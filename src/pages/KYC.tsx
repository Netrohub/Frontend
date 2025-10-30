import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Snowflake, ShieldCheck, CheckCircle2, AlertCircle, Mail, Phone, IdCard, ArrowRight, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const KYC = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: email, 2: phone, 3: identity
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);

  const steps = [
    { 
      number: 1, 
      title: "التحقق من البريد الإلكتروني", 
      icon: Mail,
      status: emailVerified ? "completed" : currentStep === 1 ? "active" : "locked"
    },
    { 
      number: 2, 
      title: "التحقق من رقم الهاتف", 
      icon: Phone,
      status: phoneVerified ? "completed" : currentStep === 2 ? "active" : "locked"
    },
    { 
      number: 3, 
      title: "التحقق من الهوية", 
      icon: IdCard,
      status: identityVerified ? "completed" : currentStep === 3 ? "active" : "locked"
    },
  ];

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
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/10 backdrop-blur-md bg-[hsl(200,70%,15%,0.5)]">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Snowflake className="h-8 w-8 text-[hsl(195,80%,70%)]" />
          <span className="text-xl md:text-2xl font-black text-white">
            NXO<span className="text-[hsl(40,90%,55%)]">Land</span>
          </span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <ShieldCheck className="h-10 w-10 text-[hsl(195,80%,70%)]" />
            <h1 className="text-3xl md:text-4xl font-black text-white">التحقق من الهوية - KYC</h1>
          </div>
          <p className="text-lg text-white/60">أكمل جميع الخطوات لتتمكن من إضافة إعلانات</p>
        </div>

        {/* Warning Alert */}
        <Card className="p-5 bg-red-500/10 border-red-500/30 backdrop-blur-sm mb-8">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="font-bold mb-1">⚠️ مطلوب للبيع</p>
              <p>يجب إكمال جميع خطوات التحقق (KYC) قبل أن تتمكن من إضافة حسابات للبيع على المنصة.</p>
            </div>
          </div>
        </Card>

        {/* Progress Steps */}
        <Card className="p-6 mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
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
                    <span className={`text-sm font-bold text-center ${
                      step.status === "completed" ? "text-green-400" : 
                      step.status === "active" ? "text-white" : "text-white/40"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 ${
                      steps[index + 1].status === "completed" ? "bg-green-500" : "bg-white/20"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: Email Verification */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                <h3 className="text-xl font-bold text-white">التحقق من البريد الإلكتروني</h3>
              </div>
              <p className="text-white/60 mb-4">أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق</p>
              
              <div>
                <Label className="text-white mb-2 block">البريد الإلكتروني</Label>
                <Input 
                  type="email"
                  placeholder="example@email.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <Button 
                onClick={() => {
                  setEmailVerified(true);
                  setCurrentStep(2);
                }}
                className="w-full gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
              >
                إرسال رمز التحقق
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Phone Verification */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                <h3 className="text-xl font-bold text-white">التحقق من رقم الهاتف</h3>
              </div>
              <p className="text-white/60 mb-4">أدخل رقم هاتفك وسنرسل لك رمز التحقق عبر SMS</p>
              
              <div>
                <Label className="text-white mb-2 block">رقم الهاتف</Label>
                <Input 
                  type="tel"
                  placeholder="05XXXXXXXX"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  dir="ltr"
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">رمز التحقق</Label>
                <Input 
                  type="text"
                  placeholder="XXXXXX"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  dir="ltr"
                />
              </div>

              <Button 
                onClick={() => {
                  setPhoneVerified(true);
                  setCurrentStep(3);
                }}
                className="w-full gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
              >
                تحقق من الرمز
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 3: Identity Verification */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <IdCard className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                <h3 className="text-xl font-bold text-white">التحقق من الهوية</h3>
              </div>
              <p className="text-white/60 mb-4">ارفع صورة واضحة لهويتك الوطنية أو الإقامة</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">الجهة الأمامية للهوية</Label>
                  <button className="w-full aspect-video bg-white/5 border-2 border-dashed border-white/20 rounded-lg hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-white/40" />
                    <span className="text-sm text-white/60">رفع صورة</span>
                  </button>
                </div>

                <div>
                  <Label className="text-white mb-2 block">الجهة الخلفية للهوية</Label>
                  <button className="w-full aspect-video bg-white/5 border-2 border-dashed border-white/20 rounded-lg hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-white/40" />
                    <span className="text-sm text-white/60">رفع صورة</span>
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">صورة سيلفي (للتحقق)</Label>
                <button className="w-full aspect-video bg-white/5 border-2 border-dashed border-white/20 rounded-lg hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex flex-col items-center justify-center gap-2">
                  <Upload className="h-8 w-8 text-white/40" />
                  <span className="text-sm text-white/60">التقط صورة سيلفي</span>
                </button>
              </div>

              <Card className="p-4 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)]">
                <p className="text-sm text-white/80">
                  ℹ️ تأكد من وضوح الصورة وظهور جميع البيانات. سيتم مراجعة طلبك خلال 24-48 ساعة.
                </p>
              </Card>

              <Button 
                onClick={() => setIdentityVerified(true)}
                className="w-full gap-2 bg-green-500 hover:bg-green-600 text-white border-0"
              >
                <CheckCircle2 className="h-5 w-5" />
                إرسال للمراجعة
              </Button>
            </div>
          )}

          {/* All Steps Completed */}
          {emailVerified && phoneVerified && identityVerified && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">تم إكمال التحقق!</h3>
              <p className="text-white/60 mb-6">سيتم مراجعة معلوماتك خلال 24-48 ساعة</p>
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
