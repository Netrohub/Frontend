import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, CheckCircle2, AlertCircle, IdCard, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { kycApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";
import { SEO } from "@/components/SEO";

const KYC = () => {
  const { user } = useAuth();
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
        console.error('KYC fetch error:', error);
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
      if (import.meta.env.DEV) {
        console.log('[KYC] Create success', {
          kyc: data.kyc,
          inquiryId: data.kyc?.persona_inquiry_id,
          inquiryUrl: data.inquiry_url,
          personaLoaded,
          hasPersona: !!(window as any).Persona
        });
      }

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
                console.warn('[KYC] Error destroying existing Persona client:', e);
              }
            }
            
            // Use Persona SDK to open embedded widget
            const personaClient = new (window as any).Persona.Client({
              inquiryId: data.kyc.persona_inquiry_id,
              onReady: () => {
                console.log('[KYC] Persona widget ready');
              },
              onComplete: ({ inquiryId }: { inquiryId: string }) => {
                console.log('[KYC] Persona verification completed', { inquiryId });
                personaClientRef.current = null;
                toast.success("تم إكمال عملية التحقق بنجاح");
                // Refetch KYC status after a short delay
                setTimeout(() => {
                  refetch();
                }, 2000);
              },
              onCancel: () => {
                console.log('[KYC] Persona verification cancelled');
                personaClientRef.current = null;
                toast.info("تم إلغاء عملية التحقق");
              },
              onError: (error: any) => {
                console.error('[KYC] Persona error:', error);
                personaClientRef.current = null;
                toast.error("حدث خطأ أثناء عملية التحقق");
              },
            });
            
            // Store reference for cleanup
            personaClientRef.current = personaClient;
            
            // Open Persona widget (Persona handles its own modal)
            personaClient.open();
          } catch (error) {
            console.error('[KYC] Failed to initialize Persona:', error);
            // Fallback to opening in new window
            if (data.inquiry_url) {
              toast.info("سيتم فتح نافذة جديدة للتحقق");
              window.open(data.inquiry_url, 'persona-verification', 'width=600,height=700');
            } else {
              toast.error("فشل تحميل نظام التحقق. الرجاء المحاولة مرة أخرى");
            }
          }
        } else if (data.inquiry_url) {
          // Fallback: Open Persona in a new window if SDK not loaded
          toast.info("سيتم فتح نافذة جديدة للتحقق");
          window.open(data.inquiry_url, 'persona-verification', 'width=600,height=700');
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
      console.error('KYC Creation Error:', error);
    },
  });

  // Load Persona SDK
  useEffect(() => {
    // Check if Persona is already loaded
    if ((window as any).Persona) {
      setPersonaLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.withpersona.com/dist/persona-v5.0.0.js';
    script.async = true;
    script.onload = () => {
      // Double check Persona is available after script loads
      if ((window as any).Persona) {
        setPersonaLoaded(true);
        if (import.meta.env.DEV) {
          console.log('[KYC] Persona SDK loaded successfully');
        }
      } else {
        console.warn('[KYC] Persona script loaded but Persona object not available');
        // Wait a bit and check again
        setTimeout(() => {
          if ((window as any).Persona) {
            setPersonaLoaded(true);
          } else {
            console.error('[KYC] Persona still not available after timeout');
            setPersonaLoaded(true); // Allow fallback to work
          }
        }, 1000);
      }
    };
    script.onerror = () => {
      console.error('[KYC] Failed to load Persona SDK script');
      setPersonaLoaded(true); // Still allow verification to proceed (will use fallback)
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Also check periodically if Persona becomes available
  useEffect(() => {
    if (personaLoaded) return;
    
    const checkInterval = setInterval(() => {
      if ((window as any).Persona && !personaLoaded) {
        setPersonaLoaded(true);
        if (import.meta.env.DEV) {
          console.log('[KYC] Persona SDK detected via polling');
        }
        clearInterval(checkInterval);
      }
    }, 500);

    // Clear interval after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (!personaLoaded) {
        console.warn('[KYC] Persona SDK not detected after 10 seconds, allowing fallback');
        setPersonaLoaded(true); // Allow button to work with fallback
      }
    }, 10000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [personaLoaded]);

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
  const isVerified = kyc?.status === 'verified';
  const isPending = kyc?.status === 'pending';
  const isFailed = kyc?.status === 'failed';
  const isExpired = kyc?.status === 'expired';
  
  // User can start verification if:
  // - No KYC exists (kyc is null or undefined)
  // - KYC is pending (allows retry)
  // - KYC is failed
  // - KYC is expired
  // BUT NOT if verified (once verified, cannot start again)
  // Note: kyc can be null (no record) or an object (has record)
  const hasKycRecord = kyc !== null && kyc !== undefined;
  const canStartVerification = !isVerified && (!hasKycRecord || isPending || isFailed || isExpired);

  const startPersonaVerification = () => {
    if (import.meta.env.DEV) {
      console.log('[KYC] Button clicked', {
        personaLoaded,
        hasPersona: !!(window as any).Persona,
        canStartVerification,
        mutationPending: createKycMutation.isPending,
        isRefetching,
        kyc: kyc ? { id: kyc.id, status: kyc.status } : null
      });
    }

    // Check if button should be enabled
    if (!canStartVerification) {
      if (isVerified) {
        toast.info('تم التحقق من هويتك بالفعل');
      } else {
        toast.error('لا يمكن بدء التحقق في الوقت الحالي');
      }
      return;
    }

    // Check if Persona SDK is available (check both state and window object)
    const hasPersona = !!(window as any).Persona;
    if (!personaLoaded && !hasPersona) {
      toast.error('جاري تحميل نظام التحقق... الرجاء المحاولة مرة أخرى');
      return;
    }

    // If Persona is available but state wasn't updated, update it now
    if (hasPersona && !personaLoaded) {
      setPersonaLoaded(true);
    }

    // Prevent duplicate requests
    if (createKycMutation.isPending || isRefetching) {
      toast.info('جاري معالجة الطلب...');
      return;
    }

    // Create KYC inquiry via backend
    createKycMutation.mutate();
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
                onClick={() => window.location.href = '/auth'}
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
            // All Steps Completed
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">تم إكمال التحقق!</h3>
              <p className="text-white/60 mb-6">تم التحقق من هويتك بنجاح. يمكنك الآن إضافة إعلانات للبيع.</p>
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
          ) : isPending ? (
            // Pending Status - Show button to allow retry if needed
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
                    <p>إذا كنت تواجه مشكلة أو تريد إعادة المحاولة، يمكنك الضغط على الزر أدناه.</p>
                  </div>
                </div>
              </Card>
              
              {/* Show verification form even when pending - allows retry */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <IdCard className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                  <h3 className="text-xl font-bold text-white">التحقق من الهوية - Persona</h3>
                </div>
                <p className="text-white/60 mb-4">
                  سنستخدم نظام Persona المعتمد عالمياً للتحقق من هويتك ورقم هاتفك بشكل آمن وسريع
                </p>
                
                <Card className="p-6 bg-white/5 border-white/10">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(280,70%,50%)] rounded-full flex items-center justify-center">
                      <ShieldCheck className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">خطوات التحقق</h4>
                      <ul className="text-sm text-white/60 text-right space-y-2">
                        <li>• التقط صورة لهويتك الوطنية أو الإقامة</li>
                        <li>• التقط صورة سيلفي للتحقق</li>
                        <li>• تحقق من رقم هاتفك</li>
                        <li>• سيتم التحقق تلقائياً خلال دقائق</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)]">
                  <div className="flex gap-2">
                    <ShieldCheck className="h-5 w-5 text-[hsl(195,80%,70%)] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80">
                      <p className="font-bold mb-1">آمن ومشفر</p>
                      <p>نظام Persona معتمد من أكبر الشركات العالمية ويضمن حماية كاملة لبياناتك</p>
                    </div>
                  </div>
                </Card>

                <Button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (import.meta.env.DEV) {
                      console.log('[KYC] Button onClick fired (pending retry)', {
                        personaLoaded,
                        hasPersona: !!(window as any).Persona,
                        canStartVerification,
                        mutationPending: createKycMutation.isPending,
                        isRefetching,
                        kycStatus: kyc?.status
                      });
                    }
                    startPersonaVerification();
                  }}
                  disabled={createKycMutation.isPending || isRefetching || !canStartVerification}
                  className="w-full gap-2 bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(280,70%,50%)] hover:from-[hsl(195,80%,60%)] hover:to-[hsl(280,70%,60%)] text-white border-0 py-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {createKycMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جاري إنشاء طلب التحقق...
                    </>
                  ) : (
                    <>
                      <IdCard className="h-5 w-5" />
                      {personaLoaded || (window as any).Persona ? 'إعادة المحاولة' : 'جاري التحميل...'}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // Step 3: Identity Verification with Persona
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <IdCard className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                <h3 className="text-xl font-bold text-white">التحقق من الهوية - Persona</h3>
              </div>
              <p className="text-white/60 mb-4">
                سنستخدم نظام Persona المعتمد عالمياً للتحقق من هويتك ورقم هاتفك بشكل آمن وسريع
              </p>
              
              <Card className="p-6 bg-white/5 border-white/10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(280,70%,50%)] rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">خطوات التحقق</h4>
                    <ul className="text-sm text-white/60 text-right space-y-2">
                      <li>• التقط صورة لهويتك الوطنية أو الإقامة</li>
                      <li>• التقط صورة سيلفي للتحقق</li>
                      <li>• تحقق من رقم هاتفك</li>
                      <li>• سيتم التحقق تلقائياً خلال دقائق</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)]">
                <div className="flex gap-2">
                  <ShieldCheck className="h-5 w-5 text-[hsl(195,80%,70%)] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-white/80">
                    <p className="font-bold mb-1">آمن ومشفر</p>
                    <p>نظام Persona معتمد من أكبر الشركات العالمية ويضمن حماية كاملة لبياناتك</p>
                  </div>
                </div>
              </Card>

              {isFailed && (
                <Card className="p-4 bg-red-500/10 border-red-500/30">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80">
                      <p className="font-bold mb-1">فشل التحقق</p>
                      <p>لم يتم التحقق من هويتك. يرجى المحاولة مرة أخرى.</p>
                    </div>
                  </div>
                </Card>
              )}

              {isExpired && (
                <Card className="p-4 bg-yellow-500/10 border-yellow-500/30">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-white/80">
                      <p className="font-bold mb-1">انتهت صلاحية التحقق</p>
                      <p>يرجى إعادة إجراء عملية التحقق.</p>
                    </div>
                  </div>
                </Card>
              )}

              <Button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (import.meta.env.DEV) {
                    console.log('[KYC] Button onClick fired', {
                      personaLoaded,
                      hasPersona: !!(window as any).Persona,
                      canStartVerification,
                      mutationPending: createKycMutation.isPending,
                      isRefetching,
                      kycStatus: kyc?.status
                    });
                  }
                  startPersonaVerification();
                }}
                disabled={createKycMutation.isPending || isRefetching || !canStartVerification}
                className="w-full gap-2 bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(280,70%,50%)] hover:from-[hsl(195,80%,60%)] hover:to-[hsl(280,70%,60%)] text-white border-0 py-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {createKycMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري إنشاء طلب التحقق...
                  </>
                ) : (
                  <>
                    <IdCard className="h-5 w-5" />
                    {personaLoaded || (window as any).Persona ? 'بدء التحقق عبر Persona' : 'جاري التحميل...'}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
              
              {/* Debug info - remove in production */}
              {import.meta.env.DEV && (
                <div className="p-2 bg-black/20 text-xs text-white/60 rounded space-y-1">
                  <div className="font-bold mb-1">Debug Panel:</div>
                  <div>isLoading: {String(isLoading)}</div>
                  <div>kyc: {kyc === null ? 'null' : kyc === undefined ? 'undefined' : `object(id:${kyc.id})`}</div>
                  <div>hasKycRecord: {String(hasKycRecord)}</div>
                  <div>kyc status: {kyc?.status || 'null'}</div>
                  <div>isPending: {String(isPending)}</div>
                  <div>isVerified: {String(isVerified)}</div>
                  <div>isFailed: {String(isFailed)}</div>
                  <div>isExpired: {String(isExpired)}</div>
                  <div>personaLoaded: {String(personaLoaded)}</div>
                  <div>hasPersona: {String(!!(window as any).Persona)}</div>
                  <div className={`font-bold ${canStartVerification ? 'text-green-400' : 'text-red-400'}`}>
                    canStartVerification: {String(canStartVerification)}
                    {!canStartVerification && (
                      <span className="text-xs text-yellow-400 block mt-1">
                        Reason: {isVerified ? 'KYC already verified' : !hasKycRecord ? 'No KYC record (should be true)' : 'Unknown'}
                      </span>
                    )}
                  </div>
                  <div>mutationPending: {String(createKycMutation.isPending)}</div>
                  <div>isRefetching: {String(isRefetching)}</div>
                  <div className={`font-bold mt-2 ${(createKycMutation.isPending || isRefetching || !canStartVerification) ? 'text-red-400' : 'text-green-400'}`}>
                    buttonDisabled: {String(createKycMutation.isPending || isRefetching || !canStartVerification)}
                    {(createKycMutation.isPending || isRefetching || !canStartVerification) && (
                      <span className="text-xs text-yellow-400 block mt-1">
                        {createKycMutation.isPending ? 'Reason: Mutation in progress' : 
                         isRefetching ? 'Reason: Refetching data' : 
                         !canStartVerification ? `Reason: Cannot start (verified:${isVerified}, hasRecord:${hasKycRecord})` : ''}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <p className="text-xs text-center text-white/60">
                بالضغط على "بدء التحقق" ستفتح نافذة Persona للتحقق من هويتك ورقم هاتفك
              </p>
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
