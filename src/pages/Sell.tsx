import { Card } from "@/components/ui/card";
import { Gamepad2, Snowflake } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import heroArctic from "@/assets/hero-arctic.jpg";

const Sell = () => {
  const games = [
    {
      id: "wos",
      name: "Whiteout Survival",
      icon: Snowflake,
      description: "بيع حسابات Whiteout Survival",
      path: "/sell/wos",
      gradient: "from-[hsl(195,80%,50%)] to-[hsl(220,70%,60%)]",
      image: heroArctic,
    },
    // يمكن إضافة ألعاب أخرى هنا لاحقاً
  ];

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
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(195,80%,50%,0.2)] mb-4">
            <Gamepad2 className="h-8 w-8 text-[hsl(195,80%,50%)]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">اختر اللعبة</h1>
          <p className="text-xl text-white/60">اختر اللعبة التي تريد بيع حسابها</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link key={game.id} to={game.path}>
                <Card className="group relative overflow-hidden bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] cursor-pointer">
                  {/* Background Image */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} mix-blend-multiply`} />
                  </div>

                  {/* Content */}
                  <div className="relative p-8 flex flex-col items-center text-center space-y-4">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                      <p className="text-white/70">{game.description}</p>
                    </div>

                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2 text-[hsl(195,80%,50%)] font-semibold group-hover:gap-4 transition-all">
                        <span>ابدأ البيع الآن</span>
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
                            d="M15 19l-7-7 7-7" 
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
          <p className="text-white/50 text-sm">المزيد من الألعاب قريباً...</p>
        </div>
      </div>
    </div>
  );
};

export default Sell;
