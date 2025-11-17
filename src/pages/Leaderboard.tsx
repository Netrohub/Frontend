import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, TrendingUp, Medal, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { publicApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LeaderboardUser {
  id: number;
  name: string;
  avatar: string | null;
  total_revenue: number;
  total_sales: number;
}

const Leaderboard = () => {
  const { t, tAr, language } = useLanguage();
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
    revenue: user.total_revenue.toLocaleString('en-US'),
    sales: user.total_sales,
    badge: index === 0 ? t('leaderboard.gold') : index === 1 ? t('leaderboard.silver') : index === 2 ? t('leaderboard.bronze') : undefined,
    isVerified: true, // All leaderboard users are verified
  }));

  const getBadgeColor = (rank: number) => {
    if (rank === 1) return "from-[hsl(45,100%,51%)] to-[hsl(45,100%,41%)]"; // Gold
    if (rank === 2) return "from-[hsl(0,0%,75%)] to-[hsl(0,0%,60%)]"; // Silver
    if (rank === 3) return "from-[hsl(25,75%,47%)] to-[hsl(25,75%,37%)]"; // Bronze
    return "from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)]"; // Arctic theme
  };

  // Optimize snow particles: reduce on mobile, add will-change for better performance
  const snowParticles = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 30;
    return [...Array(particleCount)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white/40 rounded-full animate-fall"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20}%`,
          animationDuration: `${10 + Math.random() * 20}s`,
          animationDelay: `${Math.random() * 5}s`,
          willChange: 'transform, opacity',
        }}
      />
    ));
  }, []);

  return (
    <>
      <SEO 
        title={`${tAr('leaderboard.title')} - NXOLand`}
        description={tAr('leaderboard.description')}
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />
        
        {/* Skip link for keyboard navigation */}
        <a 
          href="#leaderboard-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          {t('leaderboard.skipToLeaderboard')}
        </a>
        
        {/* Snow particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {snowParticles}
        </div>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div id="leaderboard-content" className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <Trophy className="h-8 w-8 text-[hsl(40,90%,55%)]" aria-hidden="true" />
              <h1 className="text-3xl md:text-4xl font-black text-white">{t('leaderboard.title')}</h1>
            </div>
            <p className="text-lg text-white/60">{t('leaderboard.subtitle')}</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" aria-hidden="true" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <p className="text-red-400 mb-4">{t('leaderboard.loadError')}</p>
              <p className="text-white/60">{t('leaderboard.tryAgain')}</p>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && !error && topSellers.length === 0 && (
            <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-white/20" aria-hidden="true" />
              <p className="text-white/60">{t('leaderboard.noData')}</p>
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
                    <Medal className="h-8 w-8 text-white" aria-hidden="true" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[hsl(0,0%,75%)] flex items-center justify-center font-black text-white text-xs shadow-lg">
                    2
                  </div>
                </div>
                <h3 className="font-black text-white text-lg mb-2 drop-shadow-lg flex items-center justify-center gap-2">
                  {topSellers[1].name}
                  {topSellers[1].isVerified && (
                    <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" aria-label="موثق" />
                  )}
                </h3>
              <div className="text-3xl font-black text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">${topSellers[1].revenue}</div>
              <div className="text-xs font-bold text-white/90 mb-2">USD</div>
              <div className="flex items-center justify-center gap-1">
                <span className="font-bold text-white text-sm">{topSellers[1].sales} {t('leaderboard.deals')}</span>
              </div>
            </Card>
          </div>
          )}

            {/* 1st Place */}
            {topSellers[0] && (
            <div className="md:order-2">
              <Card className="p-5 text-center bg-[hsl(195,80%,20%)] border-2 border-[hsl(195,80%,50%)] backdrop-blur-sm shadow-[0_0_40px_rgba(56,189,248,0.4)]">
                <div className="relative inline-block mb-3">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getBadgeColor(1)} flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.6)]`}>
                    <Trophy className="h-10 w-10 text-white" aria-hidden="true" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[hsl(195,80%,50%)] flex items-center justify-center font-black text-white shadow-lg text-sm">
                    1
                  </div>
                </div>
                <Badge className="mb-2 bg-[hsl(195,80%,30%)] text-white border-[hsl(195,80%,50%)] font-bold text-xs">
                  {t('leaderboard.topSeller')}
                </Badge>
                <h3 className="font-black text-white text-xl mb-2 drop-shadow-lg flex items-center justify-center gap-2">
                  {topSellers[0].name}
                  {topSellers[0].isVerified && (
                    <CheckCircle2 className="h-5 w-5 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" aria-label="موثق" />
                  )}
                </h3>
              <div className="text-4xl font-black text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">${topSellers[0].revenue}</div>
              <div className="text-sm font-bold text-white/90 mb-2">USD</div>
              <div className="flex items-center justify-center gap-1 text-[hsl(45,100%,60%)]">
                <span className="font-bold text-lg text-white">{topSellers[0].sales} {t('leaderboard.deals')}</span>
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
                    <Medal className="h-8 w-8 text-white" aria-hidden="true" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[hsl(25,75%,47%)] flex items-center justify-center font-black text-white text-xs shadow-lg">
                    3
                  </div>
                </div>
                <h3 className="font-black text-white text-lg mb-2 drop-shadow-lg flex items-center justify-center gap-2">
                  {topSellers[2].name}
                  {topSellers[2].isVerified && (
                    <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" aria-label="موثق" />
                  )}
                </h3>
              <div className="text-3xl font-black text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">${topSellers[2].revenue}</div>
              <div className="text-xs font-bold text-white/90 mb-2">USD</div>
              <div className="flex items-center justify-center gap-1">
                <span className="font-bold text-white text-sm">{topSellers[2].sales} {t('leaderboard.deals')}</span>
              </div>
            </Card>
          </div>
          )}
        </div>

          {/* Rest of Leaderboard */}
          <Card className="p-4 bg-white/10 border-2 border-white/20 backdrop-blur-sm shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 drop-shadow-lg">{t('leaderboard.fullRanking')}</h2>
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
                        <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" aria-label="موثق" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
                      <span>{seller.sales} {t('leaderboard.deals')}</span>
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(45,100%,51%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" aria-hidden="true" />
      </div>

      <BottomNav />
    </>
  );
};

export default Leaderboard;
