import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, TrendingUp, Medal, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { publicApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface LeaderboardUser {
  id: number;
  name: string;
  avatar: string | null;
  total_revenue: number;
  total_sales: number;
}

const Leaderboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => publicApi.leaderboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const leaderboardUsers: LeaderboardUser[] = data || [];
  
  // Map to display format with ranks and badges
  const topSellers = leaderboardUsers.map((user, index) => ({
    rank: index + 1,
    name: user.name,
    revenue: user.total_revenue.toLocaleString('ar-SA'),
    rating: 5.0, // TODO: Implement rating system in backend
    sales: user.total_sales,
    badge: index === 0 ? "ذهبية" : index === 1 ? "فضية" : index === 2 ? "برونزية" : undefined,
    isVerified: true, // All leaderboard users are verified
  }));

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
      <Navbar />

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <p className="text-red-400 mb-4">فشل تحميل لوحة الصدارة</p>
            <p className="text-white/60">يرجى المحاولة مرة أخرى لاحقاً</p>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && topSellers.length === 0 && (
          <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60">لا توجد بيانات لعرضها حالياً</p>
          </Card>
        )}

        {/* Leaderboard Content */}
        {!isLoading && !error && topSellers.length > 0 && (
          <>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          {topSellers[1] && (
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
              <h3 className="font-black text-white text-lg mb-2 drop-shadow-lg flex items-center justify-center gap-2">
                {topSellers[1].name}
                {topSellers[1].isVerified && (
                  <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" />
                )}
              </h3>
              <div className="text-3xl font-black text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">${topSellers[1].revenue}</div>
              <div className="text-xs font-bold text-white/90 mb-2">USD</div>
              <div className="flex items-center justify-center gap-1">
                <span className="font-bold text-white text-sm">{topSellers[1].sales} عملية</span>
              </div>
            </Card>
          </div>
          )}

          {/* 1st Place */}
          {topSellers[0] && (
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
              <h3 className="font-black text-white text-xl mb-2 drop-shadow-lg flex items-center justify-center gap-2">
                {topSellers[0].name}
                {topSellers[0].isVerified && (
                  <CheckCircle2 className="h-5 w-5 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" />
                )}
              </h3>
              <div className="text-4xl font-black text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">${topSellers[0].revenue}</div>
              <div className="text-sm font-bold text-white/90 mb-2">USD</div>
              <div className="flex items-center justify-center gap-1 text-[hsl(45,100%,60%)]">
                <span className="font-bold text-lg text-white">{topSellers[0].sales} عملية</span>
              </div>
            </Card>
          </div>
          )}

          {/* 3rd Place */}
          {topSellers[2] && (
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
              <h3 className="font-black text-white text-lg mb-2 drop-shadow-lg flex items-center justify-center gap-2">
                {topSellers[2].name}
                {topSellers[2].isVerified && (
                  <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" />
                )}
              </h3>
              <div className="text-3xl font-black text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">${topSellers[2].revenue}</div>
              <div className="text-xs font-bold text-white/90 mb-2">USD</div>
              <div className="flex items-center justify-center gap-1">
                <span className="font-bold text-white text-sm">{topSellers[2].sales} عملية</span>
              </div>
            </Card>
          </div>
          )}
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
                  <div className="font-black text-white drop-shadow-md flex items-center gap-2">
                    {seller.name}
                    {seller.isVerified && (
                      <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
                    <span>{seller.sales} عملية</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-lg font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">${seller.revenue}</div>
                  <div className="text-xs font-bold text-white/80">USD</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        </>
        )}
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(45,100%,51%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default Leaderboard;
