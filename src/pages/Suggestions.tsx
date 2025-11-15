import { useState, useMemo } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/StarRating";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { suggestionsApi, adminApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Turnstile } from "@/components/Turnstile";
import { formatLocalizedDate } from "@/utils/date";

interface Suggestion {
  id: number;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
  comments?: number;
  status: "pending" | "implemented";
  user?: { name: string };
  created_at?: string;
  user_vote?: "up" | "down" | null;
}

const Suggestions = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [turnstileToken, setTurnstileToken] = useState("");
  
  // Platform rating state
  const [platformRating, setPlatformRating] = useState(0);
  const [platformReview, setPlatformReview] = useState("");

  // Fetch suggestions from API
  const { data: suggestionsData } = useQuery({
    queryKey: ['suggestions', activeTab],
    queryFn: () => suggestionsApi.getAll({ status: activeTab }),
  });

  // Fetch platform stats from API
  const { data: platformStats } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: () => suggestionsApi.getPlatformStats(),
  });

  // Fetch user's platform review
  const { data: userReview } = useQuery({
    queryKey: ['user-platform-review'],
    queryFn: () => suggestionsApi.getUserPlatformReview(),
    enabled: !!user,
  });

  const suggestions = suggestionsData?.data || [];

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: ({ id, voteType }: { id: number; voteType: 'up' | 'down' }) =>
      suggestionsApi.vote(id, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
    onError: () => {
      toast.error(t('suggestions.voteError'));
    },
  });

  const handleVote = (id: number, voteType: "up" | "down") => {
    if (!user) {
      toast.error(t('suggestions.loginToVote'));
      return;
    }
    voteMutation.mutate({ id, voteType });
  };

  // Admin mutation to update suggestion status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'pending' | 'implemented' }) =>
      adminApi.updateSuggestion(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      toast.success(t('suggestions.statusUpdated'));
    },
    onError: () => {
      toast.error(t('suggestions.statusUpdateError'));
    },
  });

  const handleMarkAsImplemented = (id: number) => {
    updateStatusMutation.mutate({ id, status: 'implemented' });
  };

  // Create suggestion mutation
  const createSuggestionMutation = useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      suggestionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      setNewTitle("");
      setNewDescription("");
      toast.success(t('suggestions.createSuccess'));
    },
    onError: () => {
      toast.error(t('suggestions.createError'));
    },
  });

  const handleSubmit = () => {
    if (!user) {
      toast.error(t('suggestions.loginToSuggest'));
      return;
    }
    
    if (!turnstileToken) {
      toast.error(t('suggestions.securityVerification'));
      return;
    }
    
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error(t('suggestions.fillAllFields'));
      return;
    }

    createSuggestionMutation.mutate({
      title: newTitle,
      description: newDescription,
    });
    setTurnstileToken(""); // Reset after submission
  };

  // Submit platform review mutation
  const submitPlatformReviewMutation = useMutation({
    mutationFn: (data: { rating: number; review?: string }) =>
      suggestionsApi.submitPlatformReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-stats'] });
      queryClient.invalidateQueries({ queryKey: ['user-platform-review'] });
      setPlatformRating(0);
      setPlatformReview("");
      toast.success(t('suggestions.reviewSuccess'));
    },
    onError: () => {
      toast.error(t('suggestions.reviewError'));
    },
  });

  const handlePlatformReviewSubmit = () => {
    if (!user) {
      toast.error(t('suggestions.loginToReview'));
      return;
    }
    
    if (!turnstileToken) {
      toast.error(t('suggestions.securityVerification'));
      return;
    }
    
    if (platformRating === 0) {
      toast.error(t('suggestions.selectRating'));
      return;
    }
    if (platformReview.trim().length < 10) {
      toast.error(t('suggestions.minReviewLength'));
      return;
    }

    submitPlatformReviewMutation.mutate({
      rating: platformRating,
      review: platformReview,
    });
    setTurnstileToken(""); // Reset after submission
  };

  const getRatingPercentage = (count: number) => {
    if (!platformStats || platformStats.total_reviews === 0) return '0';
    return ((count / platformStats.total_reviews) * 100).toFixed(0);
  };

  // Memoize positive ratings percentage for performance
  const positiveRatingsPercentage = useMemo(() => {
    if (!platformStats || platformStats.total_reviews === 0) return '0';
    const positiveCount = platformStats.rating_distribution[5] + platformStats.rating_distribution[4];
    return getRatingPercentage(positiveCount);
  }, [platformStats]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: t('suggestions.status.pending'), className: "bg-[hsl(40,90%,55%,0.2)] text-[hsl(40,90%,55%)]" },
      implemented: { label: t('suggestions.status.implemented'), className: "bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)]" },
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <>
      <SEO 
        title={`${t('suggestions.title')} - NXOLand`}
        description={t('suggestions.subtitle')}
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />
        
        {/* Skip link for keyboard navigation */}
        <a 
          href="#suggestions-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          {t('common.skipToContent')}
        </a>
        
        {/* Navigation */}
        <Navbar />

        <div id="suggestions-content" className="relative z-10 container mx-auto px-4 py-8 max-w-5xl pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-[0_0_30px_rgba(148,209,240,0.5)]">
            {t('suggestions.title')}
          </h1>
          <p className="text-white/70">{t('suggestions.pageSubtitle')}</p>
        </div>

          {/* Platform Rating Section */}
          <Card className="mb-8 bg-gradient-to-br from-[hsl(40,90%,15%)] to-[hsl(40,80%,10%)] border-[hsl(40,90%,55%,0.3)] backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-6 h-6 text-[hsl(40,90%,55%)]" aria-hidden="true" />
                {t('suggestions.platformRating')}
              </CardTitle>
              <CardDescription className="text-white/70">
                {t('suggestions.platformRatingSubtitle')}
              </CardDescription>
            </CardHeader>
          <CardContent>
            {/* Platform Stats - Show only if we have reviews */}
            {platformStats && platformStats.total_reviews > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 bg-white/5 rounded-lg border border-white/10">
                <div className="text-center md:text-right">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <div className="text-5xl font-black text-[hsl(40,90%,55%)]">
                      {platformStats.average_rating.toFixed(1)}
                    </div>
                    <div>
                      <StarRating rating={platformStats.average_rating} readonly size="lg" />
                      <p className="text-white/60 text-sm mt-1">
                        {t('suggestions.totalReviewsCount', { count: numberFormatter.format(platformStats.total_reviews) })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" aria-hidden="true" />
                    <span className="text-green-400 font-bold">
                      {t('suggestions.positiveRatings', { percentage: positiveRatingsPercentage })}
                    </span>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-white text-sm font-bold">{rating}</span>
                        <Star className="h-3 w-3 text-[hsl(40,90%,55%)] fill-current" aria-hidden="true" />
                      </div>
                      <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[hsl(40,90%,55%)] h-full rounded-full transition-all"
                          style={{ 
                            width: `${getRatingPercentage(platformStats.rating_distribution[rating as keyof typeof platformStats.rating_distribution])}%` 
                          }}
                        />
                      </div>
                      <span className="text-white/60 text-xs w-12 text-left">
                        {platformStats.rating_distribution[rating as keyof typeof platformStats.rating_distribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Form */}
            <div className="space-y-4 p-6 bg-white/5 rounded-lg border border-white/10">
              <div>
                <label className="text-white text-sm font-bold mb-2 block">
                  {t('suggestions.yourRating')} *
                </label>
                <div className="flex items-center gap-3">
                  <StarRating 
                    rating={platformRating} 
                    onRatingChange={setPlatformRating} 
                    size="lg"
                    showValue
                  />
                  {platformRating > 0 && (
                    <span className="text-white/60 text-sm">
                      {platformRating === 5 && t('suggestions.ratingFeedback5')}
                      {platformRating === 4 && t('suggestions.ratingFeedback4')}
                      {platformRating === 3 && t('suggestions.ratingFeedback3')}
                      {platformRating === 2 && t('suggestions.ratingFeedback2')}
                      {platformRating === 1 && t('suggestions.ratingFeedback1')}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="platform-review-text" className="text-white text-sm font-bold mb-2 block">
                  {t('suggestions.feedbackFieldLabel')} <span className="text-white/60 font-normal">{t('suggestions.feedbackHint')}</span>
                </label>
                <Textarea
                  id="platform-review-text"
                  value={platformReview}
                  onChange={(e) => setPlatformReview(e.target.value)}
                  placeholder={t('suggestions.feedbackPlaceholder')}
                  className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  maxLength={500}
                  aria-label={t('suggestions.feedbackFieldLabel')}
                />
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>{t('suggestions.characterCount', { count: platformReview.length, max: 500 })}</span>
                  <span>
                    {platformReview.trim().length < 10
                      ? t('suggestions.charactersRemaining', { count: 10 - platformReview.trim().length })
                      : t('suggestions.ready')}
                  </span>
                </div>
              </div>

              <Turnstile 
                onVerify={setTurnstileToken}
                className="flex justify-center"
              />

              <Button
                onClick={handlePlatformReviewSubmit}
                disabled={platformRating === 0 || platformReview.trim().length < 10 || !turnstileToken}
                className="w-full bg-[hsl(40,90%,55%)] hover:bg-[hsl(40,90%,65%)] text-white font-bold shadow-[0_0_30px_rgba(234,179,8,0.4)] border-0 disabled:opacity-50"
              >
                <Star className="h-4 w-4 ml-2" aria-hidden="true" />
                {t('suggestions.submitRating')}
              </Button>
            </div>
          </CardContent>
        </Card>

          {/* Submit New Suggestion */}
          <Card className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[hsl(195,80%,70%,0.3)] transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="w-5 h-5 text-[hsl(195,80%,70%)]" aria-hidden="true" />
                {t('suggestions.newSuggestion')}
              </CardTitle>
              <CardDescription className="text-white/60">{t('suggestions.shareIdeas')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder={t('suggestions.suggestionPlaceholder')}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  aria-label={t('suggestions.suggestionPlaceholder')}
                />
              </div>
              <div>
                <Textarea
                  placeholder={t('suggestions.descriptionPlaceholder')}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  aria-label={t('suggestions.descriptionPlaceholder')}
                />
              </div>
            
            <Turnstile 
              onVerify={setTurnstileToken}
              className="flex justify-center"
            />

            <Button
              onClick={handleSubmit}
              className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0 disabled:opacity-50"
              disabled={!newTitle.trim() || !newDescription.trim() || !turnstileToken}
            >
              {t('suggestions.submitSuggestion')}
            </Button>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70"
            >
              {t('suggestions.all')} ({numberFormatter.format(suggestions.length)})
            </TabsTrigger>
            <TabsTrigger 
              value="implemented"
              className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70"
            >
              {t('suggestions.implemented')} ({numberFormatter.format(suggestions.filter((s) => s.status === "implemented").length)})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Suggestions List */}
        <div className="space-y-4">
          {suggestions.map((suggestion: Suggestion) => (
            <Card
              key={suggestion.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[hsl(195,80%,70%,0.5)] transition-all hover:bg-white/10"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-2 min-w-[60px]">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleVote(suggestion.id, "up")}
                        className={`hover:bg-[hsl(160,60%,45%,0.2)] ${
                          suggestion.user_vote === "up"
                            ? "bg-[hsl(160,60%,45%,0.2)] text-[hsl(160,60%,50%)]"
                            : "text-white/60"
                        }`}
                        aria-label={t('suggestions.voteUpAria')}
                      >
                        <ThumbsUp className="w-5 h-5" aria-hidden="true" />
                      </Button>
                      <div className="flex items-center gap-1 font-bold text-lg text-[hsl(195,80%,70%)]">
                        <TrendingUp className="w-4 h-4" aria-hidden="true" />
                        {suggestion.upvotes - suggestion.downvotes}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleVote(suggestion.id, "down")}
                        className={`hover:bg-[hsl(0,70%,55%,0.2)] ${
                          suggestion.user_vote === "down"
                            ? "bg-[hsl(0,70%,55%,0.2)] text-[hsl(0,70%,60%)]"
                            : "text-white/60"
                        }`}
                        aria-label={t('suggestions.voteDownAria')}
                      >
                        <ThumbsDown className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    </div>

                  {/* Content Section */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-bold text-white">{suggestion.title}</h3>
                      {getStatusBadge(suggestion.status)}
                    </div>
                    <p className="text-white/60 mb-4">{suggestion.description}</p>
                      <div className="flex items-center gap-4 text-sm text-white/50 flex-wrap">
                        <span>{suggestion.user?.name || t('suggestions.anonymousUser')}</span>
                        <span>•</span>
                        <span>{suggestion.created_at ? formatLocalizedDate(suggestion.created_at, language) : ''}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" aria-hidden="true" />
                          {t('suggestions.commentCount', { count: numberFormatter.format(suggestion.comments ?? 0) })}
                        </div>
                      </div>
                      {/* Admin Controls */}
                      {isAdmin && suggestion.status === 'pending' && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)] hover:bg-[hsl(195,80%,70%,0.1)]"
                            onClick={() => handleMarkAsImplemented(suggestion.id)}
                            disabled={updateStatusMutation.isPending}
                          >
                            {language === 'ar' ? 'تم التنفيذ' : 'Mark as Implemented'}
                          </Button>
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

          {suggestions.length === 0 && (
            <Card className="border-dashed border-white/20 bg-white/5">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-white/40" aria-hidden="true" />
                <p className="text-white/60">{t('suggestions.noSuggestionsInCategory')}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" aria-hidden="true" />
        
        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </>
  );
};

export default Suggestions;
