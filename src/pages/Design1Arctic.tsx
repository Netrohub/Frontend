import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Users, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import heroArctic from "@/assets/hero-arctic.jpg";
import { Link } from "react-router-dom";

const Design1Arctic = () => {
  return (
    <div className="min-h-screen bg-[#0f1824]">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={heroArctic} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1824] via-[#0f1824]/80 to-[#0f1824]"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 bg-primary/20 border border-primary/30 rounded-full backdrop-blur-sm">
              <span className="text-primary-glow font-semibold">منصة موثوقة 100%</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-arctic bg-clip-text text-transparent animate-float">
              اشتر وبِع بأمان
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              أول منصة عربية متخصصة في تداول حسابات Whiteout Survival بنظام ضمان متكامل
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-arctic hover:opacity-90 shadow-arctic hover:shadow-glow transition-all">
                تصفح الحسابات
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/5 hover:bg-white/10 text-white border-white/30">
                كيف تعمل المنصة
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#1a2332]/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">لماذا منصتنا؟</h2>
            <p className="text-xl text-gray-400">حماية كاملة لحقوق المشتري والبائع</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center bg-[#0f1824]/80 border-2 border-white/10 hover:border-primary/50 hover:shadow-card transition-all hover:-translate-y-2 duration-300 backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-arctic rounded-2xl flex items-center justify-center shadow-glow">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">نظام ضمان آمن</h3>
              <p className="text-gray-400 leading-relaxed">
                الأموال محفوظة في حساب ضمان حتى تأكيد استلام الحساب وعمله بشكل صحيح
              </p>
            </Card>

            <Card className="p-8 text-center bg-[#0f1824]/80 border-2 border-white/10 hover:border-primary/50 hover:shadow-card transition-all hover:-translate-y-2 duration-300 backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-arctic rounded-2xl flex items-center justify-center shadow-glow">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">تحويل فوري</h3>
              <p className="text-gray-400 leading-relaxed">
                دفع سريع وآمن عبر تاب - استلم معلومات الحساب فوراً بعد الدفع
              </p>
            </Card>

            <Card className="p-8 text-center bg-[#0f1824]/80 border-2 border-white/10 hover:border-primary/50 hover:shadow-card transition-all hover:-translate-y-2 duration-300 backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-arctic rounded-2xl flex items-center justify-center shadow-glow">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">دعم متواصل</h3>
              <p className="text-gray-400 leading-relaxed">
                فريق دعم عربي متوفر للمساعدة في حل أي مشكلة أو نزاع بسرعة
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">كيف تعمل المنصة</h2>
            <p className="text-xl text-gray-400">ثلاث خطوات بسيطة للشراء بأمان</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-arctic rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-glow border-2 border-primary/30">
                    1
                  </div>
                </div>
                <Card className="flex-1 p-8 bg-[#0f1824]/80 border-2 border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all">
                  <h3 className="text-2xl font-bold mb-3 text-white">اختر واشترِ</h3>
                  <p className="text-lg text-gray-400">
                    تصفح الحسابات المتاحة، اختر الحساب المناسب، وادفع بأمان عبر تاب
                  </p>
                </Card>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-glow border-2 border-accent/30">
                    2
                  </div>
                </div>
                <Card className="flex-1 p-8 bg-[#0f1824]/80 border-2 border-white/10 backdrop-blur-sm hover:border-accent/50 transition-all">
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-3 text-white">
                    <Clock className="h-6 w-6 text-accent" />
                    فترة الضمان (12 ساعة)
                  </h3>
                  <p className="text-lg text-gray-400">
                    استلم معلومات الحساب وتحقق منه خلال 12 ساعة. الأموال محفوظة في حساب الضمان
                  </p>
                </Card>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-success to-success/70 rounded-full flex items-center justify-center shadow-glow border-2 border-success/30">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                </div>
                <Card className="flex-1 p-8 bg-[#0f1824]/80 border-2 border-white/10 backdrop-blur-sm hover:border-success/50 transition-all">
                  <h3 className="text-2xl font-bold mb-3 text-white">تأكيد أو نزاع</h3>
                  <p className="text-lg text-gray-400">
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
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9InNub3ciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4zIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSIzMCIgcj0iMSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4yIi8+PGNpcmNsZSBjeD0iMjUiIGN5PSI1MCIgcj0iMS41IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjI1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3Nub3cpIi8+PC9zdmc+')] animate-float"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ابدأ التداول الآن
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            انضم لآلاف المستخدمين الذين يثقون بمنصتنا لتداول الحسابات بأمان
          </p>
          <Button size="lg" className="text-lg px-12 py-6 bg-white text-primary hover:bg-white/90 font-bold shadow-2xl hover:scale-105 transition-transform">
            إنشاء حساب مجاني
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1824] py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">
            © 2025 منصة تداول حسابات الألعاب. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Design1Arctic;
