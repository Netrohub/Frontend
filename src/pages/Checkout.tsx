import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ordersApi, paymentsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ANIMATION_CONFIG, ESCROW_HOLD_HOURS } from "@/config/constants";
import type { ApiError } from "@/types/api";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const orderId = searchParams.get('order_id') ? parseInt(searchParams.get('order_id')!) : null;

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getById(orderId!),
    enabled: !!orderId && !!user,
  });

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      navigate("/auth");
    }
  }, [user, navigate]);

  const handlePayment = async () => {
    if (!orderId) {
      toast.error("طلب غير صحيح");
      return;
    }

    setProcessing(true);
    try {
      const payment = await paymentsApi.create({ order_id: orderId });
      if (payment.redirect_url) {
        // Redirect to Tap payment page
        window.location.href = payment.redirect_url;
      } else {
        toast.error("فشل إنشاء رابط الدفع");
      }
    } catch (error) {
      const apiError = error as Error & ApiError;
      toast.error(apiError.message || "فشل إنشاء رابط الدفع");
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!user) {
    return null; // Will redirect
  }

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
          <p className="text-red-400 mb-4">طلب غير موجود</p>
        </div>
      </div>
    );
  }

  const totalAmount = order.amount;

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {useMemo(() => 
          [...Array(Math.floor(ANIMATION_CONFIG.SNOW_PARTICLES_COUNT * 0.6))].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDuration: `${ANIMATION_CONFIG.SNOW_FALL_DURATION_MIN + Math.random() * (ANIMATION_CONFIG.SNOW_FALL_DURATION_MAX - ANIMATION_CONFIG.SNOW_FALL_DURATION_MIN)}s`,
                animationDelay: `${Math.random() * ANIMATION_CONFIG.SNOW_DELAY_MAX}s`,
              }}
            />
          )), []
        )}
      </div>

      {/* Navigation */}
      <Navbar showDesktopLinks={false} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">إتمام الشراء</h1>
          <p className="text-white/60">أكمل عملية الدفع بأمان</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method */}
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[hsl(195,80%,50%,0.15)] border border-[hsl(195,80%,70%,0.3)]">
                  <CreditCard className="h-5 w-5 text-[hsl(195,80%,70%)]" />
                </div>
                <h2 className="text-2xl font-bold text-white">طريقة الدفع</h2>
              </div>

              <div className="space-y-4">
                <Card className="p-4 bg-[hsl(195,80%,50%,0.1)] border-2 border-[hsl(195,80%,70%)] cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[hsl(195,80%,70%)] flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-[hsl(195,80%,70%)]" />
                    </div>
                    <span className="font-bold text-white">الدفع عبر تاب</span>
                    <div className="mr-auto px-3 py-1 bg-[hsl(195,80%,50%)] rounded-full text-xs font-bold text-white">
                      موصى به
                    </div>
                  </div>
                </Card>
              </div>
            </Card>

            {/* Protection Notice */}
            <Card className="p-5 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)] backdrop-blur-sm">
              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-[hsl(195,80%,70%)] flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-bold text-white">محمي بنظام الضمان</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    سيتم حفظ المبلغ في حساب ضمان لمدة {ESCROW_HOLD_HOURS} ساعة. يمكنك فحص الحساب والتأكد من صحته خلال هذه الفترة. إذا واجهت أي مشكلة، يمكنك فتح نزاع واسترداد أموالك بالكامل.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-6">
                {order.listing && (
                  <>
                    <div className="flex justify-between text-white/80">
                      <span>{order.listing.title}</span>
                      <span className="font-medium">{formatPrice(order.amount)}</span>
                    </div>
                    {order.listing.category && (
                      <div className="flex justify-between text-white/60 text-sm">
                        <span>{order.listing.category}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <Separator className="my-6 bg-white/10" />

              <div className="flex justify-between items-baseline mb-6">
                <span className="text-lg text-white">المجموع</span>
                <span className="text-3xl font-black text-[hsl(195,80%,70%)]">{formatPrice(totalAmount)}</span>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={processing || order.status !== 'pending'}
                size="lg" 
                className="w-full gap-2 text-lg py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    تأكيد الدفع
                  </>
                )}
              </Button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  <span>دفع آمن ومشفر</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  <span>حماية المشتري لمدة 12 ساعة</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  <span>استرداد كامل في حالة النزاع</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Glow effects */}
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default Checkout;
