import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Star, MapPin, ArrowRight, CheckCircle2, Users, Loader2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { listingsApi, ordersApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";
import { SEO } from "@/components/SEO";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const listingId = id ? parseInt(id) : 0;

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => listingsApi.getById(listingId),
    enabled: !!listingId,
  });

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const handleBuy = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
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
      toast.error(apiError.message || "فشل إنشاء الطلب");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <>
        <SEO title="تحميل..." />
        <div className="min-h-screen relative overflow-hidden" dir="rtl">
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
          <Navbar />
          <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" aria-hidden="true" />
            <span className="sr-only">جاري تحميل تفاصيل المنتج...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 text-center">
          <p className="text-red-400 mb-4">حدث خطأ في تحميل البيانات</p>
          <Link to="/marketplace">
            <Button>العودة للسوق</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = listing.images || [];
  const isOwner = user?.id === listing.user_id;

  return (
    <>
      <SEO 
        title={`${listing.title} - NXOLand`}
        description={listing.description || `شراء ${listing.title} من ${listing.category}`}
        url={`/product/${listing.id}`}
      />
      <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-white/60 hover:text-[hsl(195,80%,70%)] mb-6 transition-colors">
          <ArrowRight className="h-4 w-4" />
          العودة للسوق
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="aspect-video bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] flex items-center justify-center">
                {images.length > 0 ? (
                  <img 
                    src={images[0]} 
                    alt={`${listing.title} - ${listing.category}`}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Shield className="h-32 w-32 text-white/20" />
                )}
              </div>
            </Card>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1, 5).map((img, i) => (
                  <Card key={i} className="aspect-square bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                    <img 
                      src={img} 
                      alt={`${listing.title} - صورة ${i + 2}`}
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
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-black text-white mb-2">{listing.title}</h1>
                  <Badge className="bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]">
                    {listing.category}
                  </Badge>
                </div>
                <div className="text-left">
                  <p className="text-3xl font-black text-[hsl(40,90%,55%)]">{formatPrice(listing.price)}</p>
                  <p className="text-sm text-white/60 mt-1">{listing.views} مشاهدة</p>
                </div>
              </div>

              <p className="text-white/80 leading-relaxed mb-6">{listing.description}</p>

              {/* Seller Info */}
              {listing.user && (
                <Card className="p-4 bg-white/5 border-white/10 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[hsl(195,80%,50%,0.2)] flex items-center justify-center">
                      <Users className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                    </div>
                    <div>
                      <p className="text-white font-bold">{listing.user.name}</p>
                      <p className="text-sm text-white/60">البائع</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Action Buttons */}
            {!isOwner && listing.status === 'active' && (
              <>
                {isAuthenticated ? (
                  <Button 
                    onClick={handleBuy}
                    disabled={isCreatingOrder}
                    className="w-full py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingOrder ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        جاري المعالجة...
                      </>
                    ) : (
                      <>
                        شراء الآن
                        <ArrowRight className="mr-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    asChild
                    className="w-full py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold text-lg"
                  >
                    <Link to="/auth">
                      تسجيل الدخول للشراء
                      <ArrowRight className="mr-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
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

            {listing.status !== 'active' && (
              <Badge className="w-full justify-center py-2 bg-red-500/20 text-red-400 border-red-500/30">
                غير متاح
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetails;
