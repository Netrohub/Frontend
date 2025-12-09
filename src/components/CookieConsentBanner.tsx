import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsentBanner = () => {
  const { showBanner, acceptCookies, rejectCookies } = useCookieConsent();
  const { t, language } = useLanguage();

  if (!showBanner) {
    return null;
  }

  const handleAcceptAll = () => {
    acceptCookies();
  };

  const handleReject = () => {
    rejectCookies();
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-in slide-in-from-bottom duration-300"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-[hsl(200,70%,15%)] to-[hsl(195,60%,25%)] border-white/20 shadow-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Cookie Icon */}
          <div className="flex-shrink-0">
            <Cookie className="h-8 w-8 md:h-10 md:w-10 text-white/80" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <h3
              id="cookie-consent-title"
              className="text-lg md:text-xl font-bold text-white"
            >
              {t('cookieConsent.title')}
            </h3>
            <p
              id="cookie-consent-description"
              className="text-sm md:text-base text-white/80 leading-relaxed"
            >
              {t('cookieConsent.description')}{' '}
              <Link
                to="/privacy"
                className="underline hover:text-white transition-colors font-semibold"
              >
                {t('cookieConsent.privacyPolicy')}
              </Link>
            </p>
            <p className="text-xs md:text-sm text-white/60">
              {t('cookieConsent.googleAnalytics')}
            </p>
          </div>

          {/* Actions */}
          <div
            className="flex flex-col sm:flex-row gap-2 w-full md:w-auto flex-shrink-0"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <Button
              onClick={handleAcceptAll}
              className="bg-white text-[hsl(200,70%,15%)] hover:bg-white/90 font-semibold whitespace-nowrap"
              size="sm"
            >
              {t('cookieConsent.acceptAll')}
            </Button>
            <Button
              onClick={handleReject}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 whitespace-nowrap"
              size="sm"
            >
              {t('cookieConsent.reject')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

