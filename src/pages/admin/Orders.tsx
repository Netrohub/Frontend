import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { adminApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Order } from "@/types/api";

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminApi.orders(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const orders: Order[] = ordersResponse?.data || [];

  const cancelOrderMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      adminApi.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success("تم إلغاء الطلب وإرجاع المبلغ للمشتري");
      setShowCancelDialog(false);
      setIsDialogOpen(false);
      setCancelReason("");
      setOrderToCancel(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل إلغاء الطلب");
    },
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCancelClick = (orderId: number) => {
    setOrderToCancel(orderId);
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) {
      toast.error("يرجى إدخال سبب الإلغاء");
      return;
    }
    if (orderToCancel) {
      cancelOrderMutation.mutate({ id: orderToCancel, reason: cancelReason });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">إدارة الطلبات</h1>
        <p className="text-white/60">عرض وإدارة جميع الطلبات على المنصة</p>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              placeholder="البحث عن طلب..."
              className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <Button className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
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
      {!isLoading && orders.length === 0 && (
        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
          <p className="text-white/60">لا توجد طلبات لعرضها</p>
        </Card>
      )}

      {/* Orders Grid */}
      {!isLoading && orders.length > 0 && (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">طلب رقم #{order.id}</h3>
                  <Badge className={
                    order.status === "completed" 
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : order.status === "escrow_hold"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : order.status === "pending_payment"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {order.status === "completed" ? "مكتمل" : order.status === "escrow_hold" ? "ضمان" : order.status === "pending_payment" ? "انتظار الدفع" : order.status === "cancelled" ? "ملغي" : order.status}
                  </Badge>
                </div>
                <div className="text-sm text-white/60 space-y-1">
                  <div>المنتج: {order.listing?.title || 'غير محدد'}</div>
                  <div className="flex gap-4">
                    <span>المشتري: {order.buyer?.name || 'غير محدد'}</span>
                    <span>•</span>
                    <span>البائع: {order.seller?.name || 'غير محدد'}</span>
                  </div>
                  <div className="flex gap-4">
                    <span>السعر: ${order.total_price}</span>
                    <span>•</span>
                    <span>تاريخ الطلب: {formatDate(order.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-white/10">
              <Button size="sm" variant="outline" className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20" onClick={() => handleViewDetails(order)}>
                <Eye className="h-4 w-4" />
                عرض التفاصيل
              </Button>
              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                  onClick={() => handleCancelClick(order.id)}
                  disabled={cancelOrderMutation.isPending}
                >
                  {cancelOrderMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  إلغاء
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[hsl(217,33%,17%)] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">#{selectedOrder.id}</h3>
                <Badge className={
                  selectedOrder.status === "completed" 
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : selectedOrder.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : selectedOrder.status === "processing"
                    ? "bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }>
                  {selectedOrder.status === "completed" ? "مكتمل" : 
                   selectedOrder.status === "pending" ? "قيد الانتظار" : 
                   selectedOrder.status === "processing" ? "قيد المعالجة" : "ملغي"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <h4 className="text-sm text-white/60 mb-2">المنتج</h4>
                  <p className="text-white font-medium">{selectedOrder.product}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-sm text-white/60 mb-1">المشتري</h4>
                    <p className="text-white font-medium">{selectedOrder.buyer}</p>
                    <p className="text-sm text-white/50">{selectedOrder.buyerEmail}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-sm text-white/60 mb-1">البائع</h4>
                    <p className="text-white font-medium">{selectedOrder.seller}</p>
                    <p className="text-sm text-white/50">{selectedOrder.sellerEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-sm text-white/60 mb-1">السعر</h4>
                    <p className="text-white font-medium">${selectedOrder.price}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-sm text-white/60 mb-1">طريقة الدفع</h4>
                    <p className="text-white font-medium text-sm">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-sm text-white/60 mb-1">التاريخ</h4>
                    <p className="text-white font-medium text-sm">{selectedOrder.date}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.status === "pending" && (
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button className="flex-1 gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="h-4 w-4" />
                    قبول الطلب
                  </Button>
                  <Button className="flex-1 gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30">
                    <XCircle className="h-4 w-4" />
                    رفض الطلب
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-[hsl(217,33%,17%)] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-400">إلغاء الطلب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancel-reason" className="text-white/80">سبب الإلغاء</Label>
              <Textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="اكتب سبب إلغاء الطلب..."
                className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                rows={4}
              />
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-sm text-yellow-400">
                ⚠️ سيتم إلغاء الطلب وإرجاع المبلغ إلى محفظة المشتري تلقائياً
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelDialog(false);
                  setCancelReason("");
                  setOrderToCancel(null);
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20"
                disabled={cancelOrderMutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleConfirmCancel}
                disabled={!cancelReason.trim() || cancelOrderMutation.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                {cancelOrderMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    جاري الإلغاء...
                  </>
                ) : (
                  "تأكيد الإلغاء"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;