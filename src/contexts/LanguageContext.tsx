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
'nav.marketplace': 'المتجر',
'nav.sell': 'بيع حساب',
'nav.orders': 'طلباتي',
'nav.wallet': 'المحفظة',
'nav.profile': 'الملف الشخصي',
'nav.admin': 'لوحة التحكم',
'nav.members': 'الأعضاء',
'nav.leaderboard': 'المتصدرين',
'nav.help': 'المساعدة',
'nav.disputes': 'النزاعات',
'nav.myListings': 'إعلاناتي',
'nav.kyc': 'توثيق الهوية',
    'nav.notifications': 'الإشعارات',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',
    'nav.suggestions': 'الاقتراحات والتقييم',
'nav.community': 'المجتمع',

// Home
'home.hero.title': 'NXOLand — منصتك الآمنة لتداول حسابات الألعاب',
'home.hero.subtitle': 'بيع وشراء حساباتك المفضلة بسهولة، سرعة، وحماية تامة عبر نظام وساطة ذكي',
'home.hero.browseAccounts': 'تصفح الحسابات',
'home.hero.learnMore': 'اعرف المزيد',

'home.features.security': '🔒 أمان مضمون',
'home.features.fast': '⚡ معاملات سريعة',
'home.features.support': '💬 دعم مباشر 24/7',

'home.whyChoose': 'ليش تختار NXOLand؟',

'home.feature1.title': 'نظام وساطة آمن',
'home.feature1.desc': 'نحفظ حق البائع والمشتري من أول عملية حتى آخر خطوة',

'home.feature2.title': 'دعم متواصل',
'home.feature2.desc': 'فريق دعم متواجد دائمًا عبر ديسكورد لخدمتك في أي وقت',

'home.feature3.title': 'أسعار عادلة وتنافسية',
'home.feature3.desc': 'نقدم تجربة بيع وشراء بأسعار مميزة وبدون عمولات مبالغ فيها',

'home.feature4.title': 'تحويل فوري وآمن',
'home.feature4.desc': 'يتم التحويل للبائع فور تأكيد المشتري استلام الحساب',

'home.howItWorks': 'طريقة العمل',

'home.step1.title': 'اختر الحساب المناسب',
'home.step1.desc': 'تصفح حسابات متعددة حسب اللعبة، السعر، والمستوى',

'home.step2.title': 'ادفع بأمان تام',
'home.step2.desc': 'استخدم نظام Tap للدفع الموثوق والمشفر بالكامل',

'home.step3.title': 'استلم حسابك فورًا',
'home.step3.desc': 'بعد الدفع يتم تسليم الحساب تلقائيًا مع ضمان الحقوق للطرفين',

'home.cta.title': 'ابدأ الآن بثقة',
'home.cta.subtitle': 'انضم لآلاف اللاعبين اللي يثقون في NXOLand لتداول حساباتهم بأمان',
'home.cta.getStarted': 'ابدأ التداول',

