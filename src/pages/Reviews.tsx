import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewCard } from "@/components/ReviewCard";
import { StarRating } from "@/components/StarRating";
import { ErrorState } from "@/components/ErrorState";
import { ReviewForm } from "@/components/ReviewForm";
import { 
  Star, 
  TrendingUp, 
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Reviews = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Report Dialog State
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDetails, setReportDetails] = useState("");
  
  // Edit Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  
  // Delete Confirmation State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

  // Get reviews from API
  const { data: reviewsData, isLoading, error, refetch } = useQuery({
    queryKey: ['reviews', userId, activeFilter, sortBy, currentPage],
    queryFn: () => reviewsApi.getBySeller(parseInt(userId!), {
      rating: activeFilter !== 'all' ? activeFilter : undefined,
      sort: sortBy,
      page: currentPage,
    }),
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  });

  // Get review stats from API
  const { data: stats } = useQuery({
    queryKey: ['review-stats', userId],
    queryFn: () => reviewsApi.getSellerStats(parseInt(userId!)),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mark helpful mutation
  const markHelpfulMutation = useMutation({
    mutationFn: (reviewId: number) => reviewsApi.markHelpful(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', userId] });
    },
    onError: () => {
      toast.error(t('reviews.updateError'));
    },
  });

  // Report review mutation
  const reportMutation = useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: number; reason: string }) => 
      reviewsApi.report(reviewId, reason),
    onSuccess: () => {
      toast.success(t('reviews.reportSuccess'));
      setReportDialogOpen(false);
      setReportReason("");
      setReportDetails("");
    },
    onError: (error: any) => {
      if (error.data?.error_code === 'ALREADY_REPORTED') {
        toast.error(t('reviews.reportAlreadyReported'));
      } else {
        toast.error(error.message || t('reviews.reportError'));
      }
    },
  });

  // Edit review mutation
  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      reviewsApi.update(id, data),
    onSuccess: () => {
      toast.success(t('reviews.updateSuccess'));
      setEditDialogOpen(false);
      setEditingReview(null);
      queryClient.invalidateQueries({ queryKey: ['reviews', userId] });
    },
    onError: () => {
      toast.error(t('reviews.updateError'));
    },
  });

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => reviewsApi.delete(reviewId),
    onSuccess: () => {
      toast.success(t('reviews.deleteSuccess'));
      setDeleteDialogOpen(false);
      setDeletingReviewId(null);
      queryClient.invalidateQueries({ queryKey: ['reviews', userId] });
    },
    onError: () => {
      toast.error("فشل حذف التقييم");
    },
  });

  const reviews = reviewsData?.data || [];

  const getRatingPercentage = (count: number) => {
    if (!stats?.total_reviews || stats.total_reviews === 0) return '0';
    return ((count / stats.total_reviews) * 100).toFixed(0);
  };

  const positivePercentage = stats ? (
    ((stats.rating_distribution[5] + stats.rating_distribution[4]) / stats.total_reviews) * 100
  ).toFixed(0) : '0';

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-6xl pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            {t('reviews.title')}
          </h1>
          <p className="text-white/60">{t('reviews.subtitle')}</p>
        </div>

        {/* Rating Overview */}
        {stats && (
          <Card className="p-6 md:p-8 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Overall Rating */}
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <div className="text-6xl font-black text-white">
                    {stats.average_rating.toFixed(1)}
                  </div>
                  <div>
                    <StarRating rating={stats.average_rating} readonly size="lg" />
                    <p className="text-white/60 text-sm mt-1">
                      {t('reviews.basedOn').replace('{count}', stats.total_reviews.toString())}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-bold">{positivePercentage}% {t('reviews.positiveReviews')}</span>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-white font-bold">{rating}</span>
                      <Star className="h-4 w-4 text-[hsl(40,90%,55%)] fill-current" />
                    </div>
                    <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[hsl(40,90%,55%)] h-full rounded-full transition-all"
                        style={{ width: `${getRatingPercentage(stats.rating_distribution[rating])}%` }}
                      />
                    </div>
                    <span className="text-white/60 text-sm w-12 text-left">
                      {stats.rating_distribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-white/5 border border-white/10">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70 text-sm"
              >
                {t('reviews.all')}
              </TabsTrigger>
              {[5, 4, 3, 2, 1].map((rating) => (
                <TabsTrigger 
                  key={rating}
                  value={rating.toString()}
                  className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70 text-sm"
                >
                  {rating} <Star className="h-3 w-3 inline mr-1" />
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20 min-h-[48px] w-full md:w-auto"
              >
                <Filter className="h-4 w-4" />
                {sortBy === "recent" && t('reviews.sortRecent')}
                {sortBy === "helpful" && t('reviews.sortHelpful')}
                {sortBy === "rating-high" && t('reviews.sortRatingHigh')}
                {sortBy === "rating-low" && t('reviews.sortRatingLow')}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[hsl(200,70%,20%)] border-white/10 min-w-[200px]">
              <DropdownMenuItem 
                onClick={() => setSortBy("recent")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                {t('reviews.sortRecent')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("helpful")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                {t('reviews.sortHelpful')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("rating-high")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                {t('reviews.sortRatingHighFirst')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("rating-low")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                {t('reviews.sortRatingLowFirst')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6 bg-white/5 border-white/10">
                <div className="flex items-start gap-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 bg-white/10" />
                    <Skeleton className="h-3 w-24 bg-white/10" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full bg-white/10 mb-4" />
                <Skeleton className="h-8 w-40 bg-white/10" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <ErrorState 
            message={t('reviews.loadError')} 
            onRetry={() => refetch()}
          />
        ) : reviews.length > 0 ? (
          <>
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwnReview={currentUser?.id === review.reviewer_id}
                  onHelpful={(id) => markHelpfulMutation.mutate(parseInt(id))}
                  onReport={(id) => {
                    setReportingReviewId(parseInt(id));
                    setReportDialogOpen(true);
                  }}
                  onEdit={(id) => {
                    const reviewToEdit = reviews.find((r: any) => r.id.toString() === id);
                    if (reviewToEdit) {
                      setEditingReview(reviewToEdit);
                      setEditDialogOpen(true);
                    }
                  }}
                  onDelete={(id) => {
                    setDeletingReviewId(parseInt(id));
                    setDeleteDialogOpen(true);
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            {reviewsData && reviewsData.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="bg-white/5 text-white border-white/20 hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                  {t('reviews.previous')}
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, reviewsData.last_page) }, (_, i) => {
                    let page;
                    if (reviewsData.last_page <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= reviewsData.last_page - 2) {
                      page = reviewsData.last_page - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={page}
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        disabled={isLoading}
                        className={`min-w-[40px] ${
                          currentPage === page
                            ? 'bg-[hsl(195,80%,50%)] text-white border-[hsl(195,80%,50%)]'
                            : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(reviewsData.last_page, p + 1))}
                  disabled={currentPage === reviewsData.last_page || isLoading}
                  className="bg-white/5 text-white border-white/20 hover:bg-white/10"
                >
                  {t('reviews.next')}
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="p-12 bg-white/5 border-white/10 border-dashed text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-white/30" />
            <p className="text-white/60">{t('reviews.noReviewsInCategory')}</p>
          </Card>
        )}
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white text-right">{t('reviews.reportTitle')}</DialogTitle>
            <DialogDescription className="text-white/80 text-right">
              {t('reviews.reportDescription')}
            </DialogDescription>
          </DialogHeader>

          <RadioGroup value={reportReason} onValueChange={setReportReason}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="spam" id="spam" />
                <Label htmlFor="spam" className="text-white cursor-pointer">
                  {t('reviews.reportSpam')}
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="offensive" id="offensive" />
                <Label htmlFor="offensive" className="text-white cursor-pointer">
                  {t('reviews.reportOffensive')}
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="fake" id="fake" />
                <Label htmlFor="fake" className="text-white cursor-pointer">
                  {t('reviews.reportFake')}
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="irrelevant" id="irrelevant" />
                <Label htmlFor="irrelevant" className="text-white cursor-pointer">
                  {t('reviews.reportIrrelevant')}
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="text-white cursor-pointer">
                  {t('reviews.reportOther')}
                </Label>
              </div>
            </div>
          </RadioGroup>

          {reportReason === 'other' && (
            <Textarea
              placeholder={t('reviews.reportOtherPlaceholder')}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none"
              maxLength={500}
              rows={4}
            />
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setReportDialogOpen(false);
                setReportReason("");
                setReportDetails("");
              }}
              disabled={reportMutation.isPending}
              className="bg-white/5 text-white border-white/20 hover:bg-white/10"
            >
              إلغاء
            </Button>
            <Button
              onClick={() => {
                if (!reportReason) {
                  toast.error(t('reviews.reportSelectReason'));
                  return;
                }
                if (reportReason === 'other' && reportDetails.trim().length < 10) {
                  toast.error(t('reviews.reportClarifyReason'));
                  return;
                }
                if (reportingReviewId) {
                  reportMutation.mutate({
                    reviewId: reportingReviewId,
                    reason: reportReason === 'other' ? reportDetails : reportReason,
                  });
                }
              }}
              disabled={!reportReason || reportMutation.isPending || (reportReason === 'other' && reportDetails.trim().length < 10)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {reportMutation.isPending ? t('reviews.reportSending') : t('reviews.reportSubmit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-right">{t('reviews.editTitle')}</DialogTitle>
            <DialogDescription className="text-white/80 text-right">
              {t('reviews.editDescription')}
            </DialogDescription>
          </DialogHeader>
          {editingReview && (
            <ReviewForm
              existingReview={{
                id: editingReview.id.toString(),
                rating: editingReview.rating,
                comment: editingReview.comment,
              }}
              onSubmit={async (data) => {
                editMutation.mutate({
                  id: editingReview.id,
                  data,
                });
              }}
              onCancel={() => {
                setEditDialogOpen(false);
                setEditingReview(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[hsl(200,70%,15%)] border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-right">
              {t('reviews.deleteTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/80 text-right">
              {t('reviews.deleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              disabled={deleteMutation.isPending}
            >
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingReviewId) {
                  deleteMutation.mutate(deletingReviewId);
                }
              }}
              disabled={deleteMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteMutation.isPending ? t('reviews.deleting') : t('reviews.deleteConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Reviews;

