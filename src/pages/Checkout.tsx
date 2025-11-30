import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, CreditCard, CheckCircle2, Loader2, ArrowRight, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { HyperPayWidget } from "@/components/HyperPayWidget";
import { ordersApi, paymentsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { ANIMATION_CONFIG, ESCROW_HOLD_HOURS } from "@/config/constants";
import type { ApiError } from "@/types/api";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const orderId = searchParams.get('order_id') ? parseInt(searchParams.get('order_id')!) : null;

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getById(orderId!),
    enabled: !!orderId && !!user,
  });

  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paylink' | 'hyperpay'>('paylink');
  const [hyperPayCheckout, setHyperPayCheckout] = useState<{
    checkoutId: string;
    widgetScriptUrl: string;
    integrity?: string;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      toast.error(t('checkout.loginRequired'));
      navigate("/auth", { replace: true });
    }
  }, [user, navigate, t]);

  // Validate order amount matches listing price (prevent fraud)
  useEffect(() => {
    if (order && order.listing) {
      const priceDifference = Math.abs(order.amount - order.listing.price);
      if (priceDifference > 0.01) {
        toast.error(t('checkout.amountError'));
        navigate(`/product/${order.listing.id}`, { replace: true });
      }
    }
  }, [order, navigate, t]);

  const handlePayment = async () => {
    if (!orderId) {
      toast.error(t('checkout.invalidOrder'));
      return;
    }

    // CRITICAL: Prevent buyer from purchasing own listing
    if (order?.listing?.seller_id === user?.id) {
      toast.error(t('checkout.cannotBuyOwn'));
      navigate(`/product/${order.listing.id}`, { replace: true });
      return;
    }

    if (paymentMethod === 'hyperpay') {
      // Prepare HyperPay checkout
      setProcessing(true);
      try {
        const response = await paymentsApi.prepareHyperPayCheckout({ order_id: orderId });
        setHyperPayCheckout({
          checkoutId: response.checkoutId,
          widgetScriptUrl: response.widgetScriptUrl,
          integrity: response.integrity,
        });
      } catch (error) {
        const apiError = error as Error & ApiError;
        toast.error(apiError.message || t('checkout.paymentLinkError'));
      } finally {
        setProcessing(false);
      }
    } else {
      // Paylink payment
      setProcessing(true);
      try {
        const response = await paymentsApi.create({ order_id: orderId });
        const paymentUrl = response.paymentUrl || response.redirect_url;
        if (paymentUrl) {
          // Redirect to Paylink payment page
          window.location.href = paymentUrl;
        } else {
          toast.error(t('checkout.paymentLinkError'));
        }
      } catch (error) {
        const apiError = error as Error & ApiError;
        
        // Handle "payment already exists" case - redirect to existing payment URL
        if (apiError.data && (apiError.data as any).paymentUrl && apiError.status === 400) {
          const existingPaymentUrl = (apiError.data as any).paymentUrl;
          if (existingPaymentUrl) {
            // Payment already initiated - redirect to existing payment link
            toast.info(t('checkout.paymentAlreadyInitiated') || 'Redirecting to payment page...');
            window.location.href = existingPaymentUrl;
            return; // Don't set processing to false, we're redirecting
          }
        }
        
        toast.error(apiError.message || t('checkout.paymentLinkError'));
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleHyperPayComplete = async (resourcePath: string) => {
    if (!orderId) return;

    try {
      const response = await paymentsApi.getHyperPayStatus({
        resourcePath,
        order_id: orderId,
      });

      if (response.status === 'success') {
        toast.success(t('checkout.paymentSuccess') || 'Payment successful!');
        navigate(`/order/${orderId}?payment=success`);
      } else if (response.status === 'pending') {
        toast.info(t('checkout.paymentPending') || 'Payment is being processed...');
        navigate(`/order/${orderId}?payment=pending`);
      } else {
        // Check if MADA card error
        if (response.isMadaCard && response.resultDescription) {
          toast.error(response.resultDescription);
        } else {
          toast.error(response.resultDescription || t('checkout.paymentFailed') || 'Payment failed');
        }
        navigate(`/order/${orderId}?payment=failed`);
      }
    } catch (error) {
      const apiError = error as Error & ApiError;
      toast.error(apiError.message || 'Failed to verify payment status');
    }
  };

  const formatPrice = (price: number) => {
    return '$' + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Optimize snow particles: reduce on mobile, add will-change for better performance
  const snowParticles = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const baseCount = Math.floor(ANIMATION_CONFIG.SNOW_PARTICLES_COUNT * 0.6);
    const particleCount = isMobile ? Math.floor(baseCount * 0.5) : baseCount;
    return [...Array(particleCount)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white/40 rounded-full animate-fall"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20}%`,
          animationDelay: `${Math.random() * ANIMATION_CONFIG.SNOW_ANIMATION_DELAY}s`,
          animationDuration: `${ANIMATION_CONFIG.SNOW_ANIMATION_DURATION}s`,
          willChange: 'transform, opacity',
        }}
      />
    ));
  }, []);

  if (!user) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar showDesktopLinks={false} />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 text-center">
          <p className="text-red-400 mb-4">{t('checkout.orderNotFound')}</p>
        </div>
      </div>
    );
  }

  const totalAmount = order.amount;

  return (
    <>
      <SEO 
        title={`${t('checkout.title')} - NXOLand`}
        description={t('checkout.description')}
        noIndex={true}
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {snowParticles}
      </div>

      {/* Navigation */}
      <Navbar showDesktopLinks={false} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{t('checkout.title')}</h1>
            <p className="text-white/60">{t('checkout.subtitle')}</p>
          </div>
          {order?.listing && (
            <Button asChild variant="outline" className="bg-white/5 hover:bg-white/10 text-white border-white/20">
              <Link to={`/product/${order.listing.id}`}>
                <ArrowRight className="h-5 w-5 ml-2" />
                {t('checkout.backToListing')}
              </Link>
            </Button>
          )}
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
                <h2 className="text-2xl font-bold text-white">{t('checkout.paymentMethod')}</h2>
              </div>

              <div className="space-y-4">
                <Card 
                  className={`p-4 cursor-pointer transition-all ${
                    paymentMethod === 'paylink'
                      ? 'bg-[hsl(195,80%,50%,0.1)] border-2 border-[hsl(195,80%,70%)]'
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setPaymentMethod('paylink')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[hsl(195,80%,70%)] flex items-center justify-center">
                      {paymentMethod === 'paylink' && (
                        <div className="w-3 h-3 rounded-full bg-[hsl(195,80%,70%)]" />
                      )}
                    </div>
                    <span className="font-bold text-white">{t('checkout.paylinkPayment') || 'Paylink Payment'}</span>
                    <div className="mr-auto px-3 py-1 bg-[hsl(195,80%,50%)] rounded-full text-xs font-bold text-white">
                      {t('checkout.recommended')}
                    </div>
                  </div>
                </Card>
                
                <Card 
                  className={`p-4 cursor-pointer transition-all ${
                    paymentMethod === 'hyperpay'
                      ? 'bg-[hsl(195,80%,50%,0.1)] border-2 border-[hsl(195,80%,70%)]'
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => {
                    setPaymentMethod('hyperpay');
                    setHyperPayCheckout(null);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[hsl(195,80%,70%)] flex items-center justify-center">
                      {paymentMethod === 'hyperpay' && (
                        <div className="w-3 h-3 rounded-full bg-[hsl(195,80%,70%)]" />
                      )}
                    </div>
                    <span className="font-bold text-white">{t('checkout.hyperpayPayment') || 'HyperPay (COPYandPAY)'}</span>
                    <div className="mr-auto px-3 py-1 bg-blue-500/50 rounded-full text-xs font-bold text-white">
                      {t('checkout.secure') || 'Secure'}
                    </div>
                  </div>
                </Card>
              </div>

              {/* HyperPay Widget */}
              {paymentMethod === 'hyperpay' && hyperPayCheckout && (
                <div className="mt-6">
                  <HyperPayWidget
                    checkoutId={hyperPayCheckout.checkoutId}
                    widgetScriptUrl={hyperPayCheckout.widgetScriptUrl}
                    integrity={hyperPayCheckout.integrity}
                    shopperResultUrl={`${window.location.origin}/payments/hyperpay/callback?order_id=${orderId}`}
                    brands="MADA VISA MASTER AMEX"
                    showMadaFirst={true}
                    onPaymentComplete={handleHyperPayComplete}
                    onError={(error) => toast.error(error)}
                  />
                </div>
              )}
            </Card>

            {/* Protection Notice */}
            <Card className="p-5 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)] backdrop-blur-sm">
              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-[hsl(195,80%,70%)] flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-bold text-white">{t('checkout.protectedByEscrow')}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {t('checkout.escrowDescription', { hours: ESCROW_HOLD_HOURS })}
                  </p>
                </div>
              </div>
            </Card>

            {/* Delivery Time Notice */}
            <Card className="p-5 bg-[hsl(40,90%,55%,0.1)] border-[hsl(40,90%,55%,0.3)] backdrop-blur-sm">
              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-[hsl(40,90%,55%)] flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-bold text-white">{t('checkout.deliveryTime')}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {t('checkout.deliveryTimeDescription')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">{t('checkout.orderSummary')}</h2>
              
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
                    {/* Delivery Time */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <Zap className="h-4 w-4 text-[hsl(40,90%,55%)]" aria-hidden="true" />
                      <span className="text-sm text-white/70">{t('checkout.deliveryTimeLabel')}</span>
                    </div>
                  </>
                )}
              </div>

              <Separator className="my-6 bg-white/10" />

              <div className="flex justify-between items-baseline mb-6">
                <span className="text-lg text-white">{t('checkout.total')}</span>
                <span className="text-3xl font-black text-[hsl(195,80%,70%)]">{formatPrice(totalAmount)}</span>
              </div>

              {order.status !== 'payment_intent' && (
                <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    {order.status === 'completed' && t('checkout.orderCompleted')}
                    {order.status === 'cancelled' && t('checkout.orderCancelled')}
                    {order.status === 'disputed' && t('checkout.orderDisputed')}
                  </p>
                </div>
              )}

              {paymentMethod === 'hyperpay' && hyperPayCheckout ? (
                <div className="text-center text-white/60 text-sm">
                  <p>{t('checkout.useFormAbove') || 'Please use the payment form above to complete your payment.'}</p>
                </div>
              ) : (
                <Button 
                  onClick={handlePayment}
                  disabled={processing || order.status !== 'payment_intent'}
                  size="lg" 
                  className="w-full gap-2 text-lg py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t('common.processing')}
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      {t('checkout.confirmPayment')}
                    </>
                  )}
                </Button>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  <span>{t('checkout.securePayment')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  <span>{t('checkout.buyerProtection')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  <span>{t('checkout.fullRefund')}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Glow effects */}
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
      </div>
    </>
  );
};

export default Checkout;
