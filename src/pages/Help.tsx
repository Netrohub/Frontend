import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

const Help = () => {
  const { t, language } = useLanguage();
  
  const faqs = [
    {
      q: t('help.faq1Q'),
      a: t('help.faq1A')
    },
    {
      q: t('help.faq2Q'),
      a: t('help.faq2A')
    },
    {
      q: t('help.faq3Q'),
      a: t('help.faq3A')
    },
    {
      q: t('help.faq4Q'),
      a: t('help.faq4A')
    },
    {
      q: t('help.faq5Q'),
      a: t('help.faq5A')
    },
    {
      q: t('help.faq6Q'),
      a: t('help.faq6A')
    },
  ];

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
        title={`${t('help.title')} - NXOLand`}
        description={t('help.description')}
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />
        
        {/* Skip link for keyboard navigation */}
        <a 
          href="#help-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          {t('help.skipToContent')}
        </a>
        
        {/* Snow particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {snowParticles}
        </div>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div id="help-content" className="relative z-10 container mx-auto px-4 md:px-6 py-16 max-w-4xl pb-24 md:pb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t('help.title')}</h1>
            <p className="text-xl text-white/70">{t('help.subtitle')}</p>
          </div>

        {/* FAQs */}
        <Card className="p-6 mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6">{t('help.faqTitle')}</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                <AccordionTrigger className="text-right text-white hover:text-[hsl(195,80%,70%)] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {/* Contact */}
        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">{t('help.contactUs')}</h2>
          
          {/* Contact Icons */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {/* Email */}
            <a 
              href="mailto:info@nxoland.com"
              className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-[hsl(195,80%,50%,0.15)] border-2 border-[hsl(195,80%,70%,0.3)] hover:bg-[hsl(195,80%,50%,0.25)] hover:border-[hsl(195,80%,70%,0.5)] hover:scale-110 transition-all duration-300 group"
              aria-label={t('help.email')}
              title={t('help.email')}
            >
              <Mail className="h-8 w-8 text-[hsl(195,80%,70%)] group-hover:text-[hsl(195,80%,60%)] transition-colors mb-1" />
              <span className="text-xs text-white/70 group-hover:text-white transition-colors">{t('help.email')}</span>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/966536784471"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-[hsl(142,71%,45%,0.15)] border-2 border-[hsl(142,71%,45%,0.3)] hover:bg-[hsl(142,71%,45%,0.25)] hover:border-[hsl(142,71%,45%,0.5)] hover:scale-110 transition-all duration-300 group"
              aria-label={t('help.whatsapp')}
              title={t('help.whatsapp')}
            >
              <WhatsAppIcon size={32} className="text-[hsl(142,71%,45%)] group-hover:text-[hsl(142,71%,35%)] transition-colors mb-1" />
              <span className="text-xs text-white/70 group-hover:text-white transition-colors">{t('help.whatsapp')}</span>
            </a>

            {/* Discord */}
            <a 
              href="https://discord.gg/R72dmfCX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-[#5865F2]/15 border-2 border-[#5865F2]/30 hover:bg-[#5865F2]/25 hover:border-[#5865F2]/50 hover:scale-110 transition-all duration-300 group"
              aria-label={t('help.liveChat')}
              title={t('help.discordLiveChat')}
            >
              <DiscordIcon size={32} className="text-[#5865F2] group-hover:text-[#4752C4] transition-colors mb-1" />
              <span className="text-xs text-white/70 group-hover:text-white transition-colors">{t('help.liveChat')}</span>
            </a>
          </div>

          {/* Discord Button */}
          <div className="flex justify-center mb-6">
            <Button 
              asChild
              size="lg"
              className="flex-col h-auto py-8 px-12 bg-[#5865F2] hover:bg-[#4752C4] border-0 text-white gap-3 min-h-[120px]"
            >
              <a href="https://discord.gg/R72dmfCX" target="_blank" rel="noopener noreferrer" aria-label={t('help.discordJoin')}>
                <DiscordIcon size={48} className="mb-2" />
                <span className="font-bold text-xl">{t('help.discordJoin')}</span>
                <span className="text-sm text-white/90">{t('help.discordSupport')}</span>
              </a>
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-[#5865F2]/10 rounded-lg border border-[#5865F2]/30">
            <p className="text-sm text-white/80 text-center">
              {t('help.discordMessage')}
            </p>
          </div>

          {/* Response & Processing Times */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 text-center">{t('help.responseTimes')}</h3>
            <div className="space-y-3 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(195,80%,70%)] flex-shrink-0" aria-hidden="true" />
                <span>{t('help.responseTime')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(195,80%,70%)] flex-shrink-0" aria-hidden="true" />
                <span>{t('help.processingTime')}</span>
              </div>
            </div>
          </div>
        </Card>

          {/* Feedback Section */}
          <Card className="p-8 bg-gradient-to-br from-[hsl(40,90%,15%)] to-[hsl(40,80%,10%)] border-[hsl(40,90%,55%,0.3)] backdrop-blur-sm text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{t('help.improvementTitle')}</h2>
            <p className="text-white/70 mb-6">
              {t('help.improvementMessage')}
            </p>
            <Button 
              asChild
              size="lg"
              className="gap-2 bg-[hsl(40,90%,55%)] hover:bg-[hsl(40,90%,65%)] text-white font-bold shadow-[0_0_30px_rgba(234,179,8,0.4)] border-0"
            >
              <Link to="/suggestions">
                {t('help.ratePlatform')}
              </Link>
            </Button>
          </Card>
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-12 border-t border-white/10 backdrop-blur-sm bg-[hsl(200,70%,15%,0.5)]">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/50">{t('help.footerCopyright')}</p>
          </div>
        </footer>

        <BottomNav />
      </div>
    </>
  );
};

export default Help;
