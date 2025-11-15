import { Button } from "@/components/ui/button";
import { ArrowRight, Snowflake, Shield, Flame, Mail } from "lucide-react";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { t, language } = useLanguage();
  
  return (
    <>
      <SEO 
        title="NXOLand - تداول آمن وموثوق للحسابات"
        description="منصة NXOLand لتداول الحسابات بأمان مع نظام الضمان. بيع وشراء الحسابات بأمان تام."
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Icy background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Animated snow particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
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
      
      {/* Frost overlay effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[hsl(195,80%,50%,0.05)] to-transparent opacity-40" aria-hidden="true" />
      
      {/* Skip link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
      >
        {t('common.skipToContent')}
      </a>
      
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section id="main-content" className="relative z-10 container mx-auto px-4 md:px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-[hsl(195,80%,70%,0.3)]">
            <Snowflake className="h-4 w-4 text-[hsl(195,80%,70%)] animate-pulse" />
            <span className="text-sm font-medium text-[hsl(195,80%,70%)]">
              {t('home.badge')}
            </span>
          </div>
          
          {/* Main Heading */}
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-white drop-shadow-[0_0_30px_rgba(148,209,240,0.5)]">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              asChild
              size="lg" 
              className="gap-2 text-sm md:text-base px-6 md:px-8 py-4 md:py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0 min-h-[56px]"
            >
              <Link to="/marketplace">
                <Shield className="h-5 w-5 flex-shrink-0" />
                <span>{t('home.hero.browseAccounts')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {!isAuthenticated ? (
              <Button 
                asChild
                size="lg" 
                className="gap-2 text-sm md:text-base px-6 md:px-8 py-4 md:py-6 bg-white/5 hover:bg-white/10 text-white font-bold backdrop-blur-sm border border-white/20 min-h-[56px]"
              >
                <Link to="/auth">
                  <span>{t('home.hero.learnMore')}</span>
                </Link>
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="gap-2 text-sm md:text-base px-6 md:px-8 py-4 md:py-6 bg-white/5 hover:bg-white/10 text-white font-bold backdrop-blur-sm border border-white/20 min-h-[56px]"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label={t('home.howPlatformWorks')}
              >
                <span className="hidden sm:inline">{t('home.howPlatformWorks')}</span>
                <span className="sm:hidden">{t('home.howDoesItWork')}</span>
              </Button>
            )}
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="p-2 rounded-lg bg-[hsl(195,80%,50%,0.15)] border border-[hsl(195,80%,70%,0.3)]">
                <Shield className="h-4 w-4 text-[hsl(195,80%,70%)]" />
              </div>
              <span>{t('home.feature1.title')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="p-2 rounded-lg bg-[hsl(40,90%,55%,0.15)] border border-[hsl(40,90%,55%,0.3)]">
                <Flame className="h-4 w-4 text-[hsl(40,90%,55%)]" />
              </div>
              <span>{t('home.feature4.title')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="p-2 rounded-lg bg-[hsl(195,80%,50%,0.15)] border border-[hsl(195,80%,70%,0.3)]">
                <Snowflake className="h-4 w-4 text-[hsl(195,80%,70%)]" />
              </div>
              <span>{t('home.feature2.title')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('home.whyChoose')}</h2>
          <p className="text-xl text-white/60">{t('home.feature1.desc')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: t('home.feature1.title'), icon: Shield, desc: t('home.feature1.desc') },
            { title: t('home.feature4.title'), icon: Snowflake, desc: t('home.feature4.desc') },
            { title: t('home.feature2.title'), icon: Flame, desc: t('home.feature2.desc') },
          ].map((feature, i) => (
            <div 
              key={i}
              className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[hsl(195,80%,70%,0.5)] transition-all hover:bg-white/10 group"
            >
              <feature.icon className="h-8 w-8 text-[hsl(195,80%,70%)] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('home.howItWorks')}</h2>
          <p className="text-xl text-white/60">{t('home.howItWorksSubtitle')}</p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            { step: "1", title: t('home.step1.title'), desc: t('home.step1.desc') },
            { step: "2", title: t('home.step2.title'), desc: t('home.step2.desc') },
            { step: "3", title: t('home.step3.title'), desc: t('home.step3.desc') },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6 p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[hsl(195,80%,70%,0.3)] transition-all">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[hsl(195,80%,50%)] flex items-center justify-center text-2xl font-black text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                {item.step}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Hidden for authenticated users */}
      {!isAuthenticated && (
        <section className="relative z-10 container mx-auto px-4 md:px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">{t('home.cta.title')}</h2>
            <p className="text-xl text-white/70">{t('home.cta.subtitle')}</p>
            <Button 
              asChild
              size="lg" 
              className="gap-2 text-lg px-12 py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0"
            >
              <Link to="/auth">
                {t('home.cta.getStarted')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10 backdrop-blur-sm bg-[hsl(200,70%,15%,0.5)]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <img 
                src="/nxoland-new-logo.png" 
                alt="NXOLand Logo" 
                width="200"
                height="80"
                className="h-16 md:h-20 w-auto scale-150"
                style={{ transformOrigin: 'center' }}
                loading="lazy"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src.includes('new')) {
                    img.src = '/nxoland-official-logo.png';
                  }
                }}
              />
              <p className="text-white/50 text-sm md:text-base">
                © 2025 NXOLand. {t('home.footer.rights')}
              </p>
              <p className="text-white/60 text-xs">
                {t('home.footer.commercialRegistration')}: NXO Establishment / 7052368375
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <h3 className="text-white font-bold mb-2">{t('home.footer.quickLinks')}</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/suggestions" className="text-white/60 hover:text-[hsl(195,80%,70%)] transition-colors">
                  {t('home.footer.suggestions')}
                </Link>
                <Link to="/terms" className="text-white/60 hover:text-[hsl(195,80%,70%)] transition-colors">
                  {t('home.footer.terms')}
                </Link>
                <Link to="/privacy" className="text-white/60 hover:text-[hsl(195,80%,70%)] transition-colors">
                  {t('home.footer.privacy')}
                </Link>
                <Link to="/refund-policy" className="text-white/60 hover:text-[hsl(195,80%,70%)] transition-colors">
                  {t('home.footer.refund')}
                </Link>
                <Link to="/help" className="text-white/60 hover:text-[hsl(195,80%,70%)] transition-colors">
                  {t('home.footer.support')}
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <h3 className="text-white font-bold mb-2">{t('home.footer.contact')}</h3>
              <div className="flex items-center gap-3">
                {/* Email */}
                <a 
                  href="mailto:info@nxoland.com"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300 group"
                  aria-label={t('help.email')}
                  title={t('help.email')}
                >
                  <Mail className="h-5 w-5 text-white/60 group-hover:text-[hsl(195,80%,70%)] transition-colors" />
                </a>

                {/* WhatsApp */}
                <a 
                  href="https://wa.me/966536784471"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-[hsl(142,71%,45%,0.2)] hover:border-[hsl(142,71%,45%,0.4)] hover:scale-110 transition-all duration-300 group"
                  aria-label={t('help.whatsapp')}
                  title={t('help.whatsapp')}
                >
                  <WhatsAppIcon size={20} className="text-white/60 group-hover:text-[hsl(142,71%,45%)] transition-colors" />
                </a>

                {/* Discord */}
                <a 
                  href="https://discord.gg/wMnKRSCUVz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-[#5865F2]/20 hover:border-[#5865F2]/40 hover:scale-110 transition-all duration-300 group"
                  aria-label={t('help.liveChat')}
                  title={t('home.footer.discordLiveChat')}
                >
                  <DiscordIcon size={20} className="text-white/60 group-hover:text-[#5865F2] transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(200,70%,40%,0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" aria-hidden="true" style={{ animationDelay: '1s' }} />
      
      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
    </>
  );
};

export default Home;
