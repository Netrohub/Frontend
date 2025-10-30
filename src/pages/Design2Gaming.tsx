import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Trophy, Sparkles, ArrowLeft, Star, TrendingUp } from "lucide-react";
import heroGaming from "@/assets/hero-gaming.jpg";
import { Link } from "react-router-dom";

const Design2Gaming = () => {
  return (
    <div className="min-h-screen bg-gaming-dark text-foreground">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroGaming} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-gaming opacity-80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gaming-accent/20 border border-gaming-accent/50 rounded-full backdrop-blur-sm">
              <Star className="h-5 w-5 text-gaming-gold fill-gaming-gold animate-pulse" />
              <span className="text-white font-bold">المنصة الأولى عربياً</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 text-white">
              سوق الحسابات
              <span className="block text-transparent bg-gradient-to-l from-gaming-accent to-gaming-gold bg-clip-text animate-shimmer">
                الاحترافية
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed">
              تداول حسابات Whiteout Survival بثقة مطلقة مع أقوى نظام حماية في الشرق الأوسط
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-xl px-10 py-7 bg-gaming-accent hover:bg-gaming-accent/90 text-white font-bold shadow-2xl hover:scale-105 transition-all border-2 border-gaming-accent/50"
              >
                <Trophy className="ml-2 h-6 w-6" />
                استكشف الحسابات
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-xl px-10 py-7 bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
              >
                ابدأ البيع الآن
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl">
              <div className="text-center">
                <div className="text-4xl font-black text-gaming-gold mb-2">5000+</div>
                <div className="text-sm text-gray-400">حساب مباع</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-gaming-gold mb-2">98%</div>
                <div className="text-sm text-gray-400">رضا العملاء</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-gaming-gold mb-2">24/7</div>
                <div className="text-sm text-gray-400">دعم فوري</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gaming-accent/5 to-transparent"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              مميزات <span className="text-gaming-accent">استثنائية</span>
            </h2>
            <p className="text-xl text-gray-400">قوة وأمان لا مثيل لهما</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-8 hover:bg-white/10 transition-all hover:scale-105 duration-300 group">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gaming-accent to-gaming-accent/50 rounded-2xl flex items-center justify-center group-hover:animate-float">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">ضمان مطلق</h3>
              <p className="text-gray-400 leading-relaxed">
                نظام escrow متقدم يحمي أموالك بنسبة 100% حتى استلام الحساب والتأكد من سلامته
              </p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-8 hover:bg-white/10 transition-all hover:scale-105 duration-300 group">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gaming-gold to-gaming-gold/50 rounded-2xl flex items-center justify-center group-hover:animate-float">
                  <Sparkles className="h-8 w-8 text-gaming-dark" />
                </div>
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">تحقق فوري</h3>
              <p className="text-gray-400 leading-relaxed">
                جميع الحسابات تمر بفحص صارم قبل العرض - نضمن جودة كل حساب معروض
              </p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-8 hover:bg-white/10 transition-all hover:scale-105 duration-300 group">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-2xl flex items-center justify-center group-hover:animate-float">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">أسعار تنافسية</h3>
              <p className="text-gray-400 leading-relaxed">
                أفضل العروض في السوق مع عمولات منخفضة للبائعين وأسعار عادلة للمشترين
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-24 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              عملية <span className="text-gaming-gold">احترافية</span>
            </h2>
            <p className="text-xl text-gray-400">خطوات واضحة للشراء الآمن</p>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            {[
              { num: "01", title: "اختر حسابك", desc: "تصفح مئات الحسابات المتاحة مع تفاصيل كاملة وصور حقيقية" },
              { num: "02", title: "ادفع بأمان", desc: "الدفع السريع عبر تاب - أموالك في حساب ضمان حتى تأكيد الاستلام" },
              { num: "03", title: "استلم فوراً", desc: "احصل على معلومات الحساب بشكل فوري وابدأ اللعب" },
              { num: "04", title: "أكّد أو استرجع", desc: "12 ساعة لفحص الحساب - إما تأكيد الاستلام أو استرجاع أموالك كاملة" }
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-6 group">
                <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-gaming-accent to-gaming-gold rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <span className="text-3xl font-black text-white">{step.num}</span>
                </div>
                <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <h3 className="text-2xl font-black mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-accent via-gaming-dark to-gaming-gold opacity-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtOC44MzcgNy4xNjMtMTYgMTYtMTZzMTYgNy4xNjMgMTYgMTYtNy4xNjMgMTYtMTYgMTYtMTYtNy4xNjMtMTYtMTZ6bS0yMCA2MGMwLTguODM3IDcuMTYzLTE2IDE2LTE2czE2IDcuMTYzIDE2IDE2LTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-6xl md:text-7xl font-black text-white mb-6">
            انضم للنخبة
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            آلاف اللاعبين المحترفين يستخدمون منصتنا يومياً. حان دورك الآن.
          </p>
          <Button 
            size="lg" 
            className="text-2xl px-16 py-8 bg-gaming-gold hover:bg-gaming-gold/90 text-gaming-dark font-black shadow-2xl hover:scale-110 transition-all"
          >
            سجّل الآن مجاناً
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">
            © 2025 منصة تداول حسابات الألعاب الاحترافية. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Design2Gaming;
