import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Loader2, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { disputesApi, ordersApi, authApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import type { Order, Dispute, ApiError } from "@/types/api";

const Disputes = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get('order_id');
  const queryClient = useQueryClient();
  const [showNewDispute, setShowNewDispute] = useState(!!orderIdParam);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [disputeData, setDisputeData] = useState({
    order_id: orderIdParam ? parseInt(orderIdParam) : 0,
    reason: "",
    description: "",
  });

  const { data: disputes, isLoading } = useQuery({
    queryKey: ['disputes', currentPage, statusFilter],
    queryFn: () => disputesApi.getAll({
      page: currentPage,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    }),
    enabled: !!user,
  });

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getAll(),
    enabled: !!user,
  });

  const createDisputeMutation = useMutation({
    mutationFn: (data: { order_id: number; reason: string; description: string }) =>
      disputesApi.create(data),
    onSuccess: () => {
      toast.success(t('disputes.createSuccess'));
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowNewDispute(false);
      setDisputeData({ order_id: 0, reason: "", description: "" });
    },
    onError: (error: any) => {
      console.error('Dispute creation error:', error);
      const errorCode = error?.response?.data?.error;
      const errorMessage = error?.response?.data?.message || error?.message || t('disputes.createError');
      
      // Check if it's a Discord requirement error (initiator must have Discord)
      if (errorCode === 'discord_required_for_disputes' || 
          errorCode === 'discord_required_for_buyer' || 
          errorCode === 'discord_required_for_seller' ||
          errorCode === 'discord_required_for_initiator') {
        // Show error toast with action button to connect Discord
        toast.error(errorMessage, {
          duration: 8000, // Longer duration for mobile users
          action: {
            label: t('disputes.connectDiscord'),
            onClick: () => {
              authApi.discordConnect();
            },
          },
        });
        // Also ensure the dialog stays open so user can see the warning card
        setShowNewDispute(true);
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeData.order_id || !disputeData.reason || !disputeData.description) {
      toast.error(t('disputes.fillAllFields'));
      return;
    }
    
    // Validate that the order is still in escrow_hold status
    const selectedOrder = orders?.data?.find((order: Order) => order.id === disputeData.order_id);
    if (!selectedOrder) {
      toast.error(t('disputes.orderNotFound'));
      return;
    }
    if (selectedOrder.status !== 'escrow_hold') {
      toast.error(t('disputes.onlyEscrowOrders'));
      return;
    }
    if (selectedOrder.dispute_id) {
      toast.error(t('disputes.disputeExists'));
      return;
    }
    
    createDisputeMutation.mutate(disputeData);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      open: { text: t('disputes.status.open'), className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      under_review: { text: t('disputes.status.underReview'), className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      resolved: { text: t('disputes.status.resolved'), className: "bg-green-500/20 text-green-400 border-green-500/30" },
      closed: { text: t('disputes.status.closed'), className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
    };
    const statusInfo = statusMap[status] || statusMap.open;
    return <Badge className={statusInfo.className}>{statusInfo.text}</Badge>;
  };

  // Only orders in escrow_hold can have NEW disputes created (not disputed ones - they already have a dispute)
  const availableOrders = orders?.data?.filter(
    (order: Order) => order.status === 'escrow_hold' && !order.dispute_id
  ) || [];

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <p className="text-white/60 mb-4">يجب تسجيل الدخول لعرض النزاعات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl pb-24 md:pb-8">
        <div className="mb-8">
          {/* Response & Processing Times Notice */}
          <Card className="p-4 mb-6 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)] backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[hsl(195,80%,50%,0.2)]">
                <AlertTriangle className="h-5 w-5 text-[hsl(195,80%,70%)]" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-2">{t('disputes.responseTimes')}</h3>
                <div className="space-y-1 text-sm text-white/80">
                  <p>{t('disputes.responseTime')}</p>
                  <p>{t('disputes.processingTime')}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-black text-white">{t('disputes.title')}</h1>
            {availableOrders.length > 0 && (
            <Dialog open={showNewDispute} onOpenChange={setShowNewDispute}>
              <DialogTrigger asChild>
                <Button className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]">
                  {t('disputes.openNew')}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('disputes.openNew')}</DialogTitle>
                  <DialogDescription className="text-white/60">
                    {t('disputes.createDescription')}
                  </DialogDescription>
                </DialogHeader>
                {/* Discord Requirement Warning */}
                {user && !user.discord_user_id && (
                  <Card className="p-4 mb-4 bg-[#5865F2]/10 border-[#5865F2]/30 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#5865F2]/20">
                        <MessageCircle className="h-5 w-5 text-[#5865F2]" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white mb-2">{t('disputes.discordRequired')}</h3>
                        <p className="text-sm text-white/80 mb-3">{t('disputes.discordRequiredDesc')}</p>
                        <Button
                          type="button"
                          onClick={() => authApi.discordConnect()}
                          className="bg-[#5865F2] hover:bg-[#4752C4] text-white border-0"
                          size="sm"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {t('disputes.connectDiscord')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
                <form onSubmit={handleCreateDispute} className="space-y-4">
                  <div>
                    <Label>{t('disputes.orderNumber')}</Label>
                    <select
                      value={disputeData.order_id}
                      onChange={(e) => setDisputeData({ ...disputeData, order_id: parseInt(e.target.value) })}
                      className="w-full p-2 bg-white/5 border border-white/10 rounded text-white"
                      required
                    >
                      <option value={0}>{t('disputes.selectOrder')}</option>
                      {availableOrders.map((order: Order) => (
                        <option key={order.id} value={order.id}>
                          {t('disputes.orderLabel')} #{order.id} - {order.listing?.title || t('disputes.account')} - ${order.amount}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>{t('disputes.reason')}</Label>
                    <Input
                      value={disputeData.reason}
                      onChange={(e) => setDisputeData({ ...disputeData, reason: e.target.value })}
                      className="bg-white/5 border-white/10"
                      placeholder={t('disputes.reasonPlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t('disputes.description')}</Label>
                    <Textarea
                      value={disputeData.description}
                      onChange={(e) => setDisputeData({ ...disputeData, description: e.target.value })}
                      className="bg-white/5 border-white/10"
                      placeholder={t('disputes.descriptionPlaceholder')}
                      rows={5}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createDisputeMutation.isPending || (user && !user.discord_user_id)}
                    className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createDisputeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('disputes.processing')}
                      </>
                    ) : (
                      t('disputes.submit')
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            )}
          </div>

          {/* Status Filter */}
          <Tabs value={statusFilter} onValueChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1); // Reset to page 1 when filtering
          }}>
            <TabsList className="grid w-full grid-cols-5 bg-white/5 border border-white/10">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70"
              >
                الكل
              </TabsTrigger>
              <TabsTrigger 
                value="open"
                className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70"
              >
                مفتوح
              </TabsTrigger>
              <TabsTrigger 
                value="under_review"
                className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70"
              >
                قيد المراجعة
              </TabsTrigger>
              <TabsTrigger 
                value="resolved"
                className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70"
              >
                تم الحل
              </TabsTrigger>
              <TabsTrigger 
                value="closed"
                className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70"
              >
                مغلق
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" />
          </div>
        ) : disputes?.data?.length === 0 ? (
          <Card className="p-12 text-center bg-white/5 border-white/10">
            <AlertTriangle className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-4">{t('disputes.noDisputes')}</p>
            {availableOrders.length > 0 && (
              <Button onClick={() => setShowNewDispute(true)} variant="outline">
                {t('disputes.openNew')}
              </Button>
            )}
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {disputes?.data?.map((dispute: Dispute) => (
                <Link key={dispute.id} to={`/disputes/${dispute.id}`}>
                  <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{dispute.reason}</h3>
                        <p className="text-white/60 text-sm">طلب #{dispute.order_id}</p>
                      </div>
                      {getStatusBadge(dispute.status)}
                    </div>
                    <p className="text-white/80 mb-4 line-clamp-2">{dispute.description}</p>
                    <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                      <span>{dispute.party === 'buyer' ? t('disputes.party.buyer') : t('disputes.party.seller')}</span>
                      <span>{dispute.created_at ? new Date(dispute.created_at).toLocaleDateString('ar-SA') : ''}</span>
                    </div>
                    {dispute.discord_thread_id && dispute.discord_channel_id && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <a
                          href={`https://discord.com/channels/${dispute.discord_channel_id}/${dispute.discord_thread_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 text-sm text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] transition-colors"
                          title={`${t('disputes.openDiscordThread')} - Dispute #${dispute.id}`}
                        >
                          <MessageCircle className="h-4 w-4" />
                          {t('disputes.openDiscordThread')} (Dispute #{dispute.id})
                        </a>
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {disputes && disputes.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="bg-white/5 text-white border-white/20 hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, disputes.last_page) }, (_, i) => {
                    let page;
                    if (disputes.last_page <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= disputes.last_page - 2) {
                      page = disputes.last_page - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={page}
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        disabled={isLoading}
                        className={`min-w-[40px] ${
                          currentPage === page
                            ? 'bg-[hsl(195,80%,50%)] text-white border-[hsl(195,80%,50%)]'
                            : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(disputes.last_page, p + 1))}
                  disabled={currentPage === disputes.last_page || isLoading}
                  className="bg-white/5 text-white border-white/20 hover:bg-white/10"
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Disputes;
