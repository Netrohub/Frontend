import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Loader2, Clock, CheckCircle2, AlertTriangle, ShoppingBag, DollarSign, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { ordersApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { Order } from "@/types/api";
import { useState } from "react";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['orders', currentPage],
    queryFn: () => ordersApi.getAll({ page: currentPage }),
    enabled: !!user,
  });

  const orders = ordersResponse?.data || [];
  const pagination = ordersResponse?.meta;

  // Filter orders by status and role
  const filteredOrders = orders.filter((order: Order) => {
    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    
    // Role filter
    if (roleFilter === 'buyer' && order.buyer_id !== user?.id) return false;
    if (roleFilter === 'seller' && order.seller_id !== user?.id) return false;
    
    return true;
  });

  // Calculate stats in single pass
  const stats = orders.reduce((acc, order: Order) => {
    acc.total++;
    if (order.buyer_id === user?.id) acc.asBuyer++;
    if (order.seller_id === user?.id) acc.asSeller++;
    if (order.status === 'escrow_hold') acc.inEscrow++;
    if (order.status === 'completed') acc.completed++;
    if (order.status === 'cancelled') acc.cancelled++;
    return acc;
  }, { total: 0, asBuyer: 0, asSeller: 0, inEscrow: 0, completed: 0, cancelled: 0 });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      pending: { text: "بانتظار الدفع", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      paid: { text: "تم الدفع", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      escrow_hold: { text: "قيد الضمان", className: "bg-[hsl(40,90%,55%,0.2)] text-[hsl(40,90%,55%)] border-[hsl(40,90%,55%,0.3)]" },
      completed: { text: "مكتمل", className: "bg-green-500/20 text-green-400 border-green-500/30" },
      cancelled: { text: "ملغي", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
      disputed: { text: "قيد النزاع", className: "bg-red-500/20 text-red-400 border-red-500/30" },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <Badge className={statusInfo.className}>{statusInfo.text}</Badge>;
  };

  const getRoleBadge = (order: Order) => {
    const isBuyer = order.buyer_id === user?.id;
    return isBuyer ? (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
        <ShoppingBag className="h-3 w-3 mr-1" />
        مشتري
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
        <DollarSign className="h-3 w-3 mr-1" />
        بائع
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm">
            <p className="text-white/60 mb-4">يجب تسجيل الدخول لعرض طلباتك</p>
            <Link to="/auth">
              <Button className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]">تسجيل الدخول</Button>
            </Link>
          </Card>
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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)] pb-24 md:pb-8" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />
        
        <Navbar />

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">طلباتي</h1>
            <p className="text-white/60">عرض وإدارة جميع طلباتك (كمشتري وكبائع)</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
            <Card className="p-3 md:p-4 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="text-xl md:text-2xl font-black text-white mb-1">{stats.total}</div>
              <div className="text-xs md:text-sm text-white/60">إجمالي</div>
            </Card>
            <Card className="p-3 md:p-4 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="text-xl md:text-2xl font-black text-blue-400 mb-1">{stats.asBuyer}</div>
              <div className="text-xs md:text-sm text-white/60">كمشتري</div>
            </Card>
            <Card className="p-3 md:p-4 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="text-xl md:text-2xl font-black text-green-400 mb-1">{stats.asSeller}</div>
              <div className="text-xs md:text-sm text-white/60">كبائع</div>
            </Card>
            <Card className="p-3 md:p-4 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="text-xl md:text-2xl font-black text-[hsl(40,90%,55%)] mb-1">{stats.inEscrow}</div>
              <div className="text-xs md:text-sm text-white/60">قيد الضمان</div>
            </Card>
            <Card className="p-3 md:p-4 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="text-xl md:text-2xl font-black text-green-400 mb-1">{stats.completed}</div>
              <div className="text-xs md:text-sm text-white/60">مكتمل</div>
            </Card>
            <Card className="p-3 md:p-4 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="text-xl md:text-2xl font-black text-gray-400 mb-1">{stats.cancelled}</div>
              <div className="text-xs md:text-sm text-white/60">ملغي</div>
            </Card>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-6">
            {/* Role Filter */}
            <div>
              <label className="text-sm text-white/60 mb-2 block">عرض الطلبات:</label>
              <Tabs value={roleFilter} onValueChange={(value) => { setRoleFilter(value); setCurrentPage(1); }}>
                <TabsList className="bg-white/5 border border-white/10">
                  <TabsTrigger value="all" className="data-[state=active]:bg-[hsl(195,80%,50%)]">الكل</TabsTrigger>
                  <TabsTrigger value="buyer" className="data-[state=active]:bg-[hsl(195,80%,50%)]">كمشتري</TabsTrigger>
                  <TabsTrigger value="seller" className="data-[state=active]:bg-[hsl(195,80%,50%)]">كبائع</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm text-white/60 mb-2 block">الحالة:</label>
              <Tabs value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                <TabsList className="bg-white/5 border border-white/10 w-full md:w-auto overflow-x-auto">
                  <TabsTrigger value="all" className="data-[state=active]:bg-[hsl(195,80%,50%)]">الكل</TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-[hsl(195,80%,50%)]">بانتظار الدفع</TabsTrigger>
                  <TabsTrigger value="escrow_hold" className="data-[state=active]:bg-[hsl(195,80%,50%)]">قيد الضمان</TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-[hsl(195,80%,50%)]">مكتمل</TabsTrigger>
                  <TabsTrigger value="cancelled" className="data-[state=active]:bg-[hsl(195,80%,50%)]">ملغي</TabsTrigger>
                  <TabsTrigger value="disputed" className="data-[state=active]:bg-[hsl(195,80%,50%)]">نزاع</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card className="p-12 text-center bg-white/5 border-white/10">
              <Package className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-4">
                {statusFilter !== 'all' || roleFilter !== 'all' 
                  ? 'لا توجد طلبات تطابق الفلتر المحدد'
                  : 'لا توجد طلبات حتى الآن'
                }
              </p>
              {statusFilter === 'all' && roleFilter === 'all' && (
                <Link to="/marketplace">
                  <Button className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]">
                    تصفح السوق
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {filteredOrders.map((order: Order) => {
                  const isBuyer = order.buyer_id === user?.id;
                  const isSeller = order.seller_id === user?.id;
                  const canQuickConfirm = isBuyer && order.status === 'escrow_hold';

                  return (
                    <Card 
                      key={order.id} 
                      className="bg-white/5 border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm overflow-hidden"
                    >
                      <Link to={`/order/${order.id}`} className="block p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 rounded-lg bg-[hsl(195,80%,50%,0.2)] border border-[hsl(195,80%,70%,0.3)] flex-shrink-0">
                              <Package className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="text-sm font-bold text-white/60">#{order.id}</span>
                                {getStatusBadge(order.status)}
                                {getRoleBadge(order)}
                              </div>
                              <h3 className="font-bold text-white mb-1 truncate">
                                {order.listing?.title || 'حساب محذوف'}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-white/60 flex-wrap">
                                <span className="font-semibold text-[hsl(195,80%,70%)]">{formatPrice(order.amount)}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(order.created_at)}</span>
                                </div>
                              </div>
                              {/* Show other party info */}
                              <div className="mt-2 text-sm text-white/60">
                                {isBuyer && order.seller && (
                                  <span>البائع: {order.seller.name}</span>
                                )}
                                {isSeller && order.buyer && (
                                  <span>المشتري: {order.buyer.name}</span>
                                )}
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
                      </Link>

                      {/* Quick Actions - Only for BUYER in escrow_hold */}
                      {canQuickConfirm && (
                        <div className="px-6 pb-6 pt-0 border-t border-white/10 mt-4">
                          <div className="flex gap-2 pt-4">
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/order/${order.id}`);
                              }}
                              className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border-0"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              تأكيد الاستلام
                            </Button>
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/disputes?order_id=${order.id}`);
                              }}
                              variant="outline"
                              className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                            >
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              فتح نزاع
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    السابق
                  </Button>
                  <span className="text-white/60 px-4">
                    صفحة {pagination.current_page} من {pagination.last_page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                    disabled={currentPage === pagination.last_page}
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    التالي
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <BottomNav />
      </div>
    </>
  );
};

export default Orders;
