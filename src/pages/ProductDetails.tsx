import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Shield, Star, MapPin, ArrowRight, CheckCircle2, Users, Check, X, Zap, GraduationCap, PawPrint, Crown, Swords, Loader2 } from "lucide-react";
import stoveLv1 from "@/assets/stove_lv_1.png";
import stoveLv2 from "@/assets/stove_lv_2.png";
import stoveLv3 from "@/assets/stove_lv_3.png";
import stoveLv4 from "@/assets/stove_lv_4.png";
import stoveLv5 from "@/assets/stove_lv_5.png";
import stoveLv6 from "@/assets/stove_lv_6.png";
import stoveLv7 from "@/assets/stove_lv_7.png";
import stoveLv8 from "@/assets/stove_lv_8.png";
import stoveLv9 from "@/assets/stove_lv_9.png";
import stoveLv10 from "@/assets/stove_lv_10.png";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { listingsApi, ordersApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";
import { SEO } from "@/components/SEO";
import { formatCurrency } from "@/utils/currency";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isAuthenticated = !!user;
  const listingId = id ? parseInt(id) : 0;

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => listingsApi.getById(listingId),
    enabled: !!listingId,
  });

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const handleBuy = async () => {
    if (!user) {
      toast.error(t('product.loginRequired'));
      navigate("/auth");
      return;
    }

    if (isCreatingOrder) {
      return; // Prevent duplicate requests
    }

    setIsCreatingOrder(true);
    try {
      const order = await ordersApi.create({ listing_id: listingId });
      navigate(`/checkout?order_id=${order.id}`);
    } catch (error) {
      const apiError = error as Error & ApiError;
      toast.error(apiError.message || t('product.createOrderError'));
    } finally {
      setIsCreatingOrder(false);
    }
  };

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

  // Helper to get stove level image
  const getStoveImage = (level: string) => {
    const stoveImages: Record<string, string> = {
      'FC1': stoveLv1,
      'FC2': stoveLv2,
      'FC3': stoveLv3,
      'FC4': stoveLv4,
      'FC5': stoveLv5,
      'FC6': stoveLv6,
      'FC7': stoveLv7,
      'FC8': stoveLv8,
      'FC9': stoveLv9,
      'FC10': stoveLv10,
    };
    return stoveImages[level] || stoveLv1;
  };

  // Parse description to extract account details
  const parseAccountDetails = (description: string) => {
    const lines = description.split('\n');
    const details: Record<string, string> = {};
    
    lines.forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value) {
        details[key] = value;
      }
    });
    
    return details;
  };

  if (isLoading) {
    return (
      <>
        <SEO title={t('common.loading')} />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar />
          <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" aria-hidden="true" />
            <span className="sr-only">{t('product.loadingDetails')}</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 text-center">
          <p className="text-red-400 mb-4">{t('common.errorLoading')}</p>
          <Link to="/marketplace">
            <Button>{t('product.backToMarket')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = listing.images || [];
  const isOwner = user?.id === listing.user_id;
  const accountDetails = parseAccountDetails(listing.description || '');

  return (
    <>
      <SEO 
        title={`${listing.title} - NXOLand`}
        description={listing.description || `${t('product.buy')} ${listing.title} ${t('common.from')} ${listing.category}`}
        url={`/product/${listing.id}`}
      />
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />
      
      {/* Skip link for keyboard navigation */}
      <a 
        href="#product-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
      >
        {t('product.skipToProduct')}
      </a>
      
      {/* Snow particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {snowParticles}
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div id="product-content" className="relative z-10 container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-white/60 hover:text-[hsl(195,80%,70%)] mb-6 transition-colors">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          {t('product.backToMarket')}
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <Card 
              className="overflow-hidden bg-white/5 border-white/10 backdrop-blur-sm cursor-pointer hover:border-[hsl(195,80%,70%)] transition-all"
              onClick={() => images.length > 0 && setEnlargedImage(images[0])}
            >
              <div className="aspect-video bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] flex items-center justify-center">
                {images.length > 0 ? (
                  <img 
                    src={images[0]} 
                    alt={listing.title}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Shield className="h-32 w-32 text-white/20" aria-hidden="true" />
                )}
              </div>
            </Card>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1, 5).map((img, i) => (
                  <Card 
                    key={i} 
                    className="aspect-square bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden cursor-pointer hover:border-[hsl(195,80%,70%)] transition-all"
                    onClick={() => setEnlargedImage(img)}
                  >
                    <img 
                      src={img} 
                      alt={`${listing.title} - ${t('product.image')} ${i + 2}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                  <Badge className={
                    listing.status === 'active' 
                      ? "bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]"
                      : listing.status === 'sold'
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                  }>
                  {listing.status === 'active' ? t('product.available') : listing.status === 'sold' ? t('product.sold') : t('product.unavailable')}
                </Badge>
                {listing.user?.is_verified && (
                  <Badge className="bg-[hsl(40,90%,55%,0.2)] text-[hsl(40,90%,55%)] border-[hsl(40,90%,55%,0.3)]">
                    {t('product.premiumAccount')}
                  </Badge>
                )}
                </div>
              
              <h1 className="text-4xl font-black text-white mb-4">{listing.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>السيرفر: {accountDetails['السيرفر'] || 'غير محدد'}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black text-[hsl(195,80%,70%)]">{formatCurrency(listing.price)}</span>
              </div>
            </div>

              {/* Seller Info */}
              {listing.user && (
              <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      {listing.user.name}
                      {listing.user.is_verified && (
                        <CheckCircle2 className="h-5 w-5 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" />
                      )}
                    </div>
                    <div className="text-sm text-white/60">{listing.user.is_verified ? 'بائع موثوق' : 'بائع'}</div>
                  </div>
                </div>
              </Card>
            )}

            {/* Account Details */}
            <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[hsl(195,80%,70%)] to-[hsl(40,90%,55%)] rounded-full" />
                تفاصيل الحساب
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gradient-to-br from-[hsl(195,80%,50%,0.15)] to-[hsl(195,80%,30%,0.1)] rounded-lg border border-[hsl(195,80%,70%,0.2)]">
                  <div className="text-xs text-[hsl(195,80%,70%)] mb-1">السيرفر</div>
                  <div className="font-bold text-white text-lg">{accountDetails['السيرفر'] || 'غير محدد'}</div>
                </div>
                
                {accountDetails['حجرة الاحتراق'] && (
                  <div className="p-3 bg-gradient-to-br from-[hsl(280,70%,50%,0.15)] to-[hsl(280,70%,30%,0.1)] rounded-lg border border-[hsl(280,70%,70%,0.2)]">
                    <div className="text-xs text-[hsl(280,70%,70%)] mb-1">حجرة الاحتراق</div>
                    <div className="flex items-center gap-2">
                      <img src={getStoveImage(accountDetails['حجرة الاحتراق'])} alt={accountDetails['حجرة الاحتراق']} className="w-8 h-8" />
                      <span className="font-bold text-white text-lg">{accountDetails['حجرة الاحتراق']}</span>
                    </div>
                  </div>
                )}
                
                {accountDetails['هيليوس'] && (
                  <div className="p-3 bg-gradient-to-br from-[hsl(40,90%,55%,0.15)] to-[hsl(40,90%,40%,0.1)] rounded-lg border border-[hsl(40,90%,70%,0.2)]">
                    <div className="text-xs text-[hsl(40,90%,70%)] mb-1">هيليوس</div>
                    <div className="font-bold text-white">{accountDetails['هيليوس']}</div>
                  </div>
                )}
                
                {accountDetails['عدد الجنود'] && (
                  <div className="p-3 bg-gradient-to-br from-[hsl(160,60%,50%,0.15)] to-[hsl(160,60%,30%,0.1)] rounded-lg border border-[hsl(160,60%,70%,0.2)]">
                    <div className="text-xs text-[hsl(160,60%,70%)] mb-1 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      عدد الجنود
                    </div>
                    <div className="font-bold text-white">{accountDetails['عدد الجنود']}</div>
                  </div>
                )}
                
                {accountDetails['القوة الشخصية'] && (
                  <div className="p-3 bg-gradient-to-br from-[hsl(195,80%,50%,0.2)] to-[hsl(195,80%,30%,0.15)] rounded-lg border-2 border-[hsl(195,80%,70%,0.4)] shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                    <div className="text-xs text-[hsl(195,80%,70%)] mb-1 font-bold flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      القوة الشخصية
                    </div>
                    <div className="font-black text-[hsl(195,80%,70%)] text-xl">{accountDetails['القوة الشخصية']}</div>
                  </div>
                )}
                
                {accountDetails['قوة البطل'] && (
                  <div className="p-3 bg-gradient-to-br from-[hsl(340,70%,50%,0.15)] to-[hsl(340,70%,30%,0.1)] rounded-lg border border-[hsl(340,70%,70%,0.2)]">
                    <div className="text-xs text-[hsl(340,70%,70%)] mb-1 flex items-center gap-1">
                      <Swords className="h-3 w-3" />
                      قوة البطل
                    </div>
                    <div className="font-bold text-white">{accountDetails['قوة البطل']}</div>
                  </div>
                )}
                
                {accountDetails['الجزيرة'] && (
                  <div className="p-3 bg-gradient-to-br from-[hsl(220,70%,50%,0.15)] to-[hsl(220,70%,30%,0.1)] rounded-lg border border-[hsl(220,70%,70%,0.2)]">
                    <div className="text-xs text-[hsl(220,70%,70%)] mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      الجزيرة
                    </div>
                    <div className="font-bold text-white text-lg">{accountDetails['الجزيرة']}</div>
                  </div>
                )}
                
                {accountDetails['قوة الخبير'] && (
                  <div className="p-3 bg-gradient-to-br from-[hsl(120,60%,50%,0.15)] to-[hsl(120,60%,30%,0.1)] rounded-lg border border-[hsl(120,60%,70%,0.2)]">
                    <div className="text-xs text-[hsl(120,60%,70%)] mb-1 flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      قوة الخبير
                    </div>
                    <div className="font-bold text-white">{accountDetails['قوة الخبير']}</div>
                  </div>
                )}
                
                {accountDetails['قوة البطل الإجمالية'] && (
                  <div className="p-3 bg-gradient-to-br from-[hsl(40,90%,55%,0.15)] to-[hsl(40,90%,40%,0.1)] rounded-lg border border-[hsl(40,90%,70%,0.2)]">
                    <div className="text-xs text-[hsl(40,90%,70%)] mb-1 flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      قوة البطل الإجمالية
                    </div>
                    <div className="font-bold text-white">{accountDetails['قوة البطل الإجمالية']}</div>
                  </div>
                )}
                
                {accountDetails['قوة الحيوانات'] && (
                  <div className="p-3 bg-gradient-to-br from-[hsl(280,70%,50%,0.15)] to-[hsl(280,70%,30%,0.1)] rounded-lg border border-[hsl(280,70%,70%,0.2)]">
                    <div className="text-xs text-[hsl(280,70%,70%)] mb-1 flex items-center gap-1">
                      <PawPrint className="h-3 w-3" />
                      قوة الحيوانات
                    </div>
                    <div className="font-bold text-white">{accountDetails['قوة الحيوانات']}</div>
                  </div>
                )}
                
                {accountDetails['مع البريد الإلكتروني الأساسي'] && (
                  <div className="p-3 bg-gradient-to-br from-[hsl(120,60%,50%,0.15)] to-[hsl(120,60%,30%,0.1)] rounded-lg border border-[hsl(120,60%,70%,0.2)] col-span-2">
                    <div className="text-xs text-[hsl(120,60%,70%)] mb-1">مع البريد الإلكتروني الأساسي</div>
                    <div className="flex items-center gap-2">
                      {accountDetails['مع البريد الإلكتروني الأساسي'] === 'نعم' ? (
                        <>
                          <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                          <span className="font-bold text-[hsl(120,70%,50%)] text-lg">نعم</span>
                        </>
                      ) : (
                        <>
                          <X className="h-5 w-5 text-red-400" />
                          <span className="font-bold text-red-400 text-lg">لا</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
                  </div>
                </Card>

            {/* Account Bindings */}
            <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[hsl(195,80%,70%)] to-[hsl(40,90%,55%)] rounded-full" />
                ربط الحساب
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-white/60 mb-2">أبل</div>
                  <div className="flex items-center gap-2">
                    {accountDetails['مربوط في أبل'] === 'نعم' ? (
                      <>
                        <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                        <span className="font-bold text-[hsl(120,70%,50%)]">مربوط</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-400" />
                        <span className="font-bold text-red-400">غير مربوط</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-white/60 mb-2">قوقل</div>
                  <div className="flex items-center gap-2">
                    {accountDetails['مربوط في قوقل'] === 'نعم' ? (
                      <>
                        <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                        <span className="font-bold text-[hsl(120,70%,50%)]">مربوط</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-400" />
                        <span className="font-bold text-red-400">غير مربوط</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-white/60 mb-2">فيسبوك</div>
                  <div className="flex items-center gap-2">
                    {accountDetails['مربوط في فيسبوك'] === 'نعم' ? (
                      <>
                        <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                        <span className="font-bold text-[hsl(120,70%,50%)]">مربوط</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-400" />
                        <span className="font-bold text-red-400">غير مربوط</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-white/60 mb-2">قيم سنتر</div>
                  <div className="flex items-center gap-2">
                    {accountDetails['مربوط في قيم سنتر'] === 'نعم' ? (
                      <>
                        <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                        <span className="font-bold text-[hsl(120,70%,50%)]">مربوط</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-400" />
                        <span className="font-bold text-red-400">غير مربوط</span>
                      </>
              )}
            </div>
                </div>
              </div>
            </Card>

            {/* Invoice Images Status */}
            <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[hsl(195,80%,70%)] to-[hsl(40,90%,55%)] rounded-full" />
                {t('product.billImages')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80 text-sm">أول فاتورة شراء</span>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                    <span className="text-[hsl(120,70%,50%)] font-semibold text-sm">مرفقة</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80 text-sm">ثلاث فواتير مختلفة</span>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                    <span className="text-[hsl(120,70%,50%)] font-semibold text-sm">مرفقة</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80 text-sm">آخر فاتورة شراء</span>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                    <span className="text-[hsl(120,70%,50%)] font-semibold text-sm">مرفقة</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-[hsl(195,80%,50%,0.1)] rounded-lg border border-[hsl(195,80%,50%,0.3)]">
                <p className="text-xs text-white/70">
                  {t('product.billImagesInfo')}
                </p>
              </div>
            </Card>

            {/* CTA */}
            <div className="space-y-3">
            {!isOwner && listing.status === 'active' && (
                <>
                  {isAuthenticated ? (
              <Button 
                onClick={handleBuy}
                      disabled={isCreatingOrder}
                      size="lg" 
                      className="w-full gap-2 text-lg py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0 disabled:opacity-50"
                    >
                      {isCreatingOrder ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                          جاري المعالجة...
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5" aria-hidden="true" />
                          شراء الآن بأمان
                          <ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      asChild
                      size="lg" 
                      className="w-full gap-2 text-lg py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0"
                    >
                      <Link to="/auth">
                        <Shield className="h-5 w-5" />
                        تسجيل الدخول للشراء
                        <ArrowRight className="h-5 w-5" />
                      </Link>
              </Button>
                  )}
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                    <Shield className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                    <span>محمي بنظام الضمان لمدة 12 ساعة</span>
                  </div>
                </>
            )}

            {isOwner && (
              <div className="space-y-2">
                <p className="text-white/60 text-center">هذا حسابك</p>
                <Link to={`/my-listings`}>
                  <Button variant="outline" className="w-full">إدارة قوائمي</Button>
                </Link>
              </div>
            )}

            {listing.status !== 'active' && !isOwner && (
              <Badge className="w-full justify-center py-3 text-lg bg-red-500/20 text-red-400 border-red-500/30">
                {listing.status === 'sold' ? '🔒 تم البيع' : 'غير متاح'}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" aria-hidden="true" />
      
      {/* Image Enlarge Dialog */}
      <Dialog open={!!enlargedImage} onOpenChange={() => setEnlargedImage(null)}>
        <DialogContent className="max-w-4xl w-full bg-background/95 backdrop-blur-sm border-white/10">
          {enlargedImage ? (
            <img 
              src={enlargedImage} 
              alt="Enlarged view"
              className="w-full h-auto object-contain max-h-[85vh] rounded-lg"
            />
          ) : (
            <div className="aspect-video bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] flex items-center justify-center rounded-lg">
              <Shield className="h-64 w-64 text-white/20" aria-hidden="true" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
    </>
  );
};

export default ProductDetails;
