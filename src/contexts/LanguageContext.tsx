import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  tAr: (key: string, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key] || key;
    
    // Replace placeholders like {count}, {date}, {name}, etc.
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(new RegExp(`\\{${param}\\}`, 'g'), String(params[param]));
      });
    }
    
    return translation;
  };

  // Always return Arabic translations (for SEO consistency)
  const tAr = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations.ar[key] || key;
    
    // Replace placeholders like {count}, {date}, {name}, etc.
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(new RegExp(`\\{${param}\\}`, 'g'), String(params[param]));
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tAr }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations: Record<Language, Record<string, string>> = {
  ar: {
// Common
'common.backToHome': 'العودة إلى الصفحة الرئيسية',
'common.pageNotFound': 'الصفحة غير موجودة',
'common.pageNotFoundDesc': 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
'common.and': 'و',
'common.notSpecified': 'غير محدد',

// Navbar
'nav.home': 'الرئيسية',
'nav.marketplace': 'المتجر',
'nav.sell': 'اعرض حسابك للبيع',
'nav.orders': 'الطلبات',
'nav.wallet': 'رصيدي',
'nav.profile': 'صفحتي الشخصية',
'nav.admin': 'لوحة الإدارة',
'nav.members': 'قائمة الأعضاء',
'nav.leaderboard': 'قائمة المتصدرين',
'nav.help': 'مركز المساعدة',
'nav.disputes': 'حل النزاعات',
'nav.myListings': 'إعلاناتي',
'nav.kyc': 'التحقق من الهوية',
    'admin.kyc.title': 'إدارة التحقق من الهوية',
    'admin.kyc.subtitle': 'عرض جميع الطلبات الخاصة بالتحقق من الهوية.',
'nav.notifications': 'الإشعارات',
'nav.settings': 'الإعدادات',
'nav.logout': 'تسجيل الخروج',
'nav.login': 'تسجيل الدخول',
'nav.suggestions': 'الآراء والتقييمات',
'nav.community': 'المجتمع',
'nav.myAccount':  'حسابي',
'nav.signIn': 'تسجيل الدخول',
'nav.openMenu': 'فتح القائمة',
'nav.menu': 'القائمة',
'nav.closeMenu': 'إغلاق القائمة',
'nav.close': 'إغلاق',
'nav.navigationLinks': 'روابط الموقع',
'nav.termsAndConditions': 'الشروط والأحكام',
'nav.privacyPolicy': 'سياسة الخصوصية',
'nav.refundPolicy': 'سياسة الاسترجاع',
'nav.membersDescription': 'تصفح جميع الأعضاء',
'nav.suggestionsDescription': 'شارك أفكارك لتحسين المنصة',
'nav.homeAriaLabel': 'العودة إلى الصفحة الرئيسية',


// Home
'home.hero.title': 'منصتك لبيع وشراء الحسابات والمنتجات الرقمية',
'home.hero.subtitle': 'وسيط موثوق يسهّل عمليات البيع والشراء بأمان وشفافية تامة.',
'home.hero.browseAccounts': 'استعرض الحسابات',
'home.hero.learnMore': 'تعرف أكثر',

'home.badge': 'أهلاً بك في NXOLand 👋',

'home.whyChoose': 'ليش تختار NXOLand؟',

'home.feature1.title': 'نظام وساطة مضمون',
'home.feature1.desc': 'نضمن حقوق الطرفين من بداية الصفقة إلى استلام المنتج بالكامل.',

'home.feature2.title': 'دعم سريع ومباشر',
'home.feature2.desc': 'فريق الدعم متواجد دائمًا على ديسكورد لحل أي استفسار أو مشكلة.',

'home.feature3.title': 'أسعار عادلة بدون مبالغة',
'home.feature3.desc': 'بيع وشراء بسهولة وبأفضل الأسعار بدون عمولات زائدة.',

'home.feature4.title': 'تحويل آمن وسريع',
'home.feature4.desc': 'يتم تحويل المبلغ للبائع فور تأكيد المشتري استلام المنتج بنجاح.',

'home.howItWorks': 'طريقة الاستخدام',
'home.howPlatformWorks': 'آلية عمل المنصة',
'home.howDoesItWork': 'كيف تشتغل؟',
'home.howItWorksSubtitle': 'خطوات بسيطة تضمن تجربة آمنة وسريعة.',

'home.step1.title': 'اختَر الحساب المناسب لك',
'home.step1.desc': 'تصفح مئات الحسابات المصنّفة حسب اللعبة والسعر والمستوى.',

'home.step2.title': 'ادفع بكل أمان',
'home.step2.desc': 'عمليات الدفع تتم عبر Tap بنظام مشفر ومضمون.',

'home.step3.title': 'استلم حسابك فورًا',
'home.step3.desc': 'بعد الدفع، يتم تسليم الحساب تلقائيًا مع ضمان الحقوق للطرفين.',

'home.cta.title': 'ابدأ الآن بثقة',
'home.cta.subtitle': 'انضم لمجتمع اللاعبين اللي يتداولون حساباتهم بأمان عبر NXOLand.',
'home.cta.getStarted': 'ابدأ الآن',

// Landing Discord CTAs
'landing.discord.heroCta': 'انضم إلى مجتمع Discord',
'landing.discord.sectionTitle': 'انضم إلى مجتمع NXOLand',
'landing.discord.sectionSubtitle': 'احصل على الدعم والتحديثات ونصائح التداول مباشرة من فريقنا واللاعبين الآخرين.',
'landing.discord.bulletSupport': 'دعم سريع والإجابة على الأسئلة',
'landing.discord.bulletUpdates': 'الإعلانات وتحديثات المنصة',
'landing.discord.bulletSafety': 'نصائح التداول وإرشادات أمان الحسابات',
'landing.discord.joinButton': 'انضم إلى Discord',

'home.footer.rights': '© جميع الحقوق محفوظة لـ NXOLand',
'home.footer.terms': 'الشروط والأحكام',
'home.footer.privacy': 'سياسة الخصوصية',
'home.footer.refund': 'سياسة الاسترجاع',
'home.footer.support': 'خدمة العملاء',
'home.footer.suggestions': 'الآراء والمقترحات',
'home.footer.commercialRegistration': 'السجل التجاري',
'home.footer.quickLinks': 'روابط سريعة',
'home.footer.contact': 'تواصل معنا',
'home.footer.discordLiveChat': 'المحادثة الفورية عبر Discord',


    
// Sell
'sell.title': 'اختر اللعبة',
'sell.subtitle': 'حدد اللعبة التي ترغب في بيع حساباتها',
'sell.comingSoon': 'ألعاب جديدة قادمة قريبًا...',
'sell.selectCategory': 'اختر النوع',
'sell.categorySubtitle': 'حدد نوع الحساب الذي تريد بيعه',
'sell.explore': 'تصفح',
'sell.price': 'السعر',
'sell.description': 'الوصف',
'sell.gaming.title': 'حسابات الألعاب',
'sell.gaming.description': 'اعرض حسابات ألعابك للبيع بسهولة',
'sell.social.title': 'حسابات التواصل الاجتماعي',
'sell.social.description': 'بيع حساباتك على مختلف منصات التواصل',
'sell.social.followers': 'عدد المتابعين',
'sell.social.likes': 'الإعجابات',
'sell.social.views': 'عدد المشاهدات',
'sell.social.posts': 'عدد المنشورات',
'sell.social.engagement': 'معدل التفاعل',
'sell.social.verification': 'حالة التوثيق',
'sell.social.verified': 'موثّق',
'sell.social.unverified': 'غير موثّق',

'sell.social.tiktok.title': 'بيع حساب تيك توك',
'sell.social.tiktok.subtitle': 'أدخل تفاصيل حسابك في تيك توك',
'sell.social.tiktok.description': 'اعرض حسابات تيك توك للبيع',
'sell.social.tiktok.username': 'اسم المستخدم',
'sell.social.tiktok.descriptionPlaceholder': 'اكتب وصفًا لحسابك: نوع المحتوى، النيتش، عدد المتابعين...',

'sell.social.instagram.title': 'بيع حساب إنستغرام',
'sell.social.instagram.subtitle': 'أدخل تفاصيل حسابك في إنستغرام',
'sell.social.instagram.description': 'اعرض حسابات إنستغرام للبيع',
'sell.social.instagram.username': 'اسم المستخدم',
'sell.social.instagram.descriptionPlaceholder': 'اكتب وصفًا لحسابك: نوع المحتوى، النيتش، عدد المتابعين...',

'sell.social.accountDescription': 'تفاصيل الحساب',
'sell.social.descriptionPlaceholder': 'اكتب معلومات واضحة عن الحساب والمحتوى والاهتمام...',

'sell.social.accountWithPrimaryEmail': 'يتضمن البريد الإلكتروني الأساسي',
'sell.social.accountLinkedToPhone': 'مرتبط برقم هاتف',

'sell.social.confirmOwnership.title': 'تأكيد ملكية الحساب',
'sell.social.confirmOwnership.description': 'لضمان بيئة آمنة، يجب عليك تنفيذ الخطوات التالية لإضافة حسابك والتحقق من ملكيته.',
'sell.social.confirmOwnership.instruction': 'اضغط على "ضع الكلمة أدناه في السيرة الذاتية" للمتابعة في عملية التحقق.',
'sell.social.confirmOwnership.theWord': 'الكلمة المطلوبة',
'sell.social.confirmOwnership.copy': 'نسخ الكلمة',
'sell.social.confirmOwnership.confirm': 'تأكيد الملكية',

'sell.social.pledge1': 'أتعهد بألا يتضمن وصف الحساب أي وسيلة تواصل خارج المنصة بأي شكل من الأشكال.',
'sell.social.pledge2': 'أتحمل المسؤولية القانونية الكاملة عن الحساب منذ إنشائه أو شرائه وحتى لحظة بيعه عبر المنصة، وأؤكد خلوه من أي مخالفات أو جرائم إلكترونية.',

'sell.social.deliveryInfo.title': 'بيانات التسليم',
'sell.social.deliveryInfo.description': 'أدخل المعلومات التي سيتم تسليمها للمشتري بعد إتمام الصفقة',
'sell.social.deliveryInfo.email': 'البريد الإلكتروني المرتبط بالحساب',
'sell.social.deliveryInfo.password': 'كلمة المرور',
'sell.social.deliveryInfo.instructions': 'ملاحظات أو تعليمات إضافية',
'sell.social.deliveryInfo.instructionsPlaceholder': 'أضف أي تفاصيل يحتاجها المشتري بخصوص التسليم...',

// Listing
'listing.success': 'تم إنشاء إعلانك بنجاح!',
'listing.successDescription': 'سيتم مراجعة الإعلان ونشره خلال وقت قصير.',
'listing.creating': 'جاري إنشاء الإعلان...',
'listing.create': 'أنشئ إعلانًا جديدًا',
'listing.published': 'تم نشر إعلانك بنجاح!',
'listing.priceTooLow': 'السعر المدخل منخفض جدًا. الحد الأدنى هو 10 دولارات.',
'listing.duplicateDetected': 'يبدو أن لديك إعلانًا مشابهًا بالفعل.',
'listing.maxListingsReached': 'لقد وصلت إلى الحد الأقصى من الإعلانات المسموح بها.',
'listing.verificationRequired': 'يرجى إتمام التحقق من الهوية قبل المتابعة.',
'listing.titleRequired': 'أدخل عنوانًا واضحًا لإعلانك.',
'listing.serverRequired': 'اختر السيرفر أو المنطقة الخاصة بالحساب.',
'listing.imagesRequired': 'يجب رفع صورة واحدة على الأقل.',
'listing.billImagesRequired': 'يرجى رفع جميع صور الفواتير المطلوبة.',
'listing.uploadingImages': 'جاري رفع الصور...',
'listing.uploadFailed': 'فشل رفع الصور. حاول مرة أخرى.',
'listing.maxImages': 'يمكنك رفع ما يصل إلى 8 صور فقط.',
'listing.imageTooLarge': 'الصورة {name} تتجاوز الحد المسموح (5 ميجابايت). الحجم الحالي: {size} ميجابايت.',
'listing.imageTooLargeCurrent': 'الصورة كبيرة جدًا. الحد الأقصى 5 ميجابايت (الحجم الحالي: {size} ميجابايت).',
'listing.priceRange': 'الحد الأدنى: $10 | الحد الأقصى: $10,000',
'listing.accountImages': 'صور الحساب',
'listing.accountImagesDesc': 'قم بتحميل لقطات شاشة من حسابك — يمكنك رفع حتى 8 صور.',
'listing.uploadImage': 'رفع صورة',
'listing.imageCount': 'عدد الصور المرفوعة: {count} من 8',
'listing.billImagesTitle': 'صور الفواتير (مطلوبة)',
'listing.billImagesDesc': 'قم برفع لقطات من فواتير الشراء — ستُعرض للمشتري بعد الدفع.',
'listing.firstBillImage': 'صورة أول فاتورة شراء *',
'listing.threeBillImages': 'صور ثلاث فواتير في تواريخ مختلفة *',
'listing.lastBillImage': 'صورة آخر فاتورة شراء *',
'listing.chooseImage': 'اختر صورة من جهازك',
'listing.imageAlt': 'صورة رقم {number}',
'listing.priceRequired': 'يرجى إدخال سعر صحيح للحساب.',
'listing.stoveLevelRequired': 'يرجى تحديد مستوى الحساب أو القسم المطلوب.',
'listing.allFieldsRequired': 'يرجى تعبئة جميع البيانات المطلوبة.',
'listing.accountCredentialsRequired': 'أدخل البريد الإلكتروني وكلمة المرور الخاصة بالحساب.',
'listing.billImagesInstructions': 'قم برفع لقطات من فواتير الشراء — ستُعرض للمشتري بعد الدفع.',
'listing.billImagesSecurityNote': 'معلومات الحساب ستكون محمية ومشفرة. سيتم عرضها للمشتري فقط بعد إتمام عملية الدفع.',
'listing.cancelConfirm': 'هل أنت متأكد من الإلغاء؟ ستفقد جميع البيانات المدخلة.',
'listing.publishing': 'جاري النشر...',
'listing.publishListing': 'نشر الإعلان',
'listing.deliveryDescription': 'وصف التسليم',
'listing.deliveryDescriptionPlaceholder': 'مثال: تسجيل الدخول عبر فيسبوك، البريد الإلكتروني الرئيسي هو aa@aa.com',
'listing.deliveryDescriptionHint': 'اشرح للمشتري كيفية تسليم الحساب. سيتم عرض هذا الوصف للمشتري بعد إتمام الدفع.',
'listing.termsAcceptance': 'بإدراج هذا الحساب، أنت توافق على شروطنا وأحكامنا وسياسة الخصوصية.',
'listing.termsAcceptanceRequired': 'يجب الموافقة على الشروط والأحكام وسياسة الخصوصية للمتابعة.',
'listing.secondBillImage': 'صورة ثاني فاتورة شراء *',
'listing.thirdBillImage': 'صورة ثالث فاتورة شراء *',

// Sell WOS
'sell.wos.pageTitle': 'إضافة حساب Whiteout Survival للبيع',
'sell.wos.pageSubtitle': 'أضف تفاصيل الحساب وابدأ البيع',
'sell.wos.kycRequired': 'التحقق من الهوية (KYC) مطلوب',
'sell.wos.kycDescription1': 'يجب إكمال عملية التحقق من الهوية قبل أن تتمكن من عرض حسابات للبيع على المنصة.',
'sell.wos.kycDescription2': 'هذا الإجراء إلزامي لضمان أمان وموثوقية جميع البائعين على المنصة.',
'sell.wos.startVerification': 'ابدأ التحقق الآن',
'sell.wos.basicInfo': 'المعلومات الأساسية',
'sell.wos.listingTitle': 'عنوان الإعلان *',
'sell.wos.listingTitlePlaceholder': 'مثال: حساب قوي - المستوى 45',
'sell.wos.characters': 'حرف',
'sell.wos.server': 'السيرفر *',
'sell.wos.selectServer': 'اختر السيرفر',
'sell.wos.other': 'آخر',
'sell.wos.price': 'السعر ($) *',
'sell.wos.accountDetails': 'تفاصيل الحساب (إلزامية)',
'sell.wos.furnaceLevel': 'حجرة الاحتراق *',
'sell.wos.selectFurnaceLevel': 'اختر حجرة الاحتراق',
'sell.wos.helios': 'هيليوس (يمكن اختيار أكثر من واحد)',
'sell.wos.heliosInfantry': 'المشاة',
'sell.wos.heliosArchers': 'الرماه',
'sell.wos.heliosSpear': 'الرمح',
'sell.wos.heliosNone': 'ولا شي',
'sell.wos.troops': 'عدد الجنود *',
'sell.wos.troopsPlaceholder': 'مثال: 1M أو 1,000,000',
'sell.wos.totalPower': 'القوة الشخصية (Total Power) *',
'sell.wos.totalPowerPlaceholder': 'مثال: 50M أو 50,000,000',
'sell.wos.heroPower': 'قوة البطل (Hero Power) *',
'sell.wos.heroPowerPlaceholder': 'مثال: 10M أو 10,000,000',
'sell.wos.island': 'الجزيرة (Island) *',
'sell.wos.islandPlaceholder': 'مثال: 7 أو 1K',
'sell.wos.expertPower': 'قوة الخبير (Expert Power) *',
'sell.wos.expertPowerPlaceholder': 'مثال: 5M أو 5,000,000',
'sell.wos.heroTotalPower': 'قوة البطل الإجمالية (Hero\'s total Power) *',
'sell.wos.heroTotalPowerPlaceholder': 'مثال: 15M أو 15,000,000',
'sell.wos.petPower': 'قوة الحيوانات (Pet Power) *',
'sell.wos.petPowerPlaceholder': 'مثال: 3M أو 3,000,000',
'sell.wos.numericInputHint': 'يمكنك إدخال أرقام مع إمكانية إضافة K أو M أو B في النهاية',
'sell.wos.hasEmail': 'مع البريد الإلكتروني الأساسي؟',
'sell.wos.hasApple': 'هل الحساب مربوط في أبل؟',
'sell.wos.hasGoogle': 'هل الحساب مربوط في قوقل؟',
'sell.wos.hasFacebook': 'هل الحساب مربوط في فيسبوك؟',
'sell.wos.hasGameCenter': 'هل الحساب مربوط في قيم سنتر؟',
'sell.wos.yes': 'نعم',
'sell.wos.no': 'لا',
'sell.wos.accountDetailsSection': 'تفاصيل الحساب',
'sell.wos.accountEmail': 'البريد الإلكتروني *',
'sell.wos.accountPassword': 'كلمة المرور *',
'sell.wos.descriptionServer': 'السيرفر: {server}',
'sell.wos.descriptionFurnace': 'حجرة الاحتراق: {level}',
'sell.wos.descriptionHelios': 'هيليوس: {helios}',
'sell.wos.descriptionHeliosNone': 'هيليوس: لا يوجد',
'sell.wos.descriptionTroops': 'عدد الجنود: {troops}',
'sell.wos.descriptionTotalPower': 'القوة الشخصية: {power}',
'sell.wos.descriptionHeroPower': 'قوة البطل: {power}',
'sell.wos.descriptionIsland': 'الجزيرة: {island}',
'sell.wos.descriptionExpertPower': 'قوة الخبير: {power}',
'sell.wos.descriptionHeroTotalPower': 'قوة البطل الإجمالية: {power}',
'sell.wos.descriptionPetPower': 'قوة الحيوانات: {power}',
'sell.wos.descriptionHasEmail': 'مع البريد الإلكتروني الأساسي: {value}',
'sell.wos.descriptionHasApple': 'مربوط في أبل: {value}',
'sell.wos.descriptionHasGoogle': 'مربوط في قوقل: {value}',
'sell.wos.descriptionHasFacebook': 'مربوط في فيسبوك: {value}',
'sell.wos.descriptionHasGameCenter': 'مربوط في قيم سنتر: {value}',
'sell.wos.imageAlt': 'صورة {number}',
'sell.wos.firstBillAlt': 'أول فاتورة',
'sell.wos.multipleBillsAlt': 'فواتير متعددة',
'sell.wos.secondBillAlt': 'ثاني فاتورة',
'sell.wos.thirdBillAlt': 'ثالث فاتورة',
'sell.wos.lastBillAlt': 'آخر فاتورة',

    
// Common
'common.loading': 'جارٍ التحميل...',
'common.search': 'بحث',
'common.filter': 'تصفية النتائج',
'common.sort': 'ترتيب حسب',
'common.all': 'الكل',
'common.save': 'حفظ التغييرات',
'common.cancel': 'إلغاء',
'common.delete': 'حذف',
'common.edit': 'تعديل',
'common.view': 'عرض التفاصيل',
'common.back': 'رجوع',
'common.confirm': 'تأكيد العملية',
'common.close': 'إغلاق',
'common.submit': 'إرسال',
'common.update': 'تحديث البيانات',
'common.download': 'تنزيل',
'common.upload': 'رفع ملف',
'common.next': 'التالي',
'common.previous': 'السابق',
'common.page': 'صفحة',
'common.of': 'من',
'common.from': 'من',
'common.showing': 'عرض',
'common.results': 'نتيجة',
'common.noResults': 'لا توجد نتائج حالياً',
'common.error': 'حدث خطأ',
'common.success': 'تم بنجاح',
'common.warning': 'تنبيه',
'common.info': 'معلومة',
'common.errorLoading': 'حدث خطأ أثناء تحميل البيانات',
'common.retry': 'إعادة المحاولة',
'common.skipToContent': 'انتقال إلى المحتوى الرئيسي',
'common.sending': 'جارٍ الإرسال...',
'common.processing': 'جارٍ المعالجة...',
'common.errorTryAgain': 'حدث خطأ، حاول مرة أخرى لاحقًا',

    
// Time
'time.now': 'الآن',
'time.minutesAgo': 'منذ {count} دقيقة',
'time.hoursAgo': 'منذ {count} ساعة',
'time.daysAgo': 'منذ {count} يوم',

// Search
'search.placeholder': 'ابحث...',
'search.fullPlaceholder': 'ابحث عن الحسابات، الأعضاء، أو المواضيع...',
'search.button': 'بدء البحث',
'search.keyboardShortcuts': 'اضغط ESC للإغلاق • اضغط / للبحث السريع',

// Quick Nav
'quickNav.browseMarket': 'تصفح المتجر',
'quickNav.myOrders': 'طلباتي',
'quickNav.disputes': 'النزاعات',
'quickNav.help': 'مركز المساعدة',

    
// Reviews
'reviews.title': 'التقييمات',
'reviews.addReview': 'أضف تقييمك',
'reviews.editReview': 'تعديل التقييم',
'reviews.rating': 'التقييم *',
'reviews.comment': 'التعليق *',
'reviews.commentPlaceholder': 'شارك تجربتك مع هذا البائع... كيف كانت الخدمة؟ وهل تم التسليم بسرعة؟',
'reviews.minCharacters': '(10 أحرف على الأقل)',
'reviews.characterCount': '{count} / 1000 حرف',
'reviews.charactersRemaining': '{remaining} حرف متبقٍ',
'reviews.excellent': 'ممتاز',
'reviews.veryGood': 'جيد جدًا',
'reviews.good': 'جيد',
'reviews.acceptable': 'مقبول',
'reviews.poor': 'ضعيف',
'reviews.pleaseSelectRating': 'يرجى اختيار تقييم',
'reviews.commentMinLength': 'يجب أن يحتوي التعليق على 10 أحرف على الأقل',
'reviews.createSuccess': 'تم إضافة التقييم بنجاح',
'reviews.updateButton': 'تحديث التقييم',
'reviews.publishButton': 'نشر التقييم',
'reviews.tip': '💡 نصيحة: التقييمات الواضحة والصادقة تساعد المشترين على اتخاذ قرارات أفضل.',


// Auth
'auth.tagline': 'منصة الوساطة الآمنة لبيع وشراء الحسابات الرقمية.',
'auth.login': 'تسجيل الدخول',
'auth.loginWithDiscord': 'تسجيل الدخول عبر Discord',
'auth.registerWithDiscord': 'إنشاء حساب عبر Discord',
'auth.orContinueWith': 'أو المتابعة مع',
'auth.discordLoginSuccess': 'تم تسجيل الدخول بنجاح عبر Discord!',
'auth.discordLoginError': 'حدث خطأ أثناء تسجيل الدخول عبر Discord',
'auth.discordOAuthFailed': 'فشل تسجيل الدخول عبر Discord',
'auth.discordInvalidState': 'حالة غير صالحة. يرجى المحاولة مرة أخرى',
'auth.discordNoCode': 'لم يتم استلام رمز المصادقة',
'auth.discordTokenExchangeFailed': 'فشل تبادل رمز المصادقة',
'auth.discordNoAccessToken': 'لم يتم استلام رمز الوصول',
'auth.discordUserInfoFailed': 'فشل جلب معلومات المستخدم من Discord',
'auth.discordInvalidUser': 'معلومات مستخدم Discord غير صالحة',
'auth.discordOAuthException': 'حدث خطأ أثناء عملية تسجيل الدخول',
'auth.discordAlreadyLinked': 'حساب Discord مرتبط بالفعل بحساب آخر',
'auth.discordAlreadyLinkedSecurity': 'حساب Discord مرتبط بحساب آخر. لا يمكن تغيير الحساب بهذه الطريقة.',
'auth.sessionMismatch': 'خطأ في الجلسة. يرجى تسجيل الدخول مرة أخرى.',
'auth.discordLinkFailed': 'فشل ربط حساب Discord',
'auth.discordNotAuthenticated': 'يجب تسجيل الدخول أولاً لربط حساب Discord',
'auth.discordOAuthError': 'حدث خطأ أثناء تسجيل الدخول عبر Discord',
'auth.signup': 'إنشاء حساب جديد',
'auth.register': 'إنشاء حساب',
'auth.pageDescription': 'سجل دخولك أو أنشئ حسابًا جديدًا لبدء تداول الحسابات بأمان.',
'auth.skipToForm': 'الانتقال إلى نموذج التسجيل',
'auth.email': 'البريد الإلكتروني',
'auth.password': 'كلمة المرور',
'auth.confirmPassword': 'تأكيد كلمة المرور',
'auth.fullName': 'الاسم الكامل',
'auth.phone': 'رقم الجوال',
'auth.forgotPassword': 'هل نسيت كلمة المرور؟',
'auth.rememberMe': 'تذكرني',
'auth.haveAccount': 'لديك حساب مسبقًا؟',
'auth.noAccount': 'ليس لديك حساب؟',
'auth.loginButton': 'تسجيل الدخول',
'auth.signupButton': 'إنشاء الحساب',
'auth.loginSuccess': 'تم تسجيل الدخول بنجاح.',
'auth.signupSuccess': 'تم إنشاء الحساب بنجاح.',
'auth.registerSuccess': 'تم إنشاء الحساب بنجاح.',
'auth.loginError': 'فشل تسجيل الدخول. يرجى التحقق من البيانات.',
'auth.signupError': 'تعذر إنشاء الحساب. حاول مرة أخرى.',
'auth.registerError': 'تعذر إنشاء الحساب. حاول مرة أخرى.',
'auth.invalidEmail': 'يرجى إدخال بريد إلكتروني صالح.',
'auth.passwordTooShort': 'كلمة المرور يجب ألا تقل عن {count} أحرف.',
'auth.passwordMismatch': 'كلمتا المرور غير متطابقتين.',
'auth.nameTooShort': 'الاسم يجب ألا يقل عن {count} أحرف.',
'auth.passwordSymbols': 'كلمة المرور يجب أن تحتوي على حرف خاص واحد على الأقل (مثل: !@#$%^&*).',
'auth.passwordMixed': 'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة.',
'auth.passwordNumbers': 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.',
'auth.passwordUncompromised': 'كلمة المرور هذه تم اختراقها في قاعدة بيانات معروفة. يرجى اختيار كلمة مرور أخرى.',
'auth.passwordMin': 'كلمة المرور يجب ألا تقل عن {count} أحرف.',
'auth.emailExists': 'البريد الإلكتروني مستخدم بالفعل.',
'auth.nameRequired': 'الاسم مطلوب.',
'auth.emailRequired': 'البريد الإلكتروني مطلوب.',
'auth.passwordRequired': 'كلمة المرور مطلوبة.',
'auth.termsAgreement': 'بالتسجيل، أنت توافق على',
'auth.terms': 'الشروط والأحكام',
'auth.privacy': 'سياسة الخصوصية',
'auth.passwordResetTitle': 'إعادة تعيين كلمة المرور',
'auth.passwordResetDescription': 'أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة التعيين إذا كان لديك حساب مسجل.',
'auth.passwordResetSubmit': 'إرسال رابط إعادة التعيين',
'auth.passwordResetSuccess': 'تم إرسال الرابط إلى بريدك الإلكتروني إذا كان موجودًا لدينا.',
'auth.passwordResetError': 'تعذر إرسال رابط إعادة التعيين. حاول مرة أخرى لاحقًا.',
'auth.passwordResetCancel': 'إلغاء',
'auth.setNewPasswordTitle': 'تعيين كلمة مرور جديدة',
'auth.setNewPasswordDescription': 'أدخل بريدك الإلكتروني وكلمة المرور الجديدة لإكمال الإجراء.',
'auth.passwordResetSubmitNew': 'تحديث كلمة المرور',
'auth.passwordResetComplete': 'تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.',
'auth.passwordResetInvalidLink': 'رابط إعادة التعيين غير صالح أو منتهي. يرجى طلب رابط جديد.',
'auth.passwordResetBackToLogin': 'العودة لتسجيل الدخول',
'auth.agreeToTerms': 'بإنشائك حسابًا، فأنت توافق على',
'auth.and': 'و',
'auth.backToHome': 'العودة إلى الصفحة الرئيسية',
'auth.processing': 'جارٍ المعالجة...',
'auth.securityVerification': 'يرجى إكمال التحقق الأمني.',

// Verify Email
'verifyEmail.title': 'تأكيد البريد الإلكتروني',
'verifyEmail.description': 'تأكيد عنوان بريدك الإلكتروني',
'verifyEmail.verifying': 'جاري التحقق...',
'verifyEmail.successTitle': 'تم التأكيد بنجاح!',
'verifyEmail.successMessage': 'تم تأكيد بريدك الإلكتروني بنجاح.',
'verifyEmail.errorTitle': 'فشل التحقق',
'verifyEmail.errorMessage': 'حدث خطأ أثناء التحقق من البريد الإلكتروني.',
'verifyEmail.timeoutTitle': 'انتهت مهلة الاتصال',
'verifyEmail.timeout': 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.',
'verifyEmail.invalidLink': 'رابط التحقق غير صالح أو منتهي الصلاحية.',
'verifyEmail.verifyFailed': 'فشل التحقق من البريد الإلكتروني.',
'verifyEmail.emailSent': 'تم إرسال رسالة التحقق إلى بريدك الإلكتروني.',
'verifyEmail.sendFailed': 'فشل إرسال رسالة التحقق. يرجى المحاولة مرة أخرى.',
'verifyEmail.alreadyVerified': 'البريد الإلكتروني موثق بالفعل.',
'verifyEmail.rateLimitExceeded': 'تم تجاوز الحد المسموح. يمكنك إعادة إرسال رسالة التحقق 3 مرات فقط في الساعة. يرجى المحاولة لاحقًا.',
'verifyEmail.resend': 'إعادة إرسال رسالة التحقق',
'verifyEmail.redirecting': 'سيتم إعادة التوجيه خلال',
'verifyEmail.seconds': 'ثانية',
'verifyEmail.goNow': 'الانتقال الآن',
'verifyEmail.tip': 'نصيحة:',
'verifyEmail.checkConnection': 'تحقق من اتصالك بالإنترنت أو حاول مرة أخرى لاحقًا.',

// Marketplace
'marketplace.title': 'المتجر',
'marketplace.subtitle': 'استعرض جميع الحسابات المتاحة للبيع',
'marketplace.description': 'تصفح واشترِ حسابات الألعاب أو التواصل الاجتماعي بأمان عبر NXOLand.',
'marketplace.skipToMarket': 'الانتقال إلى المتجر',
'marketplace.searchPlaceholder': 'ابحث عن حساب...',
'marketplace.searchAriaLabel': 'البحث في المتجر',
'marketplace.filterBy': 'تصفية حسب',
'marketplace.sortBy': 'ترتيب حسب',
'marketplace.categoryFilter': 'تصفية حسب الفئة',
'marketplace.category': 'الفئة',
'marketplace.allCategories': 'كل الفئات',
'marketplace.gaming': 'ألعاب',
'marketplace.social': 'تواصل اجتماعي',
'marketplace.trading': 'تداول رقمي',
'marketplace.other': 'أخرى',
'marketplace.priceFilter': 'تصفية حسب السعر',
'marketplace.price': 'السعر',
'marketplace.allPrices': 'كل الأسعار',
'marketplace.lowPrice': 'منخفض (أقل من $100)',
'marketplace.midPrice': 'متوسط ($100 - $1000)',
'marketplace.highPrice': 'مرتفع (أكثر من $1000)',
'marketplace.moreFilters': 'خيارات إضافية',
'marketplace.showing': 'عرض',
'marketplace.outOf': 'من',
'marketplace.accounts': 'الحسابات',
'marketplace.sellNow': 'ابدأ البيع الآن',
'marketplace.registerToSell': 'سجّل لتبدأ البيع',
'marketplace.allGames': 'جميع الألعاب',
'marketplace.priceRange': 'نطاق السعر',
'marketplace.games.title': 'اختر لعبتك',
'marketplace.games.subtitle': 'تصفح الحسابات حسب اللعبة',
'marketplace.games.description': 'اختر لعبة لتصفح الحسابات المتاحة',
'marketplace.backToGames': 'العودة إلى الألعاب',
'marketplace.gameNotFound': 'اللعبة غير موجودة',
'marketplace.gameCategorySubtitle': 'تصفح جميع الحسابات المتاحة لهذه اللعبة',
'marketplace.noListingsForGame': 'لا توجد حسابات متاحة لهذه اللعبة حالياً',
'marketplace.level': 'المستوى',
'marketplace.server': 'السيرفر',
'marketplace.latest': 'الأحدث',
'marketplace.priceHigh': 'الأعلى سعرًا',
'marketplace.priceLow': 'الأقل سعرًا',
'marketplace.levelHigh': 'الأعلى مستوى',
'marketplace.noListings': 'لا توجد إعلانات متاحة',
'marketplace.noListingsDesc': 'لم يتم العثور على حسابات مطابقة لبحثك.',
'marketplace.tryDifferent': 'جرّب تعديل البحث أو تغيير الفلاتر.',
'marketplace.verified': 'موثّق',
'marketplace.featured': 'مميز',
'marketplace.viewDetails': 'عرض التفاصيل',


// Product Details
'product.details': 'تفاصيل الحساب',
'product.price': 'السعر',
'product.level': 'المستوى',
'product.server': 'السيرفر',
'product.seller': 'البائع',
'product.description': 'الوصف',
'product.specifications': 'المواصفات',
'product.images': 'الصور',
'product.image': 'صورة',
'product.buyNow': 'اشترِ الآن',
'product.buy': 'شراء',
'product.addToCart': 'أضف إلى السلة',
'product.available': 'متاح',
'product.sold': 'تم البيع',
'product.unavailable': 'غير متاح',
'product.premiumAccount': 'حساب مميز',
'product.backToMarket': 'العودة إلى المتجر',
'product.sellerInfo': 'معلومات البائع',
'product.sellerRating': 'تقييم البائع',
'product.totalSales': 'إجمالي المبيعات',
'product.memberSince': 'عضو منذ',
'product.responseTime': 'سرعة الاستجابة',
'product.deliveryTime': 'مدة التسليم',
'product.viewProfile': 'عرض الملف الشخصي',
'product.reportListing': 'الإبلاغ عن هذا الإعلان',
'product.share': 'مشاركة',
'product.clickToEnlarge': 'اضغط لعرض الصورة بالحجم الكامل',
'product.swipeToNavigate': 'اسحب للتنقل بين الصور',
'product.previousImage': 'الصورة السابقة',
'product.nextImage': 'الصورة التالية',
'product.thumbnail': 'صورة مصغرة',
'product.billImages': 'صور الفواتير',
'product.billImagesInfo': 'ℹ️ يمكن الاطلاع على صور الفواتير بعد إتمام عملية الشراء.',
'product.stoveLevel': 'حجرة الاحتراق',
'product.helios': 'هيليوس',
'product.troops': 'عدد الجنود',
'product.personalPower': 'القوة الشخصية',
'product.heroPower': 'قوة البطل',
'product.island': 'الجزيرة',
'product.expertPower': 'قوة الخبير',
'product.heroTotalPower': 'قوة البطل الإجمالية',
'product.petPower': 'قوة الحيوانات',
'product.primaryEmailIncluded': 'يتضمن البريد الإلكتروني الأساسي',
'product.yes': 'نعم',
'product.no': 'لا',
'product.accountBindings': 'ربط الحساب',
'product.binding.apple': 'أبل',
'product.binding.google': 'قوقل',
'product.binding.facebook': 'فيسبوك',
'product.binding.gameCenter': 'قيم سنتر',
'product.bindingLinked': 'مربوط',
'product.bindingNotLinked': 'غير مربوط',
'product.invoiceFirst': 'أول فاتورة شراء',
'product.invoiceMultiple': 'ثلاث فواتير مختلفة',
'product.invoiceLast': 'آخر فاتورة شراء',
'product.invoiceAttached': 'مرفقة',
'product.verifiedSeller': 'بائع موثوق',
'product.accountOwnerNotice': 'هذا حسابك',
'product.manageMyListings': 'إدارة قوائمي',
'product.buyNowSecure': 'شراء الآن بأمان',
'product.loginToBuy': 'تسجيل الدخول للشراء',
'product.escrowProtection': 'محمي بنظام الضمان لمدة 12 ساعة',

    
// Checkout
'checkout.title': 'إتمام الشراء',
'checkout.subtitle': 'أكمل عملية الشراء بأمان عبر بوابة دفع آمنة.',
'checkout.description': 'أكمل عملية الشراء بأمان عبر بوابة دفع آمنة.',
'checkout.loginRequired': 'يجب تسجيل الدخول لإتمام عملية الشراء.',
'checkout.orderNotFound': 'لم يتم العثور على الطلب.',
'checkout.amountError': 'حدث خطأ في المبلغ، يرجى المحاولة مرة أخرى.',
'checkout.invalidOrder': 'الطلب غير صالح.',
'checkout.cannotBuyOwn': 'لا يمكنك شراء إعلانك الخاص.',
'checkout.paymentLinkError': 'فشل في إنشاء رابط الدفع.',
'checkout.orderSummary': 'ملخص الطلب',
'checkout.productDetails': 'تفاصيل المنتج',
'checkout.subtotal': 'المجموع الفرعي',
'checkout.serviceFee': 'رسوم الخدمة',
'checkout.total': 'الإجمالي الكلي',
'checkout.paymentMethod': 'طريقة الدفع',
'checkout.agreeToTerms': 'أوافق على الشروط والأحكام',
'checkout.confirmPurchase': 'تأكيد الشراء',
'checkout.processing': 'جارٍ المعالجة...',
'checkout.securePayment': 'دفع آمن عبر',
'checkout.buyerProtection': 'حماية المشتري لمدة 12 ساعة بعد الدفع.',
'checkout.deliveryInfo': 'معلومات التسليم',
'checkout.instantDelivery': 'يتم التسليم فور إتمام الدفع.',
'checkout.mustAgreeTerms': 'يرجى الموافقة على الشروط والأحكام قبل المتابعة.',
'checkout.deliveryTime': 'وقت التسليم',
'checkout.deliveryTimeDescription': 'التسليم فوري بعد إتمام الدفع. يتم تسليم بيانات الحساب مباشرة بعد تأكيد الدفع.',
'checkout.deliveryTimeLabel': 'التسليم فوري بعد الدفع',
'checkout.protectedByEscrow': 'محمي بنظام الضمان',
'checkout.escrowDescription': 'سيتم الاحتفاظ بالأموال في الضمان لمدة {hours} ساعة لضمان حمايتك.',
'checkout.backToListing': 'العودة إلى الإعلان',
'checkout.tapPayment': 'دفع آمن',
'checkout.recommended': 'موصى به',
'checkout.orderCompleted': 'تم إكمال الطلب',
'checkout.orderCancelled': 'تم إلغاء الطلب',
'checkout.orderDisputed': 'الطلب في نزاع',
'checkout.fullRefund': 'استرداد كامل خلال 12 ساعة',
'checkout.paylinkPayment': 'دفع Paylink',
'checkout.confirmPayment': 'تأكيد الدفع',
'checkout.paymentAlreadyInitiated': 'تم بدء عملية الدفع مسبقاً. جارٍ التوجيه إلى صفحة الدفع...',


// Orders
'orders.title': 'طلباتي',
'orders.subtitle': 'إدارة وتتبع جميع طلباتك.',
'orders.description': 'استعرض جميع عمليات الشراء والبيع الخاصة بك.',
'orders.loginRequired': 'يجب تسجيل الدخول لعرض الطلبات.',
'orders.searchPlaceholder': 'ابحث برقم الطلب أو اسم المنتج أو البائع...',
'orders.filterByRole': 'عرض الطلبات حسب:',
'orders.all': 'الكل',
'orders.total': 'الإجمالي',
'orders.asBuyer': 'كمشتري',
'orders.asSeller': 'كبائع',
'orders.inEscrow': 'قيد الضمان',
'orders.showOrders': 'عرض الطلبات',
'orders.status': 'الحالة',
'orders.pending': 'بانتظار الدفع',
'orders.statusPending': 'بانتظار الدفع',
'orders.paid': 'تم الدفع',
'orders.statusPaid': 'تم الدفع',
'orders.escrowHold': 'قيد الضمان',
'orders.statusEscrow': 'قيد الضمان',
'orders.completed': 'مكتمل',
'orders.statusCompleted': 'مكتمل',
'orders.cancelled': 'ملغي',
'orders.statusCancelled': 'ملغي',
'orders.disputed': 'قيد النزاع',
'orders.statusDisputed': 'قيد النزاع',
'orders.noOrders': 'لا توجد طلبات بعد.',
'orders.noOrdersDesc': 'لم تقم بأي عمليات شراء حتى الآن.',
'orders.noOrdersFilter': 'لا توجد طلبات تطابق الفلتر الحالي.',
'orders.browseMarket': 'تصفح المتجر',
'orders.viewDetails': 'عرض التفاصيل',
'orders.contactSeller': 'التواصل مع البائع',
'orders.openDispute': 'فتح نزاع',
'orders.viewDispute': 'عرض النزاع',
'orders.confirmReceipt': 'تأكيد الاستلام',
'orders.orderNumber': 'رقم الطلب',
'orders.date': 'التاريخ',
'orders.buyer': 'المشتري',
'orders.seller': 'البائع',
'orders.amount': 'المبلغ',
'orders.stats.total': 'إجمالي الطلبات',
'orders.stats.asBuyer': 'كمشتري',
'orders.stats.asSeller': 'كبائع',
'orders.stats.inEscrow': 'طلبات قيد الضمان',
'orders.stats.completed': 'طلبات مكتملة',
'orders.stats.cancelled': 'طلبات ملغاة',
'orders.deletedAccount': 'حساب محذوف',
'orders.activeWarrantyPeriod': 'فترة الضمان النشطة',
'orders.timeRemainingToCheck': 'الوقت المتبقي لفحص الحساب وتأكيد الاستلام',
'orders.timeFormat': 'ساعة:دقيقة:ثانية',


// Order Details
'order.title': 'تفاصيل الطلب',
'order.status': 'حالة الطلب',
'order.statusPending': 'بانتظار الدفع',
'order.statusPaid': 'تم الدفع',
'order.statusEscrow': 'قيد الضمان',
'order.statusCompleted': 'مكتمل',
'order.statusCancelled': 'ملغي',
'order.statusDisputed': 'قيد النزاع',
'order.confirmSuccess': 'تم تأكيد استلام المنتج بنجاح.',
'order.onlyBuyerCanConfirm': 'فقط المشتري يمكنه تأكيد الاستلام.',
'order.cannotConfirmStatus': 'لا يمكن تأكيد الطلب في حالته الحالية.',
'order.confirmError': 'حدث خطأ أثناء تأكيد الاستلام.',
'order.cancelSuccess': 'تم إلغاء الطلب بنجاح.',
'order.cannotCancelCompleted': 'لا يمكن إلغاء طلب مكتمل.',
'order.cancelError': 'فشل في إلغاء الطلب.',
'order.timeline': 'سير الطلب',
'order.productInfo': 'معلومات المنتج',
'order.accountDetails': 'تفاصيل الحساب',
'order.paymentInfo': 'بيانات الدفع',
'order.actions': 'الإجراءات',
'order.confirmDelivery': 'تأكيد استلام المنتج',
'order.openDispute': 'فتح نزاع',
'order.cancelOrder': 'إلغاء الطلب',
'order.contactSupport': 'التواصل مع الدعم الفني',
'order.downloadInvoice': 'تحميل الفاتورة',
'order.escrowPeriod': 'مدة الضمان',
'order.escrowEndsIn': 'ينتهي الضمان خلال',
'order.hours': 'ساعة',
'order.minutes': 'دقيقة',
'order.delivered': 'تم التسليم',
'order.deliveredAt': 'تاريخ التسليم:',
'order.billImagesTitle': 'صور الفواتير',
'order.deliveryDescription': 'وصف التسليم',

    
// Wallet
'wallet.title': 'المحفظة',
'wallet.balance': 'الرصيد المتاح',
'wallet.pending': 'قيد المعالجة',
'wallet.onHold': 'قيد الانتظار',
'wallet.total': 'إجمالي الرصيد',
'wallet.withdraw': 'سحب الأموال',
'wallet.withdrawDescription': 'أدخل تفاصيل السحب لإكمال العملية',
'wallet.withdrawnTotalLabel': 'إجمالي المسحوب',
'wallet.deposit': 'إيداع رصيد',
'wallet.transactions': 'سجل المعاملات',
'wallet.withdrawalHistory': 'سجل عمليات السحب',
'wallet.amount': 'المبلغ',
'wallet.enterAmount': 'أدخل المبلغ المطلوب',
'wallet.minimumWithdrawal': 'الحد الأدنى للسحب',
'wallet.bankAccount': 'الحساب البنكي',
'wallet.iban': 'الآيبان (IBAN)',
'wallet.bankName': 'اسم البنك',
'wallet.accountHolderName': 'اسم صاحب الحساب',
'wallet.bankNamePlaceholder': 'مثال: البنك الأهلي السعودي',
'wallet.accountHolderNamePlaceholder': 'اسم صاحب الحساب كما يظهر في البطاقة',
'wallet.enterBankName': 'يرجى إدخال اسم البنك',
'wallet.enterAccountHolderName': 'يرجى إدخال اسم صاحب الحساب',
'wallet.accountNumber': 'رقم الحساب البنكي',
'wallet.accountName': 'اسم صاحب الحساب',
'wallet.requestWithdrawal': 'طلب سحب',
'wallet.withdrawalRequested': 'تم إرسال طلب السحب بنجاح.',
'wallet.withdrawalPending': 'قيد المعالجة',
'wallet.withdrawalCompleted': 'تم تحويل المبلغ بنجاح.',
'wallet.withdrawalFailed': 'فشلت عملية السحب.',
'wallet.transactionType': 'نوع العملية',
'wallet.sale': 'عملية بيع',
'wallet.purchase': 'عملية شراء',
'wallet.withdrawal': 'سحب',
'wallet.refund': 'استرداد',
'wallet.fee': 'رسوم خدمة',
'wallet.noTransactions': 'لا توجد معاملات حتى الآن.',
'wallet.loginRequired': 'يجب تسجيل الدخول لعرض المحفظة.',
'wallet.cancelled': 'ملغي',
'wallet.processingTime': 'مدة المعالجة المتوقعة: من 1 إلى 4 أيام عمل.',
'wallet.withdrawSuccess': 'تم إرسال طلب السحب بنجاح.',
'wallet.hourlyLimitExceeded': 'تجاوزت الحد المسموح للسحب في الساعة. يرجى المحاولة لاحقًا.',
'wallet.dailyLimitExceeded': 'تجاوزت الحد اليومي للسحب ({limit}). المتبقي: ${remaining}.',
'wallet.withdrawError': 'حدث خطأ أثناء طلب السحب.',
'wallet.invalidIBAN': 'رقم الآيبان غير صحيح. يجب أن يبدأ بـ SA ويتكوّن من 24 خانة.',
'wallet.enterValidAmount': 'يرجى إدخال مبلغ صالح.',
'wallet.minWithdrawal': 'الحد الأدنى للسحب هو ${min}.',
'wallet.maxWithdrawal': 'الحد الأقصى للسحب هو ${max}.',
'wallet.exceedsBalance': 'المبلغ المطلوب يتجاوز رصيدك المتاح.',
'wallet.enterValidIBAN': 'يرجى إدخال رقم آيبان صحيح.',
'wallet.withdrawalHistorySubtitle': 'آخر {count} عملية سحب',
'wallet.amountPlaceholder': 'الحد الأدنى: ${amount}',
'wallet.withdrawalLimitsTitle': 'حدود السحب',
'wallet.withdrawalMin': '• الحد الأدنى: ${amount}',
'wallet.withdrawalMax': '• الحد الأقصى: ${amount} لكل عملية',
'wallet.withdrawalDaily': '• الحد اليومي: ${amount}',
'wallet.withdrawalFeeInfo': '• رسوم السحب: ${amount} لكل عملية',
'wallet.availableBalanceLabel': 'الرصيد المتاح: {amount}',
'wallet.requestedAmount': 'المبلغ المطلوب:',
'wallet.withdrawalFeeLabel': 'رسوم السحب:',
'wallet.netAmount': 'المبلغ الصافي:',
'wallet.bankAccountLabel': 'الحساب البنكي:',
'wallet.ibanHint': 'يجب أن يبدأ بـ SA ويتبعه 22 رقمًا.',
'wallet.continue': 'متابعة',
'wallet.noWithdrawals': 'لا توجد عمليات سحب بعد.',
'wallet.transferId': '🔖 معرف التحويل: {id}',
'wallet.failureReason': '❌ سبب الفشل: {reason}',
'wallet.confirmWithdrawalTitle': 'تأكيد طلب السحب',
'wallet.confirmReviewMessage': 'يرجى مراجعة تفاصيل السحب بعناية قبل التأكيد.',
'wallet.warningTitle': '⚠️ تنبيهات مهمة:',
'wallet.warningNoCancel': 'لا يمكن إلغاء الطلب بعد التأكيد.',
'wallet.warningProcessingTime': 'سيتم مراجعة طلبك من قبل الإدارة. قد تستغرق المعالجة من 1 إلى 4 أيام عمل بعد الموافقة.',
'wallet.warningCheckIban': 'تأكد من صحة رقم الحساب البنكي.',
'wallet.warningManualApproval': 'سيتم مراجعة طلب السحب من قبل الإدارة. سيتم إبلاغك عند الموافقة أو الرفض.',
'wallet.warningFeeDeducted': 'سيتم خصم الرسوم من المبلغ المسحوب.',
'wallet.platformNotResponsible': 'المنصة غير مسؤولة عن اي خطا بالمعلومات المدخلة من قبل المستخدم.',
'wallet.confirmWithdrawalButton': 'تأكيد السحب',


// Profile
'profile.title': 'الملف الشخصي',
'profile.publicProfile': 'الملف العام',
'profile.memberSince': 'عضو منذ',
'profile.memberSinceLabel': 'عضو منذ',
'profile.lastActive': 'آخر ظهور',
'profile.verified': 'موثّق',
'profile.notVerified': 'غير موثّق',
'profile.rating': 'التقييم العام',
'profile.totalSales': 'إجمالي المبيعات',
'profile.completedOrders': 'الطلبات المكتملة',
'profile.totalPurchases': 'إجمالي المشتريات',
'profile.activeListings': 'الإعلانات النشطة',
'profile.responseRate': 'معدل الاستجابة',
'profile.deliveryTime': 'مدة التسليم',
'profile.editProfile': 'تعديل الملف الشخصي',
'profile.viewReviews': 'عرض التقييمات',
'profile.accountSettings': 'إعدادات الحساب',
'profile.security': 'الأمان والحماية',
'profile.verifyAccount': 'توثيق الحساب',
'profile.accountVerification': 'توثيق الحساب',
'profile.about': 'نبذة',
'profile.noReviews': 'لا توجد تقييمات بعد.',
'profile.availableBalance': 'الرصيد المتاح',
'profile.recentActivity': 'النشاط الأخير',
'profile.noRecentActivity': 'لا يوجد نشاط حديث حتى الآن.',
'profile.myListings': 'إعلاناتي',
'profile.manageListings': 'إدارة الإعلانات',
'profile.requiredForSelling': 'مطلوب للبيع على المنصة',
'profile.viewMyListings': 'عرض إعلاناتي',
'profile.discordConnected': 'تم ربط حساب Discord بنجاح!',
'profile.startVerification': 'ابدأ التوثيق',
'profile.accountActions': 'إجراءات الحساب',
'profile.reviewsCount': 'تقييم',
'profile.reviewsWithCount': '({count} تقييم)',
'profile.statsError': 'فشل تحميل الإحصائيات.',
'profile.activityError': 'فشل تحميل النشاط.',
'profile.refreshActivity': 'تحديث النشاط',
'profile.viewWallet': 'عرض المحفظة',
'profile.securityAndPrivacy': 'الأمان والخصوصية',
'profile.minutesAgo': 'منذ دقائق',
'profile.hoursAgo': 'منذ {hours} ساعة',
'profile.oneDayAgo': 'منذ يوم واحد',
'profile.daysAgo': 'منذ {days} يوم',
'profile.statsRefreshed': 'تم تحديث الإحصائيات.',
'profile.activityRefreshed': 'تم تحديث النشاط.',
'profile.loginRequired': 'يجب تسجيل الدخول لعرض الملف الشخصي.',
'profile.verifiedAccount': 'حساب موثّق',
'profile.requiresKYC': 'يتطلب توثيق الهوية (KYC)',
'profile.accountStats': 'إحصاءات الحساب',
'profile.refreshStats': 'تحديث الإحصائيات',
'profile.refresh': 'تحديث',
'profile.seoTitle': 'الملف الشخصي',
'profile.seoDescription': 'عرض ملف {name} على NXOLand: التقييمات، النشاط الأخير، والإعدادات.',
'profile.pageTitle': 'الملف الشخصي',
'profile.manageInfo': 'إدارة معلومات الحساب والإعدادات الشخصية.',
'profile.totalRevenue': 'إجمالي الأرباح',
'profile.editProfileLink': 'تعديل الملف الشخصي',
'profile.resendVerificationEmail': 'إعادة إرسال رسالة التحقق',
'profile.verificationEmailSent': 'تم إرسال رسالة التحقق إلى بريدك الإلكتروني',
'profile.verificationEmailError': 'فشل إرسال رسالة التحقق',


// Edit Profile
'editProfile.title': 'تعديل الملف الشخصي',
'editProfile.pageDescription': 'قم بتحديث معلوماتك الشخصية وإعدادات حسابك على NXOLand.',
'editProfile.skipToForm': 'الانتقال إلى نموذج التعديل',
'editProfile.personalInfo': 'المعلومات الشخصية',
'editProfile.name': 'اسم المستخدم',
'editProfile.email': 'البريد الإلكتروني',
'editProfile.phone': 'رقم الجوال',
'editProfile.bio': 'نبذة عنك',
'editProfile.avatar': 'الصورة الشخصية',
'editProfile.changeAvatar': 'تغيير الصورة',
'editProfile.saveChanges': 'حفظ التغييرات',
'editProfile.saving': 'جارٍ الحفظ...',
'editProfile.updateSuccess': 'تم تحديث الملف الشخصي بنجاح.',
'editProfile.updateError': 'فشل في تحديث الملف الشخصي.',
'editProfile.avatarUpdateSuccess': 'تم تحديث الصورة الشخصية بنجاح.',
'editProfile.avatarUpdateError': 'تعذر تحديث الصورة الشخصية.',
'editProfile.avatarPreview': 'معاينة الصورة الشخصية',
'editProfile.selectImage': 'اختر صورة',
'editProfile.upload': 'رفع الصورة',
'editProfile.uploading': 'جارٍ الرفع...',
'editProfile.invalidImageType': 'يرجى اختيار ملف صورة صالح (JPG أو PNG أو GIF).',
'editProfile.imageTooLarge': 'حجم الصورة كبير جدًا (الحد الأقصى 5 ميجابايت).',
'editProfile.avatarHint': 'يُقبل فقط JPG، PNG، أو GIF (حتى 5 ميجابايت).',
'editProfile.nameRequired': 'يرجى إدخال الاسم.',
'editProfile.nameMinLength': 'الاسم يجب ألا يقل عن 3 أحرف.',
'editProfile.nameTooLong': 'الاسم طويل جدًا (الحد الأقصى 100 حرف).',
'editProfile.emailRequired': 'يرجى إدخال البريد الإلكتروني.',
'editProfile.invalidEmail': 'البريد الإلكتروني غير صالح.',
'editProfile.backToProfile': 'العودة إلى الملف الشخصي',
'editProfile.pageTitle': 'تعديل الملف الشخصي',
'editProfile.updateInfo': 'قم بتحديث معلوماتك الشخصية.',

    
// Security
'security.title': 'الأمان',
'security.changePassword': 'تغيير كلمة المرور',
'security.currentPassword': 'كلمة المرور الحالية',
'security.newPassword': 'كلمة المرور الجديدة',
'security.confirmNewPassword': 'تأكيد كلمة المرور الجديدة',
'security.updatePassword': 'تحديث كلمة المرور',
'security.passwordUpdated': 'تم تحديث كلمة المرور.',
'security.passwordUpdateSuccess': 'تم تغيير كلمة المرور بنجاح.',
'security.passwordUpdateError': 'حدث خطأ أثناء تحديث كلمة المرور.',
'security.currentPasswordRequired': 'يرجى إدخال كلمة المرور الحالية.',
'security.newPasswordTooShort': 'كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف.',
'security.passwordsNotMatch': 'كلمتا المرور غير متطابقتين.',
'security.newPasswordTooWeak': 'كلمة المرور ضعيفة. استخدم مزيجًا من الأحرف والأرقام والرموز.',
'security.invalidCurrentPassword': 'كلمة المرور الحالية غير صحيحة.',
'security.tooManyAttempts': 'عدد كبير من المحاولات الفاشلة. حاول مرة أخرى بعد {minutes} دقيقة.',
'security.attemptsRemaining': 'المحاولات المتبقية:',
'security.veryWeak': 'ضعيفة جدًا',
'security.weak': 'ضعيفة',
'security.medium': 'متوسطة',
'security.strong': 'قوية',
'security.veryStrong': 'قوية جدًا',
'security.passwordWeakMix': 'كلمة المرور ضعيفة. استخدم أحرفًا كبيرة وصغيرة مع أرقام ورموز خاصة.',
'security.needUppercase': 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z).',
'security.needLowercase': 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل (a-z).',
'security.needNumber': 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل.',
'security.needSymbol': 'يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل (!@#$%...).',
'security.twoFactor': 'المصادقة الثنائية',
'security.enable2FA': 'تفعيل المصادقة الثنائية',
'security.disable2FA': 'تعطيل المصادقة الثنائية',
'security.loginHistory': 'سجل تسجيل الدخول',
'security.activeSessions': 'الأجهزة المتصلة حاليًا',
'security.logoutAll': 'تسجيل الخروج من جميع الأجهزة',
'security.changePasswordConfirm': 'هل أنت متأكد أنك تريد تغيير كلمة المرور؟',
'security.securityWarning': '⚠️ تنبيه أمني:',
'security.logoutOtherDevices': '• سيتم تسجيل الخروج تلقائيًا من جميع الأجهزة الأخرى.',
'security.needRelogin': '• ستحتاج إلى تسجيل الدخول مرة أخرى على الأجهزة الأخرى.',
'security.emailNotification': '• سيتم إرسال إشعار بالتغيير إلى بريدك الإلكتروني.',
'security.updating': 'جارٍ التحديث...',
'security.confirmChange': 'تأكيد التغيير',
'security.twoFactorComingSoon': 'المصادقة الثنائية (قريبًا)',
'security.twoFactorDesc': 'طبقة أمان إضافية لحماية حسابك.',
'security.privacyComingSoon': 'الخصوصية (قريبًا)',
'security.privacyDesc': 'إدارة إعدادات الخصوصية والوصول إلى بياناتك.',
'security.emailNotificationsSetting': 'إشعارات البريد الإلكتروني',
'security.receiveEmailUpdates': 'تلقي التحديثات عبر البريد الإلكتروني.',
'security.loginAlerts': 'تنبيهات تسجيل الدخول',
'security.newLoginNotification': 'إشعار عند كل تسجيل دخول جديد.',
'security.backToProfile': 'العودة إلى الملف الشخصي',
'security.securityAndPrivacy': 'الأمان والخصوصية',
'security.manageSettings': 'إدارة إعدادات الأمان والخصوصية لحسابك.',
'security.passwordSection': 'إدارة كلمة المرور',
'security.changeYourPassword': 'تغيير كلمة المرور الخاصة بك.',
'security.currentPasswordLabel': 'كلمة المرور الحالية',
'security.newPasswordLabel': 'كلمة المرور الجديدة',
'security.confirmPasswordLabel': 'تأكيد كلمة المرور',
'security.confirmPasswordChange': 'تأكيد تغيير كلمة المرور',
'security.activeSessionsComingSoon': 'الأجهزة المتصلة (قريبًا)',
'security.manageDevices': 'إدارة الأجهزة المسجلة',
'security.currentDevice': 'الجهاز الحالي',
'security.activeNow': 'نشط الآن',
'security.lastActivityNow': 'آخر نشاط: الآن',


// KYC
'kyc.title': 'التحقق من الهوية',
'kyc.subtitle': 'أكمل عملية التحقق من هويتك لزيادة حدود السحب والحماية.',
'kyc.status': 'حالة التحقق',
'kyc.notStarted': 'لم يبدأ بعد',
'kyc.pending': 'قيد المراجعة',
'kyc.verified': 'تم التوثيق',
'kyc.rejected': 'مرفوض',
'kyc.failed': 'فشل التحقق',
'kyc.expired': 'انتهت صلاحيته',
'kyc.startVerification': 'ابدأ التحقق',
'kyc.resubmit': 'إعادة التقديم',
'kyc.identityVerification': 'التحقق من الهوية',
'kyc.requiredForSale': '⚠️ مطلوب للبيع',
'kyc.requiredDescription': 'يجب إكمال التحقق من الهوية (KYC) قبل أن تتمكن من إضافة أي إعلان.',
'kyc.verifiedTitle': 'تم التحقق من هويتك',
'kyc.verifiedDescription': 'شكلاً، تم حفظ KYC في النظام ولن تحتاج إلى إكماله مرة أخرى ما دمت مُوثقاً.',
'kyc.personaTitle': 'التحقق من الهوية - Persona',
'kyc.personaDescription': 'سنستخدم نظام Persona المعتمد عالمياً للتحقق من هويتك بشكل آمن وسريع.',
'kyc.personaStepsTitle': 'خطوات التحقق عبر Persona',
'kyc.personaStep1': 'التقط صورة لهويتك الوطنية أو الإقامة',
'kyc.personaStep2': 'التقط صورة سيلفي للتحقق',
'kyc.personaStep3': 'التحقق يتم تلقائياً في دقائق',
'kyc.secureTitle': 'آمن ومشفر',
'kyc.secureDescription': 'Persona منصة موثوقة عالمياً وتؤمن بياناتك طوال العملية.',
'kyc.verificationSubmitted': 'شكراً، سيتم تحديث حالة التحقق خلال دقائق',
'kyc.privacyTitle': 'حماية الخصوصية والأمان',
'kyc.privacyDescription': 'جميع معلوماتك الشخصية محمية ومشفرة. نستخدم Persona المعتمد للتحقق من الهوية ولن يتم مشاركة بياناتك مع أي طرف ثالث.',
'kyc.benefits': 'مزايا التوثيق',
'kyc.benefit1': 'رفع حد السحب إلى 10,000 دولار.',
'kyc.benefit2': 'شارة التوثيق تظهر في ملفك الشخصي.',
'kyc.benefit3': 'زيادة ثقة المشترين والبائعين.',
'kyc.benefit4': 'أولوية في دعم العملاء.',
'kyc.requiredDocs': 'المستندات المطلوبة',
'kyc.nationalId': 'بطاقة الهوية الوطنية',
'kyc.proofOfAddress': 'إثبات العنوان (فاتورة أو مستند رسمي)',
'kyc.selfie': 'صورة شخصية للتحقق',


// My Listings
'listings.title': 'إعلاناتي',
'listings.subtitle': 'إدارة جميع إعلاناتك النشطة أو السابقة.',
'listings.createNew': 'إضافة إعلان جديد',
'listings.active': 'نشط',
'listings.pending': 'قيد المراجعة',
'listings.sold': 'تم البيع',
'listings.rejected': 'مرفوض',
'listings.draft': 'مسودة',
'listings.noListings': 'لا توجد إعلانات حتى الآن.',
'listings.createFirst': 'أنشئ أول إعلان لك الآن.',
'listings.edit': 'تعديل الإعلان',
'listings.delete': 'حذف الإعلان',
'listings.view': 'عرض الإعلان',
'listings.promote': 'ترويج الإعلان',
'listings.views': 'عدد المشاهدات',
'listings.inquiries': 'عدد الاستفسارات',
'listings.deleteConfirm': 'هل أنت متأكد من رغبتك في حذف هذا الإعلان؟',


// Disputes
'disputes.title': 'النزاعات',
'disputes.subtitle': 'إدارة النزاعات والشكاوى المتعلقة بالطلبات.',
'disputes.openDispute': 'فتح نزاع جديد',
'disputes.myDisputes': 'نزاعاتي',
'disputes.status': 'الحالة',
'disputes.open': 'مفتوح',
'disputes.inReview': 'قيد المراجعة',
'disputes.resolved': 'تم الحل',
'disputes.closed': 'مغلق',
'disputes.orderNumber': 'رقم الطلب',
'disputes.reason': 'سبب النزاع',
'disputes.description': 'شرح المشكلة',
'disputes.evidence': 'الملفات الداعمة',
'disputes.uploadEvidence': 'رفع دليل أو لقطة شاشة',
'disputes.submitDispute': 'تقديم النزاع',
'disputes.noDisputes': 'لا توجد نزاعات حالياً.',
'disputes.viewDetails': 'عرض تفاصيل النزاع',
'disputes.adminResponse': 'رد فريق المنصة',
'disputes.resolution': 'قرار الإدارة النهائي',
'disputes.responseTimes': 'أوقات الاستجابة والمعالجة',
'disputes.responseTime': 'نرد على الشكاوى خلال 24 ساعة',
'disputes.processingTime': 'نعالج الشكاوى خلال 48-72 ساعة',
'disputes.openNew': 'فتح نزاع جديد',
'disputes.createDescription': 'املأ النموذج أدناه لفتح نزاع على طلب في حالة الضمان',
'disputes.discordRequired': 'يجب ربط حساب Discord',
'disputes.discordRequiredDesc': 'يجب ربط حساب Discord قبل فتح النزاع. سيتم إنشاء قناة خاصة على Discord لمتابعة النزاع.',
'disputes.connectDiscord': 'ربط Discord',
'disputes.createSuccess': 'تم إنشاء النزاع بنجاح',
'disputes.createError': 'فشل إنشاء النزاع',
'disputes.processing': 'جاري المعالجة...',
'disputes.submit': 'إرسال النزاع',

    
// Dispute Details
'disputeDetails.title': 'تفاصيل النزاع',
'disputeDetails.description': 'عرض تفاصيل النزاع والحل المقترح.',
'disputeDetails.backToDisputes': 'العودة إلى صفحة النزاعات',
'disputeDetails.loadError': 'حدث خطأ أثناء تحميل تفاصيل النزاع.',
'disputeDetails.backToList': 'العودة إلى القائمة السابقة',
'disputeDetails.disputeOn': 'نزاع متعلق بالطلب رقم',
'disputeDetails.details': 'تفاصيل النزاع',
'disputeDetails.descriptionLabel': 'الوصف',
'disputeDetails.reporter': 'مقدم البلاغ',
'disputeDetails.buyer': 'المشتري',
'disputeDetails.seller': 'البائع',
'disputeDetails.createdAt': 'تاريخ الإنشاء',
'disputeDetails.notSpecified': 'غير محدد',
'disputeDetails.orderInfo': 'معلومات الطلب',
'disputeDetails.orderNumber': 'رقم الطلب',
'disputeDetails.amount': 'المبلغ',
'disputeDetails.orderStatus': 'حالة الطلب',
'disputeDetails.resolutionTitle': 'نتيجة النزاع',
'disputeDetails.resolvedAt': 'تاريخ الحل:',
'disputeDetails.underReviewMessage': 'النزاع قيد المراجعة حاليًا. سيتم التواصل معك خلال 24 إلى 48 ساعة.',
'disputeDetails.cancelDispute': 'إلغاء النزاع',
'disputeDetails.cancelTitle': 'تأكيد الإلغاء',
'disputeDetails.cancelConfirm': 'هل ترغب بالتأكيد في إلغاء هذا النزاع؟',
'disputeDetails.cancelWarning1': 'سيُعاد الطلب إلى حالة الضمان، ويمكنك متابعة المعاملة بشكل طبيعي.',
'disputeDetails.cancelWarning2': '⚠️ بعد الإلغاء، لا يمكن إعادة فتح النزاع.',
'disputeDetails.cancelButton': 'تراجع',
'disputeDetails.confirmCancel': 'تأكيد الإلغاء',
'disputeDetails.cancelling': 'جارٍ الإلغاء...',
'disputeDetails.cancelSuccess': 'تم إلغاء النزاع بنجاح.',
'disputeDetails.cancelError': 'فشل في إلغاء النزاع. حاول مرة أخرى.',
'disputeDetails.loginRequired': 'يجب تسجيل الدخول لعرض تفاصيل النزاع.',
'disputeDetails.loginButton': 'تسجيل الدخول',


// Notifications
'notifications.title': 'الإشعارات',
'notifications.markAllRead': 'تعليم الكل كمقروء',
'notifications.deleteAll': 'حذف جميع الإشعارات',
'notifications.noNotifications': 'لا توجد إشعارات حالياً.',
'notifications.empty': 'لا توجد إشعارات جديدة.',
'notifications.viewAll': 'عرض جميع الإشعارات',
'notifications.viewAllNotifications': 'عرض كل الإشعارات',
'notifications.unreadCount': '{count} إشعار غير مقروء',
'notifications.newOrder': 'طلب جديد',
'notifications.orderUpdate': 'تحديث على الطلب',
'notifications.disputeOpened': 'تم فتح نزاع جديد',
'notifications.disputeResolved': 'تم حل النزاع بنجاح',
'notifications.paymentReceived': 'تم استلام الدفعة',
'notifications.withdrawalCompleted': 'تم تنفيذ السحب',
'notifications.newReview': 'تقييم جديد على حسابك',
'notifications.kycUpdate': 'تحديث في حالة التحقق من الهوية',
'notifications.pageTitle': 'الإشعارات',
'notifications.clearAll': 'مسح الكل',
'notifications.typeFilter': 'تصفية حسب النوع',
'notifications.allTypes': 'جميع الأنواع',
'notifications.orderType': 'طلبات',
'notifications.disputeType': 'نزاعات',
'notifications.messageType': 'رسائل',
'notifications.systemType': 'النظام',
'notifications.noNotificationsTitle': 'لا توجد إشعارات حالياً',


// Members & Leaderboard
'members.title': 'الأعضاء',
'members.subtitle': 'تصفح قائمة تضم {count} عضوًا على المنصة.',
'members.description': 'تعرّف على أعضاء NXOLand واستكشف أبرز البائعين والمشترين.',
'members.searchMembers': 'ابحث عن عضو...',
'members.searchPlaceholder': 'اكتب اسم العضو للبحث...',
'members.searchLabel': 'بحث في قائمة الأعضاء',
'members.skipToMembers': 'انتقال إلى قائمة الأعضاء',
'members.topSellers': 'أفضل البائعين',
'members.topBuyers': 'أفضل المشترين',
'members.newMembers': 'الأعضاء الجدد',
'members.filterByRole': 'تصفية حسب نوع العضو',
'members.role': 'الدور',
'members.sellers': 'البائعون',
'members.buyers': 'المشترون',
'members.filterByRating': 'تصفية حسب التقييم',
'members.rating': 'التقييم',
'members.allRatings': 'جميع التقييمات',
'members.5stars': '5 نجوم',
'members.4plusStars': '4 نجوم فأكثر',
'members.noResults': 'لم يتم العثور على نتائج للبحث "{query}"',
'members.noMembers': 'لا يوجد أعضاء حالياً.',
'members.trustedMember': 'عضو موثوق',
'members.memberSince': 'عضو منذ {date}',
'members.viewProfile': 'عرض الملف الشخصي',
'members.profile': 'الملف الشخصي',
'members.aboutMember': 'نبذة عن العضو',
'members.listings': 'إعلانات العضو',
'members.sales': 'المبيعات',
'members.memberInfo': 'معلومات العضو',
'members.joinDate': 'تاريخ الانضمام',
'members.totalListings': 'عدد الإعلانات الإجمالي',

'leaderboard.title': 'لوحة المتصدرين',
'leaderboard.subtitle': 'عرض أبرز البائعين والمشترين على المنصة.',
'leaderboard.description': 'تعرّف على أكثر الأعضاء نشاطًا في NXOLand بناءً على المبيعات والتقييمات.',
'leaderboard.navDescription': 'أفضل البائعين والمشترين',
'leaderboard.skipToLeaderboard': 'الانتقال إلى لوحة المتصدرين',
'leaderboard.rank': 'الترتيب',
'leaderboard.member': 'العضو',
'leaderboard.sales': 'إجمالي المبيعات',
'leaderboard.rating': 'التقييم',
'leaderboard.topSeller': '#1 البائع الأول',
'leaderboard.gold': 'ذهبي',
'leaderboard.silver': 'فضي',
'leaderboard.bronze': 'برونزي',
'leaderboard.deals': 'صفقة ناجحة',
'leaderboard.fullRanking': 'عرض الترتيب الكامل',
'leaderboard.loadError': 'حدث خطأ أثناء تحميل البيانات.',
'leaderboard.tryAgain': 'أعد المحاولة',
'leaderboard.noData': 'لا توجد بيانات متاحة حالياً.',

    
// Suggestions
'suggestions.title': 'مركز الاقتراحات والتقييمات',
'suggestions.subtitle': 'شارك أفكارك وقيّم تجربتك على المنصة.',
'suggestions.platformRating': 'قيّم تجربتك معنا',
'suggestions.yourRating': 'تقييمك للمنصة',
'suggestions.yourFeedback': 'شاركنا رأيك وتجربتك',
'suggestions.submitRating': 'إرسال التقييم',
'suggestions.newSuggestion': 'إضافة اقتراح جديد لتطوير المنصة',
'suggestions.suggestionTitle': 'عنوان الاقتراح',
'suggestions.suggestionDesc': 'صف اقتراحك بشكل واضح ومفصل...',
'suggestions.submitSuggestion': 'إرسال الاقتراح',
'suggestions.upvote': 'تصويت إيجابي',
'suggestions.downvote': 'تصويت سلبي',
'suggestions.votes': 'صوت',
'suggestions.platformRatingSubtitle': 'رأيك يهمنا - ساعدنا في تحسين تجربة المستخدمين',
'suggestions.totalReviewsCount': '{count} تقييم',
'suggestions.positiveRatings': '{percentage}% تقييمات إيجابية',
'suggestions.ratingFeedback5': 'ممتاز! 🎉',
'suggestions.ratingFeedback4': 'جيد جدًا 👍',
'suggestions.ratingFeedback3': 'جيد ✓',
'suggestions.ratingFeedback2': 'يحتاج تحسين',
'suggestions.ratingFeedback1': 'ضعيف',
'suggestions.feedbackFieldLabel': 'أخبرنا عن تجربتك',
'suggestions.feedbackHint': '(10 أحرف على الأقل)',
'suggestions.feedbackPlaceholder': 'ما هي الميزات التي أعجبتك؟ وما الذي يمكننا تحسينه؟',
'suggestions.statusUpdated': 'تم تحديث حالة الاقتراح بنجاح',
'suggestions.statusUpdateError': 'فشل تحديث حالة الاقتراح',
'suggestions.deleteSuccess': 'تم حذف الاقتراح بنجاح',
'suggestions.deleteError': 'فشل حذف الاقتراح',
'suggestions.characterCount': '{count} / {max} حرف',
'suggestions.charactersRemaining': '{count} حرف متبقٍ',
'suggestions.ready': 'جاهز',
'suggestions.suggestionPlaceholder': 'عنوان الاقتراح',
'suggestions.descriptionPlaceholder': 'وصف الاقتراح بالتفصيل...',
'suggestions.anonymousUser': 'مستخدم',
'suggestions.commentCount': '{count} تعليق',
'suggestions.voteUpAria': 'تصويت إيجابي',
'suggestions.voteDownAria': 'تصويت سلبي',
'suggestions.invalidLink': 'رابط غير صالح',
'suggestions.status.pending': 'قيد المراجعة',
'suggestions.status.approved': 'مقبول',
'suggestions.status.implemented': 'تم التنفيذ',
'suggestions.voteError': 'حدث خطأ أثناء التصويت. حاول مرة أخرى.',
'suggestions.loginToVote': 'يجب تسجيل الدخول للتصويت.',
'suggestions.createSuccess': 'تم إرسال اقتراحك بنجاح.',
'suggestions.createError': 'فشل في إرسال الاقتراح. حاول لاحقًا.',
'suggestions.loginToSuggest': 'يرجى تسجيل الدخول لإضافة اقتراح.',
'suggestions.securityVerification': 'يرجى إكمال التحقق الأمني.',
'suggestions.fillAllFields': 'يرجى ملء جميع الحقول المطلوبة.',
'suggestions.reviewSuccess': 'شكرًا لمشاركتك! تم إرسال تقييمك بنجاح.',
'suggestions.reviewError': 'حدث خطأ أثناء إرسال التقييم.',
'suggestions.loginToReview': 'يجب تسجيل الدخول لتقييم المنصة.',
'suggestions.selectRating': 'يرجى اختيار التقييم.',
'suggestions.minReviewLength': 'يرجى كتابة تعليق لا يقل عن 10 أحرف.',
'suggestions.avgRating': 'متوسط التقييم',
'suggestions.totalReviews': 'إجمالي التقييمات',
'suggestions.topSuggestions': 'الاقتراحات الأعلى تصويتًا',
'suggestions.recentSuggestions': 'الاقتراحات الأحدث',
'suggestions.all': 'الكل',
'suggestions.pending': 'قيد المراجعة',
'suggestions.approved': 'مقبول',
'suggestions.implemented': 'تم التنفيذ',
'suggestions.submitting': 'جارٍ الإرسال...',
'suggestions.pageSubtitle': 'شارك تقييمك واقتراحاتك لتطوير المنصة.',
'suggestions.shareIdeas': 'شاركنا أفكارك لإضافة ميزات أو تحسينات جديدة.',
'suggestions.noSuggestionsInCategory': 'لا توجد اقتراحات في هذه الفئة حالياً.',


// My Listings
'myListings.title': 'إعلاناتي',
'myListings.subtitle': 'إدارة جميع حساباتك المعروضة للبيع.',
'myListings.loginRequired': 'يجب تسجيل الدخول لعرض إعلاناتك.',
'myListings.loginButton': 'تسجيل الدخول',
'myListings.addAccount': 'إضافة حساب جديد',
'myListings.createNew': 'إنشاء إعلان جديد',
'myListings.all': 'الكل',
'myListings.active': 'نشط',
'myListings.inactive': 'غير نشط',
'myListings.sold': 'مباع',
'myListings.totalListings': 'إجمالي الإعلانات',
'myListings.noListings': 'لا توجد إعلانات حتى الآن.',
'myListings.noListingsMessage': 'ابدأ بإنشاء إعلانك الأول الآن.',
'myListings.getStarted': 'ابدأ البيع',
'myListings.edit': 'تعديل',
'myListings.delete': 'حذف',
'myListings.view': 'عرض',
'myListings.cancel': 'إلغاء',
'myListings.confirm': 'تأكيد',
'myListings.markAsSold': 'تحديد كمباع',
'myListings.reactivate': 'إعادة تفعيل',
'myListings.deactivate': 'إيقاف مؤقت',
'myListings.deleteConfirm': 'هل أنت متأكد؟',
'myListings.deleteMessage': 'سيتم حذف هذا الإعلان بشكل دائم.',
'myListings.soldConfirm': 'تأكيد البيع؟',
'myListings.soldMessage': 'هل ترغب بتحديد هذا الإعلان كمباع؟ سيتم إخفاؤه من المتجر العام.',
'myListings.deleteSuccess': 'تم حذف الإعلان بنجاح.',
'myListings.deleteError': 'فشل حذف الإعلان.',
'myListings.hasActiveOrders': 'لا يمكن حذف الإعلان لوجود طلبات نشطة عليه.',
'myListings.updateSuccess': 'تم تحديث حالة الإعلان بنجاح.',
'myListings.updateError': 'فشل تحديث الإعلان.',
'myListings.stats': 'الإحصائيات',
'myListings.views': 'عدد المشاهدات',
'myListings.price': 'السعر',
'myListings.status': 'الحالة',
'myListings.actions': 'الإجراءات',
'myListings.createdAt': 'تاريخ الإنشاء',
'myListings.previous': 'السابق',
'myListings.next': 'التالي',
'myListings.page': 'صفحة',
'myListings.of': 'من',
'myListings.emptyStateTitle': 'لا توجد إعلانات',
'myListings.emptyStateMessage': 'ابدأ بإضافة حسابك الأول للبيع على المنصة.',
'myListings.addNewAccount': 'إضافة حساب جديد',
'myListings.noListingsForFilter': 'لا توجد إعلانات مطابقة للفلتر الحالي.',
'myListings.viewCount': 'عدد المشاهدات',
'myListings.deleteTitle': 'تأكيد الحذف',
'myListings.deleteDescription': 'هل ترغب في حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.',
'myListings.soldTitle': 'تأكيد البيع',
'myListings.soldDescription': 'هل تم بيع هذا الحساب؟ سيتم تحديث الحالة إلى "مباع" وإخفاؤه من الواجهة العامة.',
'myListings.confirmSale': 'تأكيد البيع',


// Admin
'admin.dashboard': 'لوحة التحكم',
'admin.users': 'المستخدمون',
'admin.listings': 'الإعلانات',
'admin.orders': 'الطلبات',
'admin.disputes': 'النزاعات',
'admin.notifications': 'الإشعارات',
'admin.settings': 'الإعدادات العامة',
'admin.legalContent': 'المحتوى القانوني',
'admin.stats': 'الإحصاءات',
'admin.activity': 'النشاط الأخير',
'admin.totalUsers': 'إجمالي المستخدمين',
'admin.activeListings': 'الإعلانات النشطة',
'admin.pendingOrders': 'الطلبات المعلقة',
'admin.openDisputes': 'النزاعات المفتوحة',
'admin.revenue': 'الإيرادات',
'admin.actions': 'إجراءات',
'admin.ban': 'حظر المستخدم',
'admin.unban': 'إلغاء الحظر',
'admin.verify': 'توثيق الحساب',
'admin.reject': 'رفض الطلب',
'admin.approve': 'الموافقة',
'admin.viewDetails': 'عرض التفاصيل',
'admin.sendNotification': 'إرسال إشعار',
'admin.broadcastMessage': 'رسالة عامة للمستخدمين',
'admin.reviews': 'التقييمات',
'admin.financial': 'التقارير المالية',
'admin.activityLogs': 'سجل النشاط',
'admin.totalRevenue': 'إجمالي الإيرادات',
'admin.pendingWithdrawals': 'طلبات السحب المعلقة',
'admin.transactions': 'المعاملات المالية',
'admin.filter': 'تصفية النتائج',
'admin.exportData': 'تصدير البيانات',
'admin.refresh': 'تحديث البيانات',
'admin.loading': 'جارٍ التحميل...',
'admin.withdrawals': 'طلبات السحب',
'admin.withdrawalsSubtitle': 'مراجعة وموافقة طلبات السحب من المستخدمين',
'admin.allStatuses': 'جميع الحالات',
'admin.pending': 'قيد الانتظار',
'admin.processing': 'قيد المعالجة',
'admin.completed': 'مكتمل',
'admin.failed': 'فشل',
'admin.cancelled': 'ملغي',
'admin.noWithdrawals': 'لا توجد طلبات سحب',
'admin.searchByNameOrEmail': 'البحث بالاسم أو البريد الإلكتروني',
'admin.withdrawalDetails': 'تفاصيل طلب السحب',
'admin.amount': 'المبلغ',
'admin.status': 'الحالة',
'admin.user': 'المستخدم',
'admin.iban': 'IBAN / رقم الحساب',
'admin.bankName': 'اسم البنك',
'admin.accountHolderName': 'اسم صاحب الحساب',
'admin.requestDate': 'تاريخ الطلب',
'admin.processedDate': 'تاريخ المعالجة',
'admin.transferId': 'معرف التحويل',
'admin.failureReason': 'سبب الفشل',
'admin.confirmApprove': 'تأكيد الموافقة',
'admin.confirmApproveMessage': 'سيتم بدء عملية التحويل. تأكد من صحة تفاصيل الحساب البنكي.',
'admin.approveWarning': 'سيتم تحويل الأموال خلال 1-4 أيام عمل.',
'admin.rejectWithdrawal': 'رفض طلب السحب',
'admin.rejectMessage': 'سيتم رفض طلب السحب وإعادة المبلغ إلى رصيد المستخدم.',
'admin.rejectReason': 'سبب الرفض',
'admin.rejectReasonRequired': 'يرجى إدخال سبب الرفض',
'admin.rejectReasonPlaceholder': 'أدخل سبب رفض طلب السحب...',
'admin.rejectReasonHint': 'سيتم إبلاغ المستخدم بهذا السبب.',
'admin.rejectWarning': 'سيتم إعادة المبلغ إلى رصيد المستخدم المتاح.',
'admin.confirmReject': 'تأكيد الرفض',
'admin.withdrawalApproved': 'تمت الموافقة على طلب السحب بنجاح',
'admin.withdrawalApproveError': 'فشل الموافقة على طلب السحب',
'admin.withdrawalRejected': 'تم رفض طلب السحب بنجاح',
'admin.withdrawalRejectError': 'فشل رفض طلب السحب',
'admin.orderBreakdown': 'تفاصيل الطلبات المساهمة',
'admin.item': 'عنصر',
'admin.total': 'الإجمالي',
'admin.order': 'طلب',


// Help & Support
'help.title': 'مركز المساعدة',
'help.description': 'إجابات شاملة لجميع أسئلتك حول استخدام المنصة.',
'help.subtitle': 'تعرّف على كيفية الشراء، البيع، والسحب بأمان عبر NXOLand.',
'help.skipToContent': 'الانتقال إلى المحتوى',
'help.faq': 'الأسئلة الشائعة',
'help.faqTitle': 'الأسئلة الأكثر تكرارًا',
'help.contactSupport': 'التواصل مع الدعم الفني',
'help.contactUs': 'تواصل معنا',
'help.contactMessage': 'هل تحتاج إلى مساعدة؟ فريقنا متاح عبر Discord للرد على استفساراتك.',
'help.discordJoin': 'انضم إلى Discord',
'help.discordSupport': 'قناة الدعم الرسمية — متوفرة على مدار الساعة.',
'help.discordMessage': '💬 يمكنك طرح أسئلتك وفتح تذاكر الدعم عبر سيرفر Discord الرسمي.',
'help.improvementTitle': 'شاركنا اقتراحاتك',
'help.improvementMessage': 'رأيك يهمنا! ساهم في تحسين المنصة من خلال اقتراحاتك وتجربتك.',
'help.ratePlatform': 'قيّم المنصة وشارك اقتراحك',
'help.footerCopyright': '© 2025 NXOLand. جميع الحقوق محفوظة.',
'help.searchHelp': 'ابحث عن إجابة...',
'help.popularTopics': 'المواضيع الشائعة',
'help.gettingStarted': 'البدء على المنصة',
'help.buyingGuide': 'دليل الشراء الآمن',
'help.sellingGuide': 'دليل البيع خطوة بخطوة',
'help.accountSecurity': 'أمان الحساب والإجراءات الوقائية',
'help.paymentsAndFees': 'الدفع والرسوم',
'help.faq1Q': 'كيف أشتري حسابًا؟',
'help.faq1A': 'تصفح المتجر، اختر الحساب المناسب، ثم اضغط "شراء" وأكمل الدفع. يتم تسليم الحساب خلال 12 ساعة.',
'help.faq2Q': 'هل عملية الدفع آمنة؟',
'help.faq2A': 'نعم، نستخدم بوابة دفع موثوقة ومشفرة بالكامل. جميع العمليات محمية.',
'help.faq3Q': 'كم تستغرق عملية التسليم؟',
'help.faq3A': 'بعد الدفع مباشرة، يتم تسليم الحساب تلقائيًا، وتتاح لك 12 ساعة لمراجعته وتأكيد الاستلام.',
'help.faq4Q': 'ماذا أفعل إذا كان الحساب غير مطابق للوصف؟',
'help.faq4A': 'يمكنك فتح نزاع خلال فترة الضمان (12 ساعة). سيتولى فريقنا مراجعة الحالة واتخاذ القرار المناسب.',
'help.faq5Q': 'ما هي رسوم المنصة؟',
'help.faq5A': 'تُفرض عمولة 5٪ على كل عملية بيع. وتشمل الرسوم نظام الضمان والدعم الفني وخدمات الحماية.',
'help.faq6Q': 'كيف أسحب أرباحي؟',
'help.faq6A': 'اذهب إلى المحفظة، اختر "سحب"، أدخل رقم الآيبان، وقدّم الطلب. يتم التحويل خلال 1 إلى 4 أيام عمل.',
'help.email': 'البريد الإلكتروني',
'help.whatsapp': 'واتساب',
'help.liveChat': 'المحادثة الفورية',
'help.discordLiveChat': 'المحادثة الفورية عبر Discord',
'help.responseTimes': 'أوقات الاستجابة والمعالجة',
'help.responseTime': 'نرد على الشكاوى خلال 24 ساعة',
'help.processingTime': 'نعالج الشكاوى خلال 48-72 ساعة',

    
// About
'about.title': 'عن المنصّة',
'about.description': 'تعرّف على NXOLand ورؤيتنا لتقديم منصة آمنة لتداول الحسابات الرقمية.',
'about.subtitle': 'NXOLand — رؤيتنا وقيمنا وهدفنا في توفير تجربة تداول آمنة وشفافة.',
'about.skipToContent': 'الانتقال إلى المحتوى',
'about.ourMission': 'مهمّتنا',
'about.vision': 'رؤيتنا',
'about.visionText': 'نسعى لأن نكون المنصّة الأولى والأكثر ثقة في الشرق الأوسط لتداول الحسابات الرقمية، مع توفير بيئة آمنة وموثوقة للبائعين والمشترين.',
'about.ourValues': 'قيمنا',
'about.security': 'الأمان والحماية',
'about.securityDesc': 'حماية شاملة للمعاملات عبر نظام ضمان ذكي.',
'about.speed': 'السرعة والكفاءة',
'about.speedDesc': 'عمليات سريعة وتسليم فوري لبيانات الحساب.',
'about.trust': 'الثقة والشفافية',
'about.trustDesc': 'نرسّخ الثقة بالوضوح والمصداقية في كل خطوة.',
'about.story': 'قصّتنا',
'about.storyPara1': 'بدأت NXOLand بفكرة بسيطة: منصّة آمنة وموثوقة لتداول حسابات الألعاب في الشرق الأوسط، تضمن حقوق البائع والمشتري معًا.',
'about.storyPara2': 'ومع نمو عالم الألعاب والمنصّات الرقمية، صار تداول الحسابات جزءًا من تجربة اللاعب، لكن كثيرًا من المنصّات تفتقر للحماية والدعم الكافيين.',
'about.storyPara3': 'لذلك أنشأنا NXOLand: مزيج من الأمان والسرعة والشفافية؛ نظامنا يحمي الطرفين من أول خطوة حتى إتمام الصفقة.',
'about.howItWorks': 'كيف تعمل المنصّة',
'about.buyerSteps': 'خطوات المشتري',
'about.buyerStep1Title': 'تصفّح الحسابات',
'about.buyerStep1Desc': 'ابحث عن الحساب المناسب من المتجر وحدّد تفضيلاتك.',
'about.buyerStep2Title': 'الطلب والدفع',
'about.buyerStep2Desc': 'قدّم الطلب وادفع بأمان عبر المنصّة.',
'about.buyerStep3Title': 'استلام البيانات',
'about.buyerStep3Desc': 'تستلم بيانات الحساب مباشرة بعد موافقة البائع.',
'about.buyerStep4Title': 'التأكيد',
'about.buyerStep4Desc': 'راجع الحساب ثم أكّد الاستلام لإكمال الصفقة.',
'about.sellerSteps': 'خطوات البائع',
'about.sellerStep1Title': 'إنشاء إعلان',
'about.sellerStep1Desc': 'أضف تفاصيل الحساب والسعر المقترح.',
'about.sellerStep2Title': 'استقبال الطلبات',
'about.sellerStep2Desc': 'تصلُك الطلبات وتراجع التفاصيل قبل التسليم.',
'about.sellerStep3Title': 'تسليم الحساب',
'about.sellerStep3Desc': 'أرسل بيانات الحساب عبر المنصّة بشكل آمن.',
'about.sellerStep4Title': 'استلام المبلغ',
'about.sellerStep4Desc': 'يُحوَّل المبلغ بعد تأكيد المشتري الاستلام.',
'about.activeUsers': 'مستخدم نشط',
'about.successfulDeals': 'صفقة ناجحة',
'about.satisfactionRate': 'معدّل الرضا',
'about.team': 'الفريق',
'about.contact': 'تواصل معنا',
'about.support': 'الدعم الفنّي',
'about.contactInfo': 'معلومات التواصل',
'about.commercialRegistration': 'السجل التجاري',
'about.email': 'البريد الإلكتروني',
'about.whatsapp': 'واتساب',
'about.liveChat': 'المحادثة الفورية',
'about.discordLiveChat': 'المحادثة الفورية عبر Discord',
'about.responseTimes': 'أوقات الاستجابة والمعالجة',
'about.responseTime': 'نرد على الشكاوى خلال 24 ساعة',
'about.processingTime': 'نعالج الشكاوى خلال 48-72 ساعة',
'common.copyright': '© 2025 NXOLand. جميع الحقوق محفوظة.',

// Error Messages
'error.404': 'الصفحة غير موجودة',
'error.404.desc': 'عذرًا، الصفحة التي تبحث عنها غير متاحة.',
'error.500': 'خطأ في الخادم',
'error.500.desc': 'حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.',
'error.networkError': 'خطأ في الاتصال بالشبكة',
'error.tryAgain': 'أعد المحاولة',
'error.goHome': 'العودة إلى الصفحة الرئيسية',
'error.forbidden': 'غير مُصرّح بالوصول',
'error.unauthorized': 'يجب تسجيل الدخول أولًا',
'error.sessionExpired': 'انتهت الجلسة. يرجى تسجيل الدخول مجددًا.',

// Status Messages
'status.loading': 'جارٍ التحميل...',
'status.saving': 'جارٍ الحفظ...',
'status.uploading': 'جارٍ الرفع...',
'status.processing': 'جارٍ المعالجة...',
'status.success': 'تم بنجاح',
'status.failed': 'فشل',
'status.pending': 'قيد المعالجة',
'status.completed': 'مكتمل',
'status.cancelled': 'ملغي',

// Maintenance
'maintenance.title': 'وضع الصيانة',
'maintenance.description': 'نعمل على تحسين الموقع لخدمتكم بشكل أفضل',
'maintenance.descriptionDetail': 'NXOLand هي منصة آمنة لشراء وبيع حسابات الألعاب الرقمية مع نظام ضمان متكامل. نحن نعمل حالياً على تحديثات مهمة لتحسين تجربتك.',
'maintenance.discordButton': 'انضم إلى Discord للحصول على آخر التحديثات',
'maintenance.discordAriaLabel': 'انضم إلى Discord',
'maintenance.statusMessage': 'سيتم إعادة فتح الموقع قريباً. شكراً لصبركم!',

// Common additions
'common.verified': 'موثق',

// NotFound
'notFound.browseMarketplace': 'تصفح المتجر',
'notFound.youMightBeLookingFor': 'ربما تبحث عن:',
'notFound.links.marketplace': 'المتجر الرقمي',
'notFound.links.members': 'الأعضاء',
'notFound.links.help': 'مركز المساعدة',

// Refund Policy
'refundPolicy.title': 'سياسة الاسترداد والإرجاع',
'refundPolicy.emptyState': 'لا توجد سياسة استرداد متاحة حاليًا',
'refundPolicy.lastUpdated': 'آخر تحديث:',

// Privacy
'privacy.title': 'سياسة الخصوصية',
'privacy.emptyState': 'لا توجد سياسة خصوصية متاحة حاليًا',
'privacy.lastUpdated': 'آخر تحديث:',

// Terms
'terms.title': 'الشروط والأحكام',
'terms.emptyState': 'لا توجد شروط وأحكام متاحة حاليًا',
'terms.lastUpdated': 'آخر تحديث:',

// Suggestions
'suggestions.confirmDelete': 'هل أنت متأكد من حذف هذا الاقتراح؟',
'suggestions.markAsImplemented': 'تم التنفيذ',
'suggestions.delete': 'حذف',

// Sell Social
'sell.social.comingSoon': 'قريباً',
'sell.social.comingSoonDescription': 'نعمل على إضافة هذه الميزة قريباً',
'sell.social.goBack': 'العودة',

// Order
'order.revealAccountInfo': 'اضغط "عرض" للكشف عن معلومات الحساب',
'order.waitingBuyerConfirmation': 'في انتظار تأكيد المشتري',
'order.escrowHoldMessage': 'الأموال محتجزة وسيتم تحويلها بعد تأكيد المشتري',

// Disputes
'disputes.status.open': 'مفتوح',
'disputes.status.underReview': 'قيد المراجعة',
'disputes.status.resolved': 'تم الحل',
'disputes.status.closed': 'مغلق',
'disputes.party.buyer': 'مشتري',
'disputes.party.seller': 'بائع',
'disputes.selectOrder': 'اختر الطلب',
'disputes.orderLabel': 'طلب',
'disputes.account': 'حساب',
'disputes.reasonPlaceholder': 'مثال: الحساب لا يعمل',
'disputes.descriptionPlaceholder': 'وصف تفصيلي للمشكلة...',
'disputes.fillAllFields': 'يرجى ملء جميع الحقول',
'disputes.orderNotFound': 'الطلب غير موجود',
'disputes.onlyEscrowOrders': 'يمكن إنشاء النزاع فقط للطلبات في حالة الضمان',
'disputes.disputeExists': 'يوجد نزاع بالفعل لهذا الطلب',

// Admin Financial
'admin.financial.totalRevenue': 'إجمالي الإيرادات',
'admin.financial.commissionsCollected': 'العمولات المحصلة',
'admin.financial.pendingPayments': 'المدفوعات المعلقة',
'admin.financial.totalWithdrawals': 'المسحوبات',
'admin.financial.title': 'التقارير المالية',
'admin.financial.subtitle': 'إدارة ومراقبة العمليات المالية',
'admin.financial.selectPeriod': 'تحديد الفترة',
'admin.financial.exportReport': 'تصدير التقرير',
'admin.financial.recentTransactions': 'المعاملات الأخيرة',
'admin.financial.noTransactions': 'لا توجد معاملات',
'admin.financial.tableHeaders.id': 'المعرف',
'admin.financial.tableHeaders.type': 'النوع',
'admin.financial.tableHeaders.amount': 'المبلغ',
'admin.financial.tableHeaders.details': 'التفاصيل',
'admin.financial.tableHeaders.date': 'التاريخ',
'admin.financial.tableHeaders.status': 'الحالة',
'admin.financial.transactionTypes.order': 'طلب',
'admin.financial.transactionTypes.withdrawal': 'سحب',
'admin.financial.transactionTypes.refund': 'استرداد',
'admin.financial.statuses.completed': 'مكتمل',
'admin.financial.statuses.pending': 'قيد الانتظار',
'admin.financial.statuses.processing': 'قيد المعالجة',
'admin.financial.statuses.escrowHold': 'في الضمان',
'admin.financial.statuses.failed': 'فشل',
'admin.financial.statuses.cancelled': 'ملغي',
'admin.financial.details.order': 'رقم الطلب:',
'admin.financial.details.seller': 'البائع:',
'admin.financial.details.buyer': 'المشتري:',
'admin.financial.details.user': 'المستخدم:',

// Admin Reviews
'admin.reviews.title': 'إدارة المراجعات',
'admin.reviews.subtitle': 'مراجعة والموافقة على تقييمات المستخدمين',
'admin.reviews.searchPlaceholder': 'البحث في المراجعات...',
'admin.reviews.filters.allStatus': 'جميع الحالات',
'admin.reviews.filters.approved': 'معتمدة',
'admin.reviews.filters.flagged': 'مبلغ عنها',
'admin.reviews.filters.allRatings': 'جميع التقييمات',
'admin.reviews.filters.stars': 'نجوم',
'admin.reviews.actions.search': 'بحث',
'admin.reviews.actions.approve': 'قبول المراجعة',
'admin.reviews.actions.delete': 'حذف المراجعة',
'admin.reviews.actions.viewDetails': 'عرض التفاصيل',
'admin.reviews.actions.loadMore': 'تحميل المزيد',
'admin.reviews.status.approved': 'معتمدة',
'admin.reviews.status.flagged': 'مبلغ عنها',
'admin.reviews.labels.noReviews': 'لا توجد مراجعات',
'admin.reviews.labels.reviewFor': 'مراجعة لـ:',
'admin.reviews.labels.product': 'المنتج:',
'admin.reviews.labels.helpful': 'مفيد:',
'admin.reviews.users': 'مستخدم',
'admin.reviews.labels.reports': 'بلاغات',
'admin.reviews.labels.anonymous': 'مستخدم مجهول',
'admin.reviews.comingSoon.removeReports': 'قريباً: إزالة البلاغات',
'admin.reviews.comingSoon.deleteReview': 'قريباً: حذف المراجعة',
'admin.reviews.comingSoon.viewDetails': 'قريباً: عرض التفاصيل',
'admin.reviews.comingSoon.pagination': 'قريباً: التصفح',

// Admin Notifications
'admin.notifications.types.order': 'طلب',
'admin.notifications.types.dispute': 'نزاع',
'admin.notifications.types.message': 'رسالة',
'admin.notifications.types.system': 'نظام',
'admin.notifications.types.announcement': 'إعلان',
'admin.notifications.filters.all': 'الجميع',
'admin.notifications.filters.buyers': 'المشترين',
'admin.notifications.filters.sellers': 'البائعين',

// Admin Orders
'admin.orders.status.completed': 'مكتمل',
'admin.orders.status.escrowHold': 'في الضمان',
'admin.orders.status.paid': 'مدفوع',
'admin.orders.status.pending': 'قيد الانتظار',
'admin.orders.status.cancelled': 'ملغي',
'admin.orders.status.disputed': 'نزاع',
'admin.orders.cancelledBy': 'تم الإلغاء بواسطة:',
'admin.orders.cancelledBy.admin': 'الإدارة',
'admin.orders.cancelledBy.user': 'المستخدم',
'admin.orders.dispute.status.open': 'مفتوح',
'admin.orders.dispute.status.resolved': 'محلول',
'admin.orders.dispute.status.closed': 'مغلق',
'admin.orders.actions.delete': 'حذف',
'admin.orders.amount': 'المبلغ',
'admin.orders.paymentStatus': 'حالة الدفع',
'admin.orders.paymentId': 'معرف الدفع',
'admin.orders.paymentStatus.paid': 'مدفوع',
'admin.orders.paymentStatus.pending': 'قيد الانتظار',
'admin.orders.paymentStatus.unspecified': 'غير محدد',
'admin.orders.timeline': 'الجدول الزمني',
'admin.orders.createdAt': 'تاريخ الإنشاء:',
'admin.orders.updatedAt': 'آخر تحديث:',
'admin.orders.cancelledAt': 'تاريخ الإلغاء:',
'admin.orders.cancellationReason': 'سبب الإلغاء',
'admin.orders.activeDispute': 'نزاع نشط',
'admin.orders.disputeStatus': 'الحالة:',
'admin.orders.cancelSuccess': 'تم إلغاء الطلب وإرجاع المبلغ للمشتري',
'admin.orders.cancelReasonRequired': 'يرجى إدخال سبب الإلغاء',
'admin.orders.cancelWarning': '⚠️ سيتم إلغاء الطلب وإرجاع المبلغ إلى محفظة المشتري تلقائياً',

// Admin Users
'admin.users.status.deleted': 'محذوف',
'admin.users.status.active': 'نشط',
'admin.users.verifiedTooltip': 'موثق',
'admin.users.role.admin': 'مدير',
'admin.users.role.user': 'مستخدم',
'admin.users.actions.delete': 'حذف',
'admin.users.title': 'إدارة المستخدمين',
'admin.users.subtitle': 'عرض وإدارة جميع مستخدمي المنصة',
'admin.users.userCount': 'مستخدم',
'admin.users.noUsers': 'لا يوجد مستخدمين',
'admin.users.noUsersSearch': ' مطابقين للبحث',
'admin.users.verifiedByEmail': 'موثق بالبريد',
'admin.users.kycVerified': 'KYC موثق',
'admin.users.userId': 'معرف المستخدم:',
'admin.users.role': 'الدور:',
'admin.users.deleteUser': 'حذف المستخدم',
'admin.users.confirmDelete': 'تأكيد الحذف',
'admin.users.confirmDeleteMessage': 'هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.',
'admin.users.deleteSuccess': 'تم حذف المستخدم بنجاح',
'admin.users.deleteError': 'فشل حذف المستخدم',
'admin.users.userDetails': 'معلومات تفصيلية عن المستخدم',

// Admin Listings
'admin.listings.status.active': 'نشط',
'admin.listings.status.sold': 'مباع',
'admin.listings.status.inactive': 'غير نشط',
'admin.listings.actions.delete': 'حذف',
'admin.listings.deleteSuccess': 'تم حذف الإعلان',
'admin.listings.deleteError': 'فشل حذف الإعلان',
'admin.listings.deleteListing': 'حذف الإعلان',
'admin.listings.confirmDelete': 'تأكيد حذف الإعلان',
'admin.listings.confirmDeleteMessage': 'هل أنت متأكد من حذف هذا الإعلان؟ هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات المتعلقة بالإعلان.',

// Admin Legal Content
'admin.legalContent.edit': 'تحرير',
'admin.legalContent.preview': 'معاينة',

// Profile Edit
'profile.edit.fullNameAriaLabel': 'الاسم الكامل',
'profile.edit.emailAriaLabel': 'البريد الإلكتروني',
'profile.edit.phoneAriaLabel': 'رقم الهاتف',

// Error Boundary
'errorBoundary.retryAriaLabel': 'إعادة المحاولة',
'errorBoundary.backToHomeAriaLabel': 'العودة للصفحة الرئيسية',

// TikTok OAuth
'tiktok.connected': 'تم الاتصال بحساب TikTok: @{username}',
'tiktok.connectError': 'يرجى الاتصال بحساب TikTok أولاً',
'tiktok.connectTitle': 'الاتصال بـ TikTok',
'tiktok.connectDescription': 'اتصل بحسابك للتحقق من الملكية',
'tiktok.connectButton': 'اتصل بـ TikTok',
'tiktok.privacyNote': '🔒 سنستخدم TikTok فقط للتحقق من ملكية الحساب. لن نقوم بالنشر أو الوصول إلى أي شيء آخر.',
'tiktok.sellAccount': 'بيع حساب TikTok',
'tiktok.connectedAs': 'متصل بـ {name}',
'tiktok.verifyOwnership': 'تأكيد ملكية الحساب',
'tiktok.addCodeToBio': 'أضف هذا الكود إلى البايو الخاص بك',
'tiktok.steps': 'الخطوات:',
'tiktok.step1': 'انسخ الكود أعلاه',
'tiktok.step2': 'افتح TikTok',
'tiktok.step3': 'انتقل إلى ملفك الشخصي',
'tiktok.step4': 'اضغط "تعديل الملف الشخصي"',
'tiktok.step5': 'الصق الكود في البايو',
'tiktok.step6': 'احفظ التغييرات',
'tiktok.step7': 'ارجع هنا واضغط "تحقق"',
'tiktok.verifying': 'جاري التحقق...',
'tiktok.verifyNow': 'أضفت الكود - تحقق الآن',
'tiktok.verifiedSuccess': '✅ تم التحقق بنجاح!',
'tiktok.bioVerified': '✅ تم التحقق من البايو بنجاح!',
'tiktok.verificationFailed': 'فشل التحقق',
'tiktok.pleaseVerifyBio': 'يرجى التحقق من البايو أولاً',
'tiktok.copied': 'تم النسخ!',
'tiktok.codeCopied': 'تم نسخ كود التحقق',
'tiktok.continue': 'متابعة',

// Social Product Example
'socialProduct.home': 'الرئيسية',
'socialProduct.marketplace': 'السوق',
'socialProduct.accountDetails': 'تفاصيل الحساب',
'socialProduct.availableNow': 'متاح الآن',
'socialProduct.verifiedSeller': 'بائع موثوق',
'socialProduct.sales': 'عملية بيع',
'socialProduct.rating': 'التقييم',
'socialProduct.member': 'عضو منذ',
'socialProduct.withPrimaryEmail': 'مع البريد الإلكتروني الأساسي',
'socialProduct.yes': 'نعم',
'socialProduct.no': 'لا',
'socialProduct.accountLinkedToPhone': 'الحساب مرتبط برقم هاتف',
'socialProduct.description': 'الوصف',
'socialProduct.buyNow': 'شراء الآن',
'socialProduct.contactSeller': 'تواصل مع البائع',
'socialProduct.sellerReviews': 'تقييمات البائع',

// Admin Activity
'admin.activity.title': 'سجل النشاطات',
'admin.activity.subtitle': 'تتبع جميع إجراءات المسؤولين والمشرفين',
'admin.activity.searchPlaceholder': 'البحث في السجل...',
'admin.activity.allActivities': 'جميع النشاطات',
'admin.activity.users': 'المستخدمين',
'admin.activity.listings': 'الإعلانات',
'admin.activity.orders': 'الطلبات',
'admin.activity.disputes': 'النزاعات',
'admin.activity.settings': 'الإعدادات',
'admin.activity.search': 'بحث',
'admin.activity.severity': 'أهمية',
'admin.activity.severityHigh': 'عالية',
'admin.activity.severityMedium': 'متوسطة',
'admin.activity.severityLow': 'منخفضة',
'admin.activity.admin': 'المسؤول:',
'admin.activity.target': 'الهدف:',
'admin.activity.time': 'الوقت:',

// Admin Disputes
'admin.disputes.title': 'إدارة النزاعات',
'admin.disputes.subtitle': 'مراجعة وحل النزاعات بين المستخدمين',
'admin.disputes.disputeCount': 'نزاع',
'admin.disputes.searchPlaceholder': 'البحث عن نزاع...',
'admin.disputes.search': 'بحث',
'admin.disputes.noDisputes': 'لا توجد نزاعات لعرضها',
'admin.disputes.noMatchingDisputes': 'لا توجد نزاعات مطابقة للبحث',
'admin.disputes.disputeNumber': 'نزاع رقم #{id}',
'admin.disputes.statusOpen': 'مفتوح',
'admin.disputes.statusResolved': 'محلول',
'admin.disputes.statusClosed': 'مغلق',
'admin.disputes.inFavorOfBuyer': 'لصالح المشتري',
'admin.disputes.inFavorOfSeller': 'لصالح البائع',
'admin.disputes.order': 'الطلب:',
'admin.disputes.reporter': 'المُبلغ:',
'admin.disputes.reported': 'المُبلغ عنه:',
'admin.disputes.reason': 'السبب:',
'admin.disputes.viewDetails': 'عرض التفاصيل',
'admin.disputes.resolveForBuyer': 'لصالح المشتري',
'admin.disputes.resolveForSeller': 'لصالح البائع',
'admin.disputes.disputeDetails': 'تفاصيل النزاع',
'admin.disputes.orderInfo': 'معلومات الطلب',
'admin.disputes.orderNumber': 'رقم الطلب:',
'admin.disputes.product': 'المنتج:',
'admin.disputes.price': 'السعر:',
'admin.disputes.reporterLabel': 'المُبلِّغ',
'admin.disputes.reportedLabel': 'المُبلَّغ عنه',
'admin.disputes.notSpecified': 'غير محدد',
'admin.disputes.disputeReason': 'سبب النزاع',
'admin.disputes.timeline': 'الجدول الزمني',
'admin.disputes.reportDate': 'تاريخ الإبلاغ:',
'admin.disputes.resolveDate': 'تاريخ الحل:',
'admin.disputes.resolutionInfo': 'معلومات الحل',
'admin.disputes.resolvedInFavorOf': 'تم الحل لصالح:',
'admin.disputes.adminNotes': 'ملاحظات الإدارة:',
'admin.disputes.resolvedBy': 'تم الحل بواسطة:',
'admin.disputes.resolveForBuyerButton': 'حل لصالح المشتري',
'admin.disputes.resolveForSellerButton': 'حل لصالح البائع',
'admin.disputes.resolveTitle': 'حل النزاع لصالح {party}',
'admin.disputes.adminNotesLabel': 'ملاحظات الإدارة',
'admin.disputes.adminNotesPlaceholder': 'اكتب ملاحظات توضح سبب الحل...',
'admin.disputes.resolutionNote': 'ℹ️ سيتم حل النزاع وإخطار الطرفين بالقرار',
'admin.disputes.resolving': 'جاري الحل...',
'admin.disputes.confirmResolve': 'تأكيد الحل',
'admin.disputes.addNotesRequired': 'يرجى إضافة ملاحظات للحل',
'admin.disputes.resolveSuccess': 'تم حل النزاع بنجاح',
'admin.disputes.resolveError': 'فشل حل النزاع',
'admin.disputes.resolutionNoteAuto': 'تم الحل لصالح {party} من قبل الإدارة',

// Reviews Page (duplicate removed - already exists earlier)
'reviews.subtitle': 'آراء المشترين السابقين',
'reviews.basedOn': 'بناءً على {count} تقييم',
'reviews.positiveReviews': 'تقييمات إيجابية',
'reviews.all': 'الكل',
'reviews.sortRecent': 'الأحدث',
'reviews.sortHelpful': 'الأكثر فائدة',
'reviews.sortRatingHigh': 'التقييم: الأعلى',
'reviews.sortRatingLow': 'التقييم: الأدنى',
'reviews.sortRatingHighFirst': 'التقييم: الأعلى أولاً',
'reviews.sortRatingLowFirst': 'التقييم: الأدنى أولاً',
'reviews.loadError': 'فشل تحميل التقييمات',
'reviews.previous': 'السابق',
'reviews.next': 'التالي',
'reviews.noReviewsInCategory': 'لا توجد تقييمات في هذه الفئة',
'reviews.reportTitle': 'إبلاغ عن تقييم غير لائق',
'reviews.reportDescription': 'اختر سبب الإبلاغ عن هذا التقييم. سيتم مراجعة البلاغ من قبل فريق المشرفين.',
'reviews.reportSpam': 'محتوى غير مرغوب (spam)',
'reviews.reportOffensive': 'محتوى مسيء أو غير لائق',
'reviews.reportFake': 'تقييم مزيف أو ملفق',
'reviews.reportIrrelevant': 'غير متعلق بالمنتج أو الخدمة',
'reviews.reportOther': 'سبب آخر',
'reviews.reportOtherPlaceholder': 'يرجى توضيح السبب... (10 أحرف على الأقل)',
'reviews.reportSending': 'جاري الإرسال...',
'reviews.reportSubmit': 'إرسال الإبلاغ',
'reviews.reportSelectReason': 'يرجى اختيار سبب الإبلاغ',
'reviews.reportClarifyReason': 'يرجى توضيح السبب (10 أحرف على الأقل)',
'reviews.reportSuccess': 'تم الإبلاغ عن التقييم بنجاح',
'reviews.reportAlreadyReported': 'لقد قمت بالإبلاغ عن هذا التقييم من قبل',
'reviews.reportError': 'فشل الإبلاغ عن التقييم',
'reviews.editTitle': 'تعديل التقييم',
'reviews.editDescription': 'قم بتحديث تقييمك وتعليقك',
'reviews.deleteTitle': 'حذف التقييم',
'reviews.deleteDescription': 'هل أنت متأكد من حذف هذا التقييم؟ هذا الإجراء لا يمكن التراجع عنه.\n\nسيتم حذف التقييم نهائياً من المنصة ولن تتمكن من استعادته.',
'reviews.deleteConfirm': 'حذف التقييم',
'reviews.deleting': 'جاري الحذف...',
'reviews.deleteSuccess': 'تم حذف التقييم بنجاح',
'reviews.deleteError': 'فشل حذف التقييم',
'reviews.updateError': 'فشل تحديث التقييم',
'reviews.markHelpfulError': 'فشل تحديث التقييم',

  },
  en: {
// Common
'common.backToHome': 'Back to Home',
'common.pageNotFound': 'Page Not Found',
'common.pageNotFoundDesc': 'Sorry, the page you are looking for does not exist or has been moved.',
'common.and': 'and',
'common.notSpecified': 'Not specified',

// Navbar
'nav.home': 'Home',
'nav.marketplace': 'Marketplace',
'nav.sell': 'Sell Account',
'nav.orders': 'My Orders',
'nav.wallet': 'Wallet',
'nav.profile': 'Profile',
'nav.admin': 'Admin Panel',
'nav.members': 'Members',
'nav.leaderboard': 'Leaderboard',
'nav.help': 'Help Center',
'nav.disputes': 'Disputes',
'nav.myListings': 'My Listings',
'nav.kyc': 'Identity Verification',
    'admin.kyc.title': 'KYC Management',
    'admin.kyc.subtitle': 'Review every identity verification request submitted on the platform.',
'nav.notifications': 'Notifications',
'nav.settings': 'Settings',
'nav.logout': 'Log Out',
'nav.login': 'Log In',
'nav.suggestions': 'Suggestions & Feedback',
'nav.community': 'Community',
'nav.myAccount': 'My Account',
'nav.signIn': 'Sign In',
'nav.openMenu': 'Open Menu',
'nav.menu': 'Menu',
'nav.closeMenu': 'Close Menu',
'nav.close': 'Close',
'nav.navigationLinks': 'Navigation Links',
'nav.termsAndConditions': 'Terms & Conditions',
'nav.privacyPolicy': 'Privacy Policy',
'nav.refundPolicy': 'Refund Policy',
'nav.membersDescription': 'Browse all members',
'nav.suggestionsDescription': 'Share your ideas to improve the platform',
'nav.homeAriaLabel': 'Return to the homepage',


// Home
'home.hero.title': 'NXOLand — Your Trusted Platform for Game Account Trading',
'home.hero.subtitle': 'Buy and sell game accounts easily, safely, and instantly with our smart escrow system.',
'home.hero.browseAccounts': 'Browse Accounts',
'home.hero.learnMore': 'Learn More',

'home.badge': 'Welcome to NXOLand 👋',
'home.whyChoose': 'Why Choose NXOLand?',

'home.feature1.title': 'Secure Escrow System',
'home.feature1.desc': 'Every trade is fully protected to ensure both buyer and seller stay safe from start to finish.',

'home.feature2.title': '24/7 Discord Support',
'home.feature2.desc': 'Our support team is available around the clock on Discord to assist you anytime.',

'home.feature3.title': 'Fair & Competitive Pricing',
'home.feature3.desc': 'Enjoy smooth trading with transparent prices and low service fees.',

'home.feature4.title': 'Instant Payouts',
'home.feature4.desc': 'Sellers receive funds instantly after the buyer confirms account delivery.',

'home.howItWorks': 'How It Works',
'home.howPlatformWorks': 'How the Platform Works',
'home.howDoesItWork': 'How Does It Work?',
'home.howItWorksSubtitle': 'Three simple steps for a secure purchase',

'home.step1.title': 'Find the Right Account',
'home.step1.desc': 'Browse thousands of verified listings filtered by game, price, and level.',

'home.step2.title': 'Pay Securely',
'home.step2.desc': 'Complete your payment through Tap — a trusted, fully encrypted gateway.',

'home.step3.title': 'Receive Instantly',
'home.step3.desc': 'Once your payment is confirmed, account details are delivered instantly.',

'home.cta.title': 'Start Trading with Confidence',
'home.cta.subtitle': 'Join thousands of gamers who trust NXOLand for secure, seamless trades.',
'home.cta.getStarted': 'Get Started',

// Landing Discord CTAs
'landing.discord.heroCta': 'Join our Discord community',
'landing.discord.sectionTitle': 'Join the NXOLand community',
'landing.discord.sectionSubtitle': 'Get support, updates, and trade insights directly from our team and other players.',
'landing.discord.bulletSupport': 'Quick support and Q&A',
'landing.discord.bulletUpdates': 'Announcements and platform updates',
'landing.discord.bulletSafety': 'Trade tips and account safety guidance',
'landing.discord.joinButton': 'Join Discord',

'home.footer.rights': '© All rights reserved to NXOLand',
'home.footer.terms': 'Terms & Conditions',
'home.footer.privacy': 'Privacy Policy',
'home.footer.refund': 'Refund Policy',
'home.footer.support': 'Support',
'home.footer.suggestions': 'Suggestions',
'home.footer.commercialRegistration': 'Commercial Registration',
'home.footer.quickLinks': 'Quick Links',
'home.footer.contact': 'Contact Us',
'home.footer.discordLiveChat': 'Live Chat via Discord',


// Sell
'sell.title': 'Choose a Game',
'sell.subtitle': 'Select the game you want to sell accounts for.',
'sell.comingSoon': 'More games coming soon...',
'sell.selectCategory': 'Select Category',
'sell.categorySubtitle': 'Choose the type of account you want to sell.',
'sell.explore': 'Explore',
'sell.price': 'Price',
'sell.description': 'Description',

'sell.gaming.title': 'Gaming Accounts',
'sell.gaming.description': 'Sell your gaming accounts easily and securely.',

'sell.social.title': 'Social Media Accounts',
'sell.social.description': 'Sell your verified or popular social accounts.',

'sell.social.followers': 'Followers',
'sell.social.likes': 'Likes',
'sell.social.views': 'Views',
'sell.social.posts': 'Posts',
'sell.social.engagement': 'Engagement Rate',
'sell.social.verification': 'Verification Status',
'sell.social.verified': 'Verified',
'sell.social.unverified': 'Unverified',

'sell.social.tiktok.title': 'Sell TikTok Account',
'sell.social.tiktok.subtitle': 'Provide your TikTok account details.',
'sell.social.tiktok.description': 'Sell TikTok accounts safely through NXOLand.',
'sell.social.tiktok.username': 'Username',
'sell.social.tiktok.descriptionPlaceholder': 'Describe your account — niche, content style, audience, etc.',

'sell.social.instagram.title': 'Sell Instagram Account',
'sell.social.instagram.subtitle': 'Provide your Instagram account details.',
'sell.social.instagram.description': 'Sell Instagram accounts securely with verified ownership.',
'sell.social.instagram.username': 'Username',
'sell.social.instagram.descriptionPlaceholder': 'Describe your account — niche, content style, audience, etc.',

'sell.social.accountDescription': 'Account Description',
'sell.social.descriptionPlaceholder': 'Describe your account, niche, or content style...',
'sell.social.accountWithPrimaryEmail': 'Account includes primary email access',
'sell.social.accountLinkedToPhone': 'Account linked to a phone number',

'sell.social.confirmOwnership.title': 'Ownership Confirmation & Delivery Details',
'sell.social.confirmOwnership.description': 'For a secure trading experience, please complete the steps below to verify ownership of your account.',
'sell.social.confirmOwnership.instruction': 'Click "Place the word below in your account bio" to proceed with verification.',
'sell.social.confirmOwnership.theWord': 'Verification Word',
'sell.social.confirmOwnership.copy': 'Copy',
'sell.social.confirmOwnership.confirm': 'Confirm Ownership',

'sell.social.pledge1': 'I confirm that the product description does not include any form of external contact information, direct or indirect.',
'sell.social.pledge2': 'I accept full legal responsibility for all actions related to this account until the date of sale on the platform, and guarantee it is free of any violations or cybercrimes.',

'sell.social.deliveryInfo.title': 'Delivery Information',
'sell.social.deliveryInfo.description': 'Enter the credentials that will be delivered to the buyer.',
'sell.social.deliveryInfo.email': 'Email Address',
'sell.social.deliveryInfo.password': 'Password',
'sell.social.deliveryInfo.instructions': 'Delivery Instructions',
'sell.social.deliveryInfo.instructionsPlaceholder': 'Any additional notes or instructions for the buyer...',


// Listing
'listing.success': 'Listing created successfully!',
'listing.successDescription': 'Your listing is under review and will be published shortly.',
'listing.creating': 'Creating...',
'listing.create': 'Create Listing',
'listing.published': 'Listing published successfully!',
'listing.priceTooLow': 'Price too low — minimum is $10.',
'listing.duplicateDetected': 'You already have a similar listing.',
'listing.maxListingsReached': 'You\'ve reached the maximum limit of active listings.',
'listing.verificationRequired': 'You must complete identity verification first.',
'listing.titleRequired': 'Please enter a listing title.',
'listing.serverRequired': 'Please select a server.',
'listing.imagesRequired': 'Please upload at least one image.',
'listing.billImagesRequired': 'Please upload all required billing screenshots.',
'listing.uploadingImages': 'Uploading images...',
'listing.uploadFailed': 'Failed to upload images. Please try again.',
'listing.maxImages': 'You can upload up to 8 images.',
'listing.imageTooLarge': 'Image {name} is too large. Max size is 5 MB ({size} MB).',
'listing.imageTooLargeCurrent': 'Image too large. Max 5 MB (current: {size} MB).',
'listing.priceRange': 'Minimum: $10 | Maximum: $10,000',
'listing.accountImages': 'Account Images',
'listing.accountImagesDesc': 'Upload clear screenshots (up to 8 images).',
'listing.uploadImage': 'Upload Image',
'listing.imageCount': 'Uploaded {count} / 8 images.',
'listing.billImagesTitle': 'Purchase Receipts (Required)',
'listing.billImagesDesc': 'Upload purchase receipts — visible to the buyer after payment confirmation.',
'listing.firstBillImage': 'First Purchase Receipt *',
'listing.threeBillImages': 'Three Receipts with Different Dates *',
'listing.lastBillImage': 'Latest Purchase Receipt *',
'listing.chooseImage': 'Choose Image',
'listing.imageAlt': 'Image {number}',
'listing.priceRequired': 'Please enter a valid price.',
'listing.stoveLevelRequired': 'Please select furnace level.',
'listing.allFieldsRequired': 'Please complete all required fields.',
'listing.accountCredentialsRequired': 'Please provide the account email and password.',
'listing.billImagesInstructions': 'Upload purchase receipts — visible to the buyer after payment confirmation.',
'listing.billImagesSecurityNote': 'Account information is protected and encrypted. It will be visible to the buyer only after payment is completed.',
'listing.cancelConfirm': 'Are you sure you want to cancel? You will lose all entered data.',
'listing.publishing': 'Publishing...',
'listing.publishListing': 'Publish Listing',
'listing.deliveryDescription': 'Delivery Description',
'listing.deliveryDescriptionPlaceholder': 'Example: Sign in via Facebook, main email is aa@aa.com',
'listing.deliveryDescriptionHint': 'Explain to the buyer how to deliver the account. This description will be visible to the buyer after payment is complete.',
'listing.termsAcceptance': 'By listing this account, you agree to our Terms, Conditions, and Privacy Policy.',
'listing.termsAcceptanceRequired': 'You must agree to the Terms, Conditions, and Privacy Policy to continue.',
'listing.secondBillImage': 'Second Purchase Receipt *',
'listing.thirdBillImage': 'Third Purchase Receipt *',

// Sell WOS
'sell.wos.pageTitle': 'Add Whiteout Survival Account for Sale',
'sell.wos.pageSubtitle': 'Add account details and start selling',
'sell.wos.kycRequired': 'Identity Verification (KYC) Required',
'sell.wos.kycDescription1': 'You must complete identity verification before you can list accounts for sale on the platform.',
'sell.wos.kycDescription2': 'This is mandatory to ensure the security and reliability of all sellers on the platform.',
'sell.wos.startVerification': 'Start Verification Now',
'sell.wos.basicInfo': 'Basic Information',
'sell.wos.listingTitle': 'Listing Title *',
'sell.wos.listingTitlePlaceholder': 'Example: Strong Account - Level 45',
'sell.wos.characters': 'characters',
'sell.wos.server': 'Server *',
'sell.wos.selectServer': 'Select Server',
'sell.wos.other': 'Other',
'sell.wos.price': 'Price ($) *',
'sell.wos.accountDetails': 'Account Details (Required)',
'sell.wos.furnaceLevel': 'Furnace Level *',
'sell.wos.selectFurnaceLevel': 'Select Furnace Level',
'sell.wos.helios': 'Helios (can select multiple)',
'sell.wos.heliosInfantry': 'Infantry',
'sell.wos.heliosArchers': 'Marksmen',
'sell.wos.heliosSpear': 'Lancer',
'sell.wos.heliosNone': 'None',
'sell.wos.troops': 'Troops *',
'sell.wos.troopsPlaceholder': 'Example: 1M or 1,000,000',
'sell.wos.totalPower': 'Total Power *',
'sell.wos.totalPowerPlaceholder': 'Example: 50M or 50,000,000',
'sell.wos.heroPower': 'Hero Power *',
'sell.wos.heroPowerPlaceholder': 'Example: 10M or 10,000,000',
'sell.wos.island': 'Island *',
'sell.wos.islandPlaceholder': 'Example: 7 or 1K',
'sell.wos.expertPower': 'Expert Power *',
'sell.wos.expertPowerPlaceholder': 'Example: 5M or 5,000,000',
'sell.wos.heroTotalPower': 'Hero\'s Total Power *',
'sell.wos.heroTotalPowerPlaceholder': 'Example: 15M or 15,000,000',
'sell.wos.petPower': 'Pet Power *',
'sell.wos.petPowerPlaceholder': 'Example: 3M or 3,000,000',
'sell.wos.numericInputHint': 'You can enter numbers with the option to add K, M, or B at the end',
'sell.wos.hasEmail': 'With Primary Email?',
'sell.wos.hasApple': 'Is account linked to Apple?',
'sell.wos.hasGoogle': 'Is account linked to Google?',
'sell.wos.hasFacebook': 'Is account linked to Facebook?',
'sell.wos.hasGameCenter': 'Is account linked to Game Center?',
'sell.wos.yes': 'Yes',
'sell.wos.no': 'No',
'sell.wos.accountDetailsSection': 'Account Details',
'sell.wos.accountEmail': 'Email *',
'sell.wos.accountPassword': 'Password *',
'sell.wos.descriptionServer': 'Server: {server}',
'sell.wos.descriptionFurnace': 'Furnace Level: {level}',
'sell.wos.descriptionHelios': 'Helios: {helios}',
'sell.wos.descriptionHeliosNone': 'Helios: None',
'sell.wos.descriptionTroops': 'Troops: {troops}',
'sell.wos.descriptionTotalPower': 'Total Power: {power}',
'sell.wos.descriptionHeroPower': 'Hero Power: {power}',
'sell.wos.descriptionIsland': 'Island: {island}',
'sell.wos.descriptionExpertPower': 'Expert Power: {power}',
'sell.wos.descriptionHeroTotalPower': 'Hero\'s Total Power: {power}',
'sell.wos.descriptionPetPower': 'Pet Power: {power}',
'sell.wos.descriptionHasEmail': 'With Primary Email: {value}',
'sell.wos.descriptionHasApple': 'Linked to Apple: {value}',
'sell.wos.descriptionHasGoogle': 'Linked to Google: {value}',
'sell.wos.descriptionHasFacebook': 'Linked to Facebook: {value}',
'sell.wos.descriptionHasGameCenter': 'Linked to Game Center: {value}',
'sell.wos.imageAlt': 'Image {number}',
'sell.wos.firstBillAlt': 'First Receipt',
'sell.wos.multipleBillsAlt': 'Multiple Receipts',
'sell.wos.secondBillAlt': 'Second Receipt',
'sell.wos.thirdBillAlt': 'Third Receipt',
'sell.wos.lastBillAlt': 'Latest Receipt',


// Common
'common.loading': 'Loading...',
'common.search': 'Search',
'common.filter': 'Filter',
'common.sort': 'Sort',
'common.all': 'All',
'common.save': 'Save',
'common.cancel': 'Cancel',
'common.delete': 'Delete',
'common.edit': 'Edit',
'common.view': 'View',
'common.back': 'Back',
'common.confirm': 'Confirm',
'common.close': 'Close',
'common.submit': 'Submit',
'common.update': 'Update',
'common.download': 'Download',
'common.upload': 'Upload',
'common.next': 'Next',
'common.previous': 'Previous',
'common.page': 'Page',
'common.of': 'of',
'common.from': 'from',
'common.showing': 'Showing',
'common.results': 'results',
'common.noResults': 'No results found',
'common.error': 'Error',
'common.success': 'Success',
'common.warning': 'Warning',
'common.info': 'Information',
'common.errorLoading': 'An error occurred while loading content.',
'common.retry': 'Retry',
'common.skipToContent': 'Skip to main content',
'common.sending': 'Sending...',
'common.processing': 'Processing...',
'common.errorTryAgain': 'Something went wrong. Please try again.',


// Time
'time.now': 'Now',
'time.minutesAgo': '{count} min ago',
'time.hoursAgo': '{count} h ago',
'time.daysAgo': '{count} d ago',


// Search
'search.placeholder': 'Search...',
'search.fullPlaceholder': 'Search for accounts, members, or topics...',
'search.button': 'Search',
'search.keyboardShortcuts': 'Press ESC to close • Press / to search quickly',


// Quick Nav
'quickNav.browseMarket': 'Browse Marketplace',
'quickNav.myOrders': 'My Orders',
'quickNav.disputes': 'Disputes',
'quickNav.help': 'Help',

    
// Reviews
'reviews.title': 'Reviews',
'reviews.addReview': 'Add Review',
'reviews.editReview': 'Edit Review',
'reviews.rating': 'Rating *',
'reviews.comment': 'Comment *',
'reviews.commentPlaceholder': 'Share your experience with this seller — how was the service? Was the delivery fast?',
'reviews.minCharacters': '(minimum 10 characters)',
'reviews.characterCount': '{count} / 1000 characters',
'reviews.charactersRemaining': '{remaining} characters remaining',
'reviews.excellent': 'Excellent',
'reviews.veryGood': 'Very Good',
'reviews.good': 'Good',
'reviews.acceptable': 'Acceptable',
'reviews.poor': 'Poor',
'reviews.pleaseSelectRating': 'Please select a rating.',
'reviews.commentMinLength': 'Please write a comment of at least 10 characters.',
'reviews.createSuccess': 'Review submitted successfully.',
'reviews.updateSuccess': 'Review updated successfully.',
'reviews.updateButton': 'Update Review',
'reviews.publishButton': 'Publish Review',
'reviews.tip': '💡 Tip: Honest, detailed reviews help other buyers make better decisions.',


// Auth
'auth.tagline': 'Secure marketplace for buying and selling digital accounts.',
'auth.login': 'Log In',
'auth.loginWithDiscord': 'Login with Discord',
'auth.registerWithDiscord': 'Register with Discord',
'auth.orContinueWith': 'Or continue with',
'auth.discordLoginSuccess': 'Successfully logged in with Discord!',
'auth.discordLoginError': 'An error occurred while logging in with Discord',
'auth.discordOAuthFailed': 'Discord login failed',
'auth.discordInvalidState': 'Invalid state. Please try again',
'auth.discordNoCode': 'Authorization code not received',
'auth.discordTokenExchangeFailed': 'Token exchange failed',
'auth.discordNoAccessToken': 'Access token not received',
'auth.discordUserInfoFailed': 'Failed to fetch user info from Discord',
'auth.discordInvalidUser': 'Invalid Discord user information',
'auth.discordOAuthException': 'An error occurred during login process',
'auth.discordAlreadyLinked': 'Discord account is already linked to another account',
'auth.discordAlreadyLinkedSecurity': 'Discord account is linked to another account. Account switching is not allowed.',
'auth.sessionMismatch': 'Session mismatch. Please log in again.',
'auth.discordLinkFailed': 'Failed to link Discord account',
'auth.discordNotAuthenticated': 'You must be logged in to link Discord account',
'auth.discordOAuthError': 'An error occurred while logging in with Discord',
'auth.signup': 'Sign Up',
'auth.register': 'Register',
'auth.pageDescription': 'Log in or create an account to start trading securely.',
'auth.skipToForm': 'Skip to form',
'auth.email': 'Email Address',
'auth.password': 'Password',
'auth.confirmPassword': 'Confirm Password',
'auth.fullName': 'Full Name',
'auth.phone': 'Phone Number',
'auth.forgotPassword': 'Forgot Password?',
'auth.rememberMe': 'Remember Me',
'auth.haveAccount': 'Already have an account?',
'auth.noAccount': 'Don\'t have an account?',
'auth.loginButton': 'Log In',
'auth.signupButton': 'Create Account',
'auth.loginSuccess': 'Logged in successfully.',
'auth.signupSuccess': 'Account created successfully.',
'auth.registerSuccess': 'Account created successfully.',
'auth.loginError': 'Login failed. Please check your credentials.',
'auth.signupError': 'Failed to create account.',
'auth.registerError': 'Failed to create account.',
'auth.invalidEmail': 'Please enter a valid email address.',
'auth.passwordTooShort': 'Password must be at least {count} characters long.',
'auth.passwordMismatch': 'Passwords do not match.',
'auth.nameTooShort': 'Name must be at least {count} characters long.',
'auth.passwordSymbols': 'The password must contain at least one special character (e.g., !@#$%^&*).',
'auth.passwordMixed': 'The password must contain both uppercase and lowercase letters.',
'auth.passwordNumbers': 'The password must contain at least one number.',
'auth.passwordUncompromised': 'This password has been compromised in a known data breach. Please choose a different password.',
'auth.passwordMin': 'The password must be at least {count} characters long.',
'auth.emailExists': 'This email is already registered.',
'auth.nameRequired': 'Name is required.',
'auth.emailRequired': 'Email is required.',
'auth.passwordRequired': 'Password is required.',
'auth.termsAgreement': 'By registering, you agree to our',
'auth.terms': 'Terms & Conditions',
'auth.privacy': 'Privacy Policy',
'auth.passwordResetTitle': 'Reset your password',
'auth.passwordResetDescription': 'Enter your email and we will send a reset link if the account exists.',
'auth.passwordResetSubmit': 'Send reset link',
'auth.passwordResetSuccess': 'If an account exists, a reset link has been sent to your email.',
'auth.passwordResetError': 'Could not send the reset link. Please try again later.',
'auth.passwordResetCancel': 'Cancel',
'auth.setNewPasswordTitle': 'Set a new password',
'auth.setNewPasswordDescription': 'Enter your email and new password to complete the reset.',
'auth.passwordResetSubmitNew': 'Update password',
'auth.passwordResetComplete': 'Your password has been updated. You can now log in.',
'auth.passwordResetInvalidLink': 'The reset link is invalid or has expired. Please request a new one.',
'auth.passwordResetBackToLogin': 'Back to login',
'auth.agreeToTerms': 'By creating an account, you agree to our',
'auth.and': 'and',
'auth.backToHome': 'Back to Home',
'auth.processing': 'Processing...',
'auth.securityVerification': 'Please complete the security verification.',

// Verify Email
'verifyEmail.title': 'Verify Email Address',
'verifyEmail.description': 'Verify your email address',
'verifyEmail.verifying': 'Verifying...',
'verifyEmail.successTitle': 'Verification Successful!',
'verifyEmail.successMessage': 'Your email address has been verified successfully.',
'verifyEmail.errorTitle': 'Verification Failed',
'verifyEmail.errorMessage': 'An error occurred while verifying your email address.',
'verifyEmail.timeoutTitle': 'Connection Timeout',
'verifyEmail.timeout': 'Connection timeout. Please try again.',
'verifyEmail.invalidLink': 'The verification link is invalid or has expired.',
'verifyEmail.verifyFailed': 'Failed to verify email address.',
'verifyEmail.emailSent': 'Verification email has been sent to your email address.',
'verifyEmail.sendFailed': 'Failed to send verification email. Please try again.',
'verifyEmail.alreadyVerified': 'Email address is already verified.',
'verifyEmail.rateLimitExceeded': 'Rate limit exceeded. You can only resend verification emails 3 times per hour. Please try again later.',
'verifyEmail.resend': 'Resend Verification Email',
'verifyEmail.redirecting': 'Redirecting in',
'verifyEmail.seconds': 'seconds',
'verifyEmail.goNow': 'Go Now',
'verifyEmail.tip': 'Tip:',
'verifyEmail.checkConnection': 'Check your internet connection or try again later.',

// Marketplace
'marketplace.title': 'Marketplace',
'marketplace.subtitle': 'Browse all available accounts.',
'marketplace.description': 'Explore and purchase gaming or social media accounts securely on NXOLand.',
'marketplace.skipToMarket': 'Skip to marketplace content',
'marketplace.searchPlaceholder': 'Search accounts...',
'marketplace.searchAriaLabel': 'Search marketplace',
'marketplace.filterBy': 'Filter By',
'marketplace.sortBy': 'Sort By',
'marketplace.categoryFilter': 'Category Filter',
'marketplace.category': 'Category',
'marketplace.allCategories': 'All Categories',
'marketplace.gaming': 'Gaming',
'marketplace.social': 'Social Media',
'marketplace.trading': 'Trading',
'marketplace.other': 'Other',
'marketplace.priceFilter': 'Price Filter',
'marketplace.price': 'Price',
'marketplace.allPrices': 'All Prices',
'marketplace.lowPrice': 'Low (under $100)',
'marketplace.midPrice': 'Medium ($100 - $1,000)',
'marketplace.highPrice': 'High (over $1,000)',
'marketplace.moreFilters': 'More Filters',
'marketplace.showing': 'Showing',
'marketplace.outOf': 'out of',
'marketplace.accounts': 'accounts',
'marketplace.sellNow': 'Start Selling',
'marketplace.registerToSell': 'Register to Sell',
'marketplace.allGames': 'All Games',
'marketplace.priceRange': 'Price Range',
'marketplace.games.title': 'Choose Your Game',
'marketplace.games.subtitle': 'Browse accounts by game',
'marketplace.games.description': 'Select a game to browse available accounts',
'marketplace.backToGames': 'Back to Games',
'marketplace.gameNotFound': 'Game not found',
'marketplace.gameCategorySubtitle': 'Browse all available accounts for this game',
'marketplace.noListingsForGame': 'No accounts available for this game at the moment',
'marketplace.level': 'Level',
'marketplace.server': 'Server',
'marketplace.latest': 'Latest',
'marketplace.priceHigh': 'Price: High to Low',
'marketplace.priceLow': 'Price: Low to High',
'marketplace.levelHigh': 'Level: High to Low',
'marketplace.noListings': 'No listings found.',
'marketplace.noListingsDesc': 'No accounts match your filters.',
'marketplace.tryDifferent': 'Try adjusting your search or filters.',
'marketplace.verified': 'Verified',
'marketplace.featured': 'Featured',
'marketplace.viewDetails': 'View Details',


// Product Details
'product.details': 'Account Details',
'product.price': 'Price',
'product.level': 'Level',
'product.server': 'Server',
'product.seller': 'Seller',
'product.description': 'Description',
'product.specifications': 'Specifications',
'product.images': 'Images',
'product.image': 'Image',
'product.buyNow': 'Buy Now',
'product.buy': 'Buy',
'product.addToCart': 'Add to Cart',
'product.available': 'Available',
'product.sold': 'Sold',
'product.unavailable': 'Unavailable',
'product.premiumAccount': 'Premium Account',
'product.backToMarket': 'Back to Marketplace',
'product.sellerInfo': 'Seller Information',
'product.sellerRating': 'Seller Rating',
'product.totalSales': 'Total Sales',
'product.memberSince': 'Member Since',
'product.responseTime': 'Response Time',
'product.deliveryTime': 'Delivery Time',
'product.viewProfile': 'View Profile',
'product.reportListing': 'Report Listing',
'product.share': 'Share',
'product.clickToEnlarge': 'Click to enlarge',
'product.swipeToNavigate': 'Swipe to navigate',
'product.previousImage': 'Previous image',
'product.nextImage': 'Next image',
'product.thumbnail': 'Thumbnail',
'product.billImages': 'Bill Images',
'product.billImagesInfo': 'ℹ️ Bill images become visible after purchase completion.',
'product.stoveLevel': 'Furnace Level',
'product.helios': 'Helios',
'product.troops': 'Troops',
'product.personalPower': 'Total Power',
'product.heroPower': 'Hero Power',
'product.island': 'Island',
'product.expertPower': 'Expert Power',
'product.heroTotalPower': 'Total Hero Power',
'product.petPower': 'Pet Power',
'product.primaryEmailIncluded': 'Includes primary email',
'product.yes': 'Yes',
'product.no': 'No',
'product.accountBindings': 'Account Linking',
'product.binding.apple': 'Apple',
'product.binding.google': 'Google',
'product.binding.facebook': 'Facebook',
'product.binding.gameCenter': 'Game Center',
'product.bindingLinked': 'Linked',
'product.bindingNotLinked': 'Not linked',
'product.invoiceFirst': 'First purchase invoice',
'product.invoiceMultiple': 'Three different invoices',
'product.invoiceLast': 'Latest purchase invoice',
'product.invoiceAttached': 'Attached',
'product.verifiedSeller': 'Verified seller',
'product.accountOwnerNotice': 'This is your listing',
'product.manageMyListings': 'Manage my listings',
'product.buyNowSecure': 'Buy now securely',
'product.loginToBuy': 'Log in to buy',
'product.escrowProtection': 'Protected by a 12-hour escrow system',


// Checkout
'checkout.title': 'Checkout',
'checkout.subtitle': 'Complete your secure payment through our trusted payment gateway.',
'checkout.description': 'Complete your secure payment through our trusted payment gateway.',
'checkout.loginRequired': 'Please log in to continue.',
'checkout.orderNotFound': 'Order not found.',
'checkout.amountError': 'Amount error. Please try again.',
'checkout.invalidOrder': 'Invalid order.',
'checkout.cannotBuyOwn': 'You cannot purchase your own listing.',
'checkout.paymentLinkError': 'Failed to create payment link.',
'checkout.orderSummary': 'Order Summary',
'checkout.productDetails': 'Product Details',
'checkout.subtotal': 'Subtotal',
'checkout.serviceFee': 'Service Fee',
'checkout.total': 'Total',
'checkout.paymentMethod': 'Payment Method',
'checkout.agreeToTerms': 'I agree to the Terms & Conditions.',
'checkout.confirmPurchase': 'Confirm Purchase',
'checkout.processing': 'Processing...',
'checkout.securePayment': 'Secure payment via',
'checkout.buyerProtection': '12-hour buyer protection',
'checkout.deliveryInfo': 'Delivery Information',
'checkout.instantDelivery': 'Instant delivery after payment',
'checkout.mustAgreeTerms': 'You must agree to the Terms & Conditions to continue.',
'checkout.deliveryTime': 'Delivery Time',
'checkout.deliveryTimeDescription': 'Instant delivery after payment. Account credentials are delivered immediately after payment confirmation.',
'checkout.deliveryTimeLabel': 'Instant delivery after payment',
'checkout.protectedByEscrow': 'Protected by Escrow',
'checkout.escrowDescription': 'Funds will be held in escrow for {hours} hours to ensure your protection.',
'checkout.backToListing': 'Back to Listing',
'checkout.tapPayment': 'Secure Payment',
'checkout.recommended': 'Recommended',
'checkout.orderCompleted': 'Order Completed',
'checkout.orderCancelled': 'Order Cancelled',
'checkout.orderDisputed': 'Order in Dispute',
'checkout.fullRefund': 'Full refund within 12 hours',
'checkout.paylinkPayment': 'Paylink Payment',
'checkout.confirmPayment': 'Confirm Payment',
'checkout.paymentAlreadyInitiated': 'Payment already initiated. Redirecting to payment page...',


// Orders
'orders.title': 'My Orders',
'orders.subtitle': 'View and manage all your orders.',
'orders.description': 'Track and manage your buying and selling orders easily.',
'orders.loginRequired': 'Please log in to access your orders.',
'orders.searchPlaceholder': 'Search by order ID, product, or seller...',
'orders.filterByRole': 'View orders:',
'orders.all': 'All',
'orders.total': 'Total',
'orders.asBuyer': 'As Buyer',
'orders.asSeller': 'As Seller',
'orders.inEscrow': 'In Escrow',
'orders.showOrders': 'Show Orders',
'orders.status': 'Status',
'orders.pending': 'Pending Payment',
'orders.statusPending': 'Pending Payment',
'orders.paid': 'Paid',
'orders.statusPaid': 'Paid',
'orders.escrowHold': 'In Escrow',
'orders.statusEscrow': 'In Escrow',
'orders.completed': 'Completed',
'orders.statusCompleted': 'Completed',
'orders.cancelled': 'Cancelled',
'orders.statusCancelled': 'Cancelled',
'orders.disputed': 'Disputed',
'orders.statusDisputed': 'Disputed',
'orders.noOrders': 'No orders found.',
'orders.noOrdersDesc': 'You haven\'t made any purchases yet.',
'orders.noOrdersFilter': 'No orders match the selected filter.',
'orders.browseMarket': 'Browse Marketplace',
'orders.viewDetails': 'View Details',
'orders.contactSeller': 'Contact Seller',
'orders.openDispute': 'Open Dispute',
'orders.viewDispute': 'View Dispute',
'orders.confirmReceipt': 'Confirm Receipt',
'orders.orderNumber': 'Order Number',
'orders.date': 'Date',
'orders.buyer': 'Buyer',
'orders.seller': 'Seller',
'orders.amount': 'Amount',
'orders.stats.total': 'Total',
'orders.stats.asBuyer': 'As Buyer',
'orders.stats.asSeller': 'As Seller',
'orders.stats.inEscrow': 'In Escrow',
'orders.stats.completed': 'Completed',
'orders.activeWarrantyPeriod': 'Active Warranty Period',
'orders.timeRemainingToCheck': 'Time remaining to check account and confirm receipt',
'orders.timeFormat': 'Hours:Minutes:Seconds',
'orders.stats.cancelled': 'Cancelled',
'orders.deletedAccount': 'Deleted Account',

    
// Order Details
'order.title': 'Order Details',
'order.status': 'Order Status',
'order.statusPending': 'Pending Payment',
'order.statusPaid': 'Paid',
'order.statusEscrow': 'In Escrow',
'order.statusCompleted': 'Completed',
'order.statusCancelled': 'Cancelled',
'order.statusDisputed': 'Disputed',
'order.confirmSuccess': 'Receipt confirmed successfully.',
'order.onlyBuyerCanConfirm': 'Only the buyer can confirm receipt.',
'order.cannotConfirmStatus': 'Cannot confirm the order in its current status.',
'order.confirmError': 'Failed to confirm receipt.',
'order.cancelSuccess': 'Order cancelled successfully.',
'order.cannotCancelCompleted': 'Cannot cancel a completed order.',
'order.cancelError': 'Failed to cancel the order.',
'order.timeline': 'Timeline',
'order.productInfo': 'Product Information',
'order.accountDetails': 'Account Details',
'order.paymentInfo': 'Payment Information',
'order.actions': 'Actions',
'order.confirmDelivery': 'Confirm Receipt',
'order.openDispute': 'Open Dispute',
'order.cancelOrder': 'Cancel Order',
'order.contactSupport': 'Contact Support',
'order.downloadInvoice': 'Download Invoice',
'order.escrowPeriod': 'Escrow Period',
'order.escrowEndsIn': 'Escrow ends in',
'order.hours': 'hours',
'order.minutes': 'minutes',
'order.delivered': 'Delivered',
'order.deliveredAt': 'Delivered at',
'order.billImagesTitle': 'Bill Images',
'order.deliveryDescription': 'Delivery Description',

// Wallet
'wallet.title': 'Wallet',
'wallet.balance': 'Available Balance',
'wallet.pending': 'Processing',
'wallet.onHold': 'On Hold',
'wallet.total': 'Total',
'wallet.withdraw': 'Withdraw',
'wallet.withdrawDescription': 'Enter withdrawal details to complete the transaction',
'wallet.withdrawnTotalLabel': 'Total Withdrawn',
'wallet.deposit': 'Deposit',
'wallet.transactions': 'Transactions',
'wallet.withdrawalHistory': 'Withdrawal History',
'wallet.amount': 'Amount',
'wallet.enterAmount': 'Enter amount',
'wallet.minimumWithdrawal': 'Minimum Withdrawal',
'wallet.bankAccount': 'Bank Account',
'wallet.iban': 'IBAN',
'wallet.bankName': 'Bank Name',
'wallet.accountHolderName': 'Account Holder Name',
'wallet.bankNamePlaceholder': 'Example: Al Rajhi Bank',
'wallet.accountHolderNamePlaceholder': 'Account holder name as it appears on card',
'wallet.enterBankName': 'Please enter bank name',
'wallet.enterAccountHolderName': 'Please enter account holder name',
'wallet.accountNumber': 'Account Number',
'wallet.accountName': 'Account Holder Name',
'wallet.requestWithdrawal': 'Request Withdrawal',
'wallet.withdrawalRequested': 'Withdrawal request submitted successfully.',
'wallet.withdrawalPending': 'Processing',
'wallet.withdrawalCompleted': 'Completed',
'wallet.withdrawalFailed': 'Failed',
'wallet.transactionType': 'Transaction Type',
'wallet.sale': 'Sale',
'wallet.purchase': 'Purchase',
'wallet.withdrawal': 'Withdrawal',
'wallet.refund': 'Refund',
'wallet.fee': 'Fee',
'wallet.noTransactions': 'No transactions yet.',
'wallet.loginRequired': 'You must log in to view your wallet.',
'wallet.cancelled': 'Cancelled',
'wallet.processingTime': 'Processing time: 1–4 business days.',
'wallet.withdrawSuccess': 'Withdrawal request submitted successfully.',
'wallet.hourlyLimitExceeded': 'Hourly withdrawal limit exceeded. Please try again later.',
'wallet.dailyLimitExceeded': 'Daily withdrawal limit exceeded ({limit}). Remaining: ${remaining}.',
'wallet.withdrawError': 'Withdrawal request failed.',
'wallet.invalidIBAN': 'Invalid IBAN. Must start with SA and be 24 characters long.',
'wallet.enterValidAmount': 'Please enter a valid amount.',
'wallet.minWithdrawal': 'Minimum withdrawal is ${min}.',
'wallet.maxWithdrawal': 'Maximum withdrawal is ${max}.',
'wallet.exceedsBalance': 'Amount exceeds available balance.',
'wallet.enterValidIBAN': 'Please enter a valid IBAN.',
'wallet.withdrawalHistorySubtitle': 'Last {count} withdrawals',
'wallet.amountPlaceholder': 'Minimum: ${amount}',
'wallet.withdrawalLimitsTitle': 'Withdrawal Limits',
'wallet.withdrawalMin': '• Minimum: ${amount}',
'wallet.withdrawalMax': '• Maximum: ${amount} per transaction',
'wallet.withdrawalDaily': '• Daily limit: ${amount}',
'wallet.withdrawalFeeInfo': '• Withdrawal fee: ${amount} per transaction',
'wallet.availableBalanceLabel': 'Available balance: {amount}',
'wallet.requestedAmount': 'Requested amount:',
'wallet.withdrawalFeeLabel': 'Withdrawal fee:',
'wallet.netAmount': 'Net amount:',
'wallet.bankAccountLabel': 'Bank account:',
'wallet.ibanHint': 'Must start with SA followed by 22 digits.',
'wallet.continue': 'Continue',
'wallet.noWithdrawals': 'No withdrawals yet.',
'wallet.transferId': '🔖 Transfer ID: {id}',
'wallet.failureReason': '❌ Failure reason: {reason}',
'wallet.confirmWithdrawalTitle': 'Confirm Withdrawal',
'wallet.confirmReviewMessage': 'Please review the withdrawal details carefully before confirming.',
'wallet.warningManualApproval': 'Your withdrawal request will be reviewed by administrators. You will be notified upon approval or rejection.',
'wallet.warningTitle': '⚠️ Important notices:',
'wallet.warningNoCancel': 'You cannot cancel the request after confirming.',
'wallet.warningProcessingTime': 'Processing may take 1 to 3 business days.',
'wallet.warningCheckIban': 'Double-check the bank account number.',
'wallet.warningFeeDeducted': 'Fees will be deducted from the withdrawn amount.',
'wallet.platformNotResponsible': 'The platform is not responsible for any errors in information entered by the user.',
'wallet.confirmWithdrawalButton': 'Confirm withdrawal',

// Profile
'profile.title': 'Profile',
'profile.publicProfile': 'Public Profile',
'profile.memberSince': 'Member Since',
'profile.memberSinceLabel': 'Member Since',
'profile.lastActive': 'Last Active',
'profile.verified': 'Verified',
'profile.notVerified': 'Not Verified',
'profile.rating': 'Rating',
'profile.totalSales': 'Total Sales',
'profile.completedOrders': 'Completed Orders',
'profile.totalPurchases': 'Total Purchases',
'profile.activeListings': 'Active Listings',
'profile.responseRate': 'Response Rate',
'profile.deliveryTime': 'Delivery Time',
'profile.editProfile': 'Edit Profile',
'profile.viewReviews': 'View Reviews',
'profile.accountSettings': 'Account Settings',
'profile.security': 'Security',
'profile.verifyAccount': 'Verify Account',
'profile.accountVerification': 'Account Verification',
'profile.about': 'About',
'profile.noReviews': 'No reviews yet',
'profile.availableBalance': 'Available Balance',
'profile.recentActivity': 'Recent Activity',
'profile.noRecentActivity': 'No recent activity yet.',
'profile.myListings': 'My Listings',
'profile.manageListings': 'Manage Listings',
'profile.requiredForSelling': 'Required for selling on the platform',
'profile.viewMyListings': 'View My Listings',
'profile.discordConnected': 'Discord account connected successfully!',
'profile.startVerification': 'Start Verification',
'profile.accountActions': 'Account Actions',
'profile.reviewsCount': 'reviews',
'profile.reviewsWithCount': '({count} reviews)',
'profile.statsError': 'Failed to load statistics.',
'profile.activityError': 'Failed to load activity.',
'profile.refreshActivity': 'Refresh activity',
'profile.viewWallet': 'View Wallet',
'profile.securityAndPrivacy': 'Security & Privacy',

// Profile (relative times & meta)
'profile.minutesAgo': 'minutes ago',
'profile.hoursAgo': '{hours} hours ago',
'profile.oneDayAgo': 'one day ago',
'profile.daysAgo': '{days} days ago',
'profile.statsRefreshed': 'Stats refreshed.',
'profile.activityRefreshed': 'Activity refreshed.',
'profile.loginRequired': 'Please log in to view the profile.',
'profile.verifiedAccount': 'Verified Account',
'profile.requiresKYC': 'Requires KYC Verification',
'profile.accountStats': 'Account Statistics',
'profile.refreshStats': 'Refresh Statistics',
'profile.refresh': 'Refresh',
'profile.seoTitle': 'Profile',
'profile.seoDescription': '{name}\'s profile on NXOLand. View statistics, recent activity, and settings.',
'profile.pageTitle': 'Profile',
'profile.manageInfo': 'Manage your information and settings.',
'profile.totalRevenue': 'Total Revenue',
'profile.editProfileLink': 'Edit Profile',
'profile.resendVerificationEmail': 'Resend Verification Email',
'profile.verificationEmailSent': 'Verification email sent to your inbox',
'profile.verificationEmailError': 'Failed to send verification email',

// Edit Profile
'editProfile.title': 'Edit Profile',
'editProfile.pageDescription': 'Update your personal account information on NXOLand.',
'editProfile.skipToForm': 'Skip to edit form',
'editProfile.personalInfo': 'Personal Information',
'editProfile.name': 'Username',
'editProfile.email': 'Email',
'editProfile.phone': 'Phone',
'editProfile.bio': 'Bio',
'editProfile.avatar': 'Avatar',
'editProfile.changeAvatar': 'Change Avatar',
'editProfile.saveChanges': 'Save Changes',
'editProfile.saving': 'Saving...',
'editProfile.updateSuccess': 'Profile updated successfully.',
'editProfile.updateError': 'Failed to update profile.',
'editProfile.avatarUpdateSuccess': 'Avatar updated successfully.',
'editProfile.avatarUpdateError': 'Failed to update avatar.',
'editProfile.avatarPreview': 'Avatar Preview',
'editProfile.selectImage': 'Select Image',
'editProfile.upload': 'Upload',
'editProfile.uploading': 'Uploading...',
'editProfile.invalidImageType': 'Please select a valid image file.',
'editProfile.imageTooLarge': 'Image is too large (max 5 MB).',
'editProfile.avatarHint': 'JPG, PNG, or GIF (max 5 MB).',
'editProfile.nameRequired': 'Please enter your name.',
'editProfile.nameMinLength': 'Name must be at least 3 characters.',
'editProfile.nameTooLong': 'Name is too long (max 100 characters).',
'editProfile.emailRequired': 'Please enter your email.',
'editProfile.invalidEmail': 'Invalid email address.',
'editProfile.backToProfile': 'Back to Profile',
'editProfile.pageTitle': 'Edit Profile',
'editProfile.updateInfo': 'Update your personal information.',

// Security
'security.title': 'Security',
'security.changePassword': 'Change Password',
'security.currentPassword': 'Current Password',
'security.newPassword': 'New Password',
'security.confirmNewPassword': 'Confirm New Password',
'security.updatePassword': 'Update Password',
'security.passwordUpdated': 'Password updated successfully.',
'security.passwordUpdateSuccess': 'Password updated successfully.',
'security.passwordUpdateError': 'Failed to update password.',
'security.currentPasswordRequired': 'Please enter your current password.',
'security.newPasswordTooShort': 'New password must be at least 8 characters.',
'security.passwordsNotMatch': 'Passwords do not match.',
'security.newPasswordTooWeak': 'Password is weak. Use a mix of letters, numbers, and symbols.',
'security.invalidCurrentPassword': 'Current password is incorrect.',
'security.tooManyAttempts': 'Too many attempts. Try again in {minutes} minutes.',
'security.attemptsRemaining': 'Attempts remaining',
'security.veryWeak': 'Very Weak',
'security.weak': 'Weak',
'security.medium': 'Medium',
'security.strong': 'Strong',
'security.veryStrong': 'Very Strong',
'security.passwordWeakMix': 'Password is weak. Use uppercase, lowercase, numbers, and special characters.',
'security.needUppercase': 'Password must contain at least one uppercase letter (A–Z).',
'security.needLowercase': 'Password must contain at least one lowercase letter (a–z).',
'security.needNumber': 'Password must contain at least one number.',
'security.needSymbol': 'Password must contain at least one special character (!@#$%...).',
'security.twoFactor': 'Two-Factor Authentication',
'security.enable2FA': 'Enable 2FA',
'security.disable2FA': 'Disable 2FA',
'security.loginHistory': 'Login History',
'security.activeSessions': 'Active Sessions',
'security.logoutAll': 'Log Out of All Devices',
'security.changePasswordConfirm': 'Are you sure you want to change your password?',
'security.securityWarning': '⚠️ Security Warning:',
'security.logoutOtherDevices': '• You will be logged out of all other devices automatically.',
'security.needRelogin': '• You will need to log in again on those devices.',
'security.emailNotification': '• A change notification will be sent to your email.',
'security.updating': 'Updating...',
'security.confirmChange': 'Confirm Change',
'security.twoFactorComingSoon': 'Two-Factor Authentication (Coming Soon)',
'security.twoFactorDesc': 'Add an extra layer of protection to your account.',
'security.privacyComingSoon': 'Privacy (Coming Soon)',
'security.privacyDesc': 'Manage your privacy settings.',
'security.emailNotificationsSetting': 'Email Notifications',
'security.receiveEmailUpdates': 'Receive updates via email.',
'security.loginAlerts': 'Login Alerts',
'security.newLoginNotification': 'Notify me of each new login.',
'security.backToProfile': 'Back to Profile',
'security.securityAndPrivacy': 'Security & Privacy',
'security.manageSettings': 'Manage your security and privacy settings.',
'security.passwordSection': 'Password',
'security.changeYourPassword': 'Change your password.',
'security.currentPasswordLabel': 'Current Password',
'security.newPasswordLabel': 'New Password',
'security.confirmPasswordLabel': 'Confirm Password',
'security.confirmPasswordChange': 'Confirm Password Change',
'security.activeSessionsComingSoon': 'Active Sessions (Coming Soon)',
'security.manageDevices': 'Manage connected devices',
'security.currentDevice': 'Current Device',
'security.activeNow': 'Active Now',
'security.lastActivityNow': 'Last activity: Now',

// KYC
'kyc.title': 'KYC Verification',
'kyc.subtitle': 'Complete identity verification to increase your withdrawal limit.',
'kyc.status': 'Verification Status',
'kyc.notStarted': 'Not Started',
'kyc.pending': 'Under Review',
'kyc.verified': 'Verified',
'kyc.rejected': 'Rejected',
'kyc.failed': 'Failed',
'kyc.expired': 'Expired',
'kyc.startVerification': 'Start Verification via Persona',
'kyc.resubmit': 'Resubmit',
'kyc.identityVerification': 'Identity Verification',
'kyc.requiredForSale': '⚠️ Required for Sale',
'kyc.requiredDescription': 'You must complete identity verification (KYC) before you can add any listing.',
'kyc.verifiedTitle': 'Your Identity Has Been Verified',
'kyc.verifiedDescription': 'Great! Your KYC has been saved in the system and you won\'t need to complete it again as long as you remain verified.',
'kyc.personaTitle': 'Identity Verification - Persona',
'kyc.personaDescription': 'We will use the globally recognized Persona system to verify your identity securely and quickly.',
'kyc.personaStepsTitle': 'Persona Verification Steps',
'kyc.personaStep1': 'Take a photo of your national ID or residence card',
'kyc.personaStep2': 'Take a selfie for verification',
'kyc.personaStep3': 'Verification is completed automatically in minutes',
'kyc.secureTitle': 'Secure and Encrypted',
'kyc.secureDescription': 'Persona is a globally trusted platform and secures your data throughout the process.',
'kyc.verificationSubmitted': 'Thank you, your verification status will be updated within minutes',
'kyc.privacyTitle': 'Privacy and Security Protection',
'kyc.privacyDescription': 'All your personal information is protected and encrypted. We use the trusted Persona system for identity verification and your data will not be shared with any third party.',
'kyc.benefits': 'Verification Benefits',
'kyc.benefit1': 'Increase your withdrawal limit to $10,000.',
'kyc.benefit2': 'Verified badge on your profile.',
'kyc.benefit3': 'Greater trust from buyers.',
'kyc.benefit4': 'Priority support.',
'kyc.requiredDocs': 'Required Documents',
'kyc.nationalId': 'National ID',
'kyc.proofOfAddress': 'Proof of Address',
'kyc.selfie': 'Selfie',

// My Listings
'listings.title': 'My Listings',
'listings.subtitle': 'Manage all your listings.',
'listings.createNew': 'Create New Listing',
'listings.active': 'Active',
'listings.pending': 'Pending Review',
'listings.sold': 'Sold',
'listings.rejected': 'Rejected',
'listings.draft': 'Draft',
'listings.noListings': 'No listings yet.',
'listings.createFirst': 'Create your first listing.',
'listings.edit': 'Edit',
'listings.delete': 'Delete',
'listings.view': 'View',
'listings.promote': 'Promote',
'listings.views': 'Views',
'listings.inquiries': 'Inquiries',
'listings.deleteConfirm': 'Are you sure you want to delete this listing?',

// Disputes
'disputes.title': 'Disputes',
'disputes.subtitle': 'Manage disputes and complaints.',
'disputes.openDispute': 'Open Dispute',
'disputes.myDisputes': 'My Disputes',
'disputes.status': 'Status',
'disputes.open': 'Open',
'disputes.inReview': 'Under Review',
'disputes.resolved': 'Resolved',
'disputes.closed': 'Closed',
'disputes.orderNumber': 'Order Number',
'disputes.reason': 'Reason',
'disputes.description': 'Description',
'disputes.evidence': 'Evidence',
'disputes.uploadEvidence': 'Upload Evidence',
'disputes.submitDispute': 'Submit Dispute',
'disputes.noDisputes': 'No disputes yet.',
'disputes.viewDetails': 'View Details',
'disputes.adminResponse': 'Admin Response',
'disputes.resolution': 'Resolution',
'disputes.responseTimes': 'Response & Processing Times',
'disputes.responseTime': 'We respond to complaints within 24 hours',
'disputes.processingTime': 'We process complaints within 48-72 hours',
'disputes.openNew': 'Open New Dispute',
'disputes.createDescription': 'Fill out the form below to open a dispute on an order in escrow',
'disputes.discordRequired': 'Discord Account Required',
'disputes.discordRequiredDesc': 'You must connect your Discord account before opening a dispute. A private Discord channel will be created to track the dispute.',
'disputes.connectDiscord': 'Connect Discord',
'disputes.createSuccess': 'Dispute created successfully',
'disputes.createError': 'Failed to create dispute',
'disputes.processing': 'Processing...',
'disputes.submit': 'Submit Dispute',
'disputes.reasonPlaceholder': 'Example: Account not working',
'disputes.descriptionPlaceholder': 'Detailed description of the problem...',
'disputes.fillAllFields': 'Please fill all fields',
'disputes.orderNotFound': 'Order not found',
'disputes.onlyEscrowOrders': 'Disputes can only be created for orders in escrow',
'disputes.disputeExists': 'A dispute already exists for this order',

    
// Dispute Details
'disputeDetails.title': 'Dispute Details',
'disputeDetails.description': 'View dispute details and the proposed resolution.',
'disputeDetails.backToDisputes': 'Back to Disputes',
'disputeDetails.loadError': 'Failed to load dispute details.',
'disputeDetails.backToList': 'Back to List',
'disputeDetails.disputeOn': 'Dispute for order',
'disputeDetails.details': 'Dispute Details',
'disputeDetails.descriptionLabel': 'Description',
'disputeDetails.reporter': 'Reporter',
'disputeDetails.buyer': 'Buyer',
'disputeDetails.seller': 'Seller',
'disputeDetails.createdAt': 'Created At',
'disputeDetails.notSpecified': 'Not specified',
'disputeDetails.orderInfo': 'Order Information',
'disputeDetails.orderNumber': 'Order Number',
'disputeDetails.amount': 'Amount',
'disputeDetails.orderStatus': 'Order Status',
'disputeDetails.resolutionTitle': 'Resolution',
'disputeDetails.resolvedAt': 'Resolved at:',
'disputeDetails.underReviewMessage': 'This dispute is under review. We will contact you within 24–48 hours.',
'disputeDetails.cancelDispute': 'Cancel Dispute',
'disputeDetails.cancelTitle': 'Cancel Dispute',
'disputeDetails.cancelConfirm': 'Are you sure you want to cancel this dispute?',
'disputeDetails.cancelWarning1': 'The order will return to escrow status and you can continue the transaction.',
'disputeDetails.cancelWarning2': '⚠️ The dispute cannot be reopened after cancellation.',
'disputeDetails.cancelButton': 'Go Back',
'disputeDetails.confirmCancel': 'Cancel Dispute',
'disputeDetails.cancelling': 'Cancelling...',
'disputeDetails.cancelSuccess': 'Dispute cancelled successfully.',
'disputeDetails.cancelError': 'Failed to cancel dispute.',
'disputeDetails.loginRequired': 'Please log in to view dispute details.',
'disputeDetails.loginButton': 'Log In',


// Notifications
'notifications.title': 'Notifications',
'notifications.markAllRead': 'Mark All as Read',
'notifications.deleteAll': 'Delete All',
'notifications.noNotifications': 'No notifications yet.',
'notifications.empty': 'No notifications.',
'notifications.viewAll': 'View All',
'notifications.viewAllNotifications': 'View All Notifications',
'notifications.unreadCount': '{count} unread notifications',
'notifications.newOrder': 'New Order',
'notifications.orderUpdate': 'Order Update',
'notifications.disputeOpened': 'New Dispute',
'notifications.disputeResolved': 'Dispute Resolved',
'notifications.paymentReceived': 'Payment Received',
'notifications.withdrawalCompleted': 'Withdrawal Completed',
'notifications.newReview': 'New Review',
'notifications.kycUpdate': 'KYC Update',
'notifications.pageTitle': 'Notifications',
'notifications.clearAll': 'Clear All',
'notifications.typeFilter': 'Filter by Type',
'notifications.allTypes': 'All Types',
'notifications.orderType': 'Orders',
'notifications.disputeType': 'Disputes',
'notifications.messageType': 'Messages',
'notifications.systemType': 'System',
'notifications.noNotificationsTitle': 'No Notifications',


// Members & Leaderboard
'members.title': 'Members',
'members.subtitle': 'Browse {count} members on the platform.',
'members.description': 'Explore NXOLand members and discover top sellers.',
'members.searchMembers': 'Search members...',
'members.searchPlaceholder': 'Search for a member by name...',
'members.searchLabel': 'Search Members',
'members.skipToMembers': 'Skip to members list',
'members.topSellers': 'Top Sellers',
'members.topBuyers': 'Top Buyers',
'members.newMembers': 'New Members',
'members.filterByRole': 'Filter by role',
'members.role': 'Role',
'members.sellers': 'Sellers',
'members.buyers': 'Buyers',
'members.filterByRating': 'Filter by rating',
'members.rating': 'Rating',
'members.allRatings': 'All Ratings',
'members.5stars': '5 Stars',
'members.4plusStars': '4+ Stars',
'members.noResults': 'No results for "{query}"',
'members.noMembers': 'No members available.',
'members.trustedMember': 'Trusted Member',
'members.memberSince': 'Member since {date}',
'members.viewProfile': 'View Profile',
'members.profile': 'Profile',
'members.aboutMember': 'About the Member',
'members.listings': 'Listings',
'members.sales': 'Sales',
'members.memberInfo': 'Member Information',
'members.joinDate': 'Join Date',
'members.totalListings': 'Total Listings',

'leaderboard.title': 'Leaderboard',
'leaderboard.subtitle': 'Top sellers and buyers',
'leaderboard.description': 'Discover the top sellers on NXOLand.',
'leaderboard.navDescription': 'Top sellers and buyers',
'leaderboard.skipToLeaderboard': 'Skip to leaderboard',
'leaderboard.rank': 'Rank',
'leaderboard.member': 'Member',
'leaderboard.sales': 'Sales',
'leaderboard.rating': 'Rating',
'leaderboard.topSeller': '#1 Top Seller',
'leaderboard.gold': 'Gold',
'leaderboard.silver': 'Silver',
'leaderboard.bronze': 'Bronze',
'leaderboard.deals': 'Deals',
'leaderboard.fullRanking': 'Full Ranking',
'leaderboard.loadError': 'Failed to load leaderboard.',
'leaderboard.tryAgain': 'Please try again.',
'leaderboard.noData': 'No data available.',


// Suggestions
'suggestions.title': 'Suggestions & Feedback Center',
'suggestions.subtitle': 'Share your ideas and rate your experience.',
'suggestions.platformRating': 'Rate Your Experience',
'suggestions.yourRating': 'Your Platform Rating',
'suggestions.yourFeedback': 'Tell us about your experience',
'suggestions.submitRating': 'Submit Rating',
'suggestions.newSuggestion': 'Platform Improvement Suggestion',
'suggestions.suggestionTitle': 'Suggestion Title',
'suggestions.suggestionDesc': 'Describe your suggestion in detail...',
'suggestions.submitSuggestion': 'Submit Suggestion',
'suggestions.upvote': 'Upvote',
'suggestions.downvote': 'Downvote',
'suggestions.votes': 'votes',
'suggestions.platformRatingSubtitle': 'Share your thoughts to help us improve.',
'suggestions.totalReviewsCount': '{count} reviews',
'suggestions.positiveRatings': '{percentage}% positive ratings',
'suggestions.ratingFeedback5': 'Excellent! 🎉',
'suggestions.ratingFeedback4': 'Very good 👍',
'suggestions.ratingFeedback3': 'Good ✓',
'suggestions.ratingFeedback2': 'Needs improvement',
'suggestions.ratingFeedback1': 'Poor',
'suggestions.feedbackFieldLabel': 'Tell us about your experience',
'suggestions.feedbackHint': '(minimum 10 characters)',
'suggestions.feedbackPlaceholder': 'What did you like? What can we improve?',
'suggestions.statusUpdated': 'Suggestion status updated successfully',
'suggestions.statusUpdateError': 'Failed to update suggestion status',
'suggestions.deleteSuccess': 'Suggestion deleted successfully',
'suggestions.deleteError': 'Failed to delete suggestion',
'suggestions.characterCount': '{count} / {max} characters',
'suggestions.charactersRemaining': '{count} characters remaining',
'suggestions.ready': 'Ready',
'suggestions.suggestionPlaceholder': 'Suggestion title',
'suggestions.descriptionPlaceholder': 'Describe your suggestion in detail...',
'suggestions.anonymousUser': 'Guest user',
'suggestions.commentCount': '{count} comments',
'suggestions.voteUpAria': 'Upvote suggestion',
'suggestions.voteDownAria': 'Downvote suggestion',
'suggestions.invalidLink': 'Invalid link',
'suggestions.status.pending': 'Under Review',
'suggestions.status.approved': 'Approved',
'suggestions.status.implemented': 'Implemented',
'suggestions.voteError': 'Failed to vote. Please try again.',
'suggestions.loginToVote': 'You must log in to vote.',
'suggestions.createSuccess': 'Your suggestion has been submitted successfully.',
'suggestions.createError': 'Failed to submit suggestion.',
'suggestions.loginToSuggest': 'You must log in to add a suggestion.',
'suggestions.securityVerification': 'Please complete the security verification.',
'suggestions.fillAllFields': 'Please fill in all fields.',
'suggestions.reviewSuccess': 'Thank you for your rating! Your feedback has been submitted.',
'suggestions.reviewError': 'Failed to submit rating.',
'suggestions.loginToReview': 'You must log in to rate the platform.',
'suggestions.selectRating': 'Please select a rating.',
'suggestions.minReviewLength': 'Please write a comment of at least 10 characters.',
'suggestions.avgRating': 'Average Rating',
'suggestions.totalReviews': 'Total Reviews',
'suggestions.topSuggestions': 'Top Suggestions',
'suggestions.recentSuggestions': 'Recent Suggestions',
'suggestions.all': 'All',
'suggestions.pending': 'Pending',
'suggestions.approved': 'Approved',
'suggestions.implemented': 'Implemented',
'suggestions.submitting': 'Submitting...',
'suggestions.pageSubtitle': 'Share your ideas and rate your experience on the platform.',
'suggestions.shareIdeas': 'Share your ideas to suggest new features.',
'suggestions.noSuggestionsInCategory': 'No suggestions in this category.',


// My Listings
'myListings.title': 'My Listings',
'myListings.subtitle': 'Manage your accounts listed for sale (you can buy and sell with the same account).',
'myListings.loginRequired': 'You must log in to view your listings.',
'myListings.loginButton': 'Log In',
'myListings.addAccount': 'Add Account',
'myListings.createNew': 'Create New Listing',
'myListings.all': 'All',
'myListings.active': 'Active',
'myListings.inactive': 'Inactive',
'myListings.sold': 'Sold',
'myListings.totalListings': 'Total Listings',
'myListings.noListings': 'No listings yet.',
'myListings.noListingsMessage': 'You haven\'t created any listings yet.',
'myListings.getStarted': 'Start Selling',
'myListings.edit': 'Edit',
'myListings.delete': 'Delete',
'myListings.view': 'View',
'myListings.cancel': 'Cancel',
'myListings.confirm': 'Confirm',
'myListings.markAsSold': 'Mark as Sold',
'myListings.reactivate': 'Reactivate',
'myListings.deactivate': 'Deactivate',
'myListings.deleteConfirm': 'Are you sure?',
'myListings.deleteMessage': 'This listing will be permanently deleted.',
'myListings.soldConfirm': 'Mark as sold?',
'myListings.soldMessage': 'Do you want to mark this listing as sold?',
'myListings.deleteSuccess': 'Listing deleted successfully.',
'myListings.deleteError': 'Failed to delete listing.',
'myListings.hasActiveOrders': 'Cannot delete this listing because it has active orders.',
'myListings.updateSuccess': 'Listing status updated.',
'myListings.updateError': 'Failed to update listing.',
'myListings.stats': 'Statistics',
'myListings.views': 'Views',
'myListings.price': 'Price',
'myListings.status': 'Status',
'myListings.actions': 'Actions',
'myListings.createdAt': 'Created At',
'myListings.previous': 'Previous',
'myListings.next': 'Next',
'myListings.page': 'Page',
'myListings.of': 'of',
'myListings.emptyStateTitle': 'No Listings',
'myListings.emptyStateMessage': 'Start by adding your first account for sale.',
'myListings.addNewAccount': 'Add New Account',
'myListings.noListingsForFilter': 'No listings match your filters.',
'myListings.viewCount': 'view',
'myListings.deleteTitle': 'Confirm Deletion',
'myListings.deleteDescription': 'Are you sure you want to delete this listing? This action cannot be undone.',
'myListings.soldTitle': 'Confirm Sale',
'myListings.soldDescription': 'Has this account been sold? The status will be updated to "Sold" and hidden from public listings.',
'myListings.confirmSale': 'Confirm Sale',


// Admin
'admin.dashboard': 'Dashboard',
'admin.users': 'Users',
'admin.listings': 'Listings',
'admin.orders': 'Orders',
'admin.disputes': 'Disputes',
'admin.notifications': 'Notifications',
'admin.settings': 'Settings',
'admin.legalContent': 'Legal Content',
'admin.stats': 'Statistics',
'admin.activity': 'Recent Activity',
'admin.totalUsers': 'Total Users',
'admin.activeListings': 'Active Listings',
'admin.pendingOrders': 'Pending Orders',
'admin.openDisputes': 'Open Disputes',
'admin.revenue': 'Revenue',
'admin.actions': 'Actions',
'admin.ban': 'Ban',
'admin.unban': 'Unban',
'admin.verify': 'Verify',
'admin.reject': 'Reject',
'admin.approve': 'Approve',
'admin.viewDetails': 'View Details',
'admin.sendNotification': 'Send Notification',
'admin.broadcastMessage': 'Broadcast Message',
'admin.reviews': 'Reviews',
'admin.financial': 'Financial Reports',
'admin.activityLogs': 'Activity Logs',
'admin.totalRevenue': 'Total Revenue',
'admin.pendingWithdrawals': 'Pending Withdrawals',
'admin.transactions': 'Transactions',
'admin.filter': 'Filter',
'admin.exportData': 'Export Data',
'admin.refresh': 'Refresh',
'admin.loading': 'Loading...',
'admin.withdrawals': 'Withdrawal Requests',
'admin.withdrawalsSubtitle': 'Review and approve user withdrawal requests',
'admin.allStatuses': 'All Statuses',
'admin.pending': 'Pending',
'admin.processing': 'Processing',
'admin.completed': 'Completed',
'admin.failed': 'Failed',
'admin.cancelled': 'Cancelled',
'admin.noWithdrawals': 'No withdrawal requests',
'admin.searchByNameOrEmail': 'Search by name or email',
'admin.withdrawalDetails': 'Withdrawal Request Details',
'admin.amount': 'Amount',
'admin.status': 'Status',
'admin.user': 'User',
'admin.iban': 'IBAN / Account Number',
'admin.bankName': 'Bank Name',
'admin.accountHolderName': 'Account Holder Name',
'admin.requestDate': 'Request Date',
'admin.processedDate': 'Processed Date',
'admin.transferId': 'Transfer ID',
'admin.failureReason': 'Failure Reason',
'admin.confirmApprove': 'Confirm Approval',
'admin.confirmApproveMessage': 'The transfer will be initiated. Please verify the bank account details.',
'admin.approveWarning': 'Funds will be transferred within 1-4 business days.',
'admin.rejectWithdrawal': 'Reject Withdrawal Request',
'admin.rejectMessage': 'The withdrawal request will be rejected and the amount will be refunded to the user\'s balance.',
'admin.rejectReason': 'Rejection Reason',
'admin.rejectReasonRequired': 'Please enter a rejection reason',
'admin.rejectReasonPlaceholder': 'Enter the reason for rejecting the withdrawal request...',
'admin.rejectReasonHint': 'The user will be notified of this reason.',
'admin.rejectWarning': 'The amount will be refunded to the user\'s available balance.',
'admin.confirmReject': 'Confirm Rejection',
'admin.withdrawalApproved': 'Withdrawal request approved successfully',
'admin.withdrawalApproveError': 'Failed to approve withdrawal request',
'admin.withdrawalRejected': 'Withdrawal request rejected successfully',
'admin.withdrawalRejectError': 'Failed to reject withdrawal request',
'admin.orderBreakdown': 'Contributing Orders Breakdown',
'admin.item': 'Item',
'admin.total': 'Total',
'admin.order': 'Order',


// Help & Support
'help.title': 'Help',
'help.description': 'Help Center — get answers to your questions about the platform.',
'help.subtitle': 'Answers to common questions about NXOLand.',
'help.skipToContent': 'Skip to content',
'help.faq': 'Frequently Asked Questions',
'help.faqTitle': 'Frequently Asked Questions',
'help.contactSupport': 'Contact Support',
'help.contactUs': 'Contact Us',
'help.contactMessage': 'Need help? Our team is available on Discord to answer your questions.',
'help.discordJoin': 'Join Discord',
'help.discordSupport': 'Official support channel — available 24/7.',
'help.discordMessage': '💬 All inquiries and support requests are handled via the official Discord server.',
'help.improvementTitle': 'Help Us Improve',
'help.improvementMessage': 'Your opinion matters! Share your experience and suggestions to improve the platform.',
'help.ratePlatform': 'Rate the platform and share your suggestions',
'help.footerCopyright': '© 2025 NXOLand. All rights reserved.',
'help.searchHelp': 'Search for help...',
'help.popularTopics': 'Popular Topics',
'help.gettingStarted': 'Getting Started',
'help.buyingGuide': 'Buying Guide',
'help.sellingGuide': 'Selling Guide',
'help.accountSecurity': 'Account Security',
'help.paymentsAndFees': 'Payments & Fees',
'help.faq1Q': 'How do I buy an account?',
'help.faq1A': 'Browse the marketplace, choose the right account, click Buy, and pay securely. The account will be delivered within 12 hours.',
'help.faq2Q': 'Is payment secure?',
'help.faq2A': 'Yes. We use a trusted and fully encrypted payment system. All transactions are protected.',
'help.faq3Q': 'How long does delivery take?',
'help.faq3A': 'After payment, credentials are delivered instantly. You have 12 hours to review and confirm receipt.',
'help.faq4Q': 'What if the account doesn\'t match the description?',
'help.faq4A': 'You can open a dispute during the 12-hour escrow period. Our team will review the case and decide accordingly.',
'help.faq5Q': 'What are the platform fees?',
'help.faq5A': 'We charge a 5% commission on each sale. This covers escrow, support, and protection services.',
'help.faq6Q': 'How do I withdraw my earnings?',
'help.faq6A': 'Go to Wallet, click Withdraw, enter your IBAN, and submit the request. Transfers take 1–4 business days.',
'help.email': 'Email',
'help.whatsapp': 'WhatsApp',
'help.liveChat': 'Live Chat',
'help.discordLiveChat': 'Live Chat via Discord',
'help.responseTimes': 'Response & Processing Times',
'help.responseTime': 'We respond to complaints within 24 hours',
'help.processingTime': 'We process complaints within 48-72 hours',


// About
'about.title': 'About Us',
'about.description': 'Learn about NXOLand and our vision for a secure account-trading platform.',
'about.subtitle': 'NXOLand — our vision, values, and goal of delivering a safe trading experience.',
'about.skipToContent': 'Skip to content',
'about.ourMission': 'Our Mission',
'about.vision': 'Our Vision',
'about.visionText': 'We aim to be the most trusted platform in the Middle East for digital account trading, providing a secure, reliable environment for buyers and sellers.',
'about.ourValues': 'Our Values',
'about.security': 'Security & Protection',
'about.securityDesc': 'Comprehensive protection for all transactions through an intelligent escrow system.',
'about.speed': 'Speed & Efficiency',
'about.speedDesc': 'Fast processes and instant account delivery.',
'about.trust': 'Trust & Transparency',
'about.trustDesc': 'Building trust through transparency and credibility.',
'about.story': 'Our Story',
'about.storyPara1': 'NXOLand began with a simple idea: a secure, reliable platform for game account trading in the Middle East, protecting both buyer and seller.',
'about.storyPara2': 'As gaming and digital platforms grew, account trading became essential — but many platforms lack adequate protection and support.',
'about.storyPara3': 'That\'s why we built NXOLand: combining security, speed, and transparency to protect both parties from start to finish.',
'about.howItWorks': 'How It Works',
'about.buyerSteps': 'Buyer Steps',
'about.buyerStep1Title': 'Browse Accounts',
'about.buyerStep1Desc': 'Find the right account in the marketplace.',
'about.buyerStep2Title': 'Order & Pay',
'about.buyerStep2Desc': 'Place your order and pay securely through the platform.',
'about.buyerStep3Title': 'Receive Credentials',
'about.buyerStep3Desc': 'Get the account credentials after seller approval.',
'about.buyerStep4Title': 'Confirm',
'about.buyerStep4Desc': 'Review the account and confirm receipt to complete.',
'about.sellerSteps': 'Seller Steps',
'about.sellerStep1Title': 'Create Listing',
'about.sellerStep1Desc': 'Add your account details and price.',
'about.sellerStep2Title': 'Receive Orders',
'about.sellerStep2Desc': 'Receive buyer orders and review details.',
'about.sellerStep3Title': 'Deliver Account',
'about.sellerStep3Desc': 'Send credentials to the buyer through the platform.',
'about.sellerStep4Title': 'Receive Payment',
'about.sellerStep4Desc': 'Get paid after the buyer confirms receipt.',
'about.activeUsers': 'Active Users',
'about.successfulDeals': 'Successful Deals',
'about.satisfactionRate': 'Satisfaction Rate',
'about.team': 'Team',
'about.contact': 'Contact Us',
'about.support': 'Technical Support',
'about.contactInfo': 'Contact Information',
'about.commercialRegistration': 'Commercial Registration',
'about.email': 'Email',
'about.whatsapp': 'WhatsApp',
'about.liveChat': 'Live Chat',
'about.discordLiveChat': 'Live Chat via Discord',
'about.responseTimes': 'Response & Processing Times',
'about.responseTime': 'We respond to complaints within 24 hours',
'about.processingTime': 'We process complaints within 48-72 hours',
'common.copyright': '© 2025 NXOLand. All rights reserved.',


// Error Messages
'error.404': 'Page Not Found',
'error.404.desc': 'Sorry, the page you\'re looking for doesn\'t exist.',
'error.500': 'Server Error',
'error.500.desc': 'An unexpected error occurred.',
'error.networkError': 'Network Error',
'error.tryAgain': 'Try Again',
'error.goHome': 'Go Home',
'error.forbidden': 'Forbidden',
'error.unauthorized': 'Please log in.',
'error.sessionExpired': 'Session expired.',


// Status Messages
'status.loading': 'Loading...',
'status.saving': 'Saving...',
'status.uploading': 'Uploading...',
'status.processing': 'Processing...',
'status.success': 'Success',
'status.failed': 'Failed',
'status.pending': 'Pending',
'status.completed': 'Completed',
'status.cancelled': 'Cancelled',

// Maintenance
'maintenance.title': 'Maintenance Mode',
'maintenance.description': 'We are working to improve the site to serve you better',
'maintenance.descriptionDetail': 'NXOLand is a secure platform for buying and selling digital gaming accounts with an integrated guarantee system. We are currently working on important updates to improve your experience.',
'maintenance.discordButton': 'Join Discord for Latest Updates',
'maintenance.discordAriaLabel': 'Join Discord',
'maintenance.statusMessage': 'The site will reopen soon. Thank you for your patience!',

// Common additions
'common.verified': 'Verified',

// NotFound
'notFound.browseMarketplace': 'Browse Marketplace',
'notFound.youMightBeLookingFor': 'You might be looking for:',
'notFound.links.marketplace': 'Marketplace',
'notFound.links.members': 'Members',
'notFound.links.help': 'Help Center',

// Refund Policy
'refundPolicy.title': 'Refund & Return Policy',
'refundPolicy.emptyState': 'No refund policy available',
'refundPolicy.lastUpdated': 'Last updated:',

// Privacy
'privacy.title': 'Privacy Policy',
'privacy.emptyState': 'No privacy policy available',
'privacy.lastUpdated': 'Last updated:',

// Terms
'terms.title': 'Terms & Conditions',
'terms.emptyState': 'No terms and conditions available',
'terms.lastUpdated': 'Last updated:',

// Suggestions
'suggestions.confirmDelete': 'Are you sure you want to delete this suggestion?',
'suggestions.markAsImplemented': 'Mark as Implemented',
'suggestions.delete': 'Delete',

// Sell Social
'sell.social.comingSoon': 'Coming Soon',
'sell.social.comingSoonDescription': 'We are working on adding this feature soon',
'sell.social.goBack': 'Go Back',

// Order
'order.revealAccountInfo': 'Click "Show" to reveal account information',
'order.waitingBuyerConfirmation': 'Waiting for buyer confirmation',
'order.escrowHoldMessage': 'Funds are held and will be transferred after buyer confirmation',

// Disputes
'disputes.status.open': 'Open',
'disputes.status.underReview': 'Under Review',
'disputes.status.resolved': 'Resolved',
'disputes.status.closed': 'Closed',
'disputes.party.buyer': 'Buyer',
'disputes.party.seller': 'Seller',
'disputes.selectOrder': 'Select Order',
'disputes.orderLabel': 'Order',
'disputes.account': 'Account',

// Admin Financial
'admin.financial.totalRevenue': 'Total Revenue',
'admin.financial.commissionsCollected': 'Commissions Collected',
'admin.financial.pendingPayments': 'Pending Payments',
'admin.financial.totalWithdrawals': 'Total Withdrawals',
'admin.financial.title': 'Financial Reports',
'admin.financial.subtitle': 'Manage and monitor financial operations',
'admin.financial.selectPeriod': 'Select Period',
'admin.financial.exportReport': 'Export Report',
'admin.financial.recentTransactions': 'Recent Transactions',
'admin.financial.noTransactions': 'No transactions found',
'admin.financial.tableHeaders.id': 'ID',
'admin.financial.tableHeaders.type': 'Type',
'admin.financial.tableHeaders.amount': 'Amount',
'admin.financial.tableHeaders.details': 'Details',
'admin.financial.tableHeaders.date': 'Date',
'admin.financial.tableHeaders.status': 'Status',
'admin.financial.transactionTypes.order': 'Order',
'admin.financial.transactionTypes.withdrawal': 'Withdrawal',
'admin.financial.transactionTypes.refund': 'Refund',
'admin.financial.statuses.completed': 'Completed',
'admin.financial.statuses.pending': 'Pending',
'admin.financial.statuses.processing': 'Processing',
'admin.financial.statuses.escrowHold': 'Escrow Hold',
'admin.financial.statuses.failed': 'Failed',
'admin.financial.statuses.cancelled': 'Cancelled',
'admin.financial.details.order': 'Order:',
'admin.financial.details.seller': 'Seller:',
'admin.financial.details.buyer': 'Buyer:',
'admin.financial.details.user': 'User:',

// Admin Reviews
'admin.reviews.title': 'Reviews Management',
'admin.reviews.subtitle': 'Review and approve user reviews',
'admin.reviews.searchPlaceholder': 'Search reviews...',
'admin.reviews.filters.allStatus': 'All Status',
'admin.reviews.filters.approved': 'Approved',
'admin.reviews.filters.flagged': 'Flagged',
'admin.reviews.filters.allRatings': 'All Ratings',
'admin.reviews.filters.stars': 'Stars',
'admin.reviews.actions.search': 'Search',
'admin.reviews.actions.approve': 'Approve Review',
'admin.reviews.actions.delete': 'Delete Review',
'admin.reviews.actions.viewDetails': 'View Details',
'admin.reviews.actions.loadMore': 'Load More',
'admin.reviews.status.approved': 'Approved',
'admin.reviews.status.flagged': 'Flagged',
'admin.reviews.labels.noReviews': 'No reviews found',
'admin.reviews.labels.reviewFor': 'Review for:',
'admin.reviews.labels.product': 'Product:',
'admin.reviews.labels.helpful': 'Helpful:',
'admin.reviews.users': 'users',
'admin.reviews.labels.reports': 'reports',
'admin.reviews.labels.anonymous': 'Anonymous',
'admin.reviews.comingSoon.removeReports': 'Coming soon: Remove reports',
'admin.reviews.comingSoon.deleteReview': 'Coming soon: Delete review',
'admin.reviews.comingSoon.viewDetails': 'Coming soon: View details',
'admin.reviews.comingSoon.pagination': 'Coming soon: Pagination',

// Admin Notifications
'admin.notifications.types.order': 'Order',
'admin.notifications.types.dispute': 'Dispute',
'admin.notifications.types.message': 'Message',
'admin.notifications.types.system': 'System',
'admin.notifications.types.announcement': 'Announcement',
'admin.notifications.filters.all': 'All',
'admin.notifications.filters.buyers': 'Buyers',
'admin.notifications.filters.sellers': 'Sellers',

// Admin Orders
'admin.orders.status.completed': 'Completed',
'admin.orders.status.escrowHold': 'Escrow Hold',
'admin.orders.status.paid': 'Paid',
'admin.orders.status.pending': 'Pending',
'admin.orders.status.cancelled': 'Cancelled',
'admin.orders.status.disputed': 'Disputed',
'admin.orders.cancelledBy': 'Cancelled by:',
'admin.orders.cancelledBy.admin': 'Admin',
'admin.orders.cancelledBy.user': 'User',
'admin.orders.dispute.status.open': 'Open',
'admin.orders.dispute.status.resolved': 'Resolved',
'admin.orders.dispute.status.closed': 'Closed',
'admin.orders.actions.delete': 'Delete',
'admin.orders.amount': 'Amount',
'admin.orders.paymentStatus': 'Payment Status',
'admin.orders.paymentId': 'Payment ID',
'admin.orders.paymentStatus.paid': 'Paid',
'admin.orders.paymentStatus.pending': 'Pending',
'admin.orders.paymentStatus.unspecified': 'Unspecified',
'admin.orders.timeline': 'Timeline',
'admin.orders.createdAt': 'Created At:',
'admin.orders.updatedAt': 'Last Updated:',
'admin.orders.cancelledAt': 'Cancelled At:',
'admin.orders.cancellationReason': 'Cancellation Reason',
'admin.orders.activeDispute': 'Active Dispute',
'admin.orders.disputeStatus': 'Status:',
'admin.orders.cancelSuccess': 'Order cancelled and amount refunded to buyer',
'admin.orders.cancelReasonRequired': 'Please enter cancellation reason',
'admin.orders.cancelWarning': '⚠️ The order will be cancelled and the amount will be automatically refunded to the buyer\'s wallet',

// Admin Users
'admin.users.status.deleted': 'Deleted',
'admin.users.status.active': 'Active',
'admin.users.verifiedTooltip': 'Verified',
'admin.users.role.admin': 'Admin',
'admin.users.role.user': 'User',
'admin.users.actions.delete': 'Delete',
'admin.users.title': 'Users Management',
'admin.users.subtitle': 'View and manage all platform users',
'admin.users.userCount': 'users',
'admin.users.noUsers': 'No users found',
'admin.users.noUsersSearch': ' matching search',
'admin.users.verifiedByEmail': 'Verified by Email',
'admin.users.kycVerified': 'KYC Verified',
'admin.users.userId': 'User ID:',
'admin.users.role': 'Role:',
'admin.users.deleteUser': 'Delete User',
'admin.users.confirmDelete': 'Confirm Deletion',
'admin.users.confirmDeleteMessage': 'Are you sure you want to delete this user? This action cannot be undone.',
'admin.users.deleteSuccess': 'User deleted successfully',
'admin.users.deleteError': 'Failed to delete user',
'admin.users.userDetails': 'Detailed User Information',

// Admin Listings
'admin.listings.status.active': 'Active',
'admin.listings.status.sold': 'Sold',
'admin.listings.status.inactive': 'Inactive',
'admin.listings.actions.delete': 'Delete',
'admin.listings.deleteSuccess': 'Listing deleted successfully',
'admin.listings.deleteError': 'Failed to delete listing',
'admin.listings.deleteListing': 'Delete Listing',
'admin.listings.confirmDelete': 'Confirm Listing Deletion',
'admin.listings.confirmDeleteMessage': 'Are you sure you want to delete this listing? This action cannot be undone and all listing-related data will be deleted.',

// Admin Legal Content
'admin.legalContent.edit': 'Edit',
'admin.legalContent.preview': 'Preview',

// Profile Edit
'profile.edit.fullNameAriaLabel': 'Full Name',
'profile.edit.emailAriaLabel': 'Email',
'profile.edit.phoneAriaLabel': 'Phone Number',

// Error Boundary
'errorBoundary.retryAriaLabel': 'Retry',
'errorBoundary.backToHomeAriaLabel': 'Back to Home',

// TikTok OAuth
'tiktok.connected': 'Connected to TikTok: @{username}',
'tiktok.connectError': 'Please connect your TikTok account first',
'tiktok.connectTitle': 'Connect TikTok',
'tiktok.connectDescription': 'Connect your account to verify ownership',
'tiktok.connectButton': 'Connect TikTok',
'tiktok.privacyNote': '🔒 We only use TikTok to verify account ownership. We won\'t post or access anything else.',
'tiktok.sellAccount': 'Sell TikTok Account',
'tiktok.connectedAs': 'Connected as {name}',
'tiktok.verifyOwnership': 'Verify Account Ownership',
'tiktok.addCodeToBio': 'Add this code to your TikTok bio',
'tiktok.steps': 'Steps:',
'tiktok.step1': 'Copy the code above',
'tiktok.step2': 'Open TikTok app',
'tiktok.step3': 'Go to your profile',
'tiktok.step4': 'Tap "Edit Profile"',
'tiktok.step5': 'Paste code in Bio',
'tiktok.step6': 'Save changes',
'tiktok.step7': 'Come back and click "Verify"',
'tiktok.verifying': 'Verifying...',
'tiktok.verifyNow': 'I Added It - Verify Now',
'tiktok.verifiedSuccess': '✅ Verified Successfully!',
'tiktok.bioVerified': '✅ Bio verified successfully!',
'tiktok.verificationFailed': 'Verification Failed',
'tiktok.pleaseVerifyBio': 'Please verify your bio first',
'tiktok.copied': 'Copied!',
'tiktok.codeCopied': 'Verification code copied to clipboard',
'tiktok.continue': 'Continue',

// Social Product Example
'socialProduct.home': 'Home',
'socialProduct.marketplace': 'Marketplace',
'socialProduct.accountDetails': 'Account Details',
'socialProduct.availableNow': 'Available Now',
'socialProduct.verifiedSeller': 'Verified Seller',
'socialProduct.sales': 'Sales',
'socialProduct.rating': 'Rating',
'socialProduct.member': 'Member',
'socialProduct.withPrimaryEmail': 'With Primary Email',
'socialProduct.yes': 'Yes',
'socialProduct.no': 'No',
'socialProduct.accountLinkedToPhone': 'Account Linked to Phone Number',
'socialProduct.description': 'Description',
'socialProduct.buyNow': 'Buy Now',
'socialProduct.contactSeller': 'Contact Seller',
'socialProduct.sellerReviews': 'Seller Reviews',

// Admin Activity
'admin.activity.title': 'Activity Log',
'admin.activity.subtitle': 'Track all admin and moderator actions',
'admin.activity.searchPlaceholder': 'Search log...',
'admin.activity.allActivities': 'All Activities',
'admin.activity.users': 'Users',
'admin.activity.listings': 'Listings',
'admin.activity.orders': 'Orders',
'admin.activity.disputes': 'Disputes',
'admin.activity.settings': 'Settings',
'admin.activity.search': 'Search',
'admin.activity.severity': 'Severity',
'admin.activity.severityHigh': 'High',
'admin.activity.severityMedium': 'Medium',
'admin.activity.severityLow': 'Low',
'admin.activity.admin': 'Admin:',
'admin.activity.target': 'Target:',
'admin.activity.time': 'Time:',

// Admin Disputes
'admin.disputes.title': 'Disputes Management',
'admin.disputes.subtitle': 'Review and resolve disputes between users',
'admin.disputes.disputeCount': 'disputes',
'admin.disputes.searchPlaceholder': 'Search for dispute...',
'admin.disputes.search': 'Search',
'admin.disputes.noDisputes': 'No disputes to display',
'admin.disputes.noMatchingDisputes': 'No disputes matching search',
'admin.disputes.disputeNumber': 'Dispute #{id}',
'admin.disputes.statusOpen': 'Open',
'admin.disputes.statusResolved': 'Resolved',
'admin.disputes.statusClosed': 'Closed',
'admin.disputes.inFavorOfBuyer': 'In Favor of Buyer',
'admin.disputes.inFavorOfSeller': 'In Favor of Seller',
'admin.disputes.order': 'Order:',
'admin.disputes.reporter': 'Reporter:',
'admin.disputes.reported': 'Reported:',
'admin.disputes.reason': 'Reason:',
'admin.disputes.viewDetails': 'View Details',
'admin.disputes.resolveForBuyer': 'Resolve for Buyer',
'admin.disputes.resolveForSeller': 'Resolve for Seller',
'admin.disputes.disputeDetails': 'Dispute Details',
'admin.disputes.orderInfo': 'Order Information',
'admin.disputes.orderNumber': 'Order Number:',
'admin.disputes.product': 'Product:',
'admin.disputes.price': 'Price:',
'admin.disputes.reporterLabel': 'Reporter',
'admin.disputes.reportedLabel': 'Reported',
'admin.disputes.notSpecified': 'Not specified',
'admin.disputes.disputeReason': 'Dispute Reason',
'admin.disputes.timeline': 'Timeline',
'admin.disputes.reportDate': 'Report Date:',
'admin.disputes.resolveDate': 'Resolve Date:',
'admin.disputes.resolutionInfo': 'Resolution Information',
'admin.disputes.resolvedInFavorOf': 'Resolved in favor of:',
'admin.disputes.adminNotes': 'Admin Notes:',
'admin.disputes.resolvedBy': 'Resolved by:',
'admin.disputes.resolveForBuyerButton': 'Resolve for Buyer',
'admin.disputes.resolveForSellerButton': 'Resolve for Seller',
'admin.disputes.resolveTitle': 'Resolve Dispute in Favor of {party}',
'admin.disputes.adminNotesLabel': 'Admin Notes',
'admin.disputes.adminNotesPlaceholder': 'Write notes explaining the resolution...',
'admin.disputes.resolutionNote': 'ℹ️ The dispute will be resolved and both parties will be notified',
'admin.disputes.resolving': 'Resolving...',
'admin.disputes.confirmResolve': 'Confirm Resolution',
'admin.disputes.addNotesRequired': 'Please add notes for the resolution',
'admin.disputes.resolveSuccess': 'Dispute resolved successfully',
'admin.disputes.resolveError': 'Failed to resolve dispute',
'admin.disputes.resolutionNoteAuto': 'Resolved in favor of {party} by administration',

// Reviews Page (duplicate removed - already exists earlier)
'reviews.subtitle': 'Previous buyers\' opinions',
'reviews.basedOn': 'Based on {count} reviews',
'reviews.positiveReviews': 'positive reviews',
'reviews.all': 'All',
'reviews.sortRecent': 'Most Recent',
'reviews.sortHelpful': 'Most Helpful',
'reviews.sortRatingHigh': 'Rating: Highest',
'reviews.sortRatingLow': 'Rating: Lowest',
'reviews.sortRatingHighFirst': 'Rating: Highest First',
'reviews.sortRatingLowFirst': 'Rating: Lowest First',
'reviews.loadError': 'Failed to load reviews',
'reviews.previous': 'Previous',
'reviews.next': 'Next',
'reviews.noReviewsInCategory': 'No reviews in this category',
'reviews.reportTitle': 'Report Inappropriate Review',
'reviews.reportDescription': 'Select a reason for reporting this review. The report will be reviewed by the moderation team.',
'reviews.reportSpam': 'Spam content',
'reviews.reportOffensive': 'Offensive or inappropriate content',
'reviews.reportFake': 'Fake or fabricated review',
'reviews.reportIrrelevant': 'Not related to product or service',
'reviews.reportOther': 'Other reason',
'reviews.reportOtherPlaceholder': 'Please clarify the reason... (at least 10 characters)',
'reviews.reportSending': 'Sending...',
'reviews.reportSubmit': 'Submit Report',
'reviews.reportSelectReason': 'Please select a report reason',
'reviews.reportClarifyReason': 'Please clarify the reason (at least 10 characters)',
'reviews.reportSuccess': 'Review reported successfully',
'reviews.reportAlreadyReported': 'You have already reported this review',
'reviews.reportError': 'Failed to report review',
'reviews.editTitle': 'Edit Review',
'reviews.editDescription': 'Update your rating and comment',
'reviews.deleteTitle': 'Delete Review',
'reviews.deleteDescription': 'Are you sure you want to delete this review? This action cannot be undone.\n\nThe review will be permanently deleted from the platform and you will not be able to restore it.',
'reviews.deleteConfirm': 'Delete Review',
'reviews.deleting': 'Deleting...',
'reviews.deleteSuccess': 'Review deleted successfully',
'reviews.deleteError': 'Failed to delete review',
'reviews.updateError': 'Failed to update review',
'reviews.markHelpfulError': 'Failed to update rating',

  }
};
