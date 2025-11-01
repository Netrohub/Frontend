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
  const personaClientRef = useRef<any>(null);
  // Track if we've successfully loaded KYC data at least once (prevents button flashing)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const { data: kyc, isLoading, error: kycError, refetch, isRefetching, isFetched } = useQuery({
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
    refetchOnMount: false, // Don't refetch on mount if we already have data
    staleTime: 30000, // Consider data fresh for 30 seconds to prevent unnecessary refetches
    gcTime: 300000, // Keep data in cache for 5 minutes (formerly cacheTime)
  });

  const createKycMutation = useMutation({
    mutationFn: () => kycApi.create(),
    onSuccess: (data) => {
      // Update the query data optimistically instead of invalidating immediately
      // This prevents the button from disappearing
      queryClient.setQueryData(['kyc'], data.kyc);
      
      // Initialize Persona with the inquiry ID if SDK is loaded
      if (data.kyc?.persona_inquiry_id && personaLoaded && (window as any).Persona) {
        try {
          // Clean up any existing Persona client
          if (personaClientRef.current) {
            try {
              personaClientRef.current.destroy();
            } catch (e) {
              // Ignore errors when destroying
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
              // Refetch KYC status
              setTimeout(() => {
                refetch();
              }, 2000);
            },
            onCancel: () => {
              console.log('[KYC] Persona verification cancelled');
              personaClientRef.current = null;
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
            setInquiryUrl(data.inquiry_url);
            setShowPersonaModal(true);
            window.open(data.inquiry_url, 'persona-verification', 'width=600,height=700');
          }
        }
      } else if (data.inquiry_url) {
        // Fallback: Open Persona in a new window if SDK not loaded
        setInquiryUrl(data.inquiry_url);
        setShowPersonaModal(true);
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
  // Once set to true, it should NEVER go back to false (persistent state)
  useEffect(() => {
    // Only set if not already set (one-way state)
    if (hasLoadedOnce) {
      return; // Already loaded, don't change
    }
    
    // Mark as loaded when:
    // 1. User is authenticated
    // 2. Query is not loading
    // 3. We have data (null or object) OR an error (both mean query completed)
    if (user && !isLoading && (kyc !== undefined || kycError)) {
      console.log('[KYC] Setting hasLoadedOnce to true', { user: !!user, isLoading, kyc: kyc !== undefined, kycError: !!kycError });
      setHasLoadedOnce(true);
    }
  }, [user, isLoading, kyc, kycError, hasLoadedOnce]);

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
  // Use stable value: always normalize to null if undefined
  // This prevents hasKyc from changing unexpectedly
  const kycData = useMemo(() => {
    // Always normalize undefined to null for consistency
    // Before first load, return null (stable) instead of undefined
    if (kyc === undefined) {
      return null;
    }
    return kyc ?? null;
  }, [kyc]);
  
  const kycStatus = useMemo(() => kycData?.status || null, [kycData]);
  const hasKyc = useMemo(() => kycData !== null && kycData !== undefined, [kycData]);
  const isVerified = useMemo(() => kycStatus === 'verified', [kycStatus]);
  const isPending = useMemo(() => kycStatus === 'pending', [kycStatus]);
  const isFailed = useMemo(() => kycStatus === 'failed', [kycStatus]);
  const isExpired = useMemo(() => kycStatus === 'expired', [kycStatus]);
  
  // Show button area when: user is authenticated and data has loaded
  // Always show status to user, button enabled/disabled based on status
  const canShowButtonArea = useMemo(() => {
    // Must be authenticated
    if (!user) {
      return false;
    }
    
    // Wait for initial load to complete
    if (!hasLoadedOnce) {
      return false;
    }
    
    // Always show the button area after load (user can see status)
    return true;
  }, [user, hasLoadedOnce]);

  // Determine if button should be enabled (clickable)
  const canStartVerification = useMemo(() => {
    // Must be authenticated and loaded
    if (!user || !hasLoadedOnce) {
      if (import.meta.env.DEV) console.log('[KYC] Button disabled: no user or not loaded');
      return false;
    }
    
    // Don't enable if we're currently creating AND already have a pending KYC
    if (createKycMutation.isPending && isPending) {
      if (import.meta.env.DEV) console.log('[KYC] Button disabled: creating pending');
      return false;
    }
    
    // Enable button if:
    // - No KYC record exists (!hasKyc)
    // - KYC status is failed
    // - KYC status is expired
    // - KYC status is null/undefined (edge case - allow retry)
    // Disable (but still show) if status is pending or verified
    const shouldEnable = !hasKyc || isFailed || isExpired || !kycStatus;
    
    if (import.meta.env.DEV) {
      console.log('[KYC] Button state:', {
        hasKyc,
        isFailed,
        isExpired,
        isPending,
        isVerified,
        kycStatus,
        shouldEnable,
        reason: !hasKyc ? 'no KYC' : isFailed ? 'failed' : isExpired ? 'expired' : !kycStatus ? 'no status' : isPending ? 'pending' : isVerified ? 'verified' : 'unknown'
      });
    }
    
    return shouldEnable;
  }, [user, hasLoadedOnce, hasKyc, isFailed, isExpired, isPending, isVerified, createKycMutation.isPending, kycStatus]);

  // Log button rendering state changes
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[KYC] Button render state:', {
        canShowButtonArea,
        canStartVerification,
        user: !!user,
        hasLoadedOnce,
        hasKyc,
        isFailed,
        isExpired,
        isPending,
        isVerified,
        status: kycStatus,
        kycData: kycData === null ? 'null' : kycData === undefined ? 'undefined' : 'object'
      });
    }
  }, [canShowButtonArea, canStartVerification, user, hasLoadedOnce, hasKyc, isFailed, isExpired, isPending, isVerified, kycStatus, kycData]);

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

          {isLoading && (!user || kyc === undefined) ? (
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
                {import.meta.env.DEV && (
                  <div className="mb-4 p-2 bg-black/20 text-xs text-white/60 rounded space-y-1">
                    <div>Debug Panel:</div>
                    <div>user: {user ? 'yes' : 'no'}</div>
                    <div>isLoading: {String(isLoading)}</div>
                    <div>isRefetching: {String(isRefetching)}</div>
                    <div>isFetched: {String(isFetched)}</div>
                    <div>hasLoadedOnce: {String(hasLoadedOnce)}</div>
                    <div>kyc: {kyc === null ? 'null' : kyc === undefined ? 'undefined' : `object(id:${(kyc as any)?.id})`}</div>
                    <div>kycData: {kycData === null ? 'null' : kycData === undefined ? 'undefined' : `object`}</div>
                    <div>hasKyc: {String(hasKyc)}</div>
                    <div>status: {kycStatus || 'null'}</div>
                    <div>isPending: {String(isPending)}</div>
                    <div>isFailed: {String(isFailed)}</div>
                    <div>isExpired: {String(isExpired)}</div>
                    <div>canStart: {String(canStartVerification)}</div>
                    <div>mutationPending: {String(createKycMutation.isPending)}</div>
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

                    {/* Action Button - Always show when loaded, display status for user */}
                    {canShowButtonArea && (
                      <div className="space-y-4">
                        {/* Show info message when no KYC or when status allows action */}
                        {(!hasKyc || isFailed || isExpired) && (
                          <div className="bg-blue-500/10 rounded-lg p-5 border border-blue-500/30">
                            <div className="flex items-start gap-3">
                              <Info className="h-6 w-6 text-blue-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-blue-400 font-bold mb-2">
                                  {!hasKyc ? 'ابدأ التحقق الآن' : isFailed ? 'فشل التحقق' : 'انتهت صلاحية التحقق'}
                                </p>
                                <p className="text-white/80 text-sm leading-relaxed">
                                  {!hasKyc 
                                    ? 'لم تقم بإنشاء طلب تحقق بعد. اضغط على الزر أدناه لبدء عملية التحقق من الهوية.'
                                    : isFailed
                                    ? 'لم يتم التحقق من هويتك. يمكنك المحاولة مرة أخرى.'
                                    : 'انتهت صلاحية طلب التحقق الخاص بك. يمكنك إنشاء طلب جديد.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Show status message when pending or verified */}
                        {(isPending || isVerified) && (
                          <div className={`rounded-lg p-5 border ${
                            isVerified 
                              ? 'bg-green-500/10 border-green-500/30' 
                              : 'bg-yellow-500/10 border-yellow-500/30'
                          }`}>
                            <div className="flex items-start gap-3">
                              {isVerified ? (
                                <CheckCircle2 className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                              ) : (
                                <Clock className="h-6 w-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                              )}
                              <div>
                                <p className={`font-bold mb-2 ${isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                                  {isVerified ? 'تم التحقق من هويتك' : 'قيد المراجعة'}
                                </p>
                                <p className="text-white/80 text-sm leading-relaxed">
                                  {isVerified
                                    ? 'تم التحقق من هويتك بنجاح. يمكنك الآن بيع الحسابات على المنصة.'
                                    : 'طلب التحقق الخاص بك قيد المراجعة من قبل فريقنا. سيتم إشعارك عبر البريد الإلكتروني عند اكتمال العملية.'}
                                </p>
                                {isPending && kycData?.created_at && (
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

                        {/* Show failed status with details */}
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

                        {/* Button - always show but disabled when not allowed */}
                        <Button
                          onClick={() => {
                            if (import.meta.env.DEV) {
                              console.log('[KYC] Button clicked', {
                                canStartVerification,
                                mutationPending: createKycMutation.isPending,
                                isRefetching,
                                willCall: canStartVerification && !createKycMutation.isPending && !isRefetching
                              });
                            }
                            if (canStartVerification && !createKycMutation.isPending && !isRefetching) {
                              createKycMutation.mutate();
                            } else if (import.meta.env.DEV) {
                              console.log('[KYC] Button click ignored - conditions not met');
                            }
                          }}
                          disabled={!canStartVerification || createKycMutation.isPending || isRefetching}
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
                              {isPending || isVerified 
                                ? (isPending ? 'قيد المراجعة...' : 'تم التحقق')
                                : hasKyc 
                                ? 'إعادة المحاولة' 
                                : 'ابدأ عملية التحقق'}
                            </>
                          )}
                        </Button>
                        {!personaLoaded && !createKycMutation.isPending && canStartVerification && (
                          <p className="text-yellow-400 text-sm text-center">
                            <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                            جاري تحميل نظام التحقق...
                          </p>
                        )}
                      </div>
                    )}

                    {/* Persona Modal - Only shown for fallback (new window) approach */}
                    {showPersonaModal && inquiryUrl && !personaLoaded && (
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
