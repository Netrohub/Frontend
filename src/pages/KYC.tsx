import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Snowflake, ShieldCheck, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const KYC = () => {
  const kycStatus = "not_started"; // "not_started" | "pending" | "verified" | "rejected"

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
            <h1 className="text-3xl md:text-4xl font-black text-white">توثيق الهوية</h1>
          </div>
          <p className="text-lg text-white/60">تحقق من هويتك لزيادة الثقة والأمان</p>
        </div>

        {/* Status Card - Shows when pending */}
        {/* Uncomment and change kycStatus to "pending" to show this */}
        {/*
        {kycStatus === "pending" && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-[hsl(40,90%,55%,0.15)] to-[hsl(40,90%,55%,0.05)] border-[hsl(40,90%,55%,0.3)] backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-[hsl(40,90%,55%)] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white text-lg mb-1">قيد المراجعة</h3>
                <p className="text-white/80">تم استلام طلب التوثيق. سيتم المراجعة خلال 24-48 ساعة.</p>
              </div>
              <Badge className="bg-[hsl(40,90%,55%,0.2)] text-[hsl(40,90%,55%)] border-[hsl(40,90%,55%,0.5)] mr-auto">
                قيد المراجعة
              </Badge>
            </div>
          </Card>
        )}
        */}

        {/* Benefits */}
        <Card className="p-6 mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">فوائد التوثيق</h2>
          <div className="space-y-4">
            {[
              "زيادة الثقة مع المشترين والبائعين",
              "رفع حد المبيعات والمشتريات",
              "أولوية في حل النزاعات",
              "شارة التوثيق على ملفك الشخصي",
              "إمكانية السحب السريع",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[hsl(195,80%,70%)] flex-shrink-0" />
                <span className="text-white/80">{benefit}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Verification Steps */}
        <Card className="p-6 mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">خطوات التوثيق</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[hsl(195,80%,50%)] flex items-center justify-center flex-shrink-0 text-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">معلومات شخصية</h3>
                <p className="text-white/60 text-sm">أدخل اسمك الكامل وتاريخ الميلاد</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[hsl(195,80%,50%)] flex items-center justify-center flex-shrink-0 text-white font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">صورة الهوية</h3>
                <p className="text-white/60 text-sm">التقط صورة واضحة للهوية الوطنية أو الإقامة</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[hsl(195,80%,50%)] flex items-center justify-center flex-shrink-0 text-white font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">صورة شخصية</h3>
                <p className="text-white/60 text-sm">التقط صورة سيلفي للتحقق من الهوية</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy Notice */}
        <Card className="p-5 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)] backdrop-blur-sm mb-8">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-[hsl(195,80%,70%)] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="font-bold mb-1">حماية الخصوصية</p>
              <p>جميع معلوماتك الشخصية محمية ومشفرة. نستخدم نظام Persona المعتمد عالمياً للتحقق من الهوية.</p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        {kycStatus === "not_started" && (
          <Button 
            size="lg"
            className="w-full gap-2 text-lg py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0"
          >
            <ShieldCheck className="h-6 w-6" />
            بدء عملية التوثيق
          </Button>
        )}

        {/* Persona Integration Placeholder */}
        <div className="mt-8 p-8 bg-white/5 border-2 border-dashed border-white/20 rounded-lg text-center">
          <ShieldCheck className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">سيتم دمج نظام Persona للتوثيق هنا</p>
        </div>
      </div>
    </div>
  );
};

export default KYC;
