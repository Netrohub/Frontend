import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, Filter, Tag, Star, Shield, Loader2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { listingsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PRICE_THRESHOLDS } from "@/config/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Listing } from "@/types/api";
import { formatCurrency } from "@/utils/currency";

const extractDetailValue = (description: string | undefined, key: string): string | undefined => {
  if (!description) return undefined;
  const lines = description.split('\n');
  for (const line of lines) {
    const [detailKey, rawValue] = line.split(':');
    if (!detailKey || !rawValue) continue;
    if (detailKey.trim() === key) {
      const value = rawValue.trim();
      return value.length > 0 ? value : undefined;
    }
  }
  return undefined;
};

const Marketplace = () => {
  const { user } = useAuth();
  const { t, tAr, language } = useLanguage();
  const isAuthenticated = !!user;
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<string>("none"); // "none" | "high-to-low" | "low-to-high"

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
    staleTime: 2 * 60 * 1000, // 2 minutes - matches backend cache time
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes for real-time updates
    refetchOnWindowFocus: true, // Refresh when user returns to tab
  });

  const listings: Listing[] = data?.data || [];
  
  // Memoize filtered and sorted listings to avoid recalculating on every render
  const filteredListings = useMemo(() => {
    let filtered = listings.filter((listing) => {
      if (priceFilter === "low" && listing.price >= PRICE_THRESHOLDS.LOW_MAX) return false;
      if (priceFilter === "mid" && (listing.price < PRICE_THRESHOLDS.MID_MIN || listing.price > PRICE_THRESHOLDS.MID_MAX)) return false;
      if (priceFilter === "high" && listing.price <= PRICE_THRESHOLDS.HIGH_MIN) return false;
      return true;
    });

    // Apply price sorting
    if (priceSort === "high-to-low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (priceSort === "low-to-high") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    }

    return filtered;
  }, [listings, priceFilter, priceSort]);

  return (
    <>
      <SEO 
        title={`${tAr('marketplace.title')} - NXOLand`}
        description={tAr('marketplace.description')}
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />

        {/* Skip link for keyboard navigation */}
        <a 
          href="#marketplace-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          {t('marketplace.skipToMarket')}
        </a>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div id="marketplace-content" className="relative z-10 container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{t('marketplace.title')}</h1>
            <p className="text-white/60">{t('marketplace.subtitle')}</p>
          </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input 
                type="search"
                inputMode="search"
                autoComplete="off"
                placeholder={t('marketplace.searchPlaceholder')}
                className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[hsl(195,80%,70%,0.5)]"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label={t('marketplace.searchAriaLabel')}
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white" aria-label={t('marketplace.categoryFilter')}>
                  <SelectValue placeholder={t('marketplace.category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('marketplace.allCategories')}</SelectItem>
                  <SelectItem value="gaming">{t('marketplace.gaming')}</SelectItem>
                  <SelectItem value="social">{t('marketplace.social')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white" aria-label={t('marketplace.priceFilter')}>
                  <SelectValue placeholder={t('marketplace.price')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('marketplace.allPrices')}</SelectItem>
                  <SelectItem value="low">{t('marketplace.lowPrice')}</SelectItem>
                  <SelectItem value="mid">{t('marketplace.midPrice')}</SelectItem>
                  <SelectItem value="high">{t('marketplace.highPrice')}</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                size="icon" 
                className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] border-0"
                aria-label={t('marketplace.moreFilters')}
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Price Sort Filter */}
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <Label className="text-white font-semibold text-base mb-3 block">
              {t('marketplace.sortByPrice')}
            </Label>
            <RadioGroup value={priceSort} onValueChange={setPriceSort} className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <RadioGroupItem value="high-to-low" id="high-to-low" className="border-white/30" />
                <Label 
                  htmlFor="high-to-low" 
                  className="text-white cursor-pointer text-sm font-normal"
                >
                  {t('marketplace.highToLow')}
                </Label>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <RadioGroupItem value="low-to-high" id="low-to-high" className="border-white/30" />
                <Label 
                  htmlFor="low-to-high" 
                  className="text-white cursor-pointer text-sm font-normal"
                >
                  {t('marketplace.lowToHigh')}
                </Label>
              </div>
            </RadioGroup>
          </Card>
          
          {/* Results Count */}
          {!isLoading && !error && listings.length > 0 && (
            <p className="text-white/60 mb-4 text-sm mt-4">
              {t('marketplace.showing')} {filteredListings.length} {t('marketplace.outOf')} {listings.length} {t('marketplace.accounts')}
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
            <p className="text-red-400 mb-4">{t('common.errorLoading')}</p>
            <Button onClick={() => refetch()} variant="outline">{t('common.retry')}</Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredListings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg mb-4">{t('marketplace.noListings')}</p>
            {isAuthenticated ? (
              <Link to="/sell/gaming">
                <Button className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]">
                  {t('marketplace.sellNow')}
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]">
                  {t('marketplace.registerToSell')}
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Listings Grid */}
        {!isLoading && !error && filteredListings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((account) => {
              const isSold = account.status === 'sold';
              const CardContent = (
                <Card className={`overflow-hidden bg-white/5 border-white/10 backdrop-blur-sm p-4 md:p-6 ${
                  isSold 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:border-[hsl(195,80%,70%,0.5)] transition-all hover:-translate-y-1 group'
                }`}>
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] overflow-hidden">
                    {account.images && account.images.length > 0 ? (
                      <img 
                        src={account.images[0]}
                        alt={`${account.title} - ${account.category}`}
                        loading="lazy"
                        decoding="async"
                        className={`w-full h-full object-cover ${isSold ? 'grayscale' : ''}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className="h-20 w-20 text-white/20" />
                      </div>
                    )}
                    {/* SOLD Badge */}
                    {isSold && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1">
                          {t('product.sold')}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className={`text-xl font-bold ${
                      isSold ? 'text-white/50' : 'text-white group-hover:text-[hsl(195,80%,70%)] transition-colors'
                    }`}>
                      {account.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {t('product.server')}:{" "}
                        {(
                          account.account_metadata &&
                          typeof account.account_metadata === 'object' &&
                          (account.account_metadata as Record<string, unknown>)?.server &&
                          String((account.account_metadata as Record<string, unknown>).server).trim()
                        ) ||
                          extractDetailValue(account.description, 'السيرفر') ||
                          t('common.notSpecified')}
                      </span>
                    </div>

                    {account.user?.average_rating > 0 && (
                      <div className="flex items-center gap-1 text-[hsl(40,90%,55%)]">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{account.user.average_rating.toFixed(1)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className={`text-2xl font-black ${
                        isSold ? 'text-white/50' : 'text-[hsl(195,80%,70%)]'
                      }`}>
                        {formatCurrency(account.price)}
                      </span>
                      <Button 
                        size="sm" 
                        disabled={isSold}
                        className={`${
                          isSold 
                            ? 'bg-white/10 text-white/50 cursor-not-allowed border-0' 
                            : 'bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0'
                        }`}
                      >
                        {isSold ? t('product.sold') : t('marketplace.viewDetails')}
                      </Button>
                    </div>
                  </div>
                </Card>
              );

              // Only make clickable if not sold
              if (isSold) {
                return (
                  <div key={account.id} className="relative">
                    {CardContent}
                  </div>
                );
              }

              return (
                <Link key={account.id} to={`/product/${account.id}`}>
                  {CardContent}
                </Link>
              );
            })}
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
