import { Card } from "@/components/ui/card";
import { Gamepad2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

const Sell = () => {
  const { t, language } = useLanguage();
  
  const categories = [
    {
      id: "gaming",
      name: t('sell.gaming.title'),
      icon: Gamepad2,
      description: t('sell.gaming.description'),
      path: "/sell/gaming",
      gradient: "from-[hsl(195,80%,50%)] to-[hsl(220,70%,60%)]",
    },
    {
      id: "social",
      name: t('sell.social.title'),
      icon: Users,
      description: t('sell.social.description'),
      path: "/sell/social",
      gradient: "from-[hsl(280,70%,60%)] to-[hsl(320,70%,50%)]",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Particles */}
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
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{t('sell.selectCategory')}</h1>
          <p className="text-xl text-white/60">{t('sell.categorySubtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} to={category.path}>
                <Card className="group relative overflow-hidden bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] cursor-pointer h-full">
                  {/* Content */}
                  <div className="relative p-8 flex flex-col items-center text-center space-y-6">
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-12 w-12 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-white/70">{category.description}</p>
                    </div>

                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2 text-[hsl(195,80%,50%)] font-semibold group-hover:gap-4 transition-all">
                        <span>{t('sell.explore')}</span>
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
      </div>
    </div>
  );
};

export default Sell;
