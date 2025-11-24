import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { GAMES } from "@/config/games";

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

          {/* Games Grid - Horizontal scroll on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {GAMES.map((game) => {
              return (
                <Link
                  key={game.id}
                  to={`/marketplace/${game.id}`}
                  className="group relative flex-shrink-0 w-[180px] md:w-auto"
                >
                  <div className="relative overflow-hidden rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[hsl(195,80%,70%,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] h-full">
                    {/* Game Image/Logo */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>

                    {/* Game Title - at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pb-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <h3 className="text-white font-bold text-base md:text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center">
                        {language === 'ar' ? game.nameAr : game.name}
                      </h3>
                    </div>
                  </div>
                </Link>
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

