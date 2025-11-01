import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Star, Shield, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { listingsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PRICE_THRESHOLDS } from "@/config/constants";
import { useAuth } from "@/contexts/AuthContext";
import type { Listing } from "@/types/api";

const Marketplace = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");

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
    }).format(price);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
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
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="السعر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأسعار</SelectItem>
                  <SelectItem value="low">أقل من 500</SelectItem>
                  <SelectItem value="mid">500 - 1500</SelectItem>
                  <SelectItem value="high">أكثر من 1500</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="p-6">
                    {/* Image */}
                    <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-white/5">
                      {account.images && account.images.length > 0 ? (
                        <img 
                          src={account.images[0]} 
                          alt={`${account.title} - ${account.category}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/40" aria-label="لا توجد صورة">
                          <Shield className="h-12 w-12" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[hsl(195,80%,70%)] transition-colors">
                      {account.title}
                    </h3>

                    {/* Category */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-white/60">{account.category}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-[hsl(40,90%,55%)]">
                        {formatPrice(account.price)}
                      </span>
                      <div className="flex items-center gap-1 text-white/60">
                        <span className="text-sm">{account.views}</span>
                        <span className="text-xs">مشاهدة</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