'home.footer.rights': '© جميع الحقوق محفوظة لـ NXOLand',
'home.footer.terms': 'الشروط والأحكام',
'home.footer.privacy': 'سياسة الخصوصية',
'home.footer.support': 'الدعم الفني',
'home.footer.suggestions': 'الاقتراحات والتقييم',

    
    // Sell
    'sell.title': 'اختر اللعبة',
    'sell.subtitle': 'حدد اللعبة التي تريد بيع حساباتها',
    'sell.comingSoon': 'المزيد من الألعاب قريباً...',
    'sell.selectCategory': 'اختر الفئة',
    'sell.categorySubtitle': 'اختر نوع الحساب الذي تريد بيعه',
    'sell.explore': 'استكشف',
    'sell.price': 'السعر',
    'sell.description': 'الوصف',
    'sell.gaming.title': 'حسابات الألعاب',
    'sell.gaming.description': 'بيع حسابات ألعابك',
    'sell.social.title': 'حسابات التواصل الاجتماعي',
    'sell.social.description': 'بيع حسابات وسائل التواصل',
    'sell.social.followers': 'المتابعين',
    'sell.social.likes': 'الإعجابات',
    'sell.social.views': 'المشاهدات',
    'sell.social.posts': 'المنشورات',
    'sell.social.engagement': 'معدل التفاعل',
    'sell.social.verification': 'حالة التوثيق',
    'sell.social.verified': 'موثق',
    'sell.social.unverified': 'غير موثق',
    'sell.social.tiktok.title': 'بيع حساب تيك توك',
    'sell.social.tiktok.subtitle': 'أدخل تفاصيل حساب تيك توك الخاص بك',
    'sell.social.tiktok.description': 'بيع حسابات تيك توك',
    'sell.social.tiktok.username': 'اسم المستخدم',
    'sell.social.tiktok.descriptionPlaceholder': 'صف حسابك، النيش، نوع المحتوى، إلخ...',
    'sell.social.instagram.title': 'بيع حساب إنستغرام',
    'sell.social.instagram.subtitle': 'أدخل تفاصيل حساب إنستغرام الخاص بك',
    'sell.social.instagram.description': 'بيع حسابات إنستغرام',
    'sell.social.instagram.username': 'اسم المستخدم',
    'sell.social.instagram.descriptionPlaceholder': 'صف حسابك، النيش، نوع المحتوى، إلخ...',
    'sell.social.accountDescription': 'وصف الحساب',
    'sell.social.descriptionPlaceholder': 'صف حسابك، النيش، نوع المحتوى، إلخ...',
    'sell.social.accountWithPrimaryEmail': 'الحساب مع البريد الإلكتروني الأساسي',
    'sell.social.accountLinkedToPhone': 'الحساب مرتبط برقم هاتف',
    'sell.social.confirmOwnership.title': 'تأكيد الملكية ومعلومات التسليم',
    'sell.social.confirmOwnership.description': 'لضمان بيئة آمنة لبيع وشراء الحسابات، يجب عليك إكمال الخطوات أدناه لإضافة حسابك.',
    'sell.social.confirmOwnership.instruction': 'اضغط على زر "ضع الكلمة أدناه في السيرة الذاتية لحسابك" للمتابعة',
    'sell.social.confirmOwnership.theWord': 'الكلمة',
    'sell.social.confirmOwnership.copy': 'نسخ',
    'sell.social.confirmOwnership.confirm': 'تأكيد الملكية',
    'sell.social.pledge1': 'أتعهد بأن يكون وصف المنتج خاليًا من أي وسائل اتصال خارج المنصة، بأي طريقة كانت، سواء كانت مباشرة أو غير مباشرة.',
    'sell.social.pledge2': 'أتعهد بتحمل المسؤولية القانونية الكاملة عن جميع الإجراءات المتخذة أو الصادرة عن الحساب المعني من تاريخ إنشائه أو شرائه حتى تاريخ بيعه على منصة المستخدم، وأضمن أنه خالٍ من أي جرائم إلكترونية.',
    'sell.social.deliveryInfo.title': 'معلومات التسليم',
    'sell.social.deliveryInfo.description': 'أدخل بيانات الحساب التي سيتم تسليمها للمشتري',
    'sell.social.deliveryInfo.email': 'البريد الإلكتروني',
    'sell.social.deliveryInfo.password': 'كلمة المرور',
    'sell.social.deliveryInfo.instructions': 'تعليمات التسليم',
    'sell.social.deliveryInfo.instructionsPlaceholder': 'أي معلومات إضافية للمشتري حول التسليم...',
    
    // Listing
    'listing.success': 'تم إنشاء الإعلان بنجاح!',
    'listing.successDescription': 'سيتم مراجعة إعلانك ونشره قريباً.',
    'listing.creating': 'جاري الإنشاء...',
    'listing.create': 'إنشاء إعلان',
    'listing.published': 'تم نشر الإعلان بنجاح!',
    'listing.priceTooLow': 'السعر منخفض جداً. الحد الأدنى للسعر هو $10',
    'listing.duplicateDetected': 'يبدو أن لديك إعلان مماثل بالفعل',
    'listing.maxListingsReached': 'لقد وصلت إلى الحد الأقصى من الإعلانات النشطة',
    'listing.verificationRequired': 'يجب إكمال التحقق من الهوية أولاً',
    'listing.titleRequired': 'يرجى إدخال عنوان الإعلان',
    'listing.serverRequired': 'يرجى اختيار السيرفر',
    'listing.imagesRequired': 'يرجى رفع صورة واحدة على الأقل',
    'listing.billImagesRequired': 'يرجى رفع جميع صور الفواتير المطلوبة',
    'listing.uploadingImages': 'جاري رفع الصور...',
    'listing.uploadFailed': 'فشل رفع الصور. يرجى المحاولة مرة أخرى',
    'listing.maxImages': 'يمكنك رفع حتى 8 صور فقط',
    'listing.imageTooLarge': 'الصورة {name} كبيرة جداً. الحد الأقصى 5 ميجابايت ({size} ميجابايت)',
    'listing.imageTooLargeCurrent': 'الصورة كبيرة جداً. الحد الأقصى 5 ميجابايت (الحجم الحالي: {size} ميجابايت)',
    'listing.priceRange': 'الحد الأدنى: $10 | الحد الأقصى: $10,000',
    'listing.accountImages': 'صور الحساب',
    'listing.accountImagesDesc': 'قم بتحميل صور (سكرين شوت) من جوالك - يمكنك رفع حتى 8 صور',
    'listing.uploadImage': 'رفع صورة',
    'listing.imageCount': 'يمكنك رفع حتى 8 صور (تم رفع {count})',
    'listing.billImagesTitle': 'صور الفواتير (إلزامية)',
    'listing.billImagesDesc': 'قم بتحميل صور (سكرين شوت) الفواتير من جوالك - سيتم عرضها للمشتري بعد إتمام الدفع',
    'listing.firstBillImage': 'صورة أول فاتورة شراء *',
    'listing.threeBillImages': 'صورة ثلاث فواتير مختلفة التوقيت *',
    'listing.lastBillImage': 'صورة آخر فاتورة شراء *',
    'listing.chooseImage': 'اختر صورة',
    'listing.imageAlt': 'صورة {number}',
    'listing.priceRequired': 'يرجى إدخال سعر صحيح',
    'listing.stoveLevelRequired': 'يرجى اختيار حجرة الاحتراق',
    'listing.allFieldsRequired': 'يرجى إدخال جميع معلومات الحساب المطلوبة',
    'listing.accountCredentialsRequired': 'يرجى إدخال البريد الإلكتروني وكلمة المرور',
    
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
    'common.confirm': 'تأكيد',
    'common.close': 'إغلاق',
    'common.submit': 'إرسال',
    'common.update': 'تحديث',
    'common.download': 'تحميل',
    'common.upload': 'رفع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.page': 'صفحة',
    'common.of': 'من',
    'common.from': 'من',
    'common.showing': 'عرض',
    'common.results': 'نتائج',
    'common.noResults': 'لا توجد نتائج',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.warning': 'تحذير',
    'common.info': 'معلومات',
    'common.errorLoading': 'حدث خطأ أثناء التحميل',
    'common.retry': 'إعادة المحاولة',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.pageDescription': 'سجل دخولك أو أنشئ حساب جديد للبدء في تداول الحسابات بأمان',
    'auth.skipToForm': 'تخطي إلى نموذج التسجيل',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.fullName': 'الاسم الكامل',
    'auth.phone': 'رقم الهاتف',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.rememberMe': 'تذكرني',
    'auth.haveAccount': 'لديك حساب؟',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.loginButton': 'تسجيل الدخول',
    'auth.signupButton': 'إنشاء حساب',
    'auth.loginSuccess': 'تم تسجيل الدخول بنجاح',
    'auth.signupSuccess': 'تم إنشاء الحساب بنجاح',
    'auth.registerSuccess': 'تم إنشاء الحساب بنجاح',
    'auth.loginError': 'فشل تسجيل الدخول',
    'auth.signupError': 'فشل إنشاء الحساب',
    'auth.registerError': 'فشل إنشاء الحساب',
    'auth.invalidEmail': 'يرجى إدخال بريد إلكتروني صحيح',
    'auth.passwordTooShort': 'كلمة المرور يجب أن تكون على الأقل',
    'auth.passwordMismatch': 'كلمات المرور غير متطابقة',
    'auth.nameTooShort': 'الاسم يجب أن يكون على الأقل',
    'auth.agreeToTerms': 'بإنشاء حساب، أنت توافق على',
    'auth.and': 'و',
    'auth.backToHome': 'العودة للصفحة الرئيسية',
    'auth.processing': 'جاري المعالجة...',
    'auth.securityVerification': 'يرجى إكمال التحقق الأمني',
    
    // Marketplace
    'marketplace.title': 'السوق',
    'marketplace.subtitle': 'تصفح جميع الحسابات المتاحة',
    'marketplace.description': 'تصفح واشترِ حسابات الألعاب والسوشيال ميديا بأمان على NXOLand',
    'marketplace.skipToMarket': 'تخطي إلى السوق',
    'marketplace.searchPlaceholder': 'ابحث عن حسابات...',
    'marketplace.searchAriaLabel': 'ابحث في السوق',
    'marketplace.filterBy': 'تصفية حسب',
    'marketplace.sortBy': 'ترتيب حسب',
    'marketplace.categoryFilter': 'تصفية حسب الفئة',
    'marketplace.category': 'الفئة',
    'marketplace.allCategories': 'جميع الفئات',
    'marketplace.gaming': 'ألعاب',
    'marketplace.social': 'سوشيال ميديا',
    'marketplace.trading': 'تداول',
    'marketplace.other': 'أخرى',
    'marketplace.priceFilter': 'تصفية حسب السعر',
    'marketplace.price': 'السعر',
    'marketplace.allPrices': 'جميع الأسعار',
    'marketplace.lowPrice': 'منخفض (أقل من $100)',
    'marketplace.midPrice': 'متوسط ($100 - $1000)',
    'marketplace.highPrice': 'مرتفع (أكثر من $1000)',
    'marketplace.moreFilters': 'المزيد من الفلاتر',
    'marketplace.showing': 'عرض',
    'marketplace.outOf': 'من',
    'marketplace.accounts': 'حسابات',
    'marketplace.sellNow': 'ابدأ البيع',
    'marketplace.registerToSell': 'سجل لتبدأ البيع',
    'marketplace.allGames': 'جميع الألعاب',
    'marketplace.priceRange': 'نطاق السعر',
    'marketplace.level': 'المستوى',
    'marketplace.server': 'السيرفر',
    'marketplace.latest': 'الأحدث',
    'marketplace.priceHigh': 'السعر (الأعلى أولاً)',
    'marketplace.priceLow': 'السعر (الأقل أولاً)',
    'marketplace.levelHigh': 'المستوى (الأعلى أولاً)',
    'marketplace.noListings': 'لا توجد إعلانات',
    'marketplace.noListingsDesc': 'لم يتم العثور على حسابات تطابق البحث',
    'marketplace.tryDifferent': 'حاول تعديل البحث أو الفلتر',
    'marketplace.verified': 'موثق',
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
    'product.buyNow': 'شراء الآن',
    'product.buy': 'شراء',
    'product.addToCart': 'أضف للسلة',
    'product.available': 'متاح',
    'product.sold': 'مباع',
    'product.unavailable': 'غير متاح',
    'product.sellerInfo': 'معلومات البائع',
    'product.sellerRating': 'تقييم البائع',
    'product.totalSales': 'إجمالي المبيعات',
    'product.memberSince': 'عضو منذ',
    'product.responseTime': 'وقت الاستجابة',
    'product.deliveryTime': 'وقت التسليم',
    'product.viewProfile': 'عرض الملف الشخصي',
    'product.reportListing': 'الإبلاغ عن الإعلان',
    'product.share': 'مشاركة',
    'product.clickToEnlarge': 'اضغط للتكبير',
    
    // Checkout
    'checkout.title': 'إتمام الشراء',
    'checkout.orderSummary': 'ملخص الطلب',
    'checkout.productDetails': 'تفاصيل المنتج',
    'checkout.subtotal': 'المجموع الفرعي',
    'checkout.serviceFee': 'رسوم الخدمة',
    'checkout.total': 'الإجمالي',
    'checkout.paymentMethod': 'طريقة الدفع',
    'checkout.agreeToTerms': 'أوافق على الشروط والأحكام',
    'checkout.confirmPurchase': 'تأكيد الشراء',
    'checkout.processing': 'جاري المعالجة...',
    'checkout.securePayment': 'دفع آمن عبر',
    'checkout.buyerProtection': 'حماية المشتري لمدة 12 ساعة',
    'checkout.deliveryInfo': 'معلومات التسليم',
    'checkout.instantDelivery': 'تسليم فوري بعد الدفع',
    'checkout.mustAgreeTerms': 'يجب الموافقة على الشروط والأحكام',
    
    // Orders
    'orders.title': 'طلباتي',
    'orders.subtitle': 'عرض وإدارة جميع طلباتك',
    'orders.description': 'عرض وإدارة جميع طلبات الشراء والبيع',
    'orders.loginRequired': 'يجب تسجيل الدخول لعرض طلباتك',
    'orders.searchPlaceholder': 'ابحث برقم الطلب، المنتج، أو البائع...',
    'orders.filterByRole': 'عرض الطلبات:',
    'orders.all': 'الكل',
    'orders.total': 'الإجمالي',
    'orders.asBuyer': 'كمشتري',
    'orders.asSeller': 'كبائع',
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
    'orders.noOrders': 'لا توجد طلبات',
    'orders.noOrdersDesc': 'لم تقم بأي عمليات شراء بعد',
    'orders.noOrdersFilter': 'لا توجد طلبات تطابق الفلتر المحدد',
    'orders.browseMarket': 'تصفح السوق',
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
    'orders.stats.total': 'إجمالي',
    'orders.stats.asBuyer': 'كمشتري',
    'orders.stats.asSeller': 'كبائع',
    'orders.stats.inEscrow': 'قيد الضمان',
    'orders.stats.completed': 'مكتمل',
    'orders.stats.cancelled': 'ملغي',
    
    // Order Details
    'order.title': 'تفاصيل الطلب',
    'order.status': 'حالة الطلب',
    'order.statusPending': 'بانتظار الدفع',
    'order.statusPaid': 'تم الدفع',
    'order.statusEscrow': 'قيد الضمان',
    'order.statusCompleted': 'مكتمل',
    'order.statusCancelled': 'ملغي',
    'order.statusDisputed': 'قيد النزاع',
    'order.confirmSuccess': 'تم تأكيد الاستلام بنجاح',
    'order.onlyBuyerCanConfirm': 'فقط المشتري يمكنه تأكيد الاستلام',
    'order.cannotConfirmStatus': 'لا يمكن تأكيد الطلب بهذه الحالة',
    'order.confirmError': 'فشل تأكيد الاستلام',
    'order.cancelSuccess': 'تم إلغاء الطلب بنجاح',
    'order.cannotCancelCompleted': 'لا يمكن إلغاء طلب مكتمل',
    'order.cancelError': 'فشل إلغاء الطلب',
    'order.timeline': 'المراحل',
    'order.productInfo': 'معلومات المنتج',
    'order.accountDetails': 'تفاصيل الحساب',
    'order.paymentInfo': 'معلومات الدفع',
    'order.actions': 'الإجراءات',
    'order.confirmDelivery': 'تأكيد الاستلام',
    'order.openDispute': 'فتح نزاع',
    'order.cancelOrder': 'إلغاء الطلب',
    'order.contactSupport': 'التواصل مع الدعم',
    'order.downloadInvoice': 'تحميل الفاتورة',
    'order.escrowPeriod': 'فترة الضمان',
    'order.escrowEndsIn': 'ينتهي الضمان خلال',
    'order.hours': 'ساعة',
    'order.minutes': 'دقيقة',
    'order.delivered': 'تم التسليم',
    'order.deliveredAt': 'تم التسليم في',
    
    // Wallet
    'wallet.title': 'المحفظة',
    'wallet.balance': 'الرصيد المتاح',
    'wallet.pending': 'قيد الانتظار',
    'wallet.total': 'الإجمالي',
    'wallet.withdraw': 'سحب الرصيد',
    'wallet.deposit': 'إيداع',
    'wallet.transactions': 'المعاملات',
    'wallet.withdrawalHistory': 'سجل السحوبات',
    'wallet.amount': 'المبلغ',
    'wallet.enterAmount': 'أدخل المبلغ',
    'wallet.minimumWithdrawal': 'الحد الأدنى للسحب',
    'wallet.bankAccount': 'الحساب البنكي',
    'wallet.accountNumber': 'رقم الحساب',
    'wallet.accountName': 'اسم صاحب الحساب',
    'wallet.bankName': 'اسم البنك',
    'wallet.iban': 'الآيبان (IBAN)',
    'wallet.requestWithdrawal': 'طلب السحب',
    'wallet.withdrawalRequested': 'تم طلب السحب بنجاح',
    'wallet.withdrawalPending': 'قيد المعالجة',
    'wallet.withdrawalCompleted': 'تم التحويل',
    'wallet.withdrawalFailed': 'فشل السحب',
    'wallet.transactionType': 'نوع المعاملة',
    'wallet.sale': 'بيع',
    'wallet.purchase': 'شراء',
    'wallet.withdrawal': 'سحب',
    'wallet.refund': 'استرداد',
    'wallet.fee': 'رسوم',
    'wallet.noTransactions': 'لا توجد معاملات',
    'wallet.processingTime': 'مدة المعالجة: 1-4 أيام عمل',
    'wallet.withdrawSuccess': 'تم طلب السحب بنجاح',
    'wallet.hourlyLimitExceeded': 'تجاوزت الحد الأقصى للسحب في الساعة. حاول مرة أخرى لاحقاً',
    'wallet.dailyLimitExceeded': 'تجاوزت الحد اليومي للسحب ({limit}). المتبقي: ${remaining}',
    'wallet.withdrawError': 'فشل طلب السحب',
    'wallet.invalidIBAN': 'رقم الآيبان غير صحيح. يجب أن يبدأ بـ SA ويتكون من 24 حرف',
    'wallet.enterValidAmount': 'يرجى إدخال مبلغ صحيح',
    'wallet.minWithdrawal': 'الحد الأدنى للسحب هو ${min}',
    'wallet.maxWithdrawal': 'الحد الأقصى للسحب هو ${max}',
    'wallet.exceedsBalance': 'المبلغ يتجاوز الرصيد المتاح',
    'wallet.enterValidIBAN': 'يرجى إدخال رقم آيبان صحيح',
    
    // Profile
    'profile.title': 'الملف الشخصي',
    'profile.publicProfile': 'الملف العام',
    'profile.memberSince': 'عضو منذ',
    'profile.lastActive': 'آخر نشاط',
    'profile.verified': 'موثق',
    'profile.notVerified': 'غير موثق',
    'profile.rating': 'التقييم',
    'profile.totalSales': 'إجمالي المبيعات',
    'profile.completedOrders': 'الطلبات المكتملة',
    'profile.activeListings': 'الإعلانات النشطة',
    'profile.responseRate': 'معدل الاستجابة',
    'profile.deliveryTime': 'وقت التسليم',
    'profile.editProfile': 'تعديل الملف الشخصي',
    'profile.viewReviews': 'عرض التقييمات',
    'profile.accountSettings': 'إعدادات الحساب',
    'profile.security': 'الأمان',
    'profile.verifyAccount': 'توثيق الحساب',
    'profile.about': 'نبذة',
    'profile.noReviews': 'لا توجد تقييمات بعد',
    'profile.reviewsCount': 'تقييم',
    'profile.minutesAgo': 'منذ دقائق',
    'profile.hoursAgo': 'منذ {hours} ساعة',
    'profile.oneDayAgo': 'منذ يوم واحد',
    'profile.daysAgo': 'منذ {days} يوم',
    'profile.statsRefreshed': 'تم تحديث الإحصائيات',
    'profile.activityRefreshed': 'تم تحديث النشاط',
    
    // Edit Profile
    'editProfile.title': 'تعديل الملف الشخصي',
    'editProfile.pageDescription': 'قم بتحديث معلومات حسابك الشخصية على NXOLand',
    'editProfile.skipToForm': 'تخطي إلى نموذج التعديل',
    'editProfile.personalInfo': 'المعلومات الشخصية',
    'editProfile.name': 'الاسم',
    'editProfile.email': 'البريد الإلكتروني',
    'editProfile.phone': 'رقم الهاتف',
    'editProfile.bio': 'نبذة عني',
    'editProfile.avatar': 'الصورة الشخصية',
    'editProfile.changeAvatar': 'تغيير الصورة',
    'editProfile.saveChanges': 'حفظ التغييرات',
    'editProfile.saving': 'جاري الحفظ...',
    'editProfile.updateSuccess': 'تم تحديث الملف بنجاح',
    'editProfile.updateError': 'فشل التحديث',
    'editProfile.nameRequired': 'يرجى إدخال الاسم',
    'editProfile.nameMinLength': 'الاسم يجب أن يكون 3 أحرف على الأقل',
    'editProfile.nameTooLong': 'الاسم طويل جداً (الحد الأقصى 100 حرف)',
    'editProfile.emailRequired': 'يرجى إدخال البريد الإلكتروني',
    'editProfile.invalidEmail': 'البريد الإلكتروني غير صحيح',
    
    // Security
    'security.title': 'الأمان',
    'security.changePassword': 'تغيير كلمة المرور',
    'security.currentPassword': 'كلمة المرور الحالية',
    'security.newPassword': 'كلمة المرور الجديدة',
    'security.confirmNewPassword': 'تأكيد كلمة المرور الجديدة',
    'security.updatePassword': 'تحديث كلمة المرور',
    'security.passwordUpdated': 'تم تحديث كلمة المرور',
    'security.passwordUpdateSuccess': 'تم تحديث كلمة المرور بنجاح',
    'security.passwordUpdateError': 'فشل تحديث كلمة المرور',
    'security.currentPasswordRequired': 'يرجى إدخال كلمة المرور الحالية',
    'security.newPasswordTooShort': 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل',
    'security.passwordsNotMatch': 'كلمات المرور غير متطابقة',
    'security.newPasswordTooWeak': 'كلمة المرور ضعيفة. استخدم مزيج من الأحرف والأرقام والرموز',
    'security.invalidCurrentPassword': 'كلمة المرور الحالية غير صحيحة',
    'security.tooManyAttempts': 'محاولات كثيرة جداً. حاول مرة أخرى بعد {minutes} دقيقة',
    'security.attemptsRemaining': 'المحاولات المتبقية',
    'security.veryWeak': 'ضعيفة جداً',
    'security.weak': 'ضعيفة',
    'security.medium': 'متوسطة',
    'security.strong': 'قوية',
    'security.veryStrong': 'قوية جداً',
    'security.passwordWeakMix': 'كلمة المرور ضعيفة. يرجى استخدام أحرف كبيرة وصغيرة وأرقام ورموز خاصة',
    'security.needUppercase': 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)',
    'security.needLowercase': 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)',
    'security.needNumber': 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل',
    'security.needSymbol': 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%...)',
    'security.twoFactor': 'المصادقة الثنائية',
    'security.enable2FA': 'تفعيل المصادقة الثنائية',
    'security.disable2FA': 'تعطيل المصادقة الثنائية',
    'security.loginHistory': 'سجل تسجيل الدخول',
    'security.activeSessions': 'الجلسات النشطة',
    'security.logoutAll': 'تسجيل الخروج من جميع الأجهزة',
    
    // KYC
    'kyc.title': 'التحقق من الهوية',
    'kyc.subtitle': 'أكمل التحقق من هويتك لزيادة حد السحب',
    'kyc.status': 'حالة التحقق',
    'kyc.notStarted': 'لم يبدأ',
    'kyc.pending': 'قيد المراجعة',
    'kyc.verified': 'موثق',
    'kyc.rejected': 'مرفوض',
    'kyc.startVerification': 'بدء التحقق',
    'kyc.resubmit': 'إعادة التقديم',
    'kyc.benefits': 'فوائد التوثيق',
    'kyc.benefit1': 'زيادة حد السحب إلى $10,000',
    'kyc.benefit2': 'شارة التوثيق على ملفك الشخصي',
    'kyc.benefit3': 'زيادة الثقة من المشترين',
    'kyc.benefit4': 'أولوية في الدعم الفني',
    'kyc.requiredDocs': 'المستندات المطلوبة',
    'kyc.nationalId': 'بطاقة الهوية',
    'kyc.proofOfAddress': 'إثبات العنوان',
    'kyc.selfie': 'صورة شخصية',
    
    // My Listings
    'listings.title': 'إعلاناتي',
    'listings.subtitle': 'إدارة جميع إعلاناتك',
    'listings.createNew': 'إنشاء إعلان جديد',
    'listings.active': 'نشط',
    'listings.pending': 'قيد المراجعة',
    'listings.sold': 'مباع',
    'listings.rejected': 'مرفوض',
    'listings.draft': 'مسودة',
    'listings.noListings': 'لا توجد إعلانات',
    'listings.createFirst': 'أنشئ أول إعلان لك',
    'listings.edit': 'تعديل',
    'listings.delete': 'حذف',
    'listings.view': 'عرض',
    'listings.promote': 'ترويج',
    'listings.views': 'مشاهدة',
    'listings.inquiries': 'استفسار',
    'listings.deleteConfirm': 'هل أنت متأكد من حذف هذا الإعلان؟',
    
    // Disputes
    'disputes.title': 'النزاعات',
    'disputes.subtitle': 'إدارة النزاعات والشكاوى',
    'disputes.openDispute': 'فتح نزاع',
    'disputes.myDisputes': 'نزاعاتي',
    'disputes.status': 'الحالة',
    'disputes.open': 'مفتوح',
    'disputes.inReview': 'قيد المراجعة',
    'disputes.resolved': 'محلول',
    'disputes.closed': 'مغلق',
    'disputes.orderNumber': 'رقم الطلب',
    'disputes.reason': 'السبب',
    'disputes.description': 'الوصف',
    'disputes.evidence': 'الأدلة',
    'disputes.uploadEvidence': 'رفع دليل',
    'disputes.submitDispute': 'تقديم النزاع',
    'disputes.noDisputes': 'لا توجد نزاعات',
    'disputes.viewDetails': 'عرض التفاصيل',
    'disputes.adminResponse': 'رد الإدارة',
    'disputes.resolution': 'القرار',
    
    // Dispute Details
    'disputeDetails.title': 'تفاصيل النزاع',
    'disputeDetails.description': 'تفاصيل النزاع والحل المقترح',
    'disputeDetails.backToDisputes': 'العودة إلى النزاعات',
    'disputeDetails.loadError': 'فشل تحميل تفاصيل النزاع',
    'disputeDetails.backToList': 'العودة إلى القائمة',
    'disputeDetails.disputeOn': 'نزاع على طلب',
    'disputeDetails.details': 'تفاصيل النزاع',
    'disputeDetails.descriptionLabel': 'الوصف',
    'disputeDetails.reporter': 'المُبلّغ',
    'disputeDetails.buyer': 'المشتري',
    'disputeDetails.seller': 'البائع',
    'disputeDetails.createdAt': 'تاريخ الإنشاء',
    'disputeDetails.notSpecified': 'غير محدد',
    'disputeDetails.orderInfo': 'معلومات الطلب',
    'disputeDetails.orderNumber': 'رقم الطلب',
    'disputeDetails.amount': 'المبلغ',
    'disputeDetails.orderStatus': 'حالة الطلب',
    'disputeDetails.resolutionTitle': 'الحل',
    'disputeDetails.resolvedAt': 'تم الحل في:',
    'disputeDetails.underReviewMessage': 'النزاع قيد المراجعة. سيتم التواصل معك خلال 24-48 ساعة.',
    'disputeDetails.cancelDispute': 'إلغاء النزاع',
    'disputeDetails.cancelTitle': 'إلغاء النزاع',
    'disputeDetails.cancelConfirm': 'هل أنت متأكد من إلغاء هذا النزاع؟',
    'disputeDetails.cancelWarning1': 'سيتم إعادة الطلب إلى حالة الضمان ويمكنك متابعة المعاملة.',
    'disputeDetails.cancelWarning2': '⚠️ لا يمكن إعادة فتح النزاع بعد إلغائه.',
    'disputeDetails.cancelButton': 'تراجع',
    'disputeDetails.confirmCancel': 'إلغاء النزاع',
    'disputeDetails.cancelling': 'جاري الإلغاء...',
    'disputeDetails.cancelSuccess': 'تم إلغاء النزاع بنجاح',
    'disputeDetails.cancelError': 'فشل إلغاء النزاع',
    'disputeDetails.loginRequired': 'يجب تسجيل الدخول لعرض تفاصيل النزاع',
    'disputeDetails.loginButton': 'تسجيل الدخول',
    
    // Notifications
    'notifications.title': 'الإشعارات',
    'notifications.markAllRead': 'تعليم الكل كمقروء',
    'notifications.deleteAll': 'حذف الكل',
    'notifications.noNotifications': 'لا توجد إشعارات',
    'notifications.newOrder': 'طلب جديد',
    'notifications.orderUpdate': 'تحديث الطلب',
    'notifications.disputeOpened': 'نزاع جديد',
    'notifications.disputeResolved': 'تم حل النزاع',
    'notifications.paymentReceived': 'تم استلام الدفع',
    'notifications.withdrawalCompleted': 'تم السحب',
    'notifications.newReview': 'تقييم جديد',
    'notifications.kycUpdate': 'تحديث التحقق',
    
    // Members & Leaderboard
    'members.title': 'الأعضاء',
    'members.subtitle': 'تصفح {count} عضو على المنصة',
    'members.description': 'تصفح أعضاء منصة NXOLand وتعرف على أفضل البائعين',
    'members.searchMembers': 'ابحث عن عضو...',
    'members.searchPlaceholder': 'ابحث عن عضو بالاسم...',
    'members.searchLabel': 'ابحث عن الأعضاء',
    'members.skipToMembers': 'تخطي إلى قائمة الأعضاء',
    'members.topSellers': 'أفضل البائعين',
    'members.topBuyers': 'أفضل المشترين',
    'members.newMembers': 'أعضاء جدد',
    'members.filterByRole': 'تصفية حسب الدور',
    'members.role': 'الدور',
    'members.sellers': 'البائعون',
    'members.buyers': 'المشترون',
    'members.filterByRating': 'تصفية حسب التقييم',
    'members.rating': 'التقييم',
    'members.allRatings': 'جميع التقييمات',
    'members.5stars': '5 نجوم',
    'members.4plusStars': '4+ نجوم',
    'members.noResults': 'لا توجد نتائج لـ "{query}"',
    'members.noMembers': 'لا يوجد أعضاء حالياً',
    'members.trustedMember': 'عضو موثوق',
    'members.memberSince': 'عضو منذ {date}',
    'members.viewProfile': 'عرض الملف الشخصي',
    'members.profile': 'الملف الشخصي',
    'members.aboutMember': 'نبذة عن العضو',
    'members.listings': 'الإعلانات',
    'members.sales': 'المبيعات',
    'members.memberInfo': 'معلومات العضو',
    'members.joinDate': 'تاريخ الانضمام',
    'members.totalListings': 'إجمالي الإعلانات',
    'leaderboard.title': 'لوحة المتصدرين',
    'leaderboard.subtitle': 'أفضل البائعين والمشترين',
    'leaderboard.description': 'تعرف على أفضل البائعين على منصة NXOLand',
    'leaderboard.skipToLeaderboard': 'تخطي إلى لوحة المتصدرين',
    'leaderboard.rank': 'الترتيب',
    'leaderboard.member': 'العضو',
    'leaderboard.sales': 'المبيعات',
    'leaderboard.rating': 'التقييم',
    'leaderboard.topSeller': '#1 أفضل بائع',
    'leaderboard.gold': 'ذهبي',
    'leaderboard.silver': 'فضي',
    'leaderboard.bronze': 'برونزي',
    'leaderboard.deals': 'صفقة',
    'leaderboard.fullRanking': 'الترتيب الكامل',
    'leaderboard.loadError': 'فشل تحميل لوحة المتصدرين',
    'leaderboard.tryAgain': 'حاول مرة أخرى',
    'leaderboard.noData': 'لا توجد بيانات متاحة حالياً',
    
    // Reviews
    'reviews.title': 'التقييمات',
    'reviews.writeReview': 'كتابة تقييم',
    'reviews.yourRating': 'تقييمك',
    'reviews.yourReview': 'تعليقك',
    'reviews.submitReview': 'إرسال التقييم',
    'reviews.helpful': 'مفيد',
    'reviews.notHelpful': 'غير مفيد',
    'reviews.report': 'إبلاغ',
    'reviews.noReviews': 'لا توجد تقييمات بعد',
    'reviews.verifiedPurchase': 'عملية شراء موثقة',
    
    // Suggestions
    'suggestions.title': 'مركز الاقتراحات والتقييمات',
    'suggestions.subtitle': 'شارك أفكارك وقيّم تجربتك على المنصة',
    'suggestions.platformRating': 'قيّم تجربتك على المنصة',
    'suggestions.yourRating': 'تقييمك للمنصة',
    'suggestions.yourFeedback': 'أخبرنا عن تجربتك',
    'suggestions.submitRating': 'إرسال التقييم',
    'suggestions.newSuggestion': 'اقتراح لتطوير المنصة',
    'suggestions.suggestionTitle': 'عنوان الاقتراح',
    'suggestions.suggestionDesc': 'وصف الاقتراح بالتفصيل...',
    'suggestions.submitSuggestion': 'إرسال الاقتراح',
    'suggestions.upvote': 'تصويت إيجابي',
    'suggestions.downvote': 'تصويت سلبي',
    'suggestions.votes': 'صوت',
    'suggestions.status.pending': 'قيد المراجعة',
    'suggestions.status.approved': 'معتمد',
    'suggestions.status.implemented': 'تم التنفيذ',
    'suggestions.voteError': 'فشل التصويت. يرجى المحاولة مرة أخرى',
    'suggestions.loginToVote': 'يجب تسجيل الدخول للتصويت',
    'suggestions.createSuccess': 'تم إرسال اقتراحك بنجاح',
    'suggestions.createError': 'فشل إرسال الاقتراح',
    'suggestions.loginToSuggest': 'يجب تسجيل الدخول لإضافة اقتراح',
    'suggestions.securityVerification': 'يرجى إكمال التحقق الأمني',
    'suggestions.fillAllFields': 'يرجى ملء جميع الحقول',
    'suggestions.reviewSuccess': 'شكراً لتقييمك! تم إرسال رأيك بنجاح',
    'suggestions.reviewError': 'فشل إرسال التقييم',
    'suggestions.loginToReview': 'يجب تسجيل الدخول لتقييم المنصة',
    'suggestions.selectRating': 'الرجاء اختيار تقييم',
    'suggestions.minReviewLength': 'الرجاء كتابة تعليق لا يقل عن 10 أحرف',
    'suggestions.avgRating': 'متوسط التقييم',
    'suggestions.totalReviews': 'إجمالي التقييمات',
    'suggestions.topSuggestions': 'أهم الاقتراحات',
    'suggestions.recentSuggestions': 'الاقتراحات الحديثة',
    'suggestions.all': 'الكل',
    'suggestions.pending': 'قيد المراجعة',
    'suggestions.approved': 'معتمد',
    'suggestions.implemented': 'تم التنفيذ',
    'suggestions.submitting': 'جاري الإرسال...',
    
    // My Listings
    'myListings.title': 'إعلاناتي',
    'myListings.subtitle': 'إدارة حساباتي المعروضة للبيع (يمكنك البيع والشراء بنفس الحساب)',
    'myListings.loginRequired': 'يجب تسجيل الدخول لعرض إعلاناتك',
    'myListings.loginButton': 'تسجيل الدخول',
    'myListings.addAccount': 'إضافة حساب',
    'myListings.createNew': 'إنشاء إعلان جديد',
    'myListings.all': 'الكل',
    'myListings.active': 'نشط',
    'myListings.inactive': 'غير نشط',
    'myListings.sold': 'مباع',
    'myListings.totalListings': 'إجمالي الإعلانات',
    'myListings.noListings': 'لا توجد إعلانات',
    'myListings.noListingsMessage': 'لم تقم بإنشاء أي إعلانات بعد',
    'myListings.getStarted': 'ابدأ البيع',
    'myListings.edit': 'تعديل',
    'myListings.delete': 'حذف',
    'myListings.view': 'عرض',
    'myListings.cancel': 'إلغاء',
    'myListings.confirm': 'تأكيد',
    'myListings.markAsSold': 'تحديد كمباع',
    'myListings.reactivate': 'إعادة تفعيل',
    'myListings.deactivate': 'إيقاف',
    'myListings.deleteConfirm': 'هل أنت متأكد؟',
    'myListings.deleteMessage': 'سيتم حذف هذا الإعلان نهائياً',
    'myListings.soldConfirm': 'تحديد كمباع؟',
    'myListings.soldMessage': 'هل تريد تحديد هذا الإعلان كمباع؟',
    'myListings.deleteSuccess': 'تم حذف الإعلان بنجاح',
    'myListings.deleteError': 'فشل حذف الإعلان',
    'myListings.hasActiveOrders': 'لا يمكن حذف الإعلان لأن لديه طلبات نشطة',
    'myListings.updateSuccess': 'تم تحديث حالة الإعلان',
    'myListings.updateError': 'فشل تحديث الإعلان',
    'myListings.stats': 'الإحصائيات',
    'myListings.views': 'مشاهدات',
    'myListings.price': 'السعر',
    'myListings.status': 'الحالة',
    'myListings.actions': 'الإجراءات',
    'myListings.createdAt': 'تاريخ الإنشاء',
    'myListings.previous': 'السابق',
    'myListings.next': 'التالي',
    'myListings.page': 'صفحة',
    'myListings.of': 'من',
    'myListings.emptyStateTitle': 'لا توجد إعلانات',
    'myListings.emptyStateMessage': 'ابدأ بإضافة حسابك الأول للبيع على المنصة',
    'myListings.addNewAccount': 'إضافة حساب جديد',
    'myListings.noListingsForFilter': 'لا توجد إعلانات',
    'myListings.viewCount': 'مشاهدة',
    'myListings.deleteTitle': 'تأكيد الحذف',
    'myListings.deleteDescription': 'هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.',
    'myListings.soldTitle': 'تأكيد البيع',
    'myListings.soldDescription': 'هل تم بيع هذا الحساب؟ سيتم تحديث حالة الإعلان إلى "مباع" وإخفاءه من القوائم العامة.',
    'myListings.confirmSale': 'تأكيد البيع',
    
    // Admin
    'admin.dashboard': 'لوحة المعلومات',
    'admin.users': 'المستخدمين',
    'admin.listings': 'الإعلانات',
    'admin.orders': 'الطلبات',
    'admin.disputes': 'النزاعات',
    'admin.notifications': 'الإشعارات',
    'admin.settings': 'الإعدادات',
    'admin.legalContent': 'المحتوى القانوني',
    'admin.stats': 'الإحصائيات',
    'admin.activity': 'النشاط الأخير',
    'admin.totalUsers': 'إجمالي المستخدمين',
    'admin.activeListings': 'الإعلانات النشطة',
    'admin.pendingOrders': 'الطلبات المعلقة',
    'admin.openDisputes': 'النزاعات المفتوحة',
    'admin.revenue': 'الإيرادات',
    'admin.actions': 'الإجراءات',
    'admin.ban': 'حظر',
    'admin.unban': 'إلغاء الحظر',
    'admin.verify': 'توثيق',
    'admin.reject': 'رفض',
    'admin.approve': 'موافقة',
    'admin.viewDetails': 'عرض التفاصيل',
    'admin.sendNotification': 'إرسال إشعار',
    'admin.broadcastMessage': 'رسالة عامة',
    'admin.reviews': 'التقييمات',
    'admin.financial': 'التقارير المالية',
    'admin.activityLogs': 'سجل النشاط',
    'admin.totalRevenue': 'إجمالي الإيرادات',
    'admin.pendingWithdrawals': 'السحوبات المعلقة',
    'admin.transactions': 'المعاملات',
    'admin.filter': 'تصفية',
    'admin.exportData': 'تصدير البيانات',
    'admin.refresh': 'تحديث',
    'admin.loading': 'جاري التحميل...',
    
    // Help & Support
    'help.title': 'المساعدة',
    'help.description': 'مركز المساعدة - إجابات لجميع أسئلتك حول المنصة',
    'help.subtitle': 'إجابات لجميع أسئلتك حول NXOLand',
    'help.skipToContent': 'تخطي إلى المحتوى',
    'help.faq': 'الأسئلة الشائعة',
    'help.faqTitle': 'الأسئلة الشائعة',
    'help.contactSupport': 'التواصل مع الدعم',
    'help.contactUs': 'تواصل معنا',
    'help.contactMessage': 'هل تحتاج مساعدة؟ فريقنا متواجد على Discord للرد على جميع استفساراتك',
    'help.discordJoin': 'انضم إلى Discord',
    'help.discordSupport': 'قناة الدعم الرسمية - متاح 24/7',
    'help.discordMessage': '💬 جميع استفساراتك وطلبات الدعم يتم التعامل معها عبر سيرفر Discord الرسمي',
    'help.improvementTitle': 'ساعدنا في التحسين',
    'help.improvementMessage': 'رأيك يهمنا! شارك تجربتك واقتراحاتك لتطوير المنصة',
    'help.ratePlatform': 'قيّم المنصة وشارك اقتراحاتك',
    'help.footerCopyright': '© 2025 NXOLand. جميع الحقوق محفوظة.',
    'help.searchHelp': 'ابحث عن مساعدة...',
    'help.popularTopics': 'المواضيع الشائعة',
    'help.gettingStarted': 'البدء',
    'help.buyingGuide': 'دليل الشراء',
    'help.sellingGuide': 'دليل البيع',
    'help.accountSecurity': 'أمان الحساب',
    'help.paymentsAndFees': 'الدفع والرسوم',
    'help.faq1Q': 'كيف أشتري حساب؟',
    'help.faq1A': 'تصفح السوق، اختر الحساب المناسب، اضغط شراء، وادفع بأمان. سيتم تسليم الحساب خلال 12 ساعة.',
    'help.faq2Q': 'هل الدفع آمن؟',
    'help.faq2A': 'نعم! نستخدم Tap Payment وهو نظام دفع موثوق ومشفر بالكامل. جميع المعاملات محمية.',
    'help.faq3Q': 'كم تستغرق عملية التسليم؟',
    'help.faq3A': 'بعد الدفع، يتم تسليم بيانات الحساب فوراً. لديك 12 ساعة لمراجعة الحساب وتأكيد الاستلام.',
    'help.faq4Q': 'ماذا لو كان الحساب غير مطابق للوصف؟',
    'help.faq4A': 'يمكنك فتح نزاع خلال فترة الضمان (12 ساعة). فريقنا سيراجع القضية ويتخذ القرار المناسب.',
    'help.faq5Q': 'كم تبلغ رسوم المنصة؟',
    'help.faq5A': 'نأخذ عمولة 5% من كل عملية بيع. الرسوم تشمل نظام الضمان، الدعم الفني، والحماية الكاملة.',
    'help.faq6Q': 'كيف أسحب أرباحي؟',
    'help.faq6A': 'اذهب إلى المحفظة، اضغط سحب، أدخل رقم الآيبان، واطلب السحب. يتم التحويل خلال 1-4 أيام عمل.',
    
    // About
    'about.title': 'عن المنصة',
    'about.description': 'تعرف على NXOLand ورؤيتنا لتوفير منصة آمنة لتداول الحسابات',
    'about.subtitle': 'منصة NXOLand - رؤيتنا، قيمنا، وهدفنا في توفير تجربة تداول آمنة',
    'about.skipToContent': 'تخطي إلى المحتوى',
    'about.ourMission': 'مهمتنا',
    'about.vision': 'رؤيتنا',
    'about.visionText': 'نسعى لأن نكون المنصة الأولى والأكثر ثقة في منطقة الشرق الأوسط لتداول الحسابات الرقمية، مع توفير بيئة آمنة وموثوقة للبائعين والمشترين',
    'about.ourValues': 'قيمنا',
    'about.security': 'الأمان والحماية',
    'about.securityDesc': 'حماية كاملة لجميع المعاملات عبر نظام ضمان ذكي',
    'about.speed': 'السرعة والكفاءة',
    'about.speedDesc': 'معاملات سريعة وتسليم فوري للحسابات',
    'about.trust': 'الثقة والشفافية',
    'about.trustDesc': 'بناء الثقة من خلال الشفافية والمصداقية',
    'about.story': 'قصتنا',
    'about.storyPara1': 'بدأت NXOLand من فكرة بسيطة: توفير منصة آمنة وموثوقة لتداول حسابات الألعاب في منطقة الشرق الأوسط. لاحظنا الحاجة الكبيرة لخدمة تضمن حقوق البائع والمشتري في نفس الوقت.',
    'about.storyPara2': 'مع التطور السريع في عالم الألعاب والمنصات الرقمية، أصبح تداول الحسابات جزءاً أساسياً من تجربة اللاعبين. ولكن للأسف، العديد من المنصات لا توفر الحماية الكافية أو الدعم المناسب.',
    'about.storyPara3': 'لذلك أنشأنا NXOLand - منصة تجمع بين الأمان، السرعة، والشفافية. نظامنا يضمن حماية كاملة للطرفين من أول خطوة حتى إتمام الصفقة بنجاح.',
    'about.howItWorks': 'كيف تعمل المنصة',
    'about.buyerSteps': 'خطوات المشتري',
    'about.buyerStep1Title': 'تصفح الحسابات',
    'about.buyerStep1Desc': 'ابحث عن الحساب المناسب من السوق',
    'about.buyerStep2Title': 'الطلب والدفع',
    'about.buyerStep2Desc': 'اطلب الحساب وادفع بأمان عبر المنصة',
    'about.buyerStep3Title': 'استلام البيانات',
    'about.buyerStep3Desc': 'احصل على بيانات الحساب بعد موافقة البائع',
    'about.buyerStep4Title': 'التأكيد',
    'about.buyerStep4Desc': 'راجع الحساب وأكد استلامه لإتمام العملية',
    'about.sellerSteps': 'خطوات البائع',
    'about.sellerStep1Title': 'إنشاء الإعلان',
    'about.sellerStep1Desc': 'أضف تفاصيل حسابك والسعر المطلوب',
    'about.sellerStep2Title': 'استقبال الطلبات',
    'about.sellerStep2Desc': 'انتظر طلب المشتري وراجع التفاصيل',
    'about.sellerStep3Title': 'تسليم الحساب',
    'about.sellerStep3Desc': 'أرسل بيانات الحساب للمشتري عبر المنصة',
    'about.sellerStep4Title': 'استلام المبلغ',
    'about.sellerStep4Desc': 'احصل على أموالك بعد تأكيد المشتري',
    'about.activeUsers': 'مستخدم نشط',
    'about.successfulDeals': 'صفقة ناجحة',
    'about.satisfactionRate': 'نسبة الرضا',
    'about.team': 'الفريق',
    'about.contact': 'تواصل معنا',
    'about.support': 'دعم فني',
    'common.copyright': '© 2025 NXOLand. جميع الحقوق محفوظة.',
    
    // Error Messages
    'error.404': 'الصفحة غير موجودة',
    'error.404.desc': 'عذراً، الصفحة التي تبحث عنها غير موجودة',
    'error.500': 'خطأ في الخادم',
    'error.500.desc': 'حدث خطأ غير متوقع',
    'error.networkError': 'خطأ في الاتصال',
    'error.tryAgain': 'حاول مرة أخرى',
    'error.goHome': 'العودة للرئيسية',
    'error.forbidden': 'غير مصرح',
    'error.unauthorized': 'يجب تسجيل الدخول',
    'error.sessionExpired': 'انتهت الجلسة',
    
    // Status Messages
    'status.loading': 'جاري التحميل...',
    'status.saving': 'جاري الحفظ...',
    'status.uploading': 'جاري الرفع...',
    'status.processing': 'جاري المعالجة...',
    'status.success': 'تم بنجاح',
    'status.failed': 'فشل',
    'status.pending': 'قيد الانتظار',
    'status.completed': 'مكتمل',
    'status.cancelled': 'ملغي',
    
    // Time & Date
    'time.justNow': 'الآن',
    'time.minutesAgo': 'منذ {n} دقيقة',
    'time.hoursAgo': 'منذ {n} ساعة',
    'time.daysAgo': 'منذ {n} يوم',
    'time.weeksAgo': 'منذ {n} أسبوع',
    'time.monthsAgo': 'منذ {n} شهر',
    'time.yearsAgo': 'منذ {n} سنة',
    
    // How It Works Section
    'home.howItWorks': 'كيف تعمل المنصة',
    'home.howItWorksSubtitle': 'ثلاث خطوات بسيطة للشراء بأمان',
    'home.howPlatformWorks': 'كيف تعمل المنصة',
    'home.howDoesItWork': 'كيف يعمل؟',
    'home.step1.title': 'اختر واشترِ',
    'home.step1.desc': 'تصفح الحسابات المتاحة واختر الحساب المناسب',
    'home.step2.title': 'فترة الضمان',
    'home.step2.desc': 'استلم معلومات الحساب وتحقق منه خلال 12 ساعة',
    'home.step3.title': 'تأكيد أو نزاع',
    'home.step3.desc': 'إذا كان الحساب يعمل، أكّد الاستلام',
    'common.skipToContent': 'تخطي إلى المحتوى الرئيسي',
  },
  en: {
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
'nav.notifications': 'Notifications',
'nav.settings': 'Settings',
'nav.logout': 'Log Out',
'nav.login': 'Log In',
'nav.suggestions': 'Suggestions & Feedback',
'nav.community': 'Community',

// Home
'home.hero.title': 'NXOLand — Your Trusted Platform for Game Account Trading',
'home.hero.subtitle': 'Buy and sell your favorite game accounts easily, securely, and instantly through our smart escrow system.',
'home.hero.browseAccounts': 'Browse Accounts',
'home.hero.learnMore': 'Learn More',

'home.features.security': '🔒 Secure',
'home.features.fast': '⚡ Fast',
'home.features.support': '💬 24/7 Support',

'home.whyChoose': 'Why Choose NXOLand?',

'home.feature1.title': 'Smart Escrow Protection',
'home.feature1.desc': 'Every transaction is protected to ensure both the buyer and seller are fully secured.',

'home.feature2.title': '24/7 Discord Support',
'home.feature2.desc': 'Our dedicated support team is available anytime through Discord for quick assistance.',

'home.feature3.title': 'Fair & Competitive Prices',
'home.feature3.desc': 'Enjoy smooth trades with fair pricing and minimal fees for both sides.',

'home.feature4.title': 'Instant Payouts',
'home.feature4.desc': 'Sellers receive their funds instantly once the buyer confirms account delivery.',

'home.howItWorks': 'How It Works',

'home.step1.title': 'Choose Your Account',
'home.step1.desc': 'Browse thousands of verified accounts across multiple games.',

'home.step2.title': 'Pay Securely',
'home.step2.desc': 'Complete your payment safely using Tap, our trusted payment partner.',

'home.step3.title': 'Receive Instantly',
'home.step3.desc': 'Once payment is confirmed, your game account is delivered instantly.',

'home.cta.title': 'Start Trading with Confidence',
'home.cta.subtitle': 'Join thousands of gamers who trust NXOLand for safe and seamless trading.',
'home.cta.getStarted': 'Get Started',

'home.footer.rights': '© All rights reserved to NXOLand',
'home.footer.terms': 'Terms & Conditions',
'home.footer.privacy': 'Privacy Policy',
'home.footer.support': 'support',
'home.footer.suggestions': 'suggestions',

    
    // Sell
    'sell.title': 'Choose Game',
    'sell.subtitle': 'Select the game you want to sell accounts for',
    'sell.comingSoon': 'More games coming soon...',
    'sell.selectCategory': 'Select Category',
    'sell.categorySubtitle': 'Choose the type of account you want to sell',
    'sell.explore': 'Explore',
    'sell.price': 'Price',
    'sell.description': 'Description',
    'sell.gaming.title': 'Gaming Accounts',
    'sell.gaming.description': 'Sell your gaming accounts',
    'sell.social.title': 'Social Media Accounts',
    'sell.social.description': 'Sell your social media accounts',
    'sell.social.followers': 'Followers',
    'sell.social.likes': 'Likes',
    'sell.social.views': 'Views',
    'sell.social.posts': 'Posts',
    'sell.social.engagement': 'Engagement Rate',
    'sell.social.verification': 'Verification Status',
    'sell.social.verified': 'Verified',
    'sell.social.unverified': 'Unverified',
    'sell.social.tiktok.title': 'Sell TikTok Account',
    'sell.social.tiktok.subtitle': 'Enter your TikTok account details',
    'sell.social.tiktok.description': 'Sell TikTok accounts',
    'sell.social.tiktok.username': 'Username',
    'sell.social.tiktok.descriptionPlaceholder': 'Describe your account, niche, content type, etc...',
    'sell.social.instagram.title': 'Sell Instagram Account',
    'sell.social.instagram.subtitle': 'Enter your Instagram account details',
    'sell.social.instagram.description': 'Sell Instagram accounts',
    'sell.social.instagram.username': 'Username',
    'sell.social.instagram.descriptionPlaceholder': 'Describe your account, niche, content type, etc...',
    'sell.social.accountDescription': 'Account Description',
    'sell.social.descriptionPlaceholder': 'Describe your account, niche, content type, etc...',
    'sell.social.accountWithPrimaryEmail': 'Account with primary email',
    'sell.social.accountLinkedToPhone': 'The account is linked to a phone number',
    'sell.social.confirmOwnership.title': 'Confirmation of ownership and delivery information',
    'sell.social.confirmOwnership.description': 'To ensure a secure environment for buying and selling accounts, you must complete the steps below to add your account.',
    'sell.social.confirmOwnership.instruction': 'Press the Put the word below in your account bio confirmation button to proceed',
    'sell.social.confirmOwnership.theWord': 'The word',
    'sell.social.confirmOwnership.copy': 'Copy',
    'sell.social.confirmOwnership.confirm': 'CONFIRMATION OF OWNERSHIP',
    'sell.social.pledge1': 'I pledge that the product description will be free of any means of communication outside the platform, in any way whatsoever, whether direct or indirect.',
    'sell.social.pledge2': 'I undertake to bear full legal responsibility for all actions taken or issued by the account in question from the date of its creation or purchase until the date of its sale on the User platform, and I guarantee that it is free of any cybercrimes.',
    'sell.social.deliveryInfo.title': 'Delivery Information',
    'sell.social.deliveryInfo.description': 'Enter the account credentials that will be delivered to the buyer',
    'sell.social.deliveryInfo.email': 'Email Address',
    'sell.social.deliveryInfo.password': 'Password',
    'sell.social.deliveryInfo.instructions': 'Delivery Instructions',
    'sell.social.deliveryInfo.instructionsPlaceholder': 'Any additional information for the buyer about delivery...',
    
    // Listing
    'listing.success': 'Listing created successfully!',
    'listing.successDescription': 'Your listing will be reviewed and published soon.',
    'listing.creating': 'Creating...',
    'listing.create': 'Create Listing',
    'listing.published': 'Listing published successfully!',
    'listing.priceTooLow': 'Price too low. Minimum price is $10',
    'listing.duplicateDetected': 'You seem to have a similar listing already',
    'listing.maxListingsReached': 'You have reached the maximum active listings limit',
    'listing.verificationRequired': 'Identity verification must be completed first',
    'listing.titleRequired': 'Please enter listing title',
    'listing.serverRequired': 'Please select server',
    'listing.imagesRequired': 'Please upload at least one image',
    'listing.billImagesRequired': 'Please upload all required bill images',
    'listing.uploadingImages': 'Uploading images...',
    'listing.uploadFailed': 'Failed to upload images. Please try again',
    'listing.maxImages': 'You can only upload up to 8 images',
    'listing.imageTooLarge': 'Image {name} is too large. Maximum 5 MB ({size} MB)',
    'listing.imageTooLargeCurrent': 'Image is too large. Maximum 5 MB (current size: {size} MB)',
    'listing.priceRange': 'Minimum: $10 | Maximum: $10,000',
    'listing.accountImages': 'Account Images',
    'listing.accountImagesDesc': 'Upload screenshots from your mobile - you can upload up to 8 images',
    'listing.uploadImage': 'Upload Image',
    'listing.imageCount': 'You can upload up to 8 images ({count} uploaded)',
    'listing.billImagesTitle': 'Bill Images (Required)',
    'listing.billImagesDesc': 'Upload screenshots of bills from your mobile - they will be shown to the buyer after payment',
    'listing.firstBillImage': 'First purchase bill image *',
    'listing.threeBillImages': 'Three bills with different timestamps *',
    'listing.lastBillImage': 'Last purchase bill image *',
    'listing.chooseImage': 'Choose Image',
    'listing.imageAlt': 'Image {number}',
    'listing.priceRequired': 'Please enter a valid price',
    'listing.stoveLevelRequired': 'Please select furnace level',
    'listing.allFieldsRequired': 'Please enter all required account information',
    'listing.accountCredentialsRequired': 'Please enter email and password',
    
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
    'common.info': 'Info',
    'common.errorLoading': 'An error occurred while loading',
    'common.retry': 'Retry',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.pageDescription': 'Log in or create a new account to start trading accounts securely',
    'auth.skipToForm': 'Skip to form',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.haveAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.loginButton': 'Login',
    'auth.signupButton': 'Create Account',
    'auth.loginSuccess': 'Login successful',
    'auth.signupSuccess': 'Account created successfully',
    'auth.registerSuccess': 'Account created successfully',
    'auth.loginError': 'Login failed',
    'auth.signupError': 'Account creation failed',
    'auth.registerError': 'Account creation failed',
    'auth.invalidEmail': 'Please enter a valid email',
    'auth.passwordTooShort': 'Password must be at least',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.nameTooShort': 'Name must be at least',
    'auth.agreeToTerms': 'By creating an account, you agree to',
    'auth.and': 'and',
    'auth.backToHome': 'Back to Home',
    'auth.processing': 'Processing...',
    'auth.securityVerification': 'Please complete security verification',
    
    // Marketplace
    'marketplace.title': 'Marketplace',
    'marketplace.subtitle': 'Browse all available accounts',
    'marketplace.description': 'Browse and buy gaming and social media accounts securely on NXOLand',
    'marketplace.skipToMarket': 'Skip to marketplace',
    'marketplace.searchPlaceholder': 'Search accounts...',
    'marketplace.searchAriaLabel': 'Search marketplace',
    'marketplace.filterBy': 'Filter by',
    'marketplace.sortBy': 'Sort by',
    'marketplace.categoryFilter': 'Filter by category',
    'marketplace.category': 'Category',
    'marketplace.allCategories': 'All Categories',
    'marketplace.gaming': 'Gaming',
    'marketplace.social': 'Social Media',
    'marketplace.trading': 'Trading',
    'marketplace.other': 'Other',
    'marketplace.priceFilter': 'Filter by price',
    'marketplace.price': 'Price',
    'marketplace.allPrices': 'All Prices',
    'marketplace.lowPrice': 'Low (under $100)',
    'marketplace.midPrice': 'Medium ($100 - $1000)',
    'marketplace.highPrice': 'High (over $1000)',
    'marketplace.moreFilters': 'More filters',
    'marketplace.showing': 'Showing',
    'marketplace.outOf': 'out of',
    'marketplace.accounts': 'accounts',
    'marketplace.sellNow': 'Start Selling',
    'marketplace.registerToSell': 'Register to Sell',
    'marketplace.allGames': 'All Games',
    'marketplace.priceRange': 'Price Range',
    'marketplace.level': 'Level',
    'marketplace.server': 'Server',
    'marketplace.latest': 'Latest',
    'marketplace.priceHigh': 'Price (High to Low)',
    'marketplace.priceLow': 'Price (Low to High)',
    'marketplace.levelHigh': 'Level (High to Low)',
    'marketplace.noListings': 'No listings found',
    'marketplace.noListingsDesc': 'No accounts match your search',
    'marketplace.tryDifferent': 'Try adjusting your search or filters',
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
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.orderSummary': 'Order Summary',
    'checkout.productDetails': 'Product Details',
    'checkout.subtotal': 'Subtotal',
    'checkout.serviceFee': 'Service Fee',
    'checkout.total': 'Total',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.agreeToTerms': 'I agree to the Terms & Conditions',
    'checkout.confirmPurchase': 'Confirm Purchase',
    'checkout.processing': 'Processing...',
    'checkout.securePayment': 'Secure payment via',
    'checkout.buyerProtection': '12-hour buyer protection',
    'checkout.deliveryInfo': 'Delivery Information',
    'checkout.instantDelivery': 'Instant delivery after payment',
    'checkout.mustAgreeTerms': 'You must agree to the Terms & Conditions',
    
    // Orders
    'orders.title': 'My Orders',
    'orders.subtitle': 'View and manage all your orders',
    'orders.description': 'View and manage all your buy and sell orders',
    'orders.loginRequired': 'Please log in to view your orders',
    'orders.searchPlaceholder': 'Search by order ID, product, or seller...',
    'orders.filterByRole': 'Show orders:',
    'orders.all': 'All',
    'orders.total': 'Total',
    'orders.asBuyer': 'As Buyer',
    'orders.asSeller': 'As Seller',
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
    'orders.noOrders': 'No orders yet',
    'orders.noOrdersDesc': 'You haven\'t made any purchases yet',
    'orders.noOrdersFilter': 'No orders match the selected filter',
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
    'orders.stats.cancelled': 'Cancelled',
    
    // Order Details
    'order.title': 'Order Details',
    'order.status': 'Order Status',
    'order.statusPending': 'Pending Payment',
    'order.statusPaid': 'Paid',
    'order.statusEscrow': 'In Escrow',
    'order.statusCompleted': 'Completed',
    'order.statusCancelled': 'Cancelled',
    'order.statusDisputed': 'Disputed',
    'order.confirmSuccess': 'Receipt confirmed successfully',
    'order.onlyBuyerCanConfirm': 'Only the buyer can confirm receipt',
    'order.cannotConfirmStatus': 'Cannot confirm order with this status',
    'order.confirmError': 'Failed to confirm receipt',
    'order.cancelSuccess': 'Order cancelled successfully',
    'order.cannotCancelCompleted': 'Cannot cancel completed order',
    'order.cancelError': 'Failed to cancel order',
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
    
    // Wallet
    'wallet.title': 'Wallet',
    'wallet.balance': 'Available Balance',
    'wallet.pending': 'Pending',
    'wallet.total': 'Total',
    'wallet.withdraw': 'Withdraw',
    'wallet.deposit': 'Deposit',
    'wallet.transactions': 'Transactions',
    'wallet.withdrawalHistory': 'Withdrawal History',
    'wallet.amount': 'Amount',
    'wallet.enterAmount': 'Enter amount',
    'wallet.minimumWithdrawal': 'Minimum withdrawal',
    'wallet.bankAccount': 'Bank Account',
    'wallet.accountNumber': 'Account Number',
    'wallet.accountName': 'Account Holder Name',
    'wallet.bankName': 'Bank Name',
    'wallet.iban': 'IBAN',
    'wallet.requestWithdrawal': 'Request Withdrawal',
    'wallet.withdrawalRequested': 'Withdrawal requested successfully',
    'wallet.withdrawalPending': 'Processing',
    'wallet.withdrawalCompleted': 'Completed',
    'wallet.withdrawalFailed': 'Failed',
    'wallet.transactionType': 'Transaction Type',
    'wallet.sale': 'Sale',
    'wallet.purchase': 'Purchase',
    'wallet.withdrawal': 'Withdrawal',
    'wallet.refund': 'Refund',
    'wallet.fee': 'Fee',
    'wallet.noTransactions': 'No transactions yet',
    'wallet.processingTime': 'Processing time: 1-4 business days',
    'wallet.withdrawSuccess': 'Withdrawal requested successfully',
    'wallet.hourlyLimitExceeded': 'Hourly withdrawal limit exceeded. Please try again later',
    'wallet.dailyLimitExceeded': 'Daily withdrawal limit exceeded ({limit}). Remaining: ${remaining}',
    'wallet.withdrawError': 'Withdrawal request failed',
    'wallet.invalidIBAN': 'Invalid IBAN. Must start with SA and be 24 characters long',
    'wallet.enterValidAmount': 'Please enter a valid amount',
    'wallet.minWithdrawal': 'Minimum withdrawal is ${min}',
    'wallet.maxWithdrawal': 'Maximum withdrawal is ${max}',
    'wallet.exceedsBalance': 'Amount exceeds available balance',
    'wallet.enterValidIBAN': 'Please enter a valid IBAN',
    
    // Profile
    'profile.title': 'Profile',
    'profile.publicProfile': 'Public Profile',
    'profile.memberSince': 'Member Since',
    'profile.lastActive': 'Last Active',
    'profile.verified': 'Verified',
    'profile.notVerified': 'Not Verified',
    'profile.rating': 'Rating',
    'profile.totalSales': 'Total Sales',
    'profile.completedOrders': 'Completed Orders',
    'profile.activeListings': 'Active Listings',
    'profile.responseRate': 'Response Rate',
    'profile.deliveryTime': 'Delivery Time',
    'profile.editProfile': 'Edit Profile',
    'profile.viewReviews': 'View Reviews',
    'profile.accountSettings': 'Account Settings',
    'profile.security': 'Security',
    'profile.verifyAccount': 'Verify Account',
    'profile.about': 'About',
    'profile.noReviews': 'No reviews yet',
    'profile.reviewsCount': 'reviews',
    
    // Profile
    'profile.minutesAgo': 'minutes ago',
    'profile.hoursAgo': '{hours} hours ago',
    'profile.oneDayAgo': 'one day ago',
    'profile.daysAgo': '{days} days ago',
    'profile.statsRefreshed': 'Stats refreshed',
    'profile.activityRefreshed': 'Activity refreshed',
    
    // Edit Profile
    'editProfile.title': 'Edit Profile',
    'editProfile.pageDescription': 'Update your personal account information on NXOLand',
    'editProfile.skipToForm': 'Skip to edit form',
    'editProfile.personalInfo': 'Personal Information',
    'editProfile.name': 'Name',
    'editProfile.email': 'Email',
    'editProfile.phone': 'Phone',
    'editProfile.bio': 'Bio',
    'editProfile.avatar': 'Avatar',
    'editProfile.changeAvatar': 'Change Avatar',
    'editProfile.saveChanges': 'Save Changes',
    'editProfile.saving': 'Saving...',
    'editProfile.updateSuccess': 'Profile updated successfully',
    'editProfile.updateError': 'Update failed',
    'editProfile.nameRequired': 'Please enter name',
    'editProfile.nameMinLength': 'Name must be at least 3 characters',
    'editProfile.nameTooLong': 'Name is too long (max 100 characters)',
    'editProfile.emailRequired': 'Please enter email',
    'editProfile.invalidEmail': 'Invalid email address',
    
    // Security
    'security.title': 'Security',
    'security.changePassword': 'Change Password',
    'security.currentPassword': 'Current Password',
    'security.newPassword': 'New Password',
    'security.confirmNewPassword': 'Confirm New Password',
    'security.updatePassword': 'Update Password',
    'security.passwordUpdated': 'Password updated successfully',
    'security.passwordUpdateSuccess': 'Password updated successfully',
    'security.passwordUpdateError': 'Failed to update password',
    'security.currentPasswordRequired': 'Please enter current password',
    'security.newPasswordTooShort': 'New password must be at least 8 characters',
    'security.passwordsNotMatch': 'Passwords do not match',
    'security.newPasswordTooWeak': 'Password is weak. Use a mix of letters, numbers, and symbols',
    'security.invalidCurrentPassword': 'Current password is incorrect',
    'security.tooManyAttempts': 'Too many attempts. Try again after {minutes} minutes',
    'security.attemptsRemaining': 'Attempts remaining',
    'security.veryWeak': 'Very Weak',
    'security.weak': 'Weak',
    'security.medium': 'Medium',
    'security.strong': 'Strong',
    'security.veryStrong': 'Very Strong',
    'security.passwordWeakMix': 'Password is weak. Please use uppercase, lowercase, numbers, and special characters',
    'security.needUppercase': 'Password must contain at least one uppercase letter (A-Z)',
    'security.needLowercase': 'Password must contain at least one lowercase letter (a-z)',
    'security.needNumber': 'Password must contain at least one number',
    'security.needSymbol': 'Password must contain at least one special character (!@#$%...)',
    'security.twoFactor': 'Two-Factor Authentication',
    'security.enable2FA': 'Enable 2FA',
    'security.disable2FA': 'Disable 2FA',
    'security.loginHistory': 'Login History',
    'security.activeSessions': 'Active Sessions',
    'security.logoutAll': 'Logout All Devices',
    
    // KYC
    'kyc.title': 'KYC Verification',
    'kyc.subtitle': 'Complete identity verification to increase withdrawal limit',
    'kyc.status': 'Verification Status',
    'kyc.notStarted': 'Not Started',
    'kyc.pending': 'Under Review',
    'kyc.verified': 'Verified',
    'kyc.rejected': 'Rejected',
    'kyc.startVerification': 'Start Verification',
    'kyc.resubmit': 'Resubmit',
    'kyc.benefits': 'Verification Benefits',
    'kyc.benefit1': 'Increase withdrawal limit to $10,000',
    'kyc.benefit2': 'Verified badge on your profile',
    'kyc.benefit3': 'Increased trust from buyers',
    'kyc.benefit4': 'Priority support',
    'kyc.requiredDocs': 'Required Documents',
    'kyc.nationalId': 'National ID',
    'kyc.proofOfAddress': 'Proof of Address',
    'kyc.selfie': 'Selfie',
    
    // My Listings
    'listings.title': 'My Listings',
    'listings.subtitle': 'Manage all your listings',
    'listings.createNew': 'Create New Listing',
    'listings.active': 'Active',
    'listings.pending': 'Pending Review',
    'listings.sold': 'Sold',
    'listings.rejected': 'Rejected',
    'listings.draft': 'Draft',
    'listings.noListings': 'No listings yet',
    'listings.createFirst': 'Create your first listing',
    'listings.edit': 'Edit',
    'listings.delete': 'Delete',
    'listings.view': 'View',
    'listings.promote': 'Promote',
    'listings.views': 'views',
    'listings.inquiries': 'inquiries',
    'listings.deleteConfirm': 'Are you sure you want to delete this listing?',
    
    // Disputes
    'disputes.title': 'Disputes',
    'disputes.subtitle': 'Manage disputes and complaints',
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
    'disputes.noDisputes': 'No disputes',
    'disputes.viewDetails': 'View Details',
    'disputes.adminResponse': 'Admin Response',
    'disputes.resolution': 'Resolution',
    
    // Dispute Details
    'disputeDetails.title': 'Dispute Details',
    'disputeDetails.description': 'Dispute details and proposed resolution',
    'disputeDetails.backToDisputes': 'Back to Disputes',
    'disputeDetails.loadError': 'Failed to load dispute details',
    'disputeDetails.backToList': 'Back to List',
    'disputeDetails.disputeOn': 'Dispute on order',
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
    'disputeDetails.underReviewMessage': 'Dispute is under review. We will contact you within 24-48 hours.',
    'disputeDetails.cancelDispute': 'Cancel Dispute',
    'disputeDetails.cancelTitle': 'Cancel Dispute',
    'disputeDetails.cancelConfirm': 'Are you sure you want to cancel this dispute?',
    'disputeDetails.cancelWarning1': 'The order will be returned to escrow status and you can continue the transaction.',
    'disputeDetails.cancelWarning2': '⚠️ The dispute cannot be reopened after cancellation.',
    'disputeDetails.cancelButton': 'Go Back',
    'disputeDetails.confirmCancel': 'Cancel Dispute',
    'disputeDetails.cancelling': 'Cancelling...',
    'disputeDetails.cancelSuccess': 'Dispute cancelled successfully',
    'disputeDetails.cancelError': 'Failed to cancel dispute',
    'disputeDetails.loginRequired': 'Please log in to view dispute details',
    'disputeDetails.loginButton': 'Log In',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Mark All as Read',
    'notifications.deleteAll': 'Delete All',
    'notifications.noNotifications': 'No notifications',
    'notifications.newOrder': 'New Order',
    'notifications.orderUpdate': 'Order Update',
    'notifications.disputeOpened': 'New Dispute',
    'notifications.disputeResolved': 'Dispute Resolved',
    'notifications.paymentReceived': 'Payment Received',
    'notifications.withdrawalCompleted': 'Withdrawal Completed',
    'notifications.newReview': 'New Review',
    'notifications.kycUpdate': 'KYC Update',
    
    // Members & Leaderboard
    'members.title': 'Members',
    'members.subtitle': 'Browse {count} members on the platform',
    'members.description': 'Browse NXOLand platform members and discover top sellers',
    'members.searchMembers': 'Search members...',
    'members.searchPlaceholder': 'Search for a member by name...',
    'members.searchLabel': 'Search members',
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
    'members.noMembers': 'No members available',
    'members.trustedMember': 'Trusted Member',
    'members.memberSince': 'Member since {date}',
    'members.viewProfile': 'View Profile',
    'members.profile': 'Profile',
    'members.aboutMember': 'About Member',
    'members.listings': 'Listings',
    'members.sales': 'Sales',
    'members.memberInfo': 'Member Information',
    'members.joinDate': 'Join Date',
    'members.totalListings': 'Total Listings',
    'leaderboard.title': 'Leaderboard',
    'leaderboard.subtitle': 'Top sellers and buyers',
    'leaderboard.description': 'Discover the top sellers on NXOLand platform',
    'leaderboard.skipToLeaderboard': 'Skip to leaderboard',
    'leaderboard.rank': 'Rank',
    'leaderboard.member': 'Member',
    'leaderboard.sales': 'Sales',
    'leaderboard.rating': 'Rating',
    'leaderboard.topSeller': '#1 Top Seller',
    'leaderboard.gold': 'Gold',
    'leaderboard.silver': 'Silver',
    'leaderboard.bronze': 'Bronze',
    'leaderboard.deals': 'deals',
    'leaderboard.fullRanking': 'Full Ranking',
    'leaderboard.loadError': 'Failed to load leaderboard',
    'leaderboard.tryAgain': 'Please try again',
    'leaderboard.noData': 'No data available',
    
    // Reviews
    'reviews.title': 'Reviews',
    'reviews.writeReview': 'Write Review',
    'reviews.yourRating': 'Your Rating',
    'reviews.yourReview': 'Your Review',
    'reviews.submitReview': 'Submit Review',
    'reviews.helpful': 'Helpful',
    'reviews.notHelpful': 'Not Helpful',
    'reviews.report': 'Report',
    'reviews.noReviews': 'No reviews yet',
    'reviews.verifiedPurchase': 'Verified Purchase',
    
    // Suggestions
    'suggestions.title': 'Suggestions & Feedback Center',
    'suggestions.subtitle': 'Share your ideas and rate your experience',
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
    'suggestions.status.pending': 'Under Review',
    'suggestions.status.approved': 'Approved',
    'suggestions.status.implemented': 'Implemented',
    'suggestions.voteError': 'Failed to vote. Please try again',
    'suggestions.loginToVote': 'You must log in to vote',
    'suggestions.createSuccess': 'Your suggestion has been submitted successfully',
    'suggestions.createError': 'Failed to submit suggestion',
    'suggestions.loginToSuggest': 'You must log in to add a suggestion',
    'suggestions.securityVerification': 'Please complete security verification',
    'suggestions.fillAllFields': 'Please fill in all fields',
    'suggestions.reviewSuccess': 'Thank you for your rating! Your feedback has been submitted',
    'suggestions.reviewError': 'Failed to submit rating',
    'suggestions.loginToReview': 'You must log in to rate the platform',
    'suggestions.selectRating': 'Please select a rating',
    'suggestions.minReviewLength': 'Please write a comment of at least 10 characters',
    'suggestions.avgRating': 'Average Rating',
    'suggestions.totalReviews': 'Total Reviews',
    'suggestions.topSuggestions': 'Top Suggestions',
    'suggestions.recentSuggestions': 'Recent Suggestions',
    'suggestions.all': 'All',
    'suggestions.pending': 'Pending',
    'suggestions.approved': 'Approved',
    'suggestions.implemented': 'Implemented',
    'suggestions.submitting': 'Submitting...',
    
    // My Listings
    'myListings.title': 'My Listings',
    'myListings.subtitle': 'Manage your accounts listed for sale (you can buy and sell with the same account)',
    'myListings.loginRequired': 'You must log in to view your listings',
    'myListings.loginButton': 'Log In',
    'myListings.addAccount': 'Add Account',
    'myListings.createNew': 'Create New Listing',
    'myListings.all': 'All',
    'myListings.active': 'Active',
    'myListings.inactive': 'Inactive',
    'myListings.sold': 'Sold',
    'myListings.totalListings': 'Total Listings',
    'myListings.noListings': 'No listings',
    'myListings.noListingsMessage': 'You haven\'t created any listings yet',
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
    'myListings.deleteMessage': 'This listing will be permanently deleted',
    'myListings.soldConfirm': 'Mark as sold?',
    'myListings.soldMessage': 'Do you want to mark this listing as sold?',
    'myListings.deleteSuccess': 'Listing deleted successfully',
    'myListings.deleteError': 'Failed to delete listing',
    'myListings.hasActiveOrders': 'Cannot delete listing because it has active orders',
    'myListings.updateSuccess': 'Listing status updated',
    'myListings.updateError': 'Failed to update listing',
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
    'myListings.emptyStateTitle': 'No listings',
    'myListings.emptyStateMessage': 'Start by adding your first account for sale on the platform',
    'myListings.addNewAccount': 'Add New Account',
    'myListings.noListingsForFilter': 'No listings',
    'myListings.viewCount': 'view',
    'myListings.deleteTitle': 'Confirm Deletion',
    'myListings.deleteDescription': 'Are you sure you want to delete this listing? This action cannot be undone.',
    'myListings.soldTitle': 'Confirm Sale',
    'myListings.soldDescription': 'Has this account been sold? The listing status will be updated to "sold" and hidden from public listings.',
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
    
    // Help & Support
    'help.title': 'Help',
    'help.description': 'Help Center - Answers to all your questions about the platform',
    'help.subtitle': 'Answers to all your questions about NXOLand',
    'help.skipToContent': 'Skip to content',
    'help.faq': 'Frequently Asked Questions',
    'help.faqTitle': 'Frequently Asked Questions',
    'help.contactSupport': 'Contact Support',
    'help.contactUs': 'Contact Us',
    'help.contactMessage': 'Need help? Our team is available on Discord to answer all your questions',
    'help.discordJoin': 'Join Discord',
    'help.discordSupport': 'Official support channel - available 24/7',
    'help.discordMessage': '💬 All your inquiries and support requests are handled through the official Discord server',
    'help.improvementTitle': 'Help Us Improve',
    'help.improvementMessage': 'Your opinion matters! Share your experience and suggestions to improve the platform',
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
    'help.faq1A': 'Browse the marketplace, choose the right account, click buy, and pay securely. The account will be delivered within 12 hours.',
    'help.faq2Q': 'Is payment secure?',
    'help.faq2A': 'Yes! We use Tap Payment, a trusted and fully encrypted payment system. All transactions are protected.',
    'help.faq3Q': 'How long does delivery take?',
    'help.faq3A': 'After payment, account credentials are delivered instantly. You have 12 hours to review and confirm receipt.',
    'help.faq4Q': 'What if the account doesn\'t match the description?',
    'help.faq4A': 'You can open a dispute during the escrow period (12 hours). Our team will review the case and make the appropriate decision.',
    'help.faq5Q': 'What are the platform fees?',
    'help.faq5A': 'We charge 5% commission on each sale. The fees include escrow system, technical support, and full protection.',
    'help.faq6Q': 'How do I withdraw my earnings?',
    'help.faq6A': 'Go to Wallet, click Withdraw, enter your IBAN, and request withdrawal. Transfer takes 1-4 business days.',
    
    // About
    'about.title': 'About Us',
    'about.description': 'Learn about NXOLand and our vision to provide a secure platform for account trading',
    'about.subtitle': 'NXOLand Platform - Our vision, values, and goal in providing a secure trading experience',
    'about.skipToContent': 'Skip to content',
    'about.ourMission': 'Our Mission',
    'about.vision': 'Our Vision',
    'about.visionText': 'We strive to be the first and most trusted platform in the Middle East for digital account trading, providing a secure and reliable environment for sellers and buyers',
    'about.ourValues': 'Our Values',
    'about.security': 'Security & Protection',
    'about.securityDesc': 'Complete protection for all transactions through an intelligent escrow system',
    'about.speed': 'Speed & Efficiency',
    'about.speedDesc': 'Fast transactions and instant account delivery',
    'about.trust': 'Trust & Transparency',
    'about.trustDesc': 'Building trust through transparency and credibility',
    'about.story': 'Our Story',
    'about.storyPara1': 'NXOLand started from a simple idea: providing a secure and reliable platform for game account trading in the Middle East. We noticed the great need for a service that guarantees the rights of both sellers and buyers.',
    'about.storyPara2': 'With the rapid development in gaming and digital platforms, account trading has become an essential part of the gaming experience. Unfortunately, many platforms do not provide adequate protection or appropriate support.',
    'about.storyPara3': 'That\'s why we created NXOLand - a platform that combines security, speed, and transparency. Our system ensures complete protection for both parties from the first step until the successful completion of the deal.',
    'about.howItWorks': 'How It Works',
    'about.buyerSteps': 'Buyer Steps',
    'about.buyerStep1Title': 'Browse Accounts',
    'about.buyerStep1Desc': 'Find the right account from the marketplace',
    'about.buyerStep2Title': 'Order & Pay',
    'about.buyerStep2Desc': 'Order the account and pay securely through the platform',
    'about.buyerStep3Title': 'Receive Credentials',
    'about.buyerStep3Desc': 'Get account credentials after seller approval',
    'about.buyerStep4Title': 'Confirm',
    'about.buyerStep4Desc': 'Review the account and confirm receipt to complete',
    'about.sellerSteps': 'Seller Steps',
    'about.sellerStep1Title': 'Create Listing',
    'about.sellerStep1Desc': 'Add your account details and desired price',
    'about.sellerStep2Title': 'Receive Orders',
    'about.sellerStep2Desc': 'Wait for buyer orders and review details',
    'about.sellerStep3Title': 'Deliver Account',
    'about.sellerStep3Desc': 'Send account credentials to buyer through platform',
    'about.sellerStep4Title': 'Receive Payment',
    'about.sellerStep4Desc': 'Get your money after buyer confirmation',
    'about.activeUsers': 'Active Users',
    'about.successfulDeals': 'Successful Deals',
    'about.satisfactionRate': 'Satisfaction Rate',
    'about.team': 'Team',
    'about.contact': 'Contact Us',
    'about.support': 'Technical Support',
    'common.copyright': '© 2025 NXOLand. All rights reserved.',
    
    // Error Messages
    'error.404': 'Page Not Found',
    'error.404.desc': 'Sorry, the page you are looking for does not exist',
    'error.500': 'Server Error',
    'error.500.desc': 'An unexpected error occurred',
    'error.networkError': 'Network Error',
    'error.tryAgain': 'Try Again',
    'error.goHome': 'Go Home',
    'error.forbidden': 'Forbidden',
    'error.unauthorized': 'Please login',
    'error.sessionExpired': 'Session Expired',
    
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
    
    // Time & Date
    'time.justNow': 'Just now',
    'time.minutesAgo': '{n} minutes ago',
    'time.hoursAgo': '{n} hours ago',
    'time.daysAgo': '{n} days ago',
    'time.weeksAgo': '{n} weeks ago',
    'time.monthsAgo': '{n} months ago',
    'time.yearsAgo': '{n} years ago',
    
    // How It Works Section
    'home.howItWorks': 'How It Works',
    'home.howItWorksSubtitle': 'Three simple steps to buy securely',
    'home.howPlatformWorks': 'How the Platform Works',
    'home.howDoesItWork': 'How does it work?',
    'home.step1.title': 'Choose & Buy',
    'home.step1.desc': 'Browse available accounts and choose the right one',
    'home.step2.title': 'Escrow Period',
    'home.step2.desc': 'Receive account credentials and verify within 12 hours',
    'home.step3.title': 'Confirm or Dispute',
    'home.step3.desc': 'If the account works, confirm receipt',
    'common.skipToContent': 'Skip to main content',
  }
};
