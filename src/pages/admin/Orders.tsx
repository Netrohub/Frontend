import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Eye, XCircle, Loader2, ShoppingCart, User, DollarSign, Calendar, Package, CreditCard, AlertTriangle } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['admin-orders', searchTerm],
    queryFn: () => adminApi.orders({ search: searchTerm || undefined }),
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

  const handleSearch = () => {
    // Search is automatic via queryKey dependency
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (amount: number) => {
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'مكتمل',
          className: 'bg-green-500/20 text-green-400 border-green-500/30'
        };
      case 'escrow_hold':
        return {
          label: 'في الضمان',
          className: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        };
      case 'paid':
        return {
          label: 'مدفوع',
          className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
        };
      case 'pending':
        return {
          label: 'قيد الانتظار',
          className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        };
      case 'cancelled':
        return {
          label: 'ملغي',
          className: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
      case 'disputed':
        return {
          label: 'متنازع عليه',
          className: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        };
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">إدارة الطلبات</h1>
        <p className="text-white/60">
          عرض وإدارة جميع الطلبات على المنصة ({orders.length} طلب)
        </p>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              placeholder="البحث برقم الطلب أو اسم المشتري أو البائع..."
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
      {!isLoading && orders.length === 0 && (
        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
          <ShoppingCart className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60">
            {searchTerm ? 'لا توجد طلبات مطابقة للبحث' : 'لا توجد طلبات لعرضها'}
          </p>
        </Card>
      )}

      {/* Orders Grid */}
      {!isLoading && orders.length > 0 && (
      <div className="space-y-4">
        {orders.map((order) => {
          const statusBadge = getStatusBadge(order.status);
          
          return (
            <Card key={order.id} className="p-5 bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">طلب رقم #{order.id}</h3>
                    <Badge className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <div className="text-sm text-white/60 space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      المنتج: {order.listing?.title || 'غير محدد'}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        المشتري: {order.buyer?.name || 'غير محدد'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        البائع: {order.seller?.name || 'غير محدد'}
                      </span>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatPrice(order.amount)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.created_at)}
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
                  onClick={() => handleViewDetails(order)}
                >
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
          );
        })}
      </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">طلب رقم #{selectedOrder.id}</h3>
                <Badge className={getStatusBadge(selectedOrder.status).className}>
                  {getStatusBadge(selectedOrder.status).label}
                </Badge>
              </div>

              {/* Listing Info */}
              <Card className="p-4 bg-white/5 border-white/10">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  معلومات المنتج
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-white/60 text-sm">العنوان:</span>
                    <p className="text-white font-medium">{selectedOrder.listing?.title || 'غير محدد'}</p>
                  </div>
                  {selectedOrder.listing?.description && (
                    <div>
                      <span className="text-white/60 text-sm">الوصف:</span>
                      <p className="text-white/80 text-sm mt-1">{selectedOrder.listing.description.substring(0, 100)}...</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Buyer & Seller Info */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 bg-white/5 border-white/10">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-green-400" />
                    المشتري
                  </h4>
                  <div className="space-y-1">
                    <p className="text-white font-medium">{selectedOrder.buyer?.name || 'غير محدد'}</p>
                    <p className="text-sm text-white/60">{selectedOrder.buyer?.email || 'غير محدد'}</p>
                  </div>
                </Card>
                <Card className="p-4 bg-white/5 border-white/10">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-400" />
                    البائع
                  </h4>
                  <div className="space-y-1">
                    <p className="text-white font-medium">{selectedOrder.seller?.name || 'غير محدد'}</p>
                    <p className="text-sm text-white/60">{selectedOrder.seller?.email || 'غير محدد'}</p>
                  </div>
                </Card>
              </div>

              {/* Payment Info */}
              <Card className="p-4 bg-white/5 border-white/10">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  معلومات الدفع
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-white/60 text-xs">المبلغ</span>
                    <p className="text-white font-bold text-lg">{formatPrice(selectedOrder.amount)}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-xs">حالة الدفع</span>
                    <p className="text-white font-medium text-sm">
                      {selectedOrder.payment?.status === 'paid' ? 'مدفوع' : 
                       selectedOrder.payment?.status === 'pending' ? 'قيد الانتظار' :
                       'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60 text-xs">معرف الدفع</span>
                    <p className="text-white font-medium text-xs">
                      {selectedOrder.payment?.id ? `#${selectedOrder.payment.id}` : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Order Timeline */}
              <Card className="p-4 bg-white/5 border-white/10">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  الجدول الزمني
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">تاريخ الإنشاء:</span>
                    <span className="text-white">{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  {selectedOrder.updated_at && (
                    <div className="flex justify-between">
                      <span className="text-white/60">آخر تحديث:</span>
                      <span className="text-white">{formatDate(selectedOrder.updated_at)}</span>
                    </div>
                  )}
                  {selectedOrder.cancelled_at && (
                    <div className="flex justify-between">
                      <span className="text-white/60">تاريخ الإلغاء:</span>
                      <span className="text-red-400">{formatDate(selectedOrder.cancelled_at)}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Cancellation Info */}
              {selectedOrder.status === 'cancelled' && selectedOrder.cancellation_reason && (
                <Card className="p-4 bg-red-500/10 border-red-500/30">
                  <h4 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    سبب الإلغاء
                  </h4>
                  <p className="text-white/80 text-sm">{selectedOrder.cancellation_reason}</p>
                  {selectedOrder.cancelled_by && (
                    <p className="text-white/60 text-xs mt-2">
                      تم الإلغاء بواسطة: {selectedOrder.cancelled_by === 'admin' ? 'الإدارة' : 'المستخدم'}
                    </p>
                  )}
                </Card>
              )}

              {/* Dispute Info */}
              {selectedOrder.status === 'disputed' && selectedOrder.dispute && (
                <Card className="p-4 bg-orange-500/10 border-orange-500/30">
                  <h4 className="text-sm font-bold text-orange-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    نزاع نشط
                  </h4>
                  <p className="text-white/80 text-sm">{selectedOrder.dispute.reason}</p>
                  <p className="text-white/60 text-xs mt-2">
                    الحالة: {selectedOrder.dispute.status === 'open' ? 'مفتوح' : 
                             selectedOrder.dispute.status === 'resolved' ? 'محلول' : 
                             'مغلق'}
                  </p>
                </Card>
              )}

              {/* Actions */}
              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button 
                    className="flex-1 gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                    onClick={() => handleCancelClick(selectedOrder.id)}
                    disabled={cancelOrderMutation.isPending}
                  >
                    {cancelOrderMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        إلغاء الطلب
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white">
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
            <Card className="p-3 bg-yellow-500/10 border-yellow-500/30">
              <p className="text-sm text-yellow-400">
                ⚠️ سيتم إلغاء الطلب وإرجاع المبلغ إلى محفظة المشتري تلقائياً
              </p>
            </Card>
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
