import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Shield, Star, CheckCircle2, MessageSquare, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ReviewCard } from "@/components/ReviewCard";
import { useLanguage } from "@/contexts/LanguageContext";
import tiktokLogo from "@/assets/tiktok-logo.png";

const SocialProductExample = () => {
  const { t, language } = useLanguage();

  // Example social media account data - only what seller provides
  const accountData = {
    platform: "TikTok",
    username: "@example_creator",
    price: 2500,
    description: "Premium TikTok account focused on fitness and lifestyle content. High engagement rate with active and loyal followers. Perfect for brands or influencers looking to expand their reach in the fitness niche.",
    hasPrimaryEmail: true,
    hasPhoneNumber: true,
  };

  const sellerInfo = {
    name: "Ahmed Ali",
    rating: 4.9,
    totalSales: 47,
    memberSince: "2023",
    verified: true,
  };

  // Mock seller reviews
  const sellerReviews = [
    {
      id: "1",
      rating: 5,
      comment: "Excellent seller, account exactly as described. Fast delivery and professional communication.",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      reviewer: {
        name: "Sarah M.",
        verified: true,
      },
      order_id: "ORD-001",
      helpful_count: 12,
      user_found_helpful: false,
    },
    {
      id: "2",
      rating: 4,
      comment: "Good account, seller was cooperative. Recommended!",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reviewer: {
        name: "John D.",
        verified: true,
      },
      order_id: "ORD-002",
      helpful_count: 8,
      user_found_helpful: true,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <Navbar />

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        <BackButton className="text-white/80 hover:text-white" fallbackPath="/marketplace" />
        
        <Breadcrumb 
          items={[
            { label: t('socialProduct.home'), href: "/" },
            { label: t('socialProduct.marketplace'), href: "/marketplace" },
            { label: t('socialProduct.accountDetails') }
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8 mt-6">
          {/* Left Column - Account Icon/Logo */}
          <div className="space-y-4">
            <Card className="overflow-hidden bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="aspect-video bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] flex items-center justify-center p-8">
                <img 
                  src={tiktokLogo} 
                  alt="TikTok" 
                  className="w-48 h-48 object-contain"
                />
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]">
                  {t('socialProduct.availableNow')}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-black text-white mb-4">{accountData.username}</h1>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black text-[hsl(195,80%,70%)]">${accountData.price}</span>
              </div>
            </div>

            {/* Seller Info */}
            <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{sellerInfo.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {sellerInfo.name}
                    {sellerInfo.verified && (
                      <CheckCircle2 className="h-5 w-5 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" />
                    )}
                  </div>
                  <div className="text-sm text-white/60">{t('socialProduct.verifiedSeller')}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[hsl(195,80%,70%)]">{sellerInfo.totalSales}</div>
                  <div className="text-xs text-white/60">{t('socialProduct.sales')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[hsl(40,90%,55%)]">{sellerInfo.rating}</div>
                  <div className="text-xs text-white/60">{t('socialProduct.rating')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{sellerInfo.memberSince}</div>
                  <div className="text-xs text-white/60">{t('socialProduct.member')}</div>
                </div>
              </div>
            </Card>

            {/* Account Details - Only seller-provided info */}
            <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[hsl(195,80%,70%)] to-[hsl(40,90%,55%)] rounded-full" />
                {t('socialProduct.accountDetails')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gradient-to-br from-[hsl(120,60%,50%,0.15)] to-[hsl(120,60%,30%,0.1)] rounded-lg border border-[hsl(120,60%,70%,0.2)] col-span-2">
                  <div className="text-xs text-[hsl(120,60%,70%)] mb-1">
                    {t('socialProduct.withPrimaryEmail')}
                  </div>
                  <div className="flex items-center gap-2">
                    {accountData.hasPrimaryEmail ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                        <span className="font-bold text-[hsl(120,70%,50%)] text-lg">
                          {t('socialProduct.yes')}
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-500" />
                        <span className="font-bold text-red-500 text-lg">
                          {t('socialProduct.no')}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-br from-[hsl(195,80%,50%,0.15)] to-[hsl(195,80%,30%,0.1)] rounded-lg border border-[hsl(195,80%,70%,0.2)] col-span-2">
                  <div className="text-xs text-[hsl(195,80%,70%)] mb-1">
                    {t('socialProduct.accountLinkedToPhone')}
                  </div>
                  <div className="flex items-center gap-2">
                    {accountData.hasPhoneNumber ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                        <span className="font-bold text-[hsl(120,70%,50%)] text-lg">
                          {t('socialProduct.yes')}
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-500" />
                        <span className="font-bold text-red-500 text-lg">
                          {t('socialProduct.no')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[hsl(195,80%,70%)] to-[hsl(40,90%,55%)] rounded-full" />
                {t('socialProduct.description')}
              </h3>
              <p className="text-white/80 leading-relaxed">{accountData.description}</p>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                asChild
                className="flex-1 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                size="lg"
              >
                <Link to="/checkout">
                  {t('socialProduct.buyNow')}
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                size="lg"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                {t('socialProduct.contactSeller')}
              </Button>
            </div>
          </div>
        </div>

        {/* Seller Reviews Section */}
        <Card className="mt-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              {t('socialProduct.sellerReviews')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sellerReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialProductExample;
