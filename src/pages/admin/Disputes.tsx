import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Eye, CheckCircle, XCircle, AlertTriangle, Loader2, User, Package, DollarSign, Calendar, FileText, Scale } from "lucide-react";
import { useState } from "react";
import { adminApi, disputesApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDate } from "@/utils/date";
import type { Dispute } from "@/types/api";

const AdminDisputes = () => {
  const { t, language } = useLanguage();
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolutionType, setResolutionType] = useState<'refund_buyer' | 'release_to_seller' | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: disputesResponse, isLoading } = useQuery({
    queryKey: ['admin-disputes', searchTerm],
    queryFn: () => adminApi.disputes({ search: searchTerm || undefined }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const disputes: Dispute[] = disputesResponse?.data || [];

  const resolveDisputeMutation = useMutation({
    mutationFn: ({ id, resolution, notes }: { id: number; resolution: 'refund_buyer' | 'release_to_seller'; notes: string }) =>
      disputesApi.update(id, { 
        status: 'resolved',
        resolution,
        resolution_notes: notes || `تم الحل لصالح ${resolution === 'refund_buyer' ? 'المشتري' : 'البائع'} من قبل الإدارة`
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      toast.success("تم حل النزاع بنجاح");
      setShowResolveDialog(false);
      setIsDialogOpen(false);
      setAdminNotes("");
      setResolutionType(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل حل النزاع");
    },
  });

  const handleViewDetails = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setIsDialogOpen(true);
  };

  const handleResolveClick = (disputeId: number, resolution: 'refund_buyer' | 'release_to_seller') => {
    const dispute = disputes.find(d => d.id === disputeId);
    setSelectedDispute(dispute || null);
    setResolutionType(resolution);
    setShowResolveDialog(true);
  };

  const handleConfirmResolve = () => {
    if (!adminNotes.trim()) {
      toast.error("يرجى إضافة ملاحظات للحل");
      return;
    }
    if (selectedDispute && resolutionType) {
      resolveDisputeMutation.mutate({ 
        id: selectedDispute.id, 
        resolution: resolutionType,
        notes: adminNotes
      });
    }
  };

  const handleSearch = () => {
    // Search is automatic via queryKey dependency
  };

  const formatDate = (dateString: string) => formatLocalizedDate(dateString, language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatPrice = (amount: number) => {
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return {
          label: 'مفتوح',
          className: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
      case 'resolved':
        return {
          label: 'محلول',
          className: 'bg-green-500/20 text-green-400 border-green-500/30'
        };
      case 'closed':
        return {
          label: 'مغلق',
          className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        };
    }
  };

  // Determine who is reported based on who initiated
  const getReportedParty = (dispute: Dispute) => {
    if (!dispute.order) return null;
    
    // If initiator is buyer, reported is seller
    if (dispute.initiator_id === dispute.order.buyer_id) {
      return dispute.order.seller;
    }
    // If initiator is seller, reported is buyer
    return dispute.order.buyer;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">إدارة النزاعات</h1>
        <p className="text-white/60">
          مراجعة وحل النزاعات بين المستخدمين ({disputes.length} نزاع)
        </p>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              placeholder="البحث عن نزاع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
          >
            بحث
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && disputes.length === 0 && (
        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
          <Scale className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60">
            {searchTerm ? 'لا توجد نزاعات مطابقة للبحث' : 'لا توجد نزاعات لعرضها'}
          </p>
        </Card>
      )}

      {/* Disputes Grid */}
      {!isLoading && disputes.length > 0 && (
      <div className="space-y-4">
        {disputes.map((dispute) => {
          const statusBadge = getStatusBadge(dispute.status);
          const reportedParty = getReportedParty(dispute);
          
          return (
            <Card key={dispute.id} className="p-5 bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-lg font-bold text-white">نزاع رقم #{dispute.id}</h3>
                    <Badge className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                    {dispute.resolution && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        لصالح {dispute.resolution === 'refund_buyer' ? 'المشتري' : 'البائع'}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-white/60 space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      الطلب: #{dispute.order_id}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        المُبلغ: {dispute.created_by?.name || dispute.initiator?.name || 'غير محدد'}
                      </span>
                      {reportedParty && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            المُبلغ عنه: {reportedParty.name}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        السبب: {dispute.reason}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(dispute.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-white/10">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20" 
                  onClick={() => handleViewDetails(dispute)}
                >
                  <Eye className="h-4 w-4" />
                  عرض التفاصيل
                </Button>
                {dispute.status === "open" && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                      onClick={() => handleResolveClick(dispute.id, 'refund_buyer')}
                      disabled={resolveDisputeMutation.isPending}
                    >
                      {resolveDisputeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      لصالح المشتري
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 bg-[hsl(195,80%,50%,0.1)] hover:bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]"
                      onClick={() => handleResolveClick(dispute.id, 'release_to_seller')}
                      disabled={resolveDisputeMutation.isPending}
                    >
                      {resolveDisputeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      لصالح البائع
                    </Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              تفاصيل النزاع
            </DialogTitle>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">نزاع رقم #{selectedDispute.id}</h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getStatusBadge(selectedDispute.status).className}>
                    {getStatusBadge(selectedDispute.status).label}
                  </Badge>
                  {selectedDispute.resolution && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      تم الحل لصالح {selectedDispute.resolution === 'refund_buyer' ? 'المشتري' : 'البائع'}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Order Info */}
              <Card className="p-4 bg-white/5 border-white/10">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  معلومات الطلب
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-white/60 text-sm">رقم الطلب:</span>
                    <p className="text-white font-medium">#{selectedDispute.order_id}</p>
                  </div>
                  {selectedDispute.order?.listing && (
                    <>
                      <div>
                        <span className="text-white/60 text-sm">المنتج:</span>
                        <p className="text-white font-medium">{selectedDispute.order.listing.title}</p>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">السعر:</span>
                        <p className="text-white font-medium">{formatPrice(selectedDispute.order.amount)}</p>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Reporter & Reported */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 bg-white/5 border-white/10">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-red-400" />
                    المُبلِّغ
                  </h4>
                  <div className="space-y-1">
                    <p className="text-white font-medium">
                      {selectedDispute.created_by?.name || selectedDispute.initiator?.name || 'غير محدد'}
                    </p>
                    <p className="text-sm text-white/60">
                      {selectedDispute.created_by?.email || selectedDispute.initiator?.email || 'غير محدد'}
                    </p>
                  </div>
                </Card>
                <Card className="p-4 bg-white/5 border-white/10">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-400" />
                    المُبلَّغ عنه
                  </h4>
                  {getReportedParty(selectedDispute) ? (
                    <div className="space-y-1">
                      <p className="text-white font-medium">{getReportedParty(selectedDispute)!.name}</p>
                      <p className="text-sm text-white/60">{getReportedParty(selectedDispute)!.email}</p>
                    </div>
                  ) : (
                    <p className="text-white/60 text-sm">غير محدد</p>
                  )}
                </Card>
              </div>

              {/* Reason */}
              <Card className="p-4 bg-amber-500/10 border-amber-500/30">
                <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  سبب النزاع
                </h4>
                <p className="text-white">{selectedDispute.reason}</p>
              </Card>

              {/* Timeline */}
              <Card className="p-4 bg-white/5 border-white/10">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  الجدول الزمني
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">تاريخ الإبلاغ:</span>
                    <span className="text-white">{formatDate(selectedDispute.created_at)}</span>
                  </div>
                  {selectedDispute.resolved_at && (
                    <div className="flex justify-between">
                      <span className="text-white/60">تاريخ الحل:</span>
                      <span className="text-green-400">{formatDate(selectedDispute.resolved_at)}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Resolution Info */}
              {selectedDispute.status === 'resolved' && (
                <Card className="p-4 bg-green-500/10 border-green-500/30">
                  <h4 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    معلومات الحل
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-white/60">تم الحل لصالح:</span>
                      <p className="text-white font-medium mt-1">
                        {selectedDispute.resolution === 'refund_buyer' ? 'المشتري' : 'البائع'}
                      </p>
                    </div>
                    {selectedDispute.admin_notes && (
                      <div>
                        <span className="text-white/60">ملاحظات الإدارة:</span>
                        <p className="text-white/80 mt-1">{selectedDispute.admin_notes}</p>
                      </div>
                    )}
                    {selectedDispute.resolver && (
                      <div>
                        <span className="text-white/60">تم الحل بواسطة:</span>
                        <p className="text-white mt-1">{selectedDispute.resolver.name}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Actions */}
              {selectedDispute.status === "open" && (
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button 
                    className="flex-1 gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                    onClick={() => handleResolveClick(selectedDispute.id, 'refund_buyer')}
                    disabled={resolveDisputeMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4" />
                    حل لصالح المشتري
                  </Button>
                  <Button 
                    className="flex-1 gap-2 bg-[hsl(195,80%,50%,0.1)] hover:bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]"
                    onClick={() => handleResolveClick(selectedDispute.id, 'release_to_seller')}
                    disabled={resolveDisputeMutation.isPending}
                  >
                    <XCircle className="h-4 w-4" />
                    حل لصالح البائع
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Dispute Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-400">
              حل النزاع لصالح {resolutionType === 'refund_buyer' ? 'المشتري' : 'البائع'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-notes" className="text-white/80">ملاحظات الإدارة</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="اكتب ملاحظات توضح سبب الحل..."
                className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                rows={4}
              />
            </div>
            <Card className="p-3 bg-blue-500/10 border-blue-500/30">
              <p className="text-sm text-blue-400">
                ℹ️ سيتم حل النزاع وإخطار الطرفين بالقرار
              </p>
            </Card>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResolveDialog(false);
                  setAdminNotes("");
                  setResolutionType(null);
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20"
                disabled={resolveDisputeMutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleConfirmResolve}
                disabled={!adminNotes.trim() || resolveDisputeMutation.isPending}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                {resolveDisputeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    جاري الحل...
                  </>
                ) : (
                  "تأكيد الحل"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDisputes;
