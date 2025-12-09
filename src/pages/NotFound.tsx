import { useLocation, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowRight, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { getStaticImageUrl } from "@/lib/cloudflareImages";

const NotFound = () => {
  const location = useLocation();
  const { t, tAr, language } = useLanguage();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  // Memoize animated particles for performance
  const particles = useMemo(() => 
    [...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white/40 rounded-full animate-fall"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20}%`,
          animationDuration: `${10 + Math.random() * 20}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
        aria-hidden="true"
      />
    )), []
  );

  return (
    <>
      <SEO 
        title={`${tAr('common.pageNotFound')} - NXOLand`}
        description={tAr('common.pageNotFoundDesc')}
        noIndex={true}
      />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Animated background particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {particles}
        </div>

        {/* Navigation */}
        <Navbar />

        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img 
                src={getStaticImageUrl('LOGO', 'public') || '/nxoland-new-logo.png'} 
                alt="NXOLand Logo" 
                width="80"
                height="80"
                className="h-16 w-16 sm:h-20 sm:w-20"
                style={{ objectFit: 'contain', aspectRatio: '1/1' }}
                loading="lazy"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src.includes('imagedelivery.net')) {
                    img.src = '/nxoland-official-logo.png';
                  }
                }}
              />
            </div>
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-[hsl(195,80%,50%)]/10 border-4 border-[hsl(195,80%,50%)] flex items-center justify-center animate-pulse">
                  <AlertCircle className="h-16 w-16 text-[hsl(195,80%,70%)]" aria-hidden="true" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
                    <span className="text-2xl font-black text-red-400">404</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              {t('common.pageNotFound')}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-white/80 font-semibold mb-8 max-w-lg mx-auto">
              {t('common.pageNotFoundDesc')}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button
                asChild
                size="lg"
                className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 group"
              >
                <Link to="/">
                  <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  {t('common.backToHome')}
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/5 hover:bg-white/10 border-white/20 text-white font-bold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 group"
              >
                <Link to="/marketplace">
                  <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  {t('notFound.browseMarketplace')}
                </Link>
              </Button>
            </div>

            {/* Helpful links */}
            <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-white/60 mb-4 text-sm">
                {t('notFound.youMightBeLookingFor')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link 
                  to="/marketplace" 
                  className="text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] text-sm font-semibold transition-colors flex items-center gap-1 group"
                >
                  {t('notFound.links.marketplace')}
                  <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} aria-hidden="true" />
                </Link>
                <span className="text-white/20">•</span>
                <Link 
                  to="/members" 
                  className="text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] text-sm font-semibold transition-colors flex items-center gap-1 group"
                >
                  {t('notFound.links.members')}
                  <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} aria-hidden="true" />
                </Link>
                <span className="text-white/20">•</span>
                <Link 
                  to="/help" 
                  className="text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] text-sm font-semibold transition-colors flex items-center gap-1 group"
                >
                  {t('notFound.links.help')}
                  <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
