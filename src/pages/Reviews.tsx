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
import { 
  Star, 
  TrendingUp, 
  Filter,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Reviews = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Get reviews from API
  const { data: reviewsData, isLoading, error, refetch } = useQuery({
    queryKey: ['reviews', userId, activeFilter, sortBy],
    queryFn: () => reviewsApi.getBySeller(parseInt(userId!), {
      rating: activeFilter !== 'all' ? activeFilter : undefined,
      sort: sortBy,
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
      toast.error("فشل تحديث التقييم");
    },
  });

  // Report review mutation
  const reportMutation = useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: number; reason: string }) => 
      reviewsApi.report(reviewId, reason),
    onSuccess: () => {
      toast.success("تم الإبلاغ عن التقييم بنجاح");
    },
    onError: () => {
      toast.error("فشل الإبلاغ عن التقييم");
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
            التقييمات والمراجعات
          </h1>
          <p className="text-white/60">آراء المشترين السابقين</p>
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
                      بناءً على {stats.total_reviews} تقييم
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-bold">{positivePercentage}% تقييمات إيجابية</span>
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
                الكل
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
                {sortBy === "recent" && "الأحدث"}
                {sortBy === "helpful" && "الأكثر فائدة"}
                {sortBy === "rating-high" && "التقييم: الأعلى"}
                {sortBy === "rating-low" && "التقييم: الأدنى"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[hsl(200,70%,20%)] border-white/10 min-w-[200px]">
              <DropdownMenuItem 
                onClick={() => setSortBy("recent")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                الأحدث
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("helpful")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                الأكثر فائدة
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("rating-high")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                التقييم: الأعلى أولاً
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("rating-low")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                التقييم: الأدنى أولاً
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
            message="فشل تحميل التقييمات" 
            onRetry={() => refetch()}
          />
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <ReviewCard
                key={review.id}
                review={review}
                isOwnReview={currentUser?.id === review.reviewer_id}
                onHelpful={(id) => markHelpfulMutation.mutate(parseInt(id))}
                onReport={(id) => {
                  const reason = prompt("ما هو سبب الإبلاغ عن هذا التقييم؟");
                  if (reason && reason.trim()) {
                    reportMutation.mutate({ reviewId: parseInt(id), reason: reason.trim() });
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 bg-white/5 border-white/10 border-dashed text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-white/30" />
            <p className="text-white/60">لا توجد تقييمات في هذه الفئة</p>
          </Card>
        )}
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Reviews;

