import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import instagramLogo from "@/assets/instagram-logo.png";

const Social = () => {
  const { t, language } = useLanguage();
  
  const platforms = [
    {
      id: "tiktok",
      name: "TikTok",
      logo: tiktokLogo,
      description: t('sell.social.tiktok.description'),
      path: "/sell/social/tiktok",
      gradient: "from-[hsl(0,0%,0%)] to-[hsl(180,100%,50%)]",
    },
    {
      id: "instagram",
      name: "Instagram",
      logo: instagramLogo,
      description: t('sell.social.instagram.description'),
      path: "/sell/social/instagram",
      gradient: "from-[hsl(320,70%,50%)] via-[hsl(340,90%,55%)] to-[hsl(45,100%,55%)]",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* COMING SOON OVERLAY */}
      <div className="absolute inset-0 z-50 bg-[hsl(200,70%,15%)]/95 backdrop-blur-md flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-[hsl(195,80%,50%)]/10 border-2 border-[hsl(195,80%,50%)] flex items-center justify-center">
              <Lock className="h-12 w-12 text-[hsl(195,80%,70%)]" aria-hidden="true" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {t('sell.social.comingSoon')}
          </h2>
          <p className="text-xl text-white/70 mb-8">
            {t('sell.social.comingSoonDescription')}
          </p>
          <BackButton 
            fallbackPath="/sell" 
            label={t('sell.social.goBack')}
            className="mx-auto"
          />
        </div>
      </div>
      
      {/* Snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        <BackButton />
        
        <div className="text-center mb-12 mt-8">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{t('sell.social.title')}</h1>
          <p className="text-xl text-white/60">{t('sell.social.description')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            return (
              <Link key={platform.id} to={platform.path}>
                <Card className="group relative overflow-hidden bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] cursor-pointer">
                  {/* Content */}
                  <div className="relative p-8 flex flex-col items-center text-center space-y-4">
                    <img 
                      src={platform.logo} 
                      alt={platform.name} 
                      className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" 
                    />
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{platform.name}</h3>
                      <p className="text-white/70">{platform.description}</p>
                    </div>

                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2 text-[hsl(195,80%,70%)] font-semibold group-hover:gap-4 transition-all">
                        <span>{t('nav.sell')}</span>
                        <svg 
                          className="h-5 w-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d={language === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
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

export default Social;

