import { Card } from "@/components/ui/card";
import { ShieldCheck, CheckCircle2, AlertCircle, IdCard, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { PersonaKycButton } from "@/components/PersonaKycButton";
import { useLanguage } from "@/contexts/LanguageContext";

const KYC = () => {
  const { user, refreshUser } = useAuth();
  const { t, language } = useLanguage();

  const identityVerified = Boolean(user?.has_completed_kyc);
  const steps = [
    {
      number: 1,
      title: t('kyc.identityVerification'),
      icon: IdCard,
      status: identityVerified ? "completed" : "active",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
            <h1 className="text-3xl md:text-4xl font-black text-white">{t('kyc.title')}</h1>
          </div>
          <p className="text-white/60">{t('kyc.subtitle')}</p>
        </div>

        <Card className="p-5 bg-red-500/10 border-red-500/30 backdrop-blur-sm">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="font-bold mb-1">{t('kyc.requiredForSale')}</p>
              <p>{t('kyc.requiredDescription')}</p>
            </div>
          </div>
        </Card>

        {identityVerified ? (
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500/50 to-green-400/60 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">{t('kyc.verifiedTitle')}</h3>
              <p className="text-white/70">
                {t('kyc.verifiedDescription')}
              </p>
            </div>
          </Card>
        ) : (
          <>
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
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <IdCard className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                  <h3 className="text-xl font-bold text-white">{t('kyc.personaTitle')}</h3>
                </div>
                <p className="text-white/60 text-sm">
                  {t('kyc.personaDescription')}
                </p>
                <Card className="p-6 bg-white/5 border-white/10">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(280,70%,50%)] rounded-full flex items-center justify-center">
                      <ShieldCheck className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">{t('kyc.personaStepsTitle')}</h4>
                      <ul className={`text-sm text-white/60 space-y-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        <li>• {t('kyc.personaStep1')}</li>
                        <li>• {t('kyc.personaStep2')}</li>
                        <li>• {t('kyc.personaStep3')}</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)]">
                  <div className="flex gap-2">
                    <ShieldCheck className="h-5 w-5 text-[hsl(195,80%,70%)] mt-0.5" />
                    <div className="text-sm text-white/80">
                      <p className="font-bold mb-1">{t('kyc.secureTitle')}</p>
                      <p>{t('kyc.secureDescription')}</p>
                    </div>
                  </div>
                </Card>

                <PersonaKycButton
                  userId={user?.id}
                  hasCompletedKyc={user?.has_completed_kyc}
                  className="w-full gap-2 bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(280,70%,50%)] hover:from-[hsl(195,80%,60%)] hover:to-[hsl(280,70%,60%)] text-white border-0 py-6 flex items-center justify-center"
                  onCompleted={async () => {
                    toast.success(t('kyc.verificationSubmitted'));
                    try {
                      await refreshUser();
                    } catch {
                      // ignore refresh failures for now
                    }
                  }}
                >
                  <IdCard className="h-5 w-5" />
                  {t('kyc.startVerification')}
                  <ArrowRight className="h-5 w-5" />
                </PersonaKycButton>

              </div>
            </Card>
          </>
        )}

        <Card className="p-5 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)] backdrop-blur-sm">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 text-[hsl(195,80%,70%)] mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="font-bold mb-1">{t('kyc.privacyTitle')}</p>
              <p>
                {t('kyc.privacyDescription')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KYC;

