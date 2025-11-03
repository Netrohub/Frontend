import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, CheckCircle2, AlertTriangle, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { ordersApi, disputesApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast: toastHook } = useToast();
  const [showCredentials, setShowCredentials] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const orderId = id ? parseInt(id) : 0;

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getById(orderId),
    enabled: !!orderId && !!user,
    refetchInterval: (data) => {
      // Refetch every 30 seconds if order is in escrow_hold
      return data?.status === 'escrow_hold' ? 30000 : false;
    },
  });

  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (order?.escrow_release_at) {
      const updateTimer = () => {
        const releaseTime = new Date(order.escrow_release_at).getTime();
        const now = new Date().getTime();
        const diff = releaseTime - now;

        if (diff <= 0) {
          setTimeLeft("00:00:00");
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [order?.escrow_release_at]);

  const handleConfirmOrder = async () => {
    try {
      await ordersApi.update(orderId, { status: 'completed' });
      setOrderConfirmed(true);
      toastHook({
        title: "تم تأكيد الطلب بنجاح",
        description: "شكراً لك! تم تأكيد استلام الحساب بنجاح.",
      });
    } catch (error) {
      const apiError = error as Error & ApiError;
      toast.error(apiError.message || "فشل تأكيد الطلب");
    }
  };

  const handleOpenDispute = () => {
    navigate(`/disputes?order_id=${orderId}`);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      pending: { text: "قيد الانتظار", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      paid: { text: "تم الدفع", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      escrow_hold: { text: "قيد الضمان", className: "bg-[hsl(40,90%,55%,0.2)] text-[hsl(40,90%,55%)] border-[hsl(40,90%,55%,0.3)]" },
      completed: { text: "مكتمل", className: "bg-green-500/20 text-green-400 border-green-500/30" },
      cancelled: { text: "ملغي", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
      disputed: { text: "قيد النزاع", className: "bg-red-500/20 text-red-400 border-red-500/30" },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <Badge className={statusInfo.className}>{statusInfo.text}</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleCopyCredential = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar showDesktopLinks={false} />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar showDesktopLinks={false} />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 text-center">
          <p className="text-red-400 mb-4">الطلب غير موجود</p>
        </div>
      </div>
    );
  }

  const canConfirm = order.status === 'escrow_hold' && !orderConfirmed;
  const canDispute = order.status === 'escrow_hold' || order.status === 'disputed';

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <Navbar showDesktopLinks={false} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-black text-white">طلب #{order.id}</h1>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-white/60">
            {order.created_at ? new Date(order.created_at).toLocaleDateString('ar-SA') : 'تاريخ غير متاح'}
          </p>
        </div>

        {/* Timer Card - Only show if in escrow */}
        {order.status === 'escrow_hold' && order.escrow_release_at && (
          <Card className="p-6 mb-6 bg-gradient-to-br from-[hsl(40,90%,15%)] to-[hsl(40,80%,10%)] border-[hsl(40,90%,55%,0.5)] backdrop-blur-sm shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 rounded-full bg-[hsl(40,90%,55%,0.3)] border border-[hsl(40,90%,55%,0.5)]">
                <Clock className="h-8 w-8 text-[hsl(40,90%,55%)]" />
              </div>
              <div className="flex-1 text-center md:text-right">
                <h3 className="font-bold text-white text-lg mb-1">فترة الضمان النشطة</h3>
                <p className="text-white/80 text-sm">الوقت المتبقي لفحص الحساب وتأكيد الاستلام</p>
              </div>
              <div className="text-center md:text-left">
                <div className="text-4xl md:text-3xl font-black text-[hsl(40,90%,55%)]">{timeLeft || "00:00:00"}</div>
                <div className="text-xs text-white/70 mt-1">ساعة:دقيقة:ثانية</div>
              </div>
            </div>
          </Card>
        )}

        {/* Credentials Card - Only show for escrow_hold or completed orders */}
        {(order.status === 'escrow_hold' || order.status === 'completed') && order.listing && (
          <Card className="p-6 mb-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">معلومات الحساب</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] hover:bg-white/5"
              >
                {showCredentials ? (
                  <>
                    <EyeOff className="h-4 w-4 ml-2" />
                    إخفاء
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 ml-2" />
                    عرض
                  </>
                )}
              </Button>
            </div>

            {showCredentials ? (
              <div className="space-y-4">
                {order.listing.account_credentials?.email && (
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">البريد الإلكتروني</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-[hsl(195,80%,70%)]"
                        onClick={() => handleCopyCredential(order.listing.account_credentials?.email || '', 'البريد الإلكتروني')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="font-mono text-white font-medium">{order.listing.account_credentials.email}</div>
                  </div>
                )}

                {order.listing.account_credentials?.password && (
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">كلمة المرور</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-[hsl(195,80%,70%)]"
                        onClick={() => handleCopyCredential(order.listing.account_credentials?.password || '', 'كلمة المرور')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="font-mono text-white font-medium">{order.listing.account_credentials.password}</div>
                  </div>
                )}

                <div className="p-4 bg-[hsl(40,90%,55%,0.1)] rounded-lg border border-[hsl(40,90%,55%,0.3)]">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-[hsl(40,90%,55%)] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80">
                      <p className="font-bold mb-1">تحذير هام:</p>
                      <p>قم بتغيير كلمة المرور فوراً بعد تسجيل الدخول. لا تشارك هذه المعلومات مع أي شخص.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">اضغط "عرض" للكشف عن معلومات الحساب</p>
              </div>
            )}
          </Card>
        )}

        {/* Order Details */}
        <Card className="p-6 mb-6 bg-white/5 border-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4">تفاصيل الطلب</h3>
          <div className="space-y-3">
            {order.listing && (
              <div className="flex justify-between text-white/80">
                <span>اسم الحساب:</span>
                <span className="font-medium">{order.listing.title}</span>
              </div>
            )}
            {order.seller && (
              <div className="flex justify-between text-white/80">
                <span>البائع:</span>
                <span className="font-medium">{order.seller.name}</span>
              </div>
            )}
            <div className="flex justify-between text-white/80">
              <span>المبلغ المدفوع:</span>
              <span className="font-bold text-[hsl(195,80%,70%)]">{formatPrice(order.amount)}</span>
            </div>
            {order.notes && (
              <div className="flex justify-between text-white/80">
                <span>ملاحظات:</span>
                <span className="font-medium">{order.notes}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        {canConfirm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              size="lg"
              onClick={handleConfirmOrder}
              disabled={orderConfirmed}
              className="gap-2 text-sm md:text-base py-4 md:py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold border-0 disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] touch-manipulation active:scale-95 transition-transform"
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <span className="hidden md:inline">
                {orderConfirmed ? "تم التأكيد" : "تأكيد - الحساب يعمل بشكل صحيح"}
              </span>
              <span className="md:hidden">
                {orderConfirmed ? "تم التأكيد" : "تأكيد الاستلام"}
              </span>
            </Button>

            <Button 
              size="lg"
              variant="outline"
              onClick={handleOpenDispute}
              disabled={orderConfirmed}
              className="gap-2 text-sm md:text-base py-4 md:py-6 bg-white/5 hover:bg-white/10 text-white border-white/20 font-bold disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] touch-manipulation active:scale-95 transition-transform"
            >
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <span className="hidden md:inline">فتح نزاع - هناك مشكلة</span>
              <span className="md:hidden">فتح نزاع</span>
            </Button>
          </div>
        )}

        {order.status === 'completed' && (
          <Card className="p-6 bg-green-500/10 border-green-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <p className="text-green-400 font-bold">تم تأكيد الطلب بنجاح</p>
            </div>
          </Card>
        )}

        {order.dispute && (
          <Card className="p-6 bg-red-500/10 border-red-500/30 mt-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <p className="text-red-400 font-bold">يوجد نزاع مفتوح</p>
            </div>
            <Link to={`/disputes/${order.dispute.id}`}>
              <Button variant="outline" className="mt-4">عرض النزاع</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default Order;
