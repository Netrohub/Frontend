import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, XCircle, Clock, Info } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
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
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [inquiryUrl, setInquiryUrl] = useState<string | null>(null);
  const personaContainerRef = useRef<HTMLDivElement>(null);
  // Track if we've successfully loaded KYC data at least once (prevents button flashing)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const { data: kyc, isLoading, error: kycError, refetch, isRefetching } = useQuery({
    queryKey: ['kyc'],
    queryFn: async () => {
      try {
        const response = await kycApi.get();
        // Normalize null/undefined to null - ensure consistent response
        return response ?? null;
      } catch (error) {
        // If error, return null instead of throwing
        console.error('KYC fetch error:', error);
        return null;
      }
    },
    enabled: !!user,
    refetchInterval: (query) => {
      // Refetch every 30 seconds if status is pending
      // Only refetch if we have data and it's pending (not on initial load)
      const kycData = query.state.data as any;
      if (kycData === null || kycData === undefined) {
        return false; // Don't refetch if no data
      }
      return kycData?.status === 'pending' ? 30000 : false;
    },
    retry: 1,
    // Keep previous data during refetch to prevent UI flashing
    placeholderData: (previousData) => previousData ?? null,
    // Don't refetch on window focus to prevent unexpected state changes
    refetchOnWindowFocus: false,
    staleTime: 5000, // Consider data fresh for 5 seconds to prevent unnecessary refetches
  });

  const createKycMutation = useMutation({
    mutationFn: () => kycApi.create(),
    onSuccess: (data) => {
      // Update the query data optimistically instead of invalidating immediately
      // This prevents the button from disappearing
      queryClient.setQueryData(['kyc'], data.kyc);
      
      // Then invalidate after a short delay to ensure fresh data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['kyc'] });
      }, 1000);
      
      if (data.inquiry_url) {
        setInquiryUrl(data.inquiry_url);
        setShowPersonaModal(true);
        // Open Persona in a new window/tab as fallback
        const personaWindow = window.open(data.inquiry_url, 'persona-verification', 'width=600,height=700');
        
        // Listen for Persona completion (check every 2 seconds)
        const checkInterval = setInterval(() => {
          if (personaWindow?.closed) {
            clearInterval(checkInterval);
            setShowPersonaModal(false);
            // Refetch KYC status after window closes
            setTimeout(() => {
              refetch();
            }, 2000);
          }
        }, 2000);
      }
      toast.success("تم إنشاء طلب التحقق بنجاح");
    },
    onError: (error: Error) => {
      const apiError = error as Error & ApiError;
      let errorMessage = apiError.message || "فشل إنشاء طلب التحقق";
      
      // Show more detailed error messages
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

  // Track when KYC data has been loaded at least once (prevents button flashing)
  useEffect(() => {
    // Once loading is complete (regardless of whether data is null or object), mark as loaded
    if (!isLoading && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [isLoading, hasLoadedOnce]);

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
      setPersonaLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Persona SDK');
      // Still allow verification to proceed (will open in new window)
      setPersonaLoaded(true);
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            مُتحقق
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            قيد المراجعة
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            فشل التحقق
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            منتهي الصلاحية
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-12 w-12 text-green-400" />;
      case 'pending':
        return <Clock className="h-12 w-12 text-yellow-400" />;
      case 'failed':
        return <XCircle className="h-12 w-12 text-red-400" />;
      case 'expired':
        return <AlertCircle className="h-12 w-12 text-gray-400" />;
      default:
        return <ShieldCheck className="h-12 w-12 text-[hsl(195,80%,70%)]" />;
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

  // Normalize kyc data - handle both null and undefined
  // Use memoization to prevent recalculation on every render
  // Use stable value: if data hasn't loaded yet, use null; otherwise use actual data
  const kycData = useMemo(() => {
    // Before first load, return null (stable) instead of undefined
    if (!hasLoadedOnce && kyc === undefined) {
      return null;
    }
    return kyc ?? null;
  }, [kyc, hasLoadedOnce]);
  
  const kycStatus = useMemo(() => kycData?.status || null, [kycData]);
  const hasKyc = useMemo(() => kycData !== null && kycData !== undefined, [kycData]);
  const isVerified = useMemo(() => kycStatus === 'verified', [kycStatus]);
  const isPending = useMemo(() => kycStatus === 'pending', [kycStatus]);
  const isFailed = useMemo(() => kycStatus === 'failed', [kycStatus]);
  const isExpired = useMemo(() => kycStatus === 'expired', [kycStatus]);
  
  // Show button when: no KYC exists, or status is failed/expired (not verified or pending)
  // Memoize this to prevent recalculation and button flashing
  // Only calculate after initial load to prevent flashing
  const canStartVerification = useMemo(() => {
    // Wait for initial load before showing button
    if (!hasLoadedOnce) {
      return false;
    }
    // If we're currently creating, only hide if we already have a pending KYC
    if (createKycMutation.isPending && isPending) {
      return false;
    }
    // Otherwise, show if no KYC or status allows it
    return !hasKyc || isFailed || isExpired;
  }, [hasLoadedOnce, hasKyc, isFailed, isExpired, createKycMutation.isPending, isPending]);

  return (
    <>
      <SEO 
        title="التحقق من الهوية - NXOLand"
        description="قم بتحقق من هويتك للبدء في بيع الحسابات على منصة NXOLand"
        url="/kyc"
      />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <Navbar />

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">التحقق من الهوية (KYC)</h1>
            <p className="text-white/60">تحقق من هويتك للبدء في بيع الحسابات على المنصة</p>
          </div>

          {isLoading && kyc === undefined ? (
            <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-white/60 mb-4" />
                <p className="text-white/60">جاري التحميل...</p>
              </div>
            </Card>
          ) : kycError ? (
            <Card className="p-8 bg-red-500/10 border-red-500/30 backdrop-blur-sm">
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
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Status Card */}
              <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm">
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-4 p-2 bg-black/20 text-xs text-white/60 rounded">
                    Debug: hasKyc={String(hasKyc)}, status={kycStatus || 'null'}, canStart={String(canStartVerification)}
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[hsl(195,80%,50%,0.2)] border-2 border-[hsl(195,80%,70%,0.3)] mb-4">
                    {kycStatus ? getStatusIcon(kycStatus) : <ShieldCheck className="h-12 w-12 text-[hsl(195,80%,70%)]" />}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {isVerified 
                      ? "تم التحقق من هويتك بنجاح" 
                      : isPending
                      ? "قيد المراجعة"
                      : isFailed
                      ? "فشل التحقق"
                      : isExpired
                      ? "انتهت صلاحية التحقق"
                      : "التحقق من الهوية"}
                  </h2>
                  {kycData && getStatusBadge(kycData.status)}
                </div>

                {isVerified ? (
                  <div className="text-center space-y-4 pt-4 border-t border-white/10">
                    <p className="text-white/80 text-lg">
                      تم التحقق من هويتك بنجاح. يمكنك الآن بيع الحسابات على المنصة.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                        <p className="text-green-400 font-bold mb-1">الحالة</p>
                        <p className="text-white/80 text-sm">مُتحقق</p>
                      </div>
                      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                        <p className="text-green-400 font-bold mb-1">تاريخ التحقق</p>
                        <p className="text-white/80 text-sm">
                          {kycData?.verified_at ? new Date(kycData.verified_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'غير متاح'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 pt-4 border-t border-white/10">
                    {/* Why KYC Section */}
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex items-start gap-3 mb-4">
                        <Info className="h-6 w-6 text-[hsl(195,80%,70%)] mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-bold text-white mb-3">لماذا نحتاج التحقق من الهوية؟</h3>
                          <ul className="list-none space-y-3 text-white/80">
                            <li className="flex items-start gap-2">
                              <span className="text-[hsl(195,80%,70%)] mt-1">•</span>
                              <span>ضمان أمان المعاملات والحد من الاحتيال</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[hsl(195,80%,70%)] mt-1">•</span>
                              <span>حماية البائعين والمشترين من الغش</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[hsl(195,80%,70%)] mt-1">•</span>
                              <span>الامتثال للقوانين واللوائح المحلية</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[hsl(195,80%,70%)] mt-1">•</span>
                              <span>بناء مجتمع موثوق وآمن للجميع</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Status Messages */}
                    {isPending && (
                      <div className="bg-yellow-500/10 rounded-lg p-5 border border-yellow-500/30">
                        <div className="flex items-start gap-3">
                          <Clock className="h-6 w-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-yellow-400 font-bold mb-2">قيد المراجعة</p>
                            <p className="text-white/80 text-sm leading-relaxed">
                              طلب التحقق الخاص بك قيد المراجعة من قبل فريقنا. سيتم إشعارك عبر البريد الإلكتروني عند اكتمال العملية.
                            </p>
                            {kycData?.created_at && (
                              <p className="text-white/60 text-xs mt-3">
                                تاريخ الطلب: {new Date(kycData.created_at).toLocaleDateString('ar-SA', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {isFailed && (
                      <div className="bg-red-500/10 rounded-lg p-5 border border-red-500/30">
                        <div className="flex items-start gap-3">
                          <XCircle className="h-6 w-6 text-red-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-red-400 font-bold mb-2">فشل التحقق</p>
                            <p className="text-white/80 text-sm leading-relaxed mb-3">
                              لم يتم التحقق من هويتك. قد يكون السبب:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
                              <li>عدم وضوح الصور المرفقة</li>
                              <li>عدم تطابق المعلومات</li>
                              <li>انتهاء صلاحية الوثائق</li>
                            </ul>
                            <p className="text-white/80 text-sm mt-3">
                              يرجى المحاولة مرة أخرى مع التأكد من وضوح الصور وصحة المعلومات.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isExpired && (
                      <div className="bg-gray-500/10 rounded-lg p-5 border border-gray-500/30">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-6 w-6 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-gray-400 font-bold mb-2">انتهت صلاحية التحقق</p>
                            <p className="text-white/80 text-sm leading-relaxed">
                              انتهت صلاحية طلب التحقق الخاص بك. يرجى إنشاء طلب جديد للتحقق من هويتك.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button - Always render when conditions are met, prevent unmounting */}
                    {canStartVerification && (
                      <div className="space-y-4">
                        {!hasKyc && (
                          <div className="bg-blue-500/10 rounded-lg p-5 border border-blue-500/30">
                            <div className="flex items-start gap-3">
                              <Info className="h-6 w-6 text-blue-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-blue-400 font-bold mb-2">ابدأ التحقق الآن</p>
                                <p className="text-white/80 text-sm leading-relaxed">
                                  لم تقم بإنشاء طلب تحقق بعد. اضغط على الزر أدناه لبدء عملية التحقق من الهوية.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <Button
                          onClick={() => {
                            if (!createKycMutation.isPending && !isRefetching) {
                              createKycMutation.mutate();
                            }
                          }}
                          disabled={createKycMutation.isPending || isRefetching}
                          className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          size="lg"
                        >
                          {createKycMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              جاري إنشاء طلب التحقق...
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-2 h-5 w-5" />
                              {hasKyc ? 'إعادة المحاولة' : 'ابدأ عملية التحقق'}
                            </>
                          )}
                        </Button>
                        {!personaLoaded && !createKycMutation.isPending && (
                          <p className="text-yellow-400 text-sm text-center">
                            <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                            جاري تحميل نظام التحقق...
                          </p>
                        )}
                      </div>
                    )}

                    {/* Persona Modal */}
                    {showPersonaModal && inquiryUrl && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <Card className="w-full max-w-2xl bg-[hsl(200,70%,15%)] border-white/20 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">تحقق من الهوية</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setShowPersonaModal(false);
                                refetch();
                              }}
                              className="text-white/60 hover:text-white"
                            >
                              <XCircle className="h-5 w-5" />
                            </Button>
                          </div>
                          <div className="border-t border-white/10 pt-4">
                            <p className="text-white/80 mb-4 text-sm">
                              سيتم فتح نافذة جديدة لإكمال عملية التحقق. بعد الانتهاء، سيتم تحديث حالتك تلقائياً.
                            </p>
                            <div className="flex gap-3">
                              <Button
                                onClick={() => {
                                  window.open(inquiryUrl, 'persona-verification', 'width=600,height=700');
                                }}
                                className="flex-1 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]"
                              >
                                فتح نافذة التحقق
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowPersonaModal(false);
                                  refetch();
                                }}
                                className="border-white/20 text-white/80 hover:bg-white/10"
                              >
                                إلغاء
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KYC;
