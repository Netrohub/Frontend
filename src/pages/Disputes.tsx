import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { disputesApi, ordersApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Order, Dispute, ApiError } from "@/types/api";

const Disputes = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get('order_id');
  const queryClient = useQueryClient();
  const [showNewDispute, setShowNewDispute] = useState(!!orderIdParam);
  const [disputeData, setDisputeData] = useState({
    order_id: orderIdParam ? parseInt(orderIdParam) : 0,
    reason: "",
    description: "",
  });

  const { data: disputes, isLoading } = useQuery({
    queryKey: ['disputes'],
    queryFn: () => disputesApi.getAll(),
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
      toast.success("تم إنشاء النزاع بنجاح");
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowNewDispute(false);
      setDisputeData({ order_id: 0, reason: "", description: "" });
    },
    onError: (error: any) => {
      console.error('Dispute creation error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || "فشل إنشاء النزاع";
      toast.error(errorMessage);
    },
  });

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeData.order_id || !disputeData.reason || !disputeData.description) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    
    // Validate that the order is still in escrow_hold status
    const selectedOrder = orders?.data?.find((order: Order) => order.id === disputeData.order_id);
    if (!selectedOrder) {
      toast.error("الطلب غير موجود");
      return;
    }
    if (selectedOrder.status !== 'escrow_hold') {
      toast.error("يمكن إنشاء النزاع فقط للطلبات في حالة الضمان");
      return;
    }
    if (selectedOrder.dispute_id) {
      toast.error("يوجد نزاع بالفعل لهذا الطلب");
      return;
    }
    
    createDisputeMutation.mutate(disputeData);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      open: { text: "مفتوح", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      under_review: { text: "قيد المراجعة", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      resolved: { text: "تم الحل", className: "bg-green-500/20 text-green-400 border-green-500/30" },
      closed: { text: "مغلق", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
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

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white">النزاعات</h1>
          {availableOrders.length > 0 && (
            <Dialog open={showNewDispute} onOpenChange={setShowNewDispute}>
              <DialogTrigger asChild>
                <Button className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]">
                  فتح نزاع جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>فتح نزاع جديد</DialogTitle>
                  <DialogDescription className="text-white/60">
                    املأ النموذج أدناه لفتح نزاع على طلب في حالة الضمان
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateDispute} className="space-y-4">
                  <div>
                    <Label>الطلب</Label>
                    <select
                      value={disputeData.order_id}
                      onChange={(e) => setDisputeData({ ...disputeData, order_id: parseInt(e.target.value) })}
                      className="w-full p-2 bg-white/5 border border-white/10 rounded text-white"
                      required
                    >
                      <option value={0}>اختر الطلب</option>
                      {availableOrders.map((order: Order) => (
                        <option key={order.id} value={order.id}>
                          طلب #{order.id} - {order.listing?.title || 'حساب'} - ${order.amount}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>سبب النزاع</Label>
                    <Input
                      value={disputeData.reason}
                      onChange={(e) => setDisputeData({ ...disputeData, reason: e.target.value })}
                      className="bg-white/5 border-white/10"
                      placeholder="مثال: الحساب لا يعمل"
                      required
                    />
                  </div>
                  <div>
                    <Label>وصف المشكلة</Label>
                    <Textarea
                      value={disputeData.description}
                      onChange={(e) => setDisputeData({ ...disputeData, description: e.target.value })}
                      className="bg-white/5 border-white/10"
                      placeholder="وصف تفصيلي للمشكلة..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createDisputeMutation.isPending}
                    className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]"
                  >
                    {createDisputeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري المعالجة...
                      </>
                    ) : (
                      "إرسال النزاع"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" />
          </div>
        ) : disputes?.data?.length === 0 ? (
          <Card className="p-12 text-center bg-white/5 border-white/10">
            <AlertTriangle className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-4">لا توجد نزاعات حالياً</p>
            {availableOrders.length > 0 && (
              <Button onClick={() => setShowNewDispute(true)} variant="outline">
                فتح نزاع جديد
              </Button>
            )}
          </Card>
        ) : (
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
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>{dispute.party === 'buyer' ? 'مشتري' : 'بائع'}</span>
                    <span>{dispute.created_at ? new Date(dispute.created_at).toLocaleDateString('ar-SA') : ''}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Disputes;
