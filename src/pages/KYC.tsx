import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { kycApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";
import { SEO } from "@/components/SEO";
import { KYCVerificationForm } from "@/components/KYCVerificationForm";

const debugLog = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[KYC] ${message}`, data);
  }
};

const KYC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [personaLoaded, setPersonaLoaded] = useState(false);
  const personaClientRef = useRef<any>(null);

  // Fetch KYC status
  const { data: kyc, isLoading, error: kycError, refetch, isRefetching } = useQuery({
    queryKey: ['kyc'],
    queryFn: async () => {
      try {
        const response = await kycApi.get();
        return response ?? null;
      } catch (error) {
        debugLog('KYC fetch error', error);
        return null;
      }
    },
    enabled: !!user,
    refetchInterval: (query) => {
      const kycData = query.state.data as any;
      if (kycData === null || kycData === undefined) {
        return false;
      }
      return kycData?.status === 'pending' ? 30000 : false;
    },
    retry: 1,
    placeholderData: (previousData) => previousData ?? null,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 30000,
    gcTime: 300000,
  });

  // Create KYC mutation
  const createKycMutation = useMutation({
    mutationFn: () => kycApi.create(),
    onSuccess: (data) => {
      debugLog('Create success', {
        kyc: data.kyc,
        inquiryId: data.kyc?.persona_inquiry_id,
        inquiryUrl: data.inquiry_url,
      });

      // Update cache with new KYC data
      queryClient.setQueryData(['kyc'], data.kyc);
      
      // Initialize Persona with the inquiry ID if SDK is loaded
      if (data.kyc?.persona_inquiry_id) {
        if (personaLoaded && (window as any).Persona) {
          try {
            // Clean up any existing Persona client
            if (personaClientRef.current) {
              try {
                personaClientRef.current.destroy();
              } catch (e) {
                debugLog('Error destroying existing Persona client', e);
              }
            }
            
            // Use Persona SDK to open embedded widget
            const personaClient = new (window as any).Persona.Client({
              inquiryId: data.kyc.persona_inquiry_id,
              onReady: () => debugLog('Persona widget ready'),
              onComplete: ({ inquiryId }: { inquiryId: string }) => {
                debugLog('Persona verification completed', { inquiryId });
                personaClientRef.current = null;
                toast.success("تم إكمال عملية التحقق بنجاح");
                // Refetch KYC status after a short delay
                setTimeout(() => refetch(), 2000);
              },
              onCancel: () => {
                debugLog('Persona verification cancelled');
                personaClientRef.current = null;
                toast.info("تم إلغاء عملية التحقق");
              },
              onError: (error: any) => {
                debugLog('Persona error', error);
                personaClientRef.current = null;
                toast.error("حدث خطأ أثناء عملية التحقق");
              },
            });
            
            personaClientRef.current = personaClient;
            personaClient.open();
          } catch (error) {
            debugLog('Failed to initialize Persona', error);
            // Fallback to opening in new window/tab
            if (data.inquiry_url) {
              openPersonaFallback(data.inquiry_url);
            } else {
              toast.error("فشل تحميل نظام التحقق. الرجاء المحاولة مرة أخرى");
            }
          }
        } else if (data.inquiry_url) {
          openPersonaFallback(data.inquiry_url);
        } else {
          toast.error("فشل الحصول على رابط التحقق");
        }
      } else {
        toast.error("فشل إنشاء طلب التحقق - لا يوجد معرف الاستعلام");
      }
    },
    onError: (error: Error) => {
      const apiError = error as Error & ApiError;
      let errorMessage = apiError.message || "فشل إنشاء طلب التحقق";
      
      if (apiError.errors && Array.isArray(apiError.errors)) {
        const firstError = apiError.errors[0];
        if (firstError.title) {
          errorMessage = firstError.title;
        }
      }
      
      toast.error(errorMessage);
      debugLog('KYC Creation Error', error);
    },
  });

  // Helper function for mobile-friendly Persona fallback
  const openPersonaFallback = (url: string) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, open in same tab (popups often blocked)
      toast.info("سيتم نقلك إلى صفحة التحقق...");
      window.location.href = url;
    } else {
      // On desktop, open in new tab
      toast.info("سيتم فتح نافذة جديدة للتحقق");
      window.open(url, '_blank', 'width=600,height=700');
    }
  };

  // Load Persona SDK
  useEffect(() => {
    // Check if Persona is already loaded
    if ((window as any).Persona) {
      setPersonaLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.withpersona.com/dist/persona-v5.1.2.js';
    script.integrity = 'sha384-nuMfOsYXMwp5L13VJicJkSs8tObai/UtHEOg3f7tQuFWU5j6LAewJbjbF5ZkfoDo';
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.onload = () => {
      if ((window as any).Persona) {
        setPersonaLoaded(true);
        debugLog('Persona SDK loaded successfully');
      } else {
        setTimeout(() => {
          if ((window as any).Persona) {
            setPersonaLoaded(true);
          } else {
            setPersonaLoaded(true); // Allow fallback
          }
        }, 1000);
      }
    };
    script.onerror = () => {
      debugLog('Failed to load Persona SDK script');
      setPersonaLoaded(true); // Allow fallback
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Cleanup Persona client on unmount
  useEffect(() => {
    return () => {
      if (personaClientRef.current) {
        try {
          personaClientRef.current.destroy();
        } catch (e) {
          // Ignore errors when destroying
        }
        personaClientRef.current = null;
      }
    };
  }, []);

  // Calculate status flags
  const kycStatus = kyc?.status;
  const isVerified = kycStatus === 'verified';
  const isPending = kycStatus === 'pending';
  const isFailed = kycStatus === 'failed';
  const isExpired = kycStatus === 'expired';
  
  const hasKycRecord = kyc !== null && kyc !== undefined;
  const hasValidStatus = kycStatus !== null && kycStatus !== undefined;
  const canStartVerification = !isVerified && (!hasKycRecord || !hasValidStatus || isPending || isFailed || isExpired);

  debugLog('State update', {
    isLoading,
    kycStatus,
    isVerified,
    isPending,
    isFailed,
    isExpired,
    canStartVerification,
  });

  const startPersonaVerification = () => {
    debugLog('Button clicked', {
      personaLoaded,
      hasPersona: !!(window as any).Persona,
      canStartVerification,
    });

    if (!canStartVerification) {
      if (isVerified) {
        toast.info('تم التحقق من هويتك بالفعل');
      } else {
        toast.error('لا يمكن بدء التحقق في الوقت الحالي');
      }
      return;
    }

    const hasPersona = !!(window as any).Persona;
    if (!personaLoaded && !hasPersona) {
      toast.error('جاري تحميل نظام التحقق... الرجاء المحاولة مرة أخرى');
      return;
    }

    if (hasPersona && !personaLoaded) {
      setPersonaLoaded(true);
    }

    if (createKycMutation.isPending || isRefetching) {
      toast.info('جاري معالجة الطلب...');
      return;
    }

    // Initialize Persona Client with templateId and environmentId
    try {
      if (personaClientRef.current) {
        try {
          personaClientRef.current.destroy();
        } catch (e) {
          debugLog('Error destroying existing Persona client', e);
        }
      }

      const personaClient = new (window as any).Persona.Client({
        templateId: import.meta.env.VITE_PERSONA_TEMPLATE_ID || 'itmpl_adDgCZjWg4q6EaB4TZEMLxWBeeyP',
        environmentId: import.meta.env.VITE_PERSONA_ENVIRONMENT_ID || 'env_G6yssyR43GAhoTicT3digMzo8gUL',
        referenceId: `user_${user?.id}`,
        fields: {
          'name-first': user?.name?.split(' ')[0] || '',
          'name-last': user?.name?.split(' ')[1] || '',
          'email-address': user?.email || '',
        },
        onReady: () => {
          debugLog('Persona widget ready, opening...');
          try {
            personaClient.open();
          } catch (error) {
            debugLog('Error opening Persona widget', error);
            toast.error("فشل فتح نافذة التحقق. الرجاء المحاولة مرة أخرى");
          }
        },
        onComplete: async ({ inquiryId, status }: { inquiryId: string; status: string }) => {
          debugLog('Persona verification completed', { inquiryId, status });
          personaClientRef.current = null;
          
          // Sync KYC status from Persona API
          try {
            const syncResult = await kycApi.sync(inquiryId ? { inquiry_id: inquiryId } : undefined);
            debugLog('Sync result', syncResult);
            
            const syncedStatus = (syncResult as any).status || (syncResult as any).kyc?.status;
            
            if (syncedStatus === 'verified') {
              toast.success("تم التحقق من هويتك بنجاح!");
            } else if (syncedStatus === 'failed') {
              toast.error("تم رفض التحقق. يرجى المحاولة مرة أخرى.");
            } else if (syncedStatus === 'expired') {
              toast.warning("انتهت صلاحية التحقق. يرجى البدء من جديد.");
            } else {
              toast.success("تم إكمال عملية التحقق. جاري مراجعة معلوماتك...");
            }
            
            setTimeout(() => refetch(), 1000);
          } catch (error) {
            debugLog('Failed to sync status', error);
            toast.success("تم إكمال عملية التحقق. جاري تحديث الحالة...");
            setTimeout(() => refetch(), 2000);
          }
        },
        onCancel: () => {
          debugLog('Persona verification cancelled');
          personaClientRef.current = null;
          toast.info("تم إلغاء عملية التحقق");
        },
        onError: (error: any) => {
          debugLog('Persona error', error);
          personaClientRef.current = null;
          toast.error("حدث خطأ أثناء عملية التحقق");
        },
      });

      personaClientRef.current = personaClient;
    } catch (error) {
      debugLog('Failed to initialize Persona', error);
      toast.error("فشل تحميل نظام التحقق. الرجاء المحاولة مرة أخرى");
    }
  };

  if (!user) {
    return (
      <>
        <SEO 
          title="التحقق من الهوية - NXOLand"
          description="قم بتحقق من هويتك للبدء في بيع الحسابات على منصة NXOLand"
        />
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
          <Navbar />
          <div className="relative z-10 container mx-auto px-4 py-8 text-center">
            <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm max-w-md mx-auto">
              <ShieldCheck className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">تحقق من الهوية</h2>
              <p className="text-white/60 mb-6">يجب تسجيل الدخول للتحقق من الهوية</p>
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]"
              >
                تسجيل الدخول
              </Button>
            </Card>
          </div>
        </div>
      </>
    );
  }

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
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <SEO 
          title="التحقق من الهوية - NXOLand"
          description="قم بتحقق من هويتك للبدء في بيع الحسابات على منصة NXOLand"
          url="/kyc"
        />

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <ShieldCheck className="h-10 w-10 text-[hsl(195,80%,70%)]" />
            <h1 className="text-3xl md:text-4xl font-black text-white">التحقق من الهوية - KYC</h1>
          </div>
          <p className="text-lg text-white/60">أكمل عملية التحقق لتتمكن من إضافة إعلانات</p>
        </div>

        {/* Warning Alert */}
        <Card className="p-5 bg-red-500/10 border-red-500/30 backdrop-blur-sm mb-8">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="font-bold mb-1">⚠️ مطلوب للبيع</p>
              <p>يجب إكمال عملية التحقق (KYC) قبل أن تتمكن من إضافة حسابات للبيع على المنصة.</p>
            </div>
          </div>
        </Card>

        {/* Main Card */}
        <Card className="p-6 mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-white/60 mb-4" />
              <p className="text-white/60">جاري التحميل...</p>
            </div>
          ) : kycError ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-white font-bold mb-2">حدث خطأ</p>
              <p className="text-white/80 text-sm text-center mb-4">
                {(kycError as Error & ApiError).message || "فشل تحميل بيانات التحقق"}
              </p>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                إعادة المحاولة
              </Button>
            </div>
          ) : isVerified ? (
            // Verified Status
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">تم إكمال التحقق!</h3>
              <p className="text-white/60 mb-2">تم التحقق من هويتك بنجاح. يمكنك الآن إضافة إعلانات للبيع.</p>
              {kyc?.verified_at && (
                <p className="text-sm text-white/50 mb-6">
                  تاريخ التحقق: {new Date(kyc.verified_at).toLocaleDateString('ar-SA')}
                </p>
              )}
              <Button 
                asChild
                className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
              >
                <Link to="/sell">
                  الآن يمكنك إضافة إعلان
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : isFailed ? (
            // Failed Status
            <div className="space-y-4">
              <div className="text-center py-4">
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">تم رفض التحقق</h3>
                <p className="text-white/60 mb-6">لم يتم التحقق من هويتك. يرجى التحقق من معلوماتك والمحاولة مرة أخرى.</p>
              </div>
              
              <Card className="p-4 bg-red-500/10 border-red-500/30">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-white/80">
                    <p className="font-bold mb-1">أسباب محتملة للرفض:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>صور غير واضحة أو غير مكتملة</li>
                      <li>معلومات غير متطابقة</li>
                      <li>وثيقة منتهية الصلاحية</li>
                    </ul>
                    <p className="mt-2">يرجى التأكد من صحة المعلومات والمحاولة مرة أخرى.</p>
                  </div>
                </div>
              </Card>
              
              <KYCVerificationForm 
                onStart={startPersonaVerification}
                isLoading={createKycMutation.isPending}
                isRefetching={isRefetching}
                canStart={canStartVerification}
                personaLoaded={personaLoaded}
                buttonText="إعادة المحاولة"
              />
            </div>
          ) : isExpired ? (
            // Expired Status
            <div className="space-y-4">
              <div className="text-center py-4">
                <Clock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">انتهت صلاحية التحقق</h3>
                <p className="text-white/60 mb-6">انتهت صلاحية عملية التحقق السابقة. يرجى إعادة إجراء عملية التحقق.</p>
              </div>
              
              <Card className="p-4 bg-yellow-500/10 border-yellow-500/30">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-white/80">
                    <p className="font-bold mb-1">ملاحظة</p>
                    <p>يرجى البدء في عملية تحقق جديدة من خلال الضغط على الزر أدناه.</p>
                  </div>
                </div>
              </Card>
              
              <KYCVerificationForm 
                onStart={startPersonaVerification}
                isLoading={createKycMutation.isPending}
                isRefetching={isRefetching}
                canStart={canStartVerification}
                personaLoaded={personaLoaded}
                buttonText="بدء التحقق الآن"
              />
            </div>
          ) : isPending ? (
            // Pending Status
            <div className="space-y-4">
              <div className="text-center py-4">
                <Loader2 className="h-16 w-16 text-yellow-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-2xl font-bold text-white mb-2">قيد المراجعة</h3>
                <p className="text-white/60 mb-6">جاري مراجعة معلوماتك. سيتم إشعارك عند اكتمال التحقق.</p>
              </div>
              
              <Card className="p-4 bg-yellow-500/10 border-yellow-500/30">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-white/80">
                    <p className="font-bold mb-1">ملاحظة</p>
                    <p>عادةً ما يستغرق التحقق بضع دقائق. إذا أكملت التحقق للتو، يمكنك الضغط على "تحديث الحالة" أدناه.</p>
                  </div>
                </div>
              </Card>
              
              {/* Manual sync button */}
              <div className="flex justify-center">
                <Button
                  onClick={async () => {
                    try {
                      await kycApi.sync();
                      toast.success("تم تحديث الحالة");
                      refetch();
                    } catch (error) {
                      debugLog('Manual sync failed', error);
                      toast.error("فشل تحديث الحالة. الرجاء المحاولة مرة أخرى");
                    }
                  }}
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
                  disabled={isRefetching}
                >
                  {isRefetching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      جاري التحديث...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                      تحديث الحالة
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // Initial State - No KYC record
            <KYCVerificationForm 
              onStart={startPersonaVerification}
              isLoading={createKycMutation.isPending}
              isRefetching={isRefetching}
              canStart={canStartVerification}
              personaLoaded={personaLoaded}
            />
          )}

          {/* Debug Panel - ONLY in Development */}
          {import.meta.env.DEV && (
            <div className="p-3 bg-black/30 border border-yellow-500/30 text-xs text-white/80 rounded space-y-1 mt-4">
              <div className="font-bold mb-2 text-yellow-400">🔍 Debug Panel (DEV ONLY):</div>
              <div className="grid grid-cols-2 gap-2">
                <div>isLoading: <span className="font-bold">{String(isLoading)}</span></div>
                <div>kycStatus: <span className="font-bold">{kycStatus || 'null'}</span></div>
                <div>isVerified: <span className="font-bold">{String(isVerified)}</span></div>
                <div>isPending: <span className="font-bold">{String(isPending)}</span></div>
                <div>isFailed: <span className="font-bold">{String(isFailed)}</span></div>
                <div>isExpired: <span className="font-bold">{String(isExpired)}</span></div>
                <div>personaLoaded: <span className="font-bold">{String(personaLoaded)}</span></div>
                <div>hasPersona: <span className="font-bold">{String(!!(window as any).Persona)}</span></div>
              </div>
              <div className={`font-bold mt-2 p-2 rounded ${canStartVerification ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                canStartVerification: {String(canStartVerification)}
              </div>
            </div>
          )}
        </Card>

        {/* Privacy Notice */}
        <Card className="p-5 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)] backdrop-blur-sm">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 text-[hsl(195,80%,70%)] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="font-bold mb-1">حماية الخصوصية والأمان</p>
              <p>جميع معلوماتك الشخصية محمية ومشفرة. نستخدم نظام Persona المعتمد عالمياً للتحقق من الهوية. لن يتم مشاركة بياناتك مع أي طرف ثالث.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KYC;
