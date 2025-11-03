import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ordersApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const PaymentCallback = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = id ? parseInt(id) : null;
  const tapId = searchParams.get('tap_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  // Fetch order details to verify payment
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getById(orderId!),
    enabled: !!orderId,
    refetchInterval: (data) => {
      // Keep refetching every 2 seconds if still pending payment
      if (data?.status === 'pending_payment' || data?.status === 'pending') {
        return 2000;
      }
      return false;
    },
  });

  useEffect(() => {
    if (!orderId || !tapId) {
      setStatus('error');
      setMessage('رابط الدفع غير صالح');
      return;
    }

    if (!isLoading && order) {
      // Check order status
      if (order.status === 'escrow_hold' || order.status === 'paid') {
        setStatus('success');
        setMessage('تم الدفع بنجاح! سيتم تحويلك إلى صفحة الطلب...');
        
        // Redirect to order page after 3 seconds
        setTimeout(() => {
          navigate(`/order/${orderId}`);
        }, 3000);
      } else if (order.status === 'cancelled' || order.status === 'failed') {
        setStatus('error');
        setMessage('فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
      } else if (order.status === 'pending_payment' || order.status === 'pending') {
        // Still waiting for webhook
        setStatus('loading');
        setMessage('جاري معالجة الدفع...');
      }
    }
  }, [orderId, tapId, order, isLoading, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)] pt-20 pb-12 px-4">
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
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">تم الدفع بنجاح! ✅</h2>
                <p className="text-white/80 mb-4">{message}</p>
                <div className="space-y-3 mt-6">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-sm text-green-400 mb-2">✅ تم استلام الدفع</p>
                    <p className="text-sm text-white/70">
                      الأموال محفوظة في حساب الضمان لمدة 12 ساعة
                    </p>
                  </div>
                  <p className="text-sm text-white/60">
                    سيتم تحويلك إلى صفحة الطلب خلال ثوانٍ...
                  </p>
                  <Button
                    asChild
                    className="bg-green-500 hover:bg-green-600 text-white"
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
                    <Button
                      asChild
                      className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white w-full"
                    >
                      <Link to={`/checkout?order_id=${orderId}`}>
                        إعادة المحاولة
                      </Link>
                    </Button>
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
          </Card>
        </div>
      </div>
    </>
  );
};

export default PaymentCallback;

