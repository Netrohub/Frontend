import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { SEO } from '@/components/SEO';
import { ordersApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';

const PaymentCallback = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const orderId = id ? parseInt(id) : null;
  const tapId = searchParams.get('tap_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'timeout'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [pollCount, setPollCount] = useState(0);
  const MAX_POLL_ATTEMPTS = 30; // 30 attempts × 2s = 60 seconds max

  // Fetch order details to verify payment
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getById(orderId!),
    enabled: !!orderId && status === 'loading',
    refetchInterval: (data) => {
      // Stop polling if reached max attempts
      if (pollCount >= MAX_POLL_ATTEMPTS) {
        setStatus('timeout');
        setMessage(t('paymentCallback.timeout'));
        return false;
      }

      // Keep refetching every 2 seconds if still payment_intent (waiting for payment confirmation)
      if (data?.status === 'payment_intent') {
        setPollCount(c => c + 1);
        return 2000;
      }
      return false;
    },
  });

  // Check order status and update UI
  useEffect(() => {
    if (!orderId || !tapId) {
      setStatus('error');
      setMessage(t('paymentCallback.invalidLink'));
      return;
    }

    if (!isLoading && order) {
      // Check order status
      if (order.status === 'escrow_hold' || order.status === 'paid') {
        setStatus('success');
        setMessage(t('paymentCallback.successMessage'));
      } else if (order.status === 'cancelled') {
        setStatus('error');
        setMessage(t('paymentCallback.cancelled'));
      } else if (order.status === 'payment_intent') {
        // Still waiting for payment confirmation webhook
        setStatus('loading');
        setMessage(t('paymentCallback.processing'));
      } else {
        // Other statuses (completed, disputed)
        setStatus('error');
        setMessage(t('paymentCallback.unexpected'));
      }
    }
  }, [orderId, tapId, order, isLoading, t]);

  // Countdown timer for auto-redirect on success
  useEffect(() => {
    if (status === 'success' && orderId) {
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            navigate(`/order/${orderId}`);
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, orderId, navigate]);

  const formatPrice = (amount: number) => {
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <>
      <SEO 
        title={`${t('paymentCallback.title')} - NXOLand`}
        description={t('paymentCallback.description')}
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)] pt-20 pb-12 px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar />
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 bg-white/10 border-white/20 backdrop-blur-sm text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 text-[hsl(195,80%,70%)] mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {message || t('paymentCallback.verifying')}
                </h2>
                <p className="text-white/70">{t('paymentCallback.waitMessage')}</p>
                
                <div className="mt-6 p-4 bg-[hsl(195,80%,50%,0.1)] rounded-lg border border-[hsl(195,80%,50%,0.3)]">
                  <p className="text-sm text-white/80">
                    💡 {t('paymentCallback.waitingConfirmation')}
                  </p>
                  {pollCount > 0 && (
                    <p className="text-xs text-white/60 mt-2">
                      {t('paymentCallback.attempt')} {pollCount} {t('common.of')} {MAX_POLL_ATTEMPTS}
                    </p>
                  )}
                </div>

                {/* Tap transaction info */}
                {tapId && (
                  <div className="mt-4 p-3 bg-black/30 rounded text-xs text-white/60">
                    <p>{t('paymentCallback.transactionId')}: {tapId}</p>
                  </div>
                )}
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('paymentCallback.successTitle')}</h2>
                <p className="text-white/80 mb-4">{message}</p>
                
                {/* Order details */}
                {order && (
                  <div className="space-y-3 mb-6">
                    {order.listing && (
                      <p className="text-white/70 text-lg">{order.listing.title}</p>
                    )}
                    <p className="text-[hsl(195,80%,70%)] text-2xl font-bold">
                      {formatPrice(order.amount)}
                    </p>
                  </div>
                )}

                <div className="space-y-3 mt-6">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-sm text-green-400 mb-2">✅ {t('paymentCallback.paymentReceived')}</p>
                    <p className="text-sm text-white/70">
                      {t('paymentCallback.escrowMessage')}
                    </p>
                  </div>
                  
                  <p className="text-sm text-white/60">
                    {t('paymentCallback.redirecting')} {countdown} {t('paymentCallback.seconds')}...
                  </p>
                  
                  <Button
                    asChild
                    className="bg-green-500 hover:bg-green-600 text-white w-full"
                  >
                    <Link to={`/order/${orderId}`}>
                      <ArrowRight className="h-4 w-4 ml-2" />
                      {t('paymentCallback.viewOrder')}
                    </Link>
                  </Button>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-12 w-12 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('paymentCallback.errorTitle')}</h2>
                <p className="text-white/80 mb-6">{message}</p>
                
                <div className="space-y-3">
                  {orderId && (
                    <>
                      <Button
                        asChild
                        className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white w-full"
                      >
                        <Link to={`/order/${orderId}`}>
                          {t('paymentCallback.viewOrder')}
                        </Link>
                      </Button>
                      <p className="text-sm text-white/60">
                        {t('paymentCallback.retryMessage')}
                      </p>
                    </>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 w-full"
                  >
                    <Link to="/marketplace">{t('product.backToMarket')}</Link>
                  </Button>
                </div>
              </>
            )}

            {status === 'timeout' && (
              <>
                <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-12 w-12 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('paymentCallback.timeoutTitle')}</h2>
                <p className="text-white/80 mb-6">{message}</p>
                
                <Card className="p-4 bg-yellow-500/10 border-yellow-500/30 mb-6">
                  <div className="flex gap-2 text-right">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80">
                      <p className="font-bold mb-1">{t('paymentCallback.whatHappened')}</p>
                      <p>{t('paymentCallback.mayBeProcessing')}</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>{t('paymentCallback.checkOrder')}</li>
                        <li>{t('paymentCallback.checkBank')}</li>
                        <li>{t('paymentCallback.waitAndRefresh')}</li>
                      </ul>
                    </div>
                  </div>
                </Card>
                
                <div className="space-y-3">
                  {orderId && (
                    <Button
                      asChild
                      className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white w-full"
                    >
                      <Link to={`/order/${orderId}`}>
                        <ArrowRight className="h-4 w-4 ml-2" />
                        {t('paymentCallback.viewOrder')}
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 w-full"
                  >
                    <Link to="/orders">{t('paymentCallback.viewAllOrders')}</Link>
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default PaymentCallback;
