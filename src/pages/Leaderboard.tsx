import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Snowflake, Trophy, Star, TrendingUp, Medal } from "lucide-react";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const topSellers = [
    { rank: 1, name: "فاطمة النور", revenue: "52,800", rating: 5.0, sales: 156, badge: "ذهبية" },
    { rank: 2, name: "محمد العتيبي", revenue: "45,200", rating: 4.9, sales: 142, badge: "فضية" },
    { rank: 3, name: "خالد الدوسري", revenue: "41,600", rating: 4.9, sales: 124, badge: "برونزية" },
    { rank: 4, name: "أحمد السعيد", revenue: "32,100", rating: 4.8, sales: 98 },
    { rank: 5, name: "سارة المطيري", revenue: "28,400", rating: 4.7, sales: 87 },
    { rank: 6, name: "نورة الغامدي", revenue: "25,300", rating: 4.6, sales: 76 },
    { rank: 7, name: "عبدالله القحطاني", revenue: "22,100", rating: 4.8, sales: 68 },
    { rank: 8, name: "ريم الشهري", revenue: "19,800", rating: 4.7, sales: 62 },
  ];

  const getBadgeColor = (rank: number) => {
    if (rank === 1) return "from-[hsl(45,100%,51%)] to-[hsl(45,100%,41%)]";
    if (rank === 2) return "from-[hsl(0,0%,75%)] to-[hsl(0,0%,60%)]";
    if (rank === 3) return "from-[hsl(25,75%,47%)] to-[hsl(25,75%,37%)]";
    return "from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)]";
  };

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
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link to="/" className="hover:text-[hsl(195,80%,70%)] transition-colors">الرئيسية</Link>
          <Link to="/marketplace" className="hover:text-[hsl(195,80%,70%)] transition-colors">السوق</Link>
          <Link to="/members" className="hover:text-[hsl(195,80%,70%)] transition-colors">الأعضاء</Link>
          <Link to="/leaderboard" className="text-[hsl(195,80%,70%)]">لوحة الصدارة</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Trophy className="h-8 w-8 text-[hsl(40,90%,55%)]" />
            <h1 className="text-3xl md:text-4xl font-black text-white">لوحة الصدارة</h1>
          </div>
          <p className="text-lg text-white/60">أفضل البائعين على المنصة</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <div className="md:order-1 md:mt-8">
            <Card className="p-4 text-center bg-white/10 border-2 border-white/20 backdrop-blur-sm shadow-lg">
              <div className="relative inline-block mb-3">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getBadgeColor(2)} flex items-center justify-center shadow-[0_0_30px_rgba(192,192,192,0.4)]`}>
                  <Medal className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[hsl(0,0%,75%)] flex items-center justify-center font-black text-white text-xs shadow-lg">
                  2
                </div>
              </div>
              <h3 className="font-black text-white text-lg mb-2 drop-shadow-lg">{topSellers[1].name}</h3>
              <div className="text-3xl font-black text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{topSellers[1].revenue}</div>
              <div className="text-xs font-bold text-white/90 mb-2">ريال سعودي</div>
              <div className="flex items-center justify-center gap-1">
                <Star className="h-3 w-3 fill-[hsl(40,90%,55%)] text-[hsl(40,90%,55%)]" />
                <span className="font-bold text-white text-sm">{topSellers[1].rating}</span>
              </div>
            </Card>
          </div>

          {/* 1st Place */}
          <div className="md:order-2">
            <Card className="p-5 text-center bg-gradient-to-br from-[hsl(45,100%,51%,0.15)] to-[hsl(45,100%,30%,0.1)] border-2 border-[hsl(45,100%,51%,0.5)] backdrop-blur-sm shadow-[0_0_40px_rgba(255,215,0,0.3)]">
              <div className="relative inline-block mb-3">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getBadgeColor(1)} flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.6)]`}>
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[hsl(45,100%,51%)] flex items-center justify-center font-black text-white shadow-lg text-sm">
                  1
                </div>
              </div>
              <Badge className="mb-2 bg-[hsl(45,100%,51%,0.3)] text-white border-[hsl(45,100%,51%)] font-bold text-xs">
                البائع الأول
              </Badge>
              <h3 className="font-black text-white text-xl mb-2 drop-shadow-lg">{topSellers[0].name}</h3>
              <div className="text-4xl font-black text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{topSellers[0].revenue}</div>
              <div className="text-sm font-bold text-white/90 mb-2">ريال سعودي</div>
              <div className="flex items-center justify-center gap-1 text-[hsl(45,100%,60%)]">
                <Star className="h-4 w-4 fill-current drop-shadow-lg" />
                <span className="font-bold text-lg text-white">{topSellers[0].rating}</span>
              </div>
            </Card>
          </div>

          {/* 3rd Place */}
          <div className="md:order-3 md:mt-8">
            <Card className="p-4 text-center bg-white/10 border-2 border-white/20 backdrop-blur-sm shadow-lg">
              <div className="relative inline-block mb-3">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getBadgeColor(3)} flex items-center justify-center shadow-[0_0_30px_rgba(205,127,50,0.4)]`}>
                  <Medal className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[hsl(25,75%,47%)] flex items-center justify-center font-black text-white text-xs shadow-lg">
                  3
                </div>
              </div>
              <h3 className="font-black text-white text-lg mb-2 drop-shadow-lg">{topSellers[2].name}</h3>
              <div className="text-3xl font-black text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{topSellers[2].revenue}</div>
              <div className="text-xs font-bold text-white/90 mb-2">ريال سعودي</div>
              <div className="flex items-center justify-center gap-1">
                <Star className="h-3 w-3 fill-[hsl(40,90%,55%)] text-[hsl(40,90%,55%)]" />
                <span className="font-bold text-white text-sm">{topSellers[2].rating}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <Card className="p-4 bg-white/10 border-2 border-white/20 backdrop-blur-sm shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4 drop-shadow-lg">تصنيف كامل</h2>
          <div className="space-y-2">
            {topSellers.slice(3).map((seller) => (
              <div 
                key={seller.rank}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20 shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center font-black text-white shadow-lg">
                  {seller.rank}
                </div>
                <div className="flex-1">
                  <div className="font-black text-white drop-shadow-md">{seller.name}</div>
                  <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
                    <span>{seller.sales} عملية</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-[hsl(40,90%,55%)] fill-current" />
                      <span className="font-bold">{seller.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-lg font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{seller.revenue}</div>
                  <div className="text-xs font-bold text-white/80">ريال</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(45,100%,51%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default Leaderboard;
