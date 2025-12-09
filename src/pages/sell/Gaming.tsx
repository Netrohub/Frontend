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

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-6xl mx-auto">
          {gamingGames.map((game) => {
            // New route structure: /sell/:gameId
            const sellPath = `/sell/${game.id}`;
            
            return (
              <GameCard
                key={game.id}
                id={game.id}
                name={game.name}
                nameAr={game.nameAr}
                description={game.description}
                descriptionAr={game.descriptionAr}
                image={game.image}
                backgroundImage={game.backgroundImage}
                language={language}
                to={sellPath}
              />
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

