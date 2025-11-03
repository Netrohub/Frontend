import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Tag, Star, Shield, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { listingsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PRICE_THRESHOLDS } from "@/config/constants";
import { useAuth } from "@/contexts/AuthContext";
import type { Listing } from "@/types/api";

const Marketplace = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['listings', { search, category: category !== 'all' ? category : undefined }],
    queryFn: () => listingsApi.getAll({ search: search || undefined, category: category !== 'all' ? category : undefined }),
  });

  const listings: Listing[] = data?.data || [];
  
  // Memoize filtered listings to avoid recalculating on every render
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      if (priceFilter === "low" && listing.price >= PRICE_THRESHOLDS.LOW_MAX) return false;
      if (priceFilter === "mid" && (listing.price < PRICE_THRESHOLDS.MID_MIN || listing.price > PRICE_THRESHOLDS.MID_MAX)) return false;
      if (priceFilter === "high" && listing.price <= PRICE_THRESHOLDS.HIGH_MIN) return false;
      return true;
    });
  }, [listings, priceFilter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <>
      <SEO 
        title="سوق الحسابات - NXOLand"
        description="تصفح واشتر حسابات الألعاب بأمان. مئات الحسابات المتاحة للشراء مع نظام ضمان متكامل."
      />
      <div className="min-h-screen relative overflow-hidden" dir="rtl">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />

        {/* Skip link for keyboard navigation */}
        <a 
          href="#marketplace-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          تخطي إلى السوق
        </a>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div id="marketplace-content" className="relative z-10 container mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">سوق الحسابات</h1>
            <p className="text-white/60">تصفح واختر الحساب المثالي لك</p>
          </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input 
                placeholder="ابحث عن حساب..."
                className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[hsl(195,80%,70%,0.5)]"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="بحث في الحسابات المتاحة"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white" aria-label="تصفية حسب الفئة">
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  <SelectItem value="gaming">ألعاب</SelectItem>
                  <SelectItem value="social">اجتماعي</SelectItem>
                  <SelectItem value="trading">تداول</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white" aria-label="تصفية حسب السعر">
                  <SelectValue placeholder="السعر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأسعار</SelectItem>
                  <SelectItem value="low">أقل من 500 ر.س</SelectItem>
                  <SelectItem value="mid">500 - 1500 ر.س</SelectItem>
                  <SelectItem value="high">أكثر من 1500 ر.س</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Results Count */}
          {!isLoading && !error && listings.length > 0 && (
            <p className="text-white/60 mb-4 text-sm">
              عرض {filteredListings.length} من أصل {listings.length} حساب
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">حدث خطأ في تحميل البيانات</p>
            <Button onClick={() => refetch()} variant="outline">إعادة المحاولة</Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredListings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg mb-4">لا توجد حسابات متاحة حالياً</p>
            {isAuthenticated ? (
              <Link to="/sell">
                <Button className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]">
                  بيع حسابك الآن
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]">
                  سجل الآن لتبدأ البيع
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Listings Grid */}
        {!isLoading && !error && filteredListings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((account) => (
              <Link key={account.id} to={`/product/${account.id}`}>
                <Card className="overflow-hidden bg-white/5 border-white/10 hover:border-[hsl(195,80%,70%,0.5)] transition-all hover:-translate-y-1 group backdrop-blur-sm">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] overflow-hidden">
                    {account.images && account.images.length > 0 ? (
                      <img 
                        src={account.images[0]} 
                        alt={`${account.title} - ${account.category}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className="h-20 w-20 text-white/20" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-[hsl(195,80%,70%)] transition-colors">
                      {account.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Tag className="h-4 w-4" />
                      <span>{account.category}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-2xl font-black text-[hsl(195,80%,70%)]">{formatPrice(account.price)}</span>
                      <Button size="sm" className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
        </div>
        
        {/* Bottom Navigation for Mobile */}
        <BottomNav />
      </div>
    </>
  );
};

export default Marketplace;
