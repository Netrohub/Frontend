import { useState } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";

interface Suggestion {
  id: number;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  status: "pending" | "approved" | "implemented";
  author: string;
  date: string;
  userVote: "up" | "down" | null;
}

const mockSuggestions: Suggestion[] = [
  {
    id: 1,
    title: "إضافة وضع الليل التلقائي",
    description: "سيكون من الرائع لو كان هناك وضع ليلي يتحول تلقائياً حسب وقت اليوم",
    upvotes: 45,
    downvotes: 3,
    comments: 12,
    status: "pending",
    author: "أحمد محمد",
    date: "2024-01-15",
    userVote: null,
  },
  {
    id: 2,
    title: "تحسين سرعة البحث",
    description: "البحث في المنتجات يأخذ وقت طويل، يحتاج تحسين في الأداء",
    upvotes: 32,
    downvotes: 1,
    comments: 8,
    status: "approved",
    author: "فاطمة علي",
    date: "2024-01-14",
    userVote: "up",
  },
  {
    id: 3,
    title: "إضافة خاصية المقارنة بين المنتجات",
    description: "أود أن أتمكن من مقارنة منتجين أو أكثر جنباً إلى جنب",
    upvotes: 67,
    downvotes: 5,
    comments: 23,
    status: "implemented",
    author: "محمد خالد",
    date: "2024-01-10",
    userVote: null,
  },
];

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Platform rating state
  const [platformRating, setPlatformRating] = useState(0);
  const [platformReview, setPlatformReview] = useState("");

  // TODO: Get platform review stats from API when backend is ready
  // For now, showing defaults until backend endpoint exists
  const platformStats = {
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  };

  const handleVote = (id: number, voteType: "up" | "down") => {
    setSuggestions((prev) =>
      prev.map((suggestion) => {
        if (suggestion.id === id) {
          const wasUpvoted = suggestion.userVote === "up";
          const wasDownvoted = suggestion.userVote === "down";
          
          let newUpvotes = suggestion.upvotes;
          let newDownvotes = suggestion.downvotes;
          let newUserVote: "up" | "down" | null = voteType;

          if (voteType === "up") {
            if (wasUpvoted) {
              newUpvotes -= 1;
              newUserVote = null;
            } else {
              newUpvotes += 1;
              if (wasDownvoted) newDownvotes -= 1;
            }
          } else {
            if (wasDownvoted) {
              newDownvotes -= 1;
              newUserVote = null;
            } else {
              newDownvotes += 1;
              if (wasUpvoted) newUpvotes -= 1;
            }
          }

          return {
            ...suggestion,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote,
          };
        }
        return suggestion;
      })
    );
  };

  const handleSubmit = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    const newSuggestion: Suggestion = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      status: "pending",
      author: "أنت",
      date: new Date().toISOString().split("T")[0],
      userVote: null,
    };

    setSuggestions([newSuggestion, ...suggestions]);
    setNewTitle("");
    setNewDescription("");
    toast.success("تم إرسال اقتراحك بنجاح");
  };

  const handlePlatformReviewSubmit = () => {
    if (platformRating === 0) {
      toast.error("الرجاء اختيار تقييم");
      return;
    }
    if (platformReview.trim().length < 10) {
      toast.error("الرجاء كتابة تعليق لا يقل عن 10 أحرف");
      return;
    }

    // TODO: Backend integration when platform reviews endpoint is ready
    // await platformReviewsApi.create({ rating: platformRating, review: platformReview });
    
    toast.success("شكراً لك! تم إرسال تقييمك بنجاح");
    setPlatformRating(0);
    setPlatformReview("");
  };

  const getRatingPercentage = (count: number) => {
    if (platformStats.total_reviews === 0) return '0';
    return ((count / platformStats.total_reviews) * 100).toFixed(0);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "قيد المراجعة", className: "bg-[hsl(40,90%,55%,0.2)] text-[hsl(40,90%,55%)]" },
      approved: { label: "تمت الموافقة", className: "bg-green-500/20 text-green-400" },
      implemented: { label: "تم التنفيذ", className: "bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)]" },
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const filterSuggestions = () => {
    if (activeTab === "all") return suggestions;
    return suggestions.filter((s) => s.status === activeTab);
  };

  const sortedSuggestions = [...filterSuggestions()].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Navigation */}
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-[0_0_30px_rgba(148,209,240,0.5)]">
            مركز الاقتراحات والتقييمات
          </h1>
          <p className="text-white/70">شارك أفكارك وقيّم تجربتك على المنصة</p>
        </div>

        {/* Platform Rating Section */}
        <Card className="mb-8 bg-gradient-to-br from-[hsl(40,90%,15%)] to-[hsl(40,80%,10%)] border-[hsl(40,90%,55%,0.3)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-6 h-6 text-[hsl(40,90%,55%)]" />
              قيّم تجربتك على المنصة
            </CardTitle>
            <CardDescription className="text-white/70">
              رأيك يهمنا - ساعدنا في تحسين تجربة المستخدمين
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Platform Stats - Show only if we have reviews */}
            {platformStats.total_reviews > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 bg-white/5 rounded-lg border border-white/10">
                <div className="text-center md:text-right">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <div className="text-5xl font-black text-[hsl(40,90%,55%)]">
                      {platformStats.average_rating.toFixed(1)}
                    </div>
                    <div>
                      <StarRating rating={platformStats.average_rating} readonly size="lg" />
                      <p className="text-white/60 text-sm mt-1">
                        {platformStats.total_reviews.toLocaleString('en-US')} تقييم
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-bold">
                      {getRatingPercentage(platformStats.rating_distribution[5] + platformStats.rating_distribution[4])}% تقييمات إيجابية
                    </span>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-white text-sm font-bold">{rating}</span>
                        <Star className="h-3 w-3 text-[hsl(40,90%,55%)] fill-current" />
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
                <label className="text-white text-sm font-bold mb-2 block">تقييمك للمنصة *</label>
                <div className="flex items-center gap-3">
                  <StarRating 
                    rating={platformRating} 
                    onRatingChange={setPlatformRating} 
                    size="lg"
                    showValue
                  />
                  {platformRating > 0 && (
                    <span className="text-white/60 text-sm">
                      {platformRating === 5 && "ممتاز! 🎉"}
                      {platformRating === 4 && "جيد جداً 👍"}
                      {platformRating === 3 && "جيد ✓"}
                      {platformRating === 2 && "يحتاج تحسين"}
                      {platformRating === 1 && "ضعيف"}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-bold mb-2 block">
                  أخبرنا عن تجربتك <span className="text-white/60 font-normal">(10 أحرف على الأقل)</span>
                </label>
                <Textarea
                  value={platformReview}
                  onChange={(e) => setPlatformReview(e.target.value)}
                  placeholder="ما هي الميزات التي أعجبتك؟ وما الذي يمكننا تحسينه؟"
                  className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  maxLength={500}
                />
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>{platformReview.length} / 500 حرف</span>
                  <span>{platformReview.trim().length < 10 ? `${10 - platformReview.trim().length} حرف متبقي` : "✓"}</span>
                </div>
              </div>

              <Button
                onClick={handlePlatformReviewSubmit}
                disabled={platformRating === 0 || platformReview.trim().length < 10}
                className="w-full bg-[hsl(40,90%,55%)] hover:bg-[hsl(40,90%,65%)] text-white font-bold shadow-[0_0_30px_rgba(234,179,8,0.4)] border-0"
              >
                <Star className="h-4 w-4 ml-2" />
                إرسال التقييم
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit New Suggestion */}
        <Card className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[hsl(195,80%,70%,0.3)] transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquare className="w-5 h-5 text-[hsl(195,80%,70%)]" />
              اقتراح لتطوير المنصة
            </CardTitle>
            <CardDescription className="text-white/60">شاركنا أفكارك لإضافة ميزات جديدة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="عنوان الاقتراح"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <Textarea
                placeholder="وصف الاقتراح بالتفصيل..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0"
              disabled={!newTitle.trim() || !newDescription.trim()}
            >
              إرسال الاقتراح
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
              الكل ({suggestions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="implemented"
              className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70"
            >
              منفذة ({suggestions.filter((s) => s.status === "implemented").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Suggestions List */}
        <div className="space-y-4">
          {sortedSuggestions.map((suggestion) => (
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
                        suggestion.userVote === "up"
                          ? "bg-[hsl(160,60%,45%,0.2)] text-[hsl(160,60%,50%)]"
                          : "text-white/60"
                      }`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-1 font-bold text-lg text-[hsl(195,80%,70%)]">
                      <TrendingUp className="w-4 h-4" />
                      {suggestion.upvotes - suggestion.downvotes}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleVote(suggestion.id, "down")}
                      className={`hover:bg-[hsl(0,70%,55%,0.2)] ${
                        suggestion.userVote === "down"
                          ? "bg-[hsl(0,70%,55%,0.2)] text-[hsl(0,70%,60%)]"
                          : "text-white/60"
                      }`}
                    >
                      <ThumbsDown className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-bold text-white">{suggestion.title}</h3>
                      {getStatusBadge(suggestion.status)}
                    </div>
                    <p className="text-white/60 mb-4">{suggestion.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <span>{suggestion.author}</span>
                      <span>•</span>
                      <span>{suggestion.date}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {suggestion.comments} تعليق
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedSuggestions.length === 0 && (
          <Card className="border-dashed border-white/20 bg-white/5">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-white/40" />
              <p className="text-white/60">لا توجد اقتراحات في هذه الفئة</p>
            </CardContent>
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

export default Suggestions;
