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
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">{language === 'ar' ? 'English' : 'العربية'}</span>
      <span className="sm:hidden">{language === 'ar' ? 'EN' : 'ع'}</span>
    </Button>
  );
};

