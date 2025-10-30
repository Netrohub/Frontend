import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Lock, CheckCircle2, ArrowLeft, FileCheck, UserCheck, Clock } from "lucide-react";
import heroTrust from "@/assets/hero-trust.jpg";
import { Link } from "react-router-dom";

const Design3Trust = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-trust">
        <div className="absolute inset-0 opacity-20">
          <img src={heroTrust} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container mx-auto px-4 py-28 md:py-36">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
              <CheckCircle2 className="h-5 w-5 text-white" />
              <span className="text-white font-bold">منصة مرخصة ومعتمدة</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 text-white leading-tight">
              الأمان والثقة
              <span className="block">في تداول الحسابات</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              نوفر بيئة آمنة تماماً لشراء وبيع حسابات Whiteout Survival مع حماية قانونية كاملة لجميع الأطراف
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-10 py-7 bg-white text-trust-blue hover:bg-white/90 font-bold shadow-2xl">
                ابدأ الآن
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 bg-white/10 hover:bg-white/20 text-white border-white/50 backdrop-blur-sm">
                تعرف على المزيد
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 items-center">
              <div className="flex items-center gap-2 text-white">
                <Shield className="h-6 w-6" />
                <span className="font-semibold">تشفير SSL 256-bit</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Lock className="h-6 w-6" />
                <span className="font-semibold">معاملات آمنة 100%</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <UserCheck className="h-6 w-6" />
                <span className="font-semibold">بائعون موثقون</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">طبقات الأمان المتعددة</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نستخدم أحدث تقنيات الحماية لضمان سلامة معاملاتك
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 border-2 hover:border-trust-blue transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-trust-blue/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-trust-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">نظام Escrow</h3>
              <p className="text-muted-foreground leading-relaxed">
                الأموال محفوظة في حساب وسيط آمن حتى اكتمال الصفقة بنجاح
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-trust-green transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-trust-green/10 rounded-xl flex items-center justify-center mb-6">
                <UserCheck className="h-7 w-7 text-trust-green" />
              </div>
              <h3 className="text-xl font-bold mb-3">التحقق من الهوية (KYC)</h3>
              <p className="text-muted-foreground leading-relaxed">
                جميع البائعين يخضعون لعملية توثيق صارمة عبر Persona
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-trust-blue transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-trust-blue/10 rounded-xl flex items-center justify-center mb-6">
                <FileCheck className="h-7 w-7 text-trust-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">فحص الحسابات</h3>
              <p className="text-muted-foreground leading-relaxed">
                كل حساب يتم فحصه والتأكد من صحته قبل عرضه على المنصة
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-trust-green transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-trust-green/10 rounded-xl flex items-center justify-center mb-6">
                <Lock className="h-7 w-7 text-trust-green" />
              </div>
              <h3 className="text-xl font-bold mb-3">تشفير متقدم</h3>
              <p className="text-muted-foreground leading-relaxed">
                بياناتك ومعلوماتك المالية محمية بأعلى معايير التشفير
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-trust-blue transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-trust-blue/10 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-trust-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">فترة حماية 12 ساعة</h3>
              <p className="text-muted-foreground leading-relaxed">
                لديك 12 ساعة كاملة للتحقق من الحساب قبل تحرير الأموال للبائع
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-trust-green transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-trust-green/10 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="h-7 w-7 text-trust-green" />
              </div>
              <h3 className="text-xl font-bold mb-3">حل النزاعات</h3>
              <p className="text-muted-foreground leading-relaxed">
                فريق متخصص لحل أي نزاع بشكل عادل وسريع مع إثباتات موثقة
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">عملية واضحة وشفافة</h2>
            <p className="text-xl text-muted-foreground">خطوات محددة لكل معاملة</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 border-l-4 border-l-trust-blue">
                <div className="text-5xl font-black text-trust-blue mb-4">01</div>
                <h3 className="text-2xl font-bold mb-4">اختيار الحساب والدفع</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-blue flex-shrink-0 mt-0.5" />
                    <span>تصفح الحسابات المعروضة مع تفاصيل كاملة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-blue flex-shrink-0 mt-0.5" />
                    <span>الدفع الآمن عبر تاب (معالج دفع مرخص)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-blue flex-shrink-0 mt-0.5" />
                    <span>الأموال تُحفظ في حساب ضمان محمي</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 border-l-4 border-l-trust-green">
                <div className="text-5xl font-black text-trust-green mb-4">02</div>
                <h3 className="text-2xl font-bold mb-4">الاستلام والفحص</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-green flex-shrink-0 mt-0.5" />
                    <span>استلام معلومات الحساب فوراً</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-green flex-shrink-0 mt-0.5" />
                    <span>12 ساعة كاملة للتحقق من الحساب</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-green flex-shrink-0 mt-0.5" />
                    <span>الأموال لا تُصرف للبائع حتى تأكيدك</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 border-l-4 border-l-trust-blue">
                <div className="text-5xl font-black text-trust-blue mb-4">03</div>
                <h3 className="text-2xl font-bold mb-4">التأكيد أو النزاع</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-blue flex-shrink-0 mt-0.5" />
                    <span>إذا كان كل شيء جيد، أكّد الاستلام</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-blue flex-shrink-0 mt-0.5" />
                    <span>إذا وجدت مشكلة، افتح نزاعاً موثقاً</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-blue flex-shrink-0 mt-0.5" />
                    <span>الأموال تُسترجع كاملة في حال النزاع</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 border-l-4 border-l-trust-green">
                <div className="text-5xl font-black text-trust-green mb-4">04</div>
                <h3 className="text-2xl font-bold mb-4">اكتمال الصفقة</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-green flex-shrink-0 mt-0.5" />
                    <span>تحرير الأموال للبائع بعد التأكيد</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-green flex-shrink-0 mt-0.5" />
                    <span>تقييم البائع والصفقة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-trust-green flex-shrink-0 mt-0.5" />
                    <span>دعم مستمر بعد البيع</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-trust relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/80"></div>
        <div className="relative container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-black mb-2">10,000+</div>
              <div className="text-lg opacity-90">صفقة ناجحة</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">99.8%</div>
              <div className="text-lg opacity-90">معدل الرضا</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">500+</div>
              <div className="text-lg opacity-90">بائع موثق</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">0</div>
              <div className="text-lg opacity-90">حالة احتيال</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            انضم لمجتمع آمن وموثوق
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            ابدأ التداول الآن مع حماية كاملة لحقوقك ومعاملاتك
          </p>
          <Button size="lg" className="text-lg px-12 py-7 bg-trust-blue hover:bg-trust-blue/90">
            إنشاء حساب
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 منصة تداول حسابات الألعاب الآمنة. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Design3Trust;
