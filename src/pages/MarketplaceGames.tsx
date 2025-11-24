import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { GAMES } from "@/config/games";
import { GameCard } from "@/components/GameCard";

const MarketplaceGames = () => {
  const { t, language } = useLanguage();

  return (
    <>
      <SEO 
        title={`${t('marketplace.games.title')} - NXOLand`}
        description={t('marketplace.games.description')}
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              {t('marketplace.games.title')}
            </h1>
            <p className="text-white/60 text-lg">
              {t('marketplace.games.subtitle')}
            </p>
          </div>

          {/* Games Grid - Vertical grid on mobile, grid on desktop */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {GAMES.map((game) => {
              return (
                <GameCard
                  key={game.id}
                  id={game.id}
                  name={game.name}
                  nameAr={game.nameAr}
                  image={game.image}
                  language={language}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation for Mobile */}
        <BottomNav />
      </div>
    </>
  );
};

export default MarketplaceGames;

