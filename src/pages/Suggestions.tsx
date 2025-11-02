import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";

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
    if (!newTitle.trim() || !newDescription.trim()) return;

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

      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-[0_0_30px_rgba(148,209,240,0.5)]">
            مركز الاقتراحات
          </h1>
          <p className="text-white/70">شارك أفكارك وساعدنا في تحسين المنصة</p>
        </div>

        {/* Submit New Suggestion */}
        <Card className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[hsl(195,80%,70%,0.3)] transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquare className="w-5 h-5 text-[hsl(195,80%,70%)]" />
              اقتراح جديد
            </CardTitle>
            <CardDescription className="text-white/60">شاركنا فكرتك لتحسين المنصة</CardDescription>
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
    </div>
  );
};

export default Suggestions;

