import { Button } from "@/components/ui/button";
import { ArrowRight, Snowflake, Shield, Flame } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Icy background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Animated snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Frost overlay effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[hsl(195,80%,50%,0.05)] to-transparent opacity-40" />
      
      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/10 backdrop-blur-md bg-[hsl(200,70%,15%,0.5)]">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Snowflake className="h-8 w-8 text-[hsl(195,80%,70%)]" />
          <span className="text-xl md:text-2xl font-black text-white">
            NXO<span className="text-[hsl(40,90%,55%)]">Land</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link to="/" className="text-[hsl(195,80%,70%)]">الرئيسية</Link>
          <a href="#features" className="hover:text-[hsl(195,80%,70%)] transition-colors">المميزات</a>
          <Link to="/marketplace" className="hover:text-[hsl(195,80%,70%)] transition-colors">السوق</Link>
          <Link to="/auth" className="hover:text-[hsl(195,80%,70%)] transition-colors">تسجيل الدخول</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 md:px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-[hsl(195,80%,70%,0.3)]">
            <Snowflake className="h-4 w-4 text-[hsl(195,80%,70%)] animate-pulse" />
            <span className="text-sm font-medium text-[hsl(195,80%,70%)]">
              منصة موثوقة 100% لتداول الحسابات
            </span>
          </div>
          
          {/* Main Heading */}
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-white drop-shadow-[0_0_30px_rgba(148,209,240,0.5)]">
              اشتر وبِع{" "}
              <span className="text-[hsl(195,80%,70%)]">بأمان</span>{" "}
              تام
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              أول منصة عربية متخصصة في تداول حسابات Whiteout Survival بنظام ضمان متكامل وحماية شاملة
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              asChild
              size="lg" 
              className="gap-2 text-base px-8 py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0"
            >
              <Link to="/marketplace">
                <Shield className="h-5 w-5" />
                تصفح الحسابات
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              className="gap-2 text-base px-8 py-6 bg-white/5 hover:bg-white/10 text-white font-bold backdrop-blur-sm border border-white/20"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              كيف تعمل المنصة
            </Button>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="p-2 rounded-lg bg-[hsl(195,80%,50%,0.15)] border border-[hsl(195,80%,70%,0.3)]">
                <Shield className="h-4 w-4 text-[hsl(195,80%,70%)]" />
              </div>
              <span>حماية المعاملات</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="p-2 rounded-lg bg-[hsl(40,90%,55%,0.15)] border border-[hsl(40,90%,55%,0.3)]">
                <Flame className="h-4 w-4 text-[hsl(40,90%,55%)]" />
              </div>
              <span>تسليم فوري</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="p-2 rounded-lg bg-[hsl(195,80%,50%,0.15)] border border-[hsl(195,80%,70%,0.3)]">
                <Snowflake className="h-4 w-4 text-[hsl(195,80%,70%)]" />
              </div>
              <span>دعم على مدار الساعة</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">لماذا منصتنا؟</h2>
          <p className="text-xl text-white/60">حماية كاملة لحقوق المشتري والبائع</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "نظام ضمان آمن", icon: Shield, desc: "الأموال محفوظة في حساب ضمان حتى تأكيد استلام الحساب" },
            { title: "تحويل فوري", icon: Snowflake, desc: "دفع سريع وآمن عبر تاب - استلم معلومات الحساب فوراً" },
            { title: "دعم متواصل", icon: Flame, desc: "فريق دعم عربي متوفر للمساعدة في حل أي مشكلة بسرعة" },
          ].map((feature, i) => (
            <div 
              key={i}
              className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[hsl(195,80%,70%,0.5)] transition-all hover:bg-white/10 group"
            >
              <feature.icon className="h-8 w-8 text-[hsl(195,80%,70%)] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">كيف تعمل المنصة</h2>
          <p className="text-xl text-white/60">ثلاث خطوات بسيطة للشراء بأمان</p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            { step: "1", title: "اختر واشترِ", desc: "تصفح الحسابات المتاحة واختر الحساب المناسب" },
            { step: "2", title: "فترة الضمان", desc: "استلم معلومات الحساب وتحقق منه خلال 12 ساعة" },
            { step: "3", title: "تأكيد أو نزاع", desc: "إذا كان الحساب يعمل، أكّد الاستلام" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6 p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[hsl(195,80%,70%,0.3)] transition-all">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[hsl(195,80%,50%)] flex items-center justify-center text-2xl font-black text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                {item.step}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 md:px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white">ابدأ التداول الآن</h2>
          <p className="text-xl text-white/70">انضم لآلاف المستخدمين الذين يثقون بمنصتنا لتداول الحسابات بأمان</p>
          <Button 
            asChild
            size="lg" 
            className="gap-2 text-lg px-12 py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0"
          >
            <Link to="/auth">
              إنشاء حساب مجاني
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10 backdrop-blur-sm bg-[hsl(200,70%,15%,0.5)]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/50">
            © 2025 منصة تداول حسابات الألعاب. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(200,70%,40%,0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default Home;
