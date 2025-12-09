import { Search, Eye, Trash2, Flag, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/StarRating";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { formatLocalizedDate } from "@/utils/date";

export default function AdminReviews() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<string>("");

  const { data: reviewsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-reviews', searchQuery, statusFilter, ratingFilter],
    queryFn: () => adminApi.reviews({
      search: searchQuery || undefined,
      status: statusFilter || undefined,
      rating: ratingFilter || undefined,
    }),
  });

  const reviews = reviewsData?.data || [];
  const hasMore = reviewsData?.current_page < reviewsData?.last_page;

  const getStatusColor = (reportsCount: number) => {
    if (reportsCount > 0) return "bg-red-500/20 text-red-400";
    return "bg-green-500/20 text-green-400";
  };

  const getStatusLabel = (reportsCount: number) => {
    if (reportsCount > 0) return t('admin.reviews.status.flagged');
    return t('admin.reviews.status.approved');
  };

  const handleSearch = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          {t('admin.reviews.title')}
        </h1>
        <p className="text-white/60">
          {t('admin.reviews.subtitle')}
        </p>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
          <Input
            placeholder={t('admin.reviews.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pr-10 bg-[hsl(200,70%,15%)] border-white/10 text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[hsl(200,70%,15%)] border border-white/10 text-white rounded-md"
        >
          <option value="">{t('admin.reviews.filters.allStatus')}</option>
          <option value="approved">{t('admin.reviews.filters.approved')}</option>
          <option value="flagged">{t('admin.reviews.filters.flagged')}</option>
        </select>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2 bg-[hsl(200,70%,15%)] border border-white/10 text-white rounded-md"
        >
          <option value="">{t('admin.reviews.filters.allRatings')}</option>
          <option value="5">5 {t('admin.reviews.filters.stars')}</option>
          <option value="4">4 {t('admin.reviews.filters.stars')}</option>
          <option value="3">3 {t('admin.reviews.filters.stars')}</option>
          <option value="2">2 {t('admin.reviews.filters.stars')}</option>
          <option value="1">1 {t('admin.reviews.filters.stars')}</option>
        </select>
        <Button 
          onClick={handleSearch}
          className="bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(200,90%,40%)]"
        >
          <Search className="h-4 w-4 mr-2" />
          {t('admin.reviews.actions.search')}
        </Button>
      </div>

      {reviews.length === 0 ? (
        <Card className="p-12 bg-[hsl(200,70%,12%)] border-white/10 text-center">
          <p className="text-white/60">
            {t('admin.reviews.labels.noReviews')}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review: any) => {
            const reportsCount = review.reports_count || 0;
            const status = reportsCount > 0 ? 'flagged' : 'approved';
            
            return (
              <Card key={review.id} className="p-6 bg-[hsl(200,70%,12%)] border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">
                        {review.reviewer?.name || t('admin.reviews.labels.anonymous')}
                      </h3>
                      <StarRating rating={review.rating} readonly />
                      <Badge className={getStatusColor(reportsCount)}>
                        {getStatusLabel(reportsCount)}
                      </Badge>
                      {reportsCount > 0 && (
                        <Badge className="bg-red-500/20 text-red-400">
                          <Flag className="h-3 w-3 mr-1" />
                          {reportsCount} {t('admin.reviews.labels.reports')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-white/60 mb-1">
                      {review.reviewer?.email || ''}
                    </p>
                    <p className="text-sm text-white/80 mb-2">
                      {t('admin.reviews.labels.reviewFor')} <span className="font-medium">{review.seller?.name || ''}</span>
                    </p>
                  </div>
                  <span className="text-sm text-white/40">
                    {review.created_at ? formatLocalizedDate(review.created_at, language) : ''}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-white/80 mb-2">{review.comment}</p>
                  {review.order?.listing && (
                    <p className="text-sm text-white/60">
                      {t('admin.reviews.labels.product')} <span className="font-medium">{review.order.listing.title}</span>
                    </p>
                  )}
                  {review.helpful_voters_count > 0 && (
                    <p className="text-sm text-white/60 mt-1">
                      {t('admin.reviews.labels.helpful')} {review.helpful_voters_count} {t('admin.reviews.users')}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {status === "flagged" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-400 border-green-500/30"
                        onClick={() => {
                          // TODO: Implement approve flagged review (remove reports)
                          toast.info(t('admin.reviews.comingSoon.removeReports'));
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {t('admin.reviews.actions.approve')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-500/30"
                        onClick={() => {
                          // TODO: Implement delete review
                          toast.info(t('admin.reviews.comingSoon.deleteReview'));
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t('admin.reviews.actions.delete')}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-auto"
                    onClick={() => {
                      // TODO: Implement view details
                      toast.info(t('admin.reviews.comingSoon.viewDetails'));
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {t('admin.reviews.actions.viewDetails')}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => {
              // TODO: Implement pagination
              toast.info(t('admin.reviews.comingSoon.pagination'));
            }}
          >
            {t('admin.reviews.actions.loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
}
