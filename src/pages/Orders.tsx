import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Loader2, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { ordersApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { Order } from "@/types/api";

const Orders = () => {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getAll(),
    enabled: !!user,
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string; icon: any }> = {
      pending: { text: "بانتظار الدفع", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
      escrow_hold: { text: "قيد المراجعة", className: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Clock },
      completed: { text: "مكتمل", className: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle2 },
      disputed: { text: "بنزاع", className: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertTriangle },
      cancelled: { text: "ملغي", className: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: XCircle },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    const StatusIcon = statusInfo.icon;
    return (
      <Badge className={statusInfo.className}>
        <StatusIcon className="h-3 w-3 mr-1" />
        {statusInfo.text}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <p className="text-white/60 mb-4">يجب تسجيل الدخول لعرض طلباتك</p>
          <Link to="/auth">
            <Button>تسجيل الدخول</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="طلباتي - NXOLand"
        description="عرض وإدارة جميع طلباتك"
      />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />
        
        <Navbar />

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">طلباتي</h1>
            <p className="text-white/60">عرض وإدارة جميع طلباتك</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            </div>
          ) : orders?.data?.length === 0 ? (
            <Card className="p-12 text-center bg-white/5 border-white/10">
              <Package className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-4">لا توجد طلبات حتى الآن</p>
              <Link to="/marketplace">
                <Button className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]">
                  تصفح السوق
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders?.data?.map((order: Order) => (
                <Link key={order.id} to={`/order/${order.id}`}>
                  <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-[hsl(195,80%,50%,0.2)] border border-[hsl(195,80%,70%,0.3)]">
                          <Package className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-white/60">#{order.id}</span>
                            {getStatusBadge(order.status)}
                          </div>
                          <h3 className="font-bold text-white mb-1">
                            {order.listing?.title || 'حساب محذوف'}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span>{formatPrice(order.amount)}</span>
                            <span>•</span>
                            <span>{order.created_at ? new Date(order.created_at).toLocaleDateString('ar-SA') : ''}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {order.status === 'escrow_hold' && (
                          <Badge variant="outline" className="text-[hsl(40,90%,55%)] border-[hsl(40,90%,55%,0.5)]">
                            <Clock className="h-3 w-3 mr-1" />
                            فترة الضمان
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions for Escrow Hold */}
                    {order.status === 'escrow_hold' && (
                      <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/order/${order.id}#confirm`;
                          }}
                          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          تأكيد الاستلام
                        </Button>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/disputes?order_id=${order.id}`;
                          }}
                          variant="outline"
                          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          فتح نزاع
                        </Button>
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </>
  );
};

export default Orders;

