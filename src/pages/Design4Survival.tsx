import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Users, ArrowLeft, TrendingUp, Award, Search, Filter, Star } from "lucide-react";
import heroSurvival from "@/assets/hero-survival.jpg";
import featureShelter from "@/assets/feature-shelter.jpg";
import { Link } from "react-router-dom";

const Design4Survival = () => {
  const categories = [
    { icon: Shield, label: "حسابات محمية", count: "250+" },
    { icon: Award, label: "بائعون موثقون", count: "150+" },
    { icon: TrendingUp, label: "صفقات نشطة", count: "500+" },
  ];

  const features = [
    {
      icon: Shield,
      title: "نظام ESCROW",
      desc: "حماية مطلقة للمعاملات",
      color: "from-blue-600 to-cyan-500"
    },
    {
      icon: Zap,
      title: "تسليم فوري",
      desc: "استلم الحساب خلال دقائق",
      color: "from-yellow-600 to-orange-500"
    },
    {
      icon: Users,
      title: "دعم 24/7",
      desc: "فريق متاح دائماً لمساعدتك",
      color: "from-purple-600 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a2332]">
      {/* Header */}
      <header className="bg-[#0f1824] border-b border-white/10 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
                القائمة الرئيسية
              </Button>
            </Link>
            
            <div className="flex items-center gap-6">
              <Button variant="ghost" className="text-gray-300 hover:text-white">الرئيسية</Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white">السوق</Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white">كيف تعمل</Button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                تسجيل الدخول
              </Button>
              <Button className="bg-gradient-to-l from-yellow-500 to-orange-500 text-black font-bold hover:from-yellow-400 hover:to-orange-400">
                اشترك الآن
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroSurvival} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/90 via-[#1a2332]/80 to-[#1a2332]"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzNiODJmNiIgb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        </div>

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-l from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-yellow-400 font-bold text-sm">منصة موثوقة • 10,000+ معاملة</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white leading-tight">
              سوق حسابات
              <span className="block bg-gradient-to-l from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                WHITEOUT SURVIVAL
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              اشترِ وبِع حسابات اللعبة بأمان تام مع نظام حماية متعدد الطبقات
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 bg-gradient-to-l from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black shadow-2xl border-2 border-yellow-400/50"
              >
                <Search className="ml-2 h-5 w-5" />
                تصفح الحسابات
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-7 bg-white/5 hover:bg-white/10 text-white border-white/30 backdrop-blur-sm"
              >
                ابدأ البيع
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              {categories.map((cat, idx) => (
                <div key={idx} className="bg-[#0f1824]/80 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-yellow-500/50 transition-all">
                  <cat.icon className="h-6 w-6 text-yellow-500 mb-2" />
                  <div className="text-2xl font-black text-white mb-1">{cat.count}</div>
                  <div className="text-xs text-gray-400">{cat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Info Section with Cards */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
              <span className="text-blue-400 font-bold">معلومات أساسية</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              لماذا تختار منصتنا
            </h2>
            <p className="text-xl text-gray-400">حماية متقدمة وخدمة احترافية</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <Card 
                key={idx}
                className="relative overflow-hidden bg-[#0f1824] border-2 border-white/10 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-l ${feature.color}`}></div>
                <div className="p-8">
                  <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full bg-[#0f1824] rounded-2xl flex items-center justify-center">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Database Section - Game Inspired */}
      <section className="py-20 bg-[#0f1824]/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
              <span className="text-purple-400 font-bold">قاعدة البيانات</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              استكشف الحسابات
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { label: "الخوادم العربية", count: "120", icon: "🗺️" },
              { label: "الخوادم الأجنبية", count: "180", icon: "🌍" },
              { label: "حسابات VIP", count: "85", icon: "👑" },
              { label: "عروض خاصة", count: "45", icon: "⚡" }
            ].map((item, idx) => (
              <Card 
                key={idx}
                className="relative overflow-hidden bg-gradient-to-br from-[#1a2332] to-[#0f1824] border-2 border-white/10 hover:border-yellow-500/50 transition-all cursor-pointer group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative p-8 text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="text-4xl font-black text-yellow-400 mb-2">{item.count}</div>
                  <div className="text-white font-bold">{item.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process with Image */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={featureShelter} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                عملية بسيطة وآمنة
              </h2>
              <p className="text-xl text-gray-400">أربع خطوات فقط للحصول على حسابك</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { num: "01", title: "اختر الحساب", desc: "تصفح مئات الحسابات مع تفاصيل كاملة وصور حقيقية", color: "blue" },
                { num: "02", title: "ادفع بأمان", desc: "الدفع عبر تاب - أموالك محفوظة في escrow", color: "yellow" },
                { num: "03", title: "استلم المعلومات", desc: "احصل على بيانات الحساب فوراً بعد الدفع", color: "green" },
                { num: "04", title: "تأكيد أو نزاع", desc: "12 ساعة للتحقق ثم تأكيد أو فتح نزاع", color: "purple" }
              ].map((step, idx) => (
                <Card 
                  key={idx}
                  className="bg-[#0f1824]/90 backdrop-blur-sm border-2 border-white/10 hover:border-white/30 transition-all p-8 group"
                >
                  <div className="flex items-start gap-6">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${
                      step.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                      step.color === 'yellow' ? 'from-yellow-500 to-orange-500' :
                      step.color === 'green' ? 'from-green-500 to-emerald-500' :
                      'from-purple-500 to-pink-500'
                    } flex items-center justify-center text-2xl font-black text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-[#1a2332] to-purple-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAgTSAyMCAwIEwgMjAgNjAgTSAwIDIwIEwgNjAgMjAgTSAzMCAwIEwgMzAgNjAgTSAwIDMwIEwgNjAgMzAgTSA0MCAwIEwgNDAgNjAgTSAwIDQwIEwgNjAgNDAgTSA1MCAwIEwgNTAgNjAgTSAwIDUwIEwgNjAgNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <Star className="w-20 h-20 text-yellow-400 fill-yellow-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            انضم للمجتمع الآن
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            آلاف اللاعبين يتداولون الحسابات بأمان على منصتنا كل يوم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-xl px-14 py-8 bg-gradient-to-l from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black shadow-2xl hover:scale-105 transition-all"
            >
              إنشاء حساب مجاناً
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-xl px-14 py-8 bg-white/5 hover:bg-white/10 text-white border-white/30 backdrop-blur-sm"
            >
              استكشف المنصة
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-sm">حماية 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              <span className="text-sm">بائعون موثقون</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-400" />
              <span className="text-sm">تسليم فوري</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1824] border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-black text-white mb-2">
              WHITEOUT SURVIVAL <span className="text-yellow-400">MARKET</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 منصة تداول حسابات الألعاب. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Design4Survival;
