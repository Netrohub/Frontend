import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { GAMES } from "@/config/games";
import { GameCard } from "@/components/GameCard";
import { Link } from "react-router-dom";

const Gaming = () => {
  const { t, language } = useLanguage();
  
  // Filter only gaming categories
  const gamingGames = GAMES.filter(game => 
    game.category.includes('_accounts') && 
    !game.category.includes('tiktok') && 
    !game.category.includes('instagram')
  );

  return (
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        <BackButton />
        
        <div className="text-center mb-12 mt-8">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{t('sell.gaming.title')}</h1>
          <p className="text-xl text-white/60">{t('sell.gaming.description')}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {gamingGames.map((game) => {
            // New route structure: /sell/:gameId
            const sellPath = `/sell/${game.id}`;
            
            return (
              <div key={game.id} className="flex flex-col items-center">
                <Link to={sellPath} className="block no-underline">
                  <div className="group relative w-full max-w-[160px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 hover:border-[hsl(195,80%,70%,0.5)] hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-24 h-24 mx-auto rounded-xl object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <span className="block text-sm font-semibold tracking-wide text-white">
                        {language === 'ar' && game.nameAr ? game.nameAr : game.name}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm">{t('sell.comingSoon')}</p>
        </div>
      </div>
    </div>
  );
};

export default Gaming;

