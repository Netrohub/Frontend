import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { SEO } from '@/components/SEO';
import { ordersApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const PaymentCallback = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
        setMessage('استغرق تأكيد الدفع وقتاً طويلاً. يرجى التحقق من صفحة الطلب.');
        return false;
      }

      // Keep refetching every 2 seconds if still pending payment
      if (data?.status === 'pending') {
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
      setMessage('رابط الدفع غير صالح. يرجى المحاولة مرة أخرى.');
      return;
    }

    if (!isLoading && order) {
      // Check order status
      if (order.status === 'escrow_hold' || order.status === 'paid') {
        setStatus('success');
        setMessage('تم الدفع بنجاح! تم تأمين المبلغ في حساب الضمان.');
      } else if (order.status === 'cancelled') {
        setStatus('error');
        setMessage('تم إلغاء الطلب. يرجى المحاولة مرة أخرى.');
      } else if (order.status === 'pending') {
        // Still waiting for webhook
        setStatus('loading');
        setMessage('جاري معالجة الدفع. يرجى الانتظار...');
      } else {
        // Other statuses (completed, disputed)
        setStatus('error');
        setMessage('حالة الطلب غير متوقعة. يرجى التحقق من صفحة الطلب.');
      }
    }
  }, [orderId, tapId, order, isLoading]);

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
        title="تأكيد الدفع - NXOLand"
        description="تأكيد عملية الدفع للطلب"
      />
      <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)] pt-20 pb-12 px-4" dir="rtl">
        <Navbar />
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 bg-white/10 border-white/20 backdrop-blur-sm text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 text-[hsl(195,80%,70%)] mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {message || 'جاري التحقق من الدفع...'}
                </h2>
                <p className="text-white/70">يرجى الانتظار، قد يستغرق هذا بضع ثوانٍ</p>
                
                <div className="mt-6 p-4 bg-[hsl(195,80%,50%,0.1)] rounded-lg border border-[hsl(195,80%,50%,0.3)]">
                  <p className="text-sm text-white/80">
                    💡 نحن ننتظر تأكيد الدفع من بوابة الدفع
                  </p>
                  {pollCount > 0 && (
                    <p className="text-xs text-white/60 mt-2">
                      محاولة {pollCount} من {MAX_POLL_ATTEMPTS}
                    </p>
                  )}
                </div>

                {/* Tap transaction info */}
                {tapId && (
                  <div className="mt-4 p-3 bg-black/30 rounded text-xs text-white/60">
                    <p>رقم المعاملة: {tapId}</p>
                  </div>
                )}
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">تم الدفع بنجاح! ✅</h2>
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
                    <p className="text-sm text-green-400 mb-2">✅ تم استلام الدفع</p>
                    <p className="text-sm text-white/70">
                      الأموال محفوظة في حساب الضمان لمدة 12 ساعة لحمايتك
                    </p>
                  </div>
                  
                  <p className="text-sm text-white/60">
                    سيتم تحويلك إلى صفحة الطلب خلال {countdown} {countdown === 1 ? 'ثانية' : 'ثواني'}...
                  </p>
                  
                  <Button
                    asChild
                    className="bg-green-500 hover:bg-green-600 text-white w-full"
                  >
                    <Link to={`/order/${orderId}`}>
                      <ArrowRight className="h-4 w-4 ml-2" />
                      عرض الطلب الآن
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
                <h2 className="text-2xl font-bold text-white mb-2">فشلت عملية الدفع ❌</h2>
                <p className="text-white/80 mb-6">{message}</p>
                
                <div className="space-y-3">
                  {orderId && (
                    <>
                      <Button
                        asChild
                        className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white w-full"
                      >
                        <Link to={`/order/${orderId}`}>
                          عرض الطلب
                        </Link>
                      </Button>
                      <p className="text-sm text-white/60">
                        يمكنك المحاولة مرة أخرى من صفحة الطلب
                      </p>
                    </>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 w-full"
                  >
                    <Link to="/marketplace">العودة للسوق</Link>
                  </Button>
                </div>
              </>
            )}

            {status === 'timeout' && (
              <>
                <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-12 w-12 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">استغرق الأمر وقتاً طويلاً ⏱️</h2>
                <p className="text-white/80 mb-6">{message}</p>
                
                <Card className="p-4 bg-yellow-500/10 border-yellow-500/30 mb-6">
                  <div className="flex gap-2 text-right">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80">
                      <p className="font-bold mb-1">ماذا حدث؟</p>
                      <p>قد يكون الدفع قيد المعالجة من بوابة الدفع. يرجى:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>التحقق من صفحة الطلب أدناه</li>
                        <li>مراجعة حسابك البنكي لتأكيد الخصم</li>
                        <li>الانتظار بضع دقائق ثم التحديث</li>
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
                        عرض الطلب
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 w-full"
                  >
                    <Link to="/orders">عرض جميع الطلبات</Link>
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
