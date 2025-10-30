import { Card } from "@/components/ui/card";
import { Snowflake, Shield, Zap, Users, Target, Heart, ShoppingCart, Package, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
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
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">من نحن</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            منصة NXOLand هي أول منصة عربية متخصصة في تداول حسابات الألعاب بنظام ضمان متكامل
          </p>
        </div>

        {/* Mission */}
        <Card className="p-8 mb-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
          <Target className="h-12 w-12 text-[hsl(195,80%,70%)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">رؤيتنا</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            نسعى لتوفير بيئة آمنة وموثوقة لتداول حسابات الألعاب، حيث يمكن للاعبين شراء وبيع حساباتهم 
            بكل ثقة واطمئنان. نؤمن بأن كل لاعب يستحق تجربة تداول عادلة ومحمية.
          </p>
        </Card>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm hover:border-[hsl(195,80%,70%,0.5)] transition-all">
            <Shield className="h-10 w-10 text-[hsl(195,80%,70%)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">الأمان</h3>
            <p className="text-white/70">حماية كاملة لجميع المعاملات</p>
          </Card>

          <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm hover:border-[hsl(195,80%,70%,0.5)] transition-all">
            <Zap className="h-10 w-10 text-[hsl(40,90%,55%)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">السرعة</h3>
            <p className="text-white/70">معاملات فورية وسلسة</p>
          </Card>

          <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm hover:border-[hsl(195,80%,70%,0.5)] transition-all">
            <Heart className="h-10 w-10 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">الثقة</h3>
            <p className="text-white/70">مجتمع موثوق ومدعوم</p>
          </Card>
        </div>

        {/* Story */}
        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">قصتنا</h2>
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>
              بدأت NXOLand من فكرة بسيطة: كيف يمكننا جعل تداول حسابات الألعاب أكثر أماناً وسهولة؟
            </p>
            <p>
              بعد تجارب شخصية مع عمليات احتيال في تداول الحسابات، قررنا بناء منصة تضع الأمان والثقة 
              في المقام الأول. اليوم، نخدم آلاف اللاعبين في المنطقة العربية.
            </p>
            <p>
              نستخدم أحدث تقنيات الأمان والتشفير، ونوفر نظام ضمان فريد يحمي حقوق المشتري والبائع على 
              حد سواء. فريقنا متواجد على مدار الساعة لضمان تجربة سلسة لجميع المستخدمين.
            </p>
          </div>
        </Card>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">كيف تعمل المنصة</h2>
          
          {/* Buyer Steps */}
          <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="h-8 w-8 text-[hsl(195,80%,70%)]" />
              <h3 className="text-2xl font-bold text-white">خطوات المشتري</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(195,80%,70%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(195,80%,70%)] font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">تصفح الحسابات</h4>
                  <p className="text-white/70 text-sm">ابحث عن الحساب المناسب من السوق</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(195,80%,70%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(195,80%,70%)] font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">الطلب والدفع</h4>
                  <p className="text-white/70 text-sm">اطلب الحساب وادفع بأمان عبر المنصة</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(195,80%,70%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(195,80%,70%)] font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">استلام البيانات</h4>
                  <p className="text-white/70 text-sm">احصل على بيانات الحساب بعد موافقة البائع</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(195,80%,70%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(195,80%,70%)] font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">التأكيد</h4>
                  <p className="text-white/70 text-sm">راجع الحساب وأكد استلامه لإتمام العملية</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Seller Steps */}
          <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-8 w-8 text-[hsl(40,90%,55%)]" />
              <h3 className="text-2xl font-bold text-white">خطوات البائع</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(40,90%,55%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(40,90%,55%)] font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">إنشاء الإعلان</h4>
                  <p className="text-white/70 text-sm">أضف تفاصيل حسابك والسعر المطلوب</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(40,90%,55%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(40,90%,55%)] font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">استقبال الطلبات</h4>
                  <p className="text-white/70 text-sm">انتظر طلب المشتري وراجع التفاصيل</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(40,90%,55%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(40,90%,55%)] font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">تسليم الحساب</h4>
                  <p className="text-white/70 text-sm">أرسل بيانات الحساب للمشتري عبر المنصة</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(40,90%,55%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(40,90%,55%)] font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">استلام المبلغ</h4>
                  <p className="text-white/70 text-sm">احصل على أموالك بعد تأكيد المشتري</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-black text-[hsl(195,80%,70%)] mb-2">1,200+</div>
            <div className="text-sm text-white/60">مستخدم نشط</div>
          </Card>
          
          <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-black text-[hsl(40,90%,55%)] mb-2">5,000+</div>
            <div className="text-sm text-white/60">عملية ناجحة</div>
          </Card>
          
          <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-black text-green-400 mb-2">98%</div>
            <div className="text-sm text-white/60">معدل الرضا</div>
          </Card>
          
          <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-black text-white mb-2">24/7</div>
            <div className="text-sm text-white/60">الدعم الفني</div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10 backdrop-blur-sm bg-[hsl(200,70%,15%,0.5)]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/50">© 2025 NXOLand. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
