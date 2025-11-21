import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, CheckCircle2, AlertCircle, Mail, Phone, IdCard, ArrowRight, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { kycApi } from "@/lib/api";
import { toast } from "sonner";
import type { KycStartResponse } from "@/types/api";

declare global {
  interface Window {
    Persona?: any;
  }
}

const PERSONA_TEMPLATE_ID = import.meta.env.VITE_PERSONA_TEMPLATE_ID;
const PERSONA_ENVIRONMENT_ID = import.meta.env.VITE_PERSONA_ENVIRONMENT_ID;

const KYC = () => {
  const { user } = useAuth();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const clientRef = useRef<any>(null);

  const startMutation = useMutation<KycStartResponse, Error>({
    mutationFn: () => kycApi.start(),
    onSuccess: (data) => {
      if (!data.session_token) {
        toast.error("حدث خطأ غير متوقع، حاول مجدداً");
        return;
      }
      setSessionToken(data.session_token);
      setInquiryId(data.inquiry_id);
    },
    onError: () => {
      toast.error("تعذر فتح واجهة التحقق، حاول لاحقاً");
    },
  });

  useEffect(() => {
    if (window.Persona) {
      setSdkLoaded(true);
      return;
    }

    const existing = document.getElementById("persona-sdk") as HTMLScriptElement | null;
    if (existing) {
      const handleLoad = () => {
        setSdkLoaded(true);
        existing.setAttribute("data-loaded", "true");
      };
      if (existing.getAttribute("data-loaded") === "true") {
        setSdkLoaded(true);
        return;
      }
      existing.addEventListener("load", handleLoad);
      return () => existing.removeEventListener("load", handleLoad);
    }

    const script = document.createElement("script");
    script.id = "persona-sdk";
    script.src = "https://cdn.withpersona.com/dist/persona-v5.1.2.js";
    script.async = true;
    script.onload = () => {
      setSdkLoaded(true);
      script.setAttribute("data-loaded", "true");
    };
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !sessionToken || !inquiryId) {
      return;
    }

    if (!window.Persona) {
      toast.error("تعذر تحميل SDK التابع لـ Persona");
      return;
    }

    clientRef.current?.close?.();

    const client = new window.Persona.Client({
      templateId: PERSONA_TEMPLATE_ID,
      environmentId: PERSONA_ENVIRONMENT_ID,
      sessionToken,
      inquiryId,
      onReady: () => client.open(),
      onComplete: () => {
        toast.success("شكراً، سيتم تحديث حالة التحقق خلال دقائق");
      },
    });

    clientRef.current = client;

    return () => {
      client.close?.();
    };
  }, [sdkLoaded, sessionToken, inquiryId]);

  const handleStart = () => {
    if (!PERSONA_TEMPLATE_ID || !PERSONA_ENVIRONMENT_ID) {
      toast.error("نظام التحقق غير مهيأ حالياً");
      return;
    }

    startMutation.mutate();
  };

  const identityVerified = Boolean(user?.is_verified);
  const steps = [
    {
      number: 1,
      title: "التحقق من البريد الإلكتروني",
      icon: Mail,
      status: "completed",
    },
    {
      number: 2,
      title: "التحقق من رقم الهاتف",
      icon: Phone,
      status: "completed",
    },
    {
      number: 3,
      title: "التحقق من الهوية",
      icon: IdCard,
      status: identityVerified ? "completed" : "active",
    },
  ];

  const phoneLabel = user?.phone || "05XXXXXXXX";
  const emailLabel = user?.email || "example@email.com";

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full bg-opacity-30 animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <Navbar />

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl space-y-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <ShieldCheck className="h-10 w-10 text-[hsl(195,80%,70%)]" />
            <h1 className="text-3xl md:text-4xl font-black text-white">التحقق من الهوية - KYC</h1>
          </div>
          <p className="text-white/60">أكمل الخطوات الآمنة لتتمكن من إضافة حسابات للبيع</p>
        </div>

        <Card className="p-5 bg-red-500/10 border-red-500/30 backdrop-blur-sm">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="font-bold mb-1">⚠️ مطلوب للبيع</p>
              <p>يجب إكمال التحقق من الهوية (KYC) قبل أن تتمكن من إضافة أي إعلان.</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                        step.status === "completed"
                          ? "bg-green-500/20 border-green-500"
                          : step.status === "active"
                          ? "bg-[hsl(195,80%,50%)] border-[hsl(195,80%,70%)] shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                          : "bg-white/5 border-white/20"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle2 className="h-7 w-7 text-green-400" />
                      ) : (
                        <Icon className={`h-6 w-6 ${step.status === "active" ? "text-white" : "text-white/40"}`} />
                      )}
                    </div>
                    <span
                      className={`text-sm font-bold text-center ${
                        step.status === "completed"
                          ? "text-green-400"
                          : step.status === "active"
                          ? "text-white"
                          : "text-white/40"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        steps[index + 1].status === "completed" ? "bg-green-500" : "bg-white/20"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                  <h3 className="text-xl font-bold text-white">التحقق من البريد الإلكتروني</h3>
                </div>
                <p className="text-white/60 text-sm">
                  تم ربط بريدك الإلكتروني، فقط انتقل لخطوة التحقق من الهوية.
                </p>
                <div>
                  <Label className="text-white text-xs mb-2 block">البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    value={emailLabel}
                    disabled
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                  <h3 className="text-xl font-bold text-white">التحقق من رقم الهاتف</h3>
                </div>
                <p className="text-white/60 text-sm">
                  تم التحقق من رقم الهاتف المرتبط بالحساب مسبقاً.
                </p>
                <div>
                  <Label className="text-white text-xs mb-2 block">رقم الهاتف</Label>
                  <Input
                    type="tel"
                    value={phoneLabel}
                    disabled
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 cursor-not-allowed"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <IdCard className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                <h3 className="text-xl font-bold text-white">التحقق من الهوية - Persona</h3>
              </div>
              <p className="text-white/60 text-sm">
                سنستخدم نظام Persona المعتمد عالمياً للتحقق من هويتك بشكل آمن وسريع.
              </p>
              <Card className="p-6 bg-white/5 border-white/10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(280,70%,50%)] rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">خطوات التحقق عبر Persona</h4>
                    <ul className="text-sm text-white/60 text-right space-y-1">
                      <li>• التقط صورة لهويتك الوطنية أو الإقامة</li>
                      <li>• التقط صورة سيلفي للتحقق</li>
                      <li>• التحقق يتم تلقائياً في دقائق</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)]">
                <div className="flex gap-2">
                  <ShieldCheck className="h-5 w-5 text-[hsl(195,80%,70%)] mt-0.5" />
                  <div className="text-sm text-white/80">
                    <p className="font-bold mb-1">آمن ومشفر</p>
                    <p>Persona منصة موثوقة عالمياً وتؤمن بياناتك طوال العملية.</p>
                  </div>
                </div>
              </Card>

              <Button
                onClick={handleStart}
                disabled={startMutation.isPending || !sdkLoaded}
                className="w-full gap-2 bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(280,70%,50%)] hover:from-[hsl(195,80%,60%)] hover:to-[hsl(280,70%,60%)] text-white border-0 py-6"
              >
                {startMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <IdCard className="h-5 w-5" />
                    {sdkLoaded ? "بدء التحقق عبر Persona" : "جاري التحميل..."}
                  </>
                )}
                <ArrowRight className="h-5 w-5" />
              </Button>

              {!sdkLoaded && (
                <p className="text-xs text-center text-white/60">
                  SDK التابع لـ Persona لا يزال يُحمَّل، يُرجى الانتظار قبل الضغط على الزر.
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)] backdrop-blur-sm">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 text-[hsl(195,80%,70%)] mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="font-bold mb-1">حماية الخصوصية والأمان</p>
              <p>
                جميع معلوماتك الشخصية محمية ومشفرة. نستخدم Persona المعتمد للتحقق من الهوية ولن يتم مشاركة بياناتك مع أي طرف ثالث.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KYC;

