import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Wrench, MessageCircle } from "lucide-react";
import { DiscordIcon } from "@/components/icons/DiscordIcon";

const Maintenance = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)] relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
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

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-[hsl(195,80%,50%)]/10 border-4 border-[hsl(195,80%,50%)] flex items-center justify-center animate-pulse">
              <Wrench className="h-16 w-16 text-[hsl(195,80%,70%)]" aria-hidden="true" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Loader2 className="h-8 w-8 text-[hsl(195,80%,70%)] animate-spin" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
          {t('maintenance.title')}
        </h1>

        {/* Description */}
        <div className="space-y-4 mb-8">
          <p className="text-xl md:text-2xl text-white/80 font-semibold">
            {t('maintenance.description')}
          </p>
          
          <p className="text-lg text-white/60 max-w-lg mx-auto">
            {t('maintenance.descriptionDetail')}
          </p>
        </div>

        {/* Discord Link */}
        <div className="mb-8">
          <a
            href="https://discord.gg/wMnKRSCUVz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border-2 border-[#5865F2]/50 hover:border-[#5865F2] rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 group"
            aria-label={t('maintenance.discordAriaLabel')}
          >
            <DiscordIcon size={28} className="text-[#5865F2] group-hover:text-[#4752C4] transition-colors" />
            <MessageCircle className="h-6 w-6 text-white/70 group-hover:text-white transition-colors" aria-hidden="true" />
            <span>
              {t('maintenance.discordButton')}
            </span>
          </a>
        </div>

        {/* Status message */}
        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-white/50">
            {t('maintenance.statusMessage')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;

