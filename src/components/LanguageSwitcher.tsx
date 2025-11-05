import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
      className="gap-2 text-white/90 hover:text-white hover:bg-[hsl(195,80%,70%,0.1)] border border-[hsl(195,80%,70%,0.3)] transition-all duration-300"
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline font-medium">{language === 'ar' ? 'English' : 'العربية'}</span>
      <span className="sm:hidden font-bold">{language === 'ar' ? 'EN' : 'ع'}</span>
    </Button>
  );
};

