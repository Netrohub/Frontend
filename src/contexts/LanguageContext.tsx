import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navbar
    'nav.home': 'الرئيسية',
    'nav.marketplace': 'التداول',
    'nav.marketplace.browse': 'السوق',
    'nav.marketplace.browse.desc': 'تصفح جميع الحسابات المعروضة',
    'nav.marketplace.sell': 'بيع حساب',
    'nav.marketplace.sell.desc': 'أضف حسابك للبيع',
    'nav.marketplace.myListings': 'إعلاناتي',
    'nav.marketplace.myListings.desc': 'إدارة إعلاناتك',
    'nav.community': 'المجتمع',
    'nav.community.leaderboard': 'لوحة المتصدرين',
    'nav.community.leaderboard.desc': 'أفضل البائعين والمشترين',
    'nav.community.members': 'الأعضاء',
    'nav.community.members.desc': 'تصفح أعضاء المنصة',
    'nav.wallet': 'المحفظة',
    'nav.wallet.balance': 'الرصيد',
    'nav.wallet.balance.desc': 'عرض رصيدك',
    'nav.wallet.orders': 'طلباتي',
    'nav.wallet.orders.desc': 'عرض طلباتك',
    'nav.wallet.disputes': 'النزاعات',
    'nav.wallet.disputes.desc': 'إدارة النزاعات',
    'nav.profile': 'الملف الشخصي',
    'nav.profile.view': 'الملف الشخصي',
    'nav.profile.view.desc': 'عرض ملفك الشخصي',
    'nav.profile.edit': 'تعديل الملف',
    'nav.profile.edit.desc': 'تحديث معلوماتك',
    'nav.profile.security': 'الأمان',
    'nav.profile.security.desc': 'إعدادات الأمان',
    'nav.profile.kyc': 'التحقق من الهوية',
    'nav.profile.kyc.desc': 'التحقق من حسابك',
    'nav.admin': 'لوحة التحكم',
    'nav.help': 'المساعدة',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',
    
    // Home
    'home.hero.title': 'أفضل منصة لبيع وشراء حسابات الألعاب',
    'home.hero.subtitle': 'اشتر وبع حسابات ألعابك المفضلة بأمان وسرعة',
    'home.hero.browseAccounts': 'تصفح الحسابات',
    'home.hero.learnMore': 'اعرف المزيد',
    'home.features.security': '🔒 آمن',
    'home.features.fast': '⚡ سريع',
    'home.features.support': '💬 دعم 24/7',
    'home.whyChoose': 'لماذا تختار نكسولاند؟',
    'home.feature1.title': 'معاملات آمنة',
    'home.feature1.desc': 'نظام دفع آمن مع حماية المشتري والبائع',
    'home.feature2.title': 'دعم على مدار الساعة',
    'home.feature2.desc': 'فريق دعم متاح 24/7 لمساعدتك',
    'home.feature3.title': 'أسعار تنافسية',
    'home.feature3.desc': 'احصل على أفضل سعر لحساباتك',
    'home.feature4.title': 'تحويل فوري',
    'home.feature4.desc': 'احصل على أموالك فوراً بعد البيع',
    'home.howItWorks': 'كيف يعمل؟',
    'home.step1.title': 'اختر حساب',
    'home.step1.desc': 'تصفح آلاف الحسابات المعروضة',
    'home.step2.title': 'ادفع بأمان',
    'home.step2.desc': 'استخدم نظام الدفع الآمن الخاص بنا',
    'home.step3.title': 'احصل على حسابك',
    'home.step3.desc': 'استلم حسابك فوراً بعد التأكيد',
    'home.cta.title': 'ابدأ التداول الآن',
    'home.cta.subtitle': 'انضم إلى آلاف المستخدمين الذين يثقون بنا',
    'home.cta.getStarted': 'ابدأ الآن',
    'home.footer.rights': 'جميع الحقوق محفوظة',
    'home.footer.terms': 'الشروط والأحكام',
    'home.footer.privacy': 'سياسة الخصوصية',
    'home.footer.support': 'الدعم',
    
    // Sell
    'sell.title': 'اختر اللعبة',
    'sell.subtitle': 'حدد اللعبة التي تريد بيع حساباتها',
    'sell.comingSoon': 'المزيد من الألعاب قريباً...',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.back': 'رجوع',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.marketplace': 'Trading',
    'nav.marketplace.browse': 'Marketplace',
    'nav.marketplace.browse.desc': 'Browse all available accounts',
    'nav.marketplace.sell': 'Sell Account',
    'nav.marketplace.sell.desc': 'List your account for sale',
    'nav.marketplace.myListings': 'My Listings',
    'nav.marketplace.myListings.desc': 'Manage your listings',
    'nav.community': 'Community',
    'nav.community.leaderboard': 'Leaderboard',
    'nav.community.leaderboard.desc': 'Top sellers and buyers',
    'nav.community.members': 'Members',
    'nav.community.members.desc': 'Browse platform members',
    'nav.wallet': 'Wallet',
    'nav.wallet.balance': 'Balance',
    'nav.wallet.balance.desc': 'View your balance',
    'nav.wallet.orders': 'My Orders',
    'nav.wallet.orders.desc': 'View your orders',
    'nav.wallet.disputes': 'Disputes',
    'nav.wallet.disputes.desc': 'Manage disputes',
    'nav.profile': 'Profile',
    'nav.profile.view': 'Profile',
    'nav.profile.view.desc': 'View your profile',
    'nav.profile.edit': 'Edit Profile',
    'nav.profile.edit.desc': 'Update your information',
    'nav.profile.security': 'Security',
    'nav.profile.security.desc': 'Security settings',
    'nav.profile.kyc': 'KYC Verification',
    'nav.profile.kyc.desc': 'Verify your account',
    'nav.admin': 'Admin Panel',
    'nav.help': 'Help',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    
    // Home
    'home.hero.title': 'Best Platform for Buying and Selling Game Accounts',
    'home.hero.subtitle': 'Buy and sell your favorite game accounts safely and quickly',
    'home.hero.browseAccounts': 'Browse Accounts',
    'home.hero.learnMore': 'Learn More',
    'home.features.security': '🔒 Secure',
    'home.features.fast': '⚡ Fast',
    'home.features.support': '💬 24/7 Support',
    'home.whyChoose': 'Why Choose NXOLand?',
    'home.feature1.title': 'Secure Transactions',
    'home.feature1.desc': 'Secure payment system with buyer and seller protection',
    'home.feature2.title': '24/7 Support',
    'home.feature2.desc': 'Support team available 24/7 to help you',
    'home.feature3.title': 'Competitive Prices',
    'home.feature3.desc': 'Get the best price for your accounts',
    'home.feature4.title': 'Instant Transfer',
    'home.feature4.desc': 'Get your money instantly after sale',
    'home.howItWorks': 'How It Works?',
    'home.step1.title': 'Choose Account',
    'home.step1.desc': 'Browse thousands of listed accounts',
    'home.step2.title': 'Pay Safely',
    'home.step2.desc': 'Use our secure payment system',
    'home.step3.title': 'Get Your Account',
    'home.step3.desc': 'Receive your account instantly after confirmation',
    'home.cta.title': 'Start Trading Now',
    'home.cta.subtitle': 'Join thousands of users who trust us',
    'home.cta.getStarted': 'Get Started',
    'home.footer.rights': 'All Rights Reserved',
    'home.footer.terms': 'Terms & Conditions',
    'home.footer.privacy': 'Privacy Policy',
    'home.footer.support': 'Support',
    
    // Sell
    'sell.title': 'Choose Game',
    'sell.subtitle': 'Select the game you want to sell accounts for',
    'sell.comingSoon': 'More games coming soon...',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
  }
};

