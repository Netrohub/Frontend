import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { kycApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const KYC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [personaLoaded, setPersonaLoaded] = useState(false);

  const { data: kyc, isLoading } = useQuery({
    queryKey: ['kyc'],
    queryFn: () => kycApi.get(),
    enabled: !!user,
  });

  const createKycMutation = useMutation({
    mutationFn: () => kycApi.create(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
      if (data.inquiry_url) {
        window.open(data.inquiry_url, '_blank');
      }
      toast.success("تم إنشاء طلب التحقق");
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل إنشاء طلب التحقق");
    },
  });

  // Load Persona SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.withpersona.com/dist/persona-v5.0.0.js';
    script.async = true;
    script.onload = () => setPersonaLoaded(true);
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
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">مُتحقق</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">قيد المراجعة</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">فشل التحقق</Badge>;
      case 'expired':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">منتهي الصلاحية</Badge>;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <p className="text-white/60 mb-4">يجب تسجيل الدخول للتحقق من الهوية</p>
        </div>
      </div>
    );
  }

  const kycStatus = kyc?.status || 'pending';
  const isVerified = kycStatus === 'verified';

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-8">التحقق من الهوية (KYC)</h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" />
          </div>
        ) : (
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[hsl(195,80%,50%,0.2)] border-2 border-[hsl(195,80%,70%,0.3)] mb-4">
                {isVerified ? (
                  <CheckCircle2 className="h-10 w-10 text-green-400" />
                ) : (
                  <ShieldCheck className="h-10 w-10 text-[hsl(195,80%,70%)]" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isVerified ? "تم التحقق من هويتك" : "التحقق من الهوية"}
              </h2>
              {kyc && getStatusBadge(kyc.status)}
            </div>

            {isVerified ? (
              <div className="text-center space-y-4">
                <p className="text-white/80">
                  تم التحقق من هويتك بنجاح. يمكنك الآن بيع الحسابات على المنصة.
                </p>
                <p className="text-sm text-white/60">
                  تاريخ التحقق: {kyc.verified_at ? new Date(kyc.verified_at).toLocaleDateString('ar-SA') : 'غير متاح'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-2">لماذا نحتاج التحقق من الهوية؟</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/80 text-sm">
                    <li>ضمان أمان المعاملات</li>
                    <li>منع الاحتيال والغش</li>
                    <li>حماية البائعين والمشترين</li>
                    <li>الامتثال للقوانين المحلية</li>
                  </ul>
                </div>

                {kycStatus === 'pending' && (
                  <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-yellow-400 font-bold mb-1">قيد المراجعة</p>
                        <p className="text-white/80 text-sm">
                          طلب التحقق الخاص بك قيد المراجعة. سيتم إشعارك عند اكتمال العملية.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {kycStatus === 'failed' && (
                  <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-bold mb-1">فشل التحقق</p>
                        <p className="text-white/80 text-sm">
                          لم يتم التحقق من هويتك. يرجى المحاولة مرة أخرى.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(kycStatus === 'failed' || !kyc) && (
                  <Button
                    onClick={() => createKycMutation.mutate()}
                    disabled={createKycMutation.isPending || !personaLoaded}
                    className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] py-6"
                  >
                    {createKycMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        جاري المعالجة...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-5 w-5" />
                        ابدأ عملية التحقق
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default KYC;
