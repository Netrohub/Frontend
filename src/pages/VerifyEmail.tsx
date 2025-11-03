import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const id = searchParams.get('id');
      const hash = searchParams.get('hash');
      const expires = searchParams.get('expires');
      const signature = searchParams.get('signature');

      if (!id || !hash || !expires || !signature) {
        setStatus('error');
        setMessage('رابط التحقق غير صالح أو منتهي الصلاحية');
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'https://backend-piz0.onrender.com';
        const verifyUrl = `${backendUrl}/api/v1/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;

        const response = await axios.get(verifyUrl);

        setStatus('success');
        setMessage(response.data.message || 'تم توثيق بريدك الإلكتروني بنجاح!');

        // Redirect to profile after 3 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'فشل توثيق البريد الإلكتروني. قد يكون الرابط منتهي الصلاحية.'
        );
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)] pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 bg-white/10 border-white/20 backdrop-blur-sm text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 text-[hsl(195,80%,70%)] mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl font-bold text-white mb-2">جاري التحقق من البريد الإلكتروني...</h2>
                <p className="text-white/70">يرجى الانتظار</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">تم التوثيق بنجاح! ✅</h2>
                <p className="text-white/80 mb-6">{message}</p>
                <p className="text-sm text-white/60 mb-4">
                  سيتم تحويلك إلى ملفك الشخصي خلال ثوانٍ...
                </p>
                <Button
                  asChild
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Link to="/profile">انتقل إلى الملف الشخصي</Link>
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-12 w-12 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">فشل التوثيق ❌</h2>
                <p className="text-white/80 mb-6">{message}</p>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white w-full"
                  >
                    <Link to="/profile">
                      <Mail className="h-4 w-4 ml-2" />
                      إعادة إرسال رسالة التحقق
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 w-full"
                  >
                    <Link to="/">العودة للرئيسية</Link>
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

export default VerifyEmail;

