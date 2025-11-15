import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Users, Target, Heart, ShoppingCart, Package, CheckCircle, TrendingUp, Phone, Mail, MessageCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t, language } = useLanguage();
  // Memoize snow particles for performance
  const snowParticles = useMemo(() => 
    [...Array(30)].map((_, i) => (
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
    )), []
  );

  return (
    <>
      <SEO 
        title={`${t('about.title')} - NXOLand`}
        description={t('about.description')}
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />
        
        {/* Skip link for keyboard navigation */}
        <a 
          href="#about-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          {t('about.skipToContent')}
        </a>
        
        {/* Snow particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {snowParticles}
        </div>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div id="about-content" className="relative z-10 container mx-auto px-4 md:px-6 py-16 max-w-4xl pb-24 md:pb-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t('about.title')}</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>

          {/* Mission */}
          <Card className="p-8 mb-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <Target className="h-12 w-12 text-[hsl(195,80%,70%)] mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-white mb-4">{t('about.vision')}</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            {t('about.visionText')}
          </p>
        </Card>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm hover:border-[hsl(195,80%,70%,0.5)] transition-all">
              <Shield className="h-10 w-10 text-[hsl(195,80%,70%)] mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-white mb-2">{t('about.security')}</h3>
              <p className="text-white/70">{t('about.securityDesc')}</p>
            </Card>

            <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm hover:border-[hsl(195,80%,70%,0.5)] transition-all">
              <Zap className="h-10 w-10 text-[hsl(40,90%,55%)] mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-white mb-2">{t('about.speed')}</h3>
              <p className="text-white/70">{t('about.speedDesc')}</p>
            </Card>

            <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm hover:border-[hsl(195,80%,70%,0.5)] transition-all">
              <Heart className="h-10 w-10 text-red-400 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-white mb-2">{t('about.trust')}</h3>
              <p className="text-white/70">{t('about.trustDesc')}</p>
            </Card>
          </div>

        {/* Story */}
        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">{t('about.story')}</h2>
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>{t('about.storyPara1')}</p>
            <p>{t('about.storyPara2')}</p>
            <p>{t('about.storyPara3')}</p>
          </div>
        </Card>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('about.howItWorks')}</h2>
            
            {/* Buyer Steps */}
            <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="h-8 w-8 text-[hsl(195,80%,70%)]" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-white">{t('about.buyerSteps')}</h3>
              </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(195,80%,70%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(195,80%,70%)] font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('about.buyerStep1Title')}</h4>
                  <p className="text-white/70 text-sm">{t('about.buyerStep1Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(195,80%,70%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(195,80%,70%)] font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('about.buyerStep2Title')}</h4>
                  <p className="text-white/70 text-sm">{t('about.buyerStep2Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(195,80%,70%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(195,80%,70%)] font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('about.buyerStep3Title')}</h4>
                  <p className="text-white/70 text-sm">{t('about.buyerStep3Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(195,80%,70%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(195,80%,70%)] font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('about.buyerStep4Title')}</h4>
                  <p className="text-white/70 text-sm">{t('about.buyerStep4Desc')}</p>
                </div>
              </div>
            </div>
          </Card>

            {/* Seller Steps */}
            <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-8 w-8 text-[hsl(40,90%,55%)]" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-white">{t('about.sellerSteps')}</h3>
              </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(40,90%,55%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(40,90%,55%)] font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('about.sellerStep1Title')}</h4>
                  <p className="text-white/70 text-sm">{t('about.sellerStep1Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(40,90%,55%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(40,90%,55%)] font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('about.sellerStep2Title')}</h4>
                  <p className="text-white/70 text-sm">{t('about.sellerStep2Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(40,90%,55%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(40,90%,55%)] font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('about.sellerStep3Title')}</h4>
                  <p className="text-white/70 text-sm">{t('about.sellerStep3Desc')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(40,90%,55%,0.2)] flex items-center justify-center">
                  <span className="text-[hsl(40,90%,55%)] font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('about.sellerStep4Title')}</h4>
                  <p className="text-white/70 text-sm">{t('about.sellerStep4Desc')}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-black text-[hsl(195,80%,70%)] mb-2">1,200+</div>
            <div className="text-sm text-white/60">{t('about.activeUsers')}</div>
          </Card>
          
          <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-black text-[hsl(40,90%,55%)] mb-2">5,000+</div>
            <div className="text-sm text-white/60">{t('about.successfulDeals')}</div>
          </Card>
          
          <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-black text-green-400 mb-2">98%</div>
            <div className="text-sm text-white/60">{t('about.satisfactionRate')}</div>
          </Card>
          
          <Card className="p-6 text-center bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-black text-white mb-2">24/7</div>
            <div className="text-sm text-white/60">{t('about.support')}</div>
          </Card>
        </div>

        {/* Contact Information & Compliance */}
        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">{t('about.contactInfo')}</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Commercial Registration */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[hsl(195,80%,50%,0.15)] border border-[hsl(195,80%,70%,0.3)]">
                <FileText className="h-6 w-6 text-[hsl(195,80%,70%)]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{t('about.commercialRegistration')}</h3>
                <p className="text-white/80">NXO Establishment</p>
                <p className="text-white/70 text-sm">7052368375</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[hsl(195,80%,50%,0.15)] border border-[hsl(195,80%,70%,0.3)]">
                <Mail className="h-6 w-6 text-[hsl(195,80%,70%)]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{t('about.email')}</h3>
                <a href="mailto:info@nxoland.com" className="text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,60%)] transition-colors">
                  info@nxoland.com
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[hsl(195,80%,50%,0.15)] border border-[hsl(195,80%,70%,0.3)]">
                <Phone className="h-6 w-6 text-[hsl(195,80%,70%)]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{t('about.whatsapp')}</h3>
                <a 
                  href="https://wa.me/966536784471" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,60%)] transition-colors"
                >
                  +966 53 678 4471
                </a>
              </div>
            </div>

            {/* Live Chat (Discord) */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[hsl(195,80%,50%,0.15)] border border-[hsl(195,80%,70%,0.3)]">
                <MessageCircle className="h-6 w-6 text-[hsl(195,80%,70%)]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{t('about.liveChat')}</h3>
                <a 
                  href="https://discord.gg/R72dmfCX" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,60%)] transition-colors"
                >
                  {t('about.discordLiveChat')}
                </a>
              </div>
            </div>
          </div>

          {/* Response & Processing Times */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">{t('about.responseTimes')}</h3>
            <div className="space-y-3 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(195,80%,70%)] flex-shrink-0" aria-hidden="true" />
                <span>{t('about.responseTime')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(195,80%,70%)] flex-shrink-0" aria-hidden="true" />
                <span>{t('about.processingTime')}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

        {/* Footer */}
        <footer className="relative z-10 py-12 border-t border-white/10 backdrop-blur-sm bg-[hsl(200,70%,15%,0.5)]">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/50">{t('common.copyright')}</p>
          </div>
        </footer>

        <BottomNav />
      </div>
    </>
  );
};

export default About;
