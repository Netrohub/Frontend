import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Users, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import heroArctic from "@/assets/hero-arctic.jpg";
import { Link } from "react-router-dom";

const Design1Arctic = () => {
  return (
    <div className="min-h-screen bg-gradient-ice">
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src={heroArctic} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 bg-primary/10 rounded-full">
              <span className="text-primary font-semibold">منصة موثوقة 100%</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-arctic bg-clip-text text-transparent animate-float">
              اشتر وبِع بأمان
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
              أول منصة عربية متخصصة في تداول حسابات Whiteout Survival بنظام ضمان متكامل
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 shadow-arctic hover:shadow-glow transition-all">
                تصفح الحسابات
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                كيف تعمل المنصة
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">لماذا منصتنا؟</h2>
            <p className="text-xl text-muted-foreground">حماية كاملة لحقوق المشتري والبائع</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center hover:shadow-card transition-all hover:-translate-y-2 duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-arctic rounded-2xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">نظام ضمان آمن</h3>
              <p className="text-muted-foreground leading-relaxed">
                الأموال محفوظة في حساب ضمان حتى تأكيد استلام الحساب وعمله بشكل صحيح
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-card transition-all hover:-translate-y-2 duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-arctic rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">تحويل فوري</h3>
              <p className="text-muted-foreground leading-relaxed">
                دفع سريع وآمن عبر تاب - استلم معلومات الحساب فوراً بعد الدفع
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-card transition-all hover:-translate-y-2 duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-arctic rounded-2xl flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">دعم متواصل</h3>
              <p className="text-muted-foreground leading-relaxed">
                فريق دعم عربي متوفر للمساعدة في حل أي مشكلة أو نزاع بسرعة
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">كيف تعمل المنصة</h2>
            <p className="text-xl text-muted-foreground">ثلاث خطوات بسيطة للشراء بأمان</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-arctic">
                    1
                  </div>
                </div>
                <Card className="flex-1 p-8">
                  <h3 className="text-2xl font-bold mb-3">اختر واشترِ</h3>
                  <p className="text-lg text-muted-foreground">
                    تصفح الحسابات المتاحة، اختر الحساب المناسب، وادفع بأمان عبر تاب
                  </p>
                </Card>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-3xl font-bold text-accent-foreground shadow-arctic">
                    2
                  </div>
                </div>
                <Card className="flex-1 p-8">
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-accent" />
                    فترة الضمان (12 ساعة)
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    استلم معلومات الحساب وتحقق منه خلال 12 ساعة. الأموال محفوظة في حساب الضمان
                  </p>
                </Card>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center shadow-arctic">
                    <CheckCircle2 className="h-10 w-10 text-success-foreground" />
                  </div>
                </div>
                <Card className="flex-1 p-8">
                  <h3 className="text-2xl font-bold mb-3">تأكيد أو نزاع</h3>
                  <p className="text-lg text-muted-foreground">
                    إذا كان الحساب يعمل، أكّد الاستلام. إذا كانت هناك مشكلة، افتح نزاعاً وسنحلها
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-arctic relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            ابدأ التداول الآن
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
            انضم لآلاف المستخدمين الذين يثقون بمنصتنا لتداول الحسابات بأمان
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-12 py-6 shadow-2xl hover:scale-105 transition-transform">
            إنشاء حساب مجاني
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 منصة تداول حسابات الألعاب. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Design1Arctic;
