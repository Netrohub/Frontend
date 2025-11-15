import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { SEO } from '@/components/SEO';
import { authApi } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'timeout'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  // Resend verification email mutation
  const resendMutation = useMutation({
    mutationFn: () => authApi.resendVerificationEmail(),
    onSuccess: (data) => {
      toast.success(data.message || t('verifyEmail.emailSent'));
    },
    onError: (error: any) => {
      if (error.message?.includes('already verified') || error.message?.includes('موثق بالفعل')) {
        toast.info(t('verifyEmail.alreadyVerified'));
      } else {
        toast.error(error.message || t('verifyEmail.sendFailed'));
      }
    },
  });

  useEffect(() => {
    const verifyEmail = async () => {
      const id = searchParams.get('id');
      const hash = searchParams.get('hash');
      const expires = searchParams.get('expires');
      const signature = searchParams.get('signature');

      if (!id || !hash || !expires || !signature) {
        setStatus('error');
        setMessage(t('verifyEmail.invalidLink'));
        return;
      }

      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setStatus('timeout');
        setMessage(t('verifyEmail.timeout'));
      }, 30000); // 30 second timeout

      try {
        // Call backend verification endpoint
        const backendUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'https://backend-piz0.onrender.com';
        const verifyUrl = `${backendUrl}/api/v1/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;

        const response = await fetch(verifyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t('verifyEmail.verifyFailed'));
        }

        setStatus('success');
        setMessage(t('verifyEmail.successMessage'));
      } catch (error: any) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          setStatus('timeout');
          setMessage(t('verifyEmail.timeout'));
        } else {
          setStatus('error');
          setMessage(
            error.message || 
            t('verifyEmail.errorMessage')
          );
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

  // Countdown timer for auto-redirect on success
  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            navigate('/profile');
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  return (
    <>
      <SEO 
        title={`${t('verifyEmail.title')} - NXOLand`}
        description={t('verifyEmail.description')}
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)] pt-20 pb-12 px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar />
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 bg-white/10 border-white/20 backdrop-blur-sm text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 text-[hsl(195,80%,70%)] mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl font-bold text-white mb-2">{t('verifyEmail.verifying')}</h2>
                <p className="text-white/70">{t('common.pleaseWait')}</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('verifyEmail.successTitle')}</h2>
                <p className="text-white/80 mb-6">{message}</p>
                <p className="text-sm text-white/60 mb-4">
                  {t('verifyEmail.redirecting')} {countdown} {t('verifyEmail.seconds')}...
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    asChild
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Link to="/profile">
                      {t('verifyEmail.goNow')}
                      <ArrowRight className="h-4 w-4 mr-2" />
                    </Link>
                  </Button>
                </div>
              </>
            )}

            {(status === 'error' || status === 'timeout') && (
              <>
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-12 w-12 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {status === 'timeout' ? t('verifyEmail.timeoutTitle') : t('verifyEmail.errorTitle')}
                </h2>
                <p className="text-white/80 mb-6">{message}</p>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => resendMutation.mutate()}
                    disabled={resendMutation.isPending}
                    className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white w-full"
                  >
                    {resendMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('common.sending')}
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        {t('verifyEmail.resend')}
                      </>
                    )}
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 w-full"
                  >
                    <Link to="/">{t('common.backToHome')}</Link>
                  </Button>
                </div>

                {status === 'timeout' && (
                  <Card className="p-4 bg-yellow-500/10 border-yellow-500/30 mt-6">
                    <div className="text-sm text-white/80 text-right">
                      <p className="font-bold mb-1">{t('verifyEmail.tip')}</p>
                      <p>{t('verifyEmail.checkConnection')}</p>
                    </div>
                  </Card>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
