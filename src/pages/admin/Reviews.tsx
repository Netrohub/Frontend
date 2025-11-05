import { Search, Eye, Trash2, Flag, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/StarRating";
import { useState } from "react";

export default function AdminReviews() {
  const [searchQuery, setSearchQuery] = useState("");

  const reviews = [
    {
      id: "1",
      reviewer: "أحمد محمد",
      reviewerEmail: "ahmed@example.com",
      reviewed: "فاطمة علي",
      rating: 5,
      comment: "بائع ممتاز، التعامل سريع والحساب كما هو موصوف",
      productTitle: "حساب إنستغرام - 50K متابع",
      date: "2024-01-15",
      status: "approved",
      reports: 0,
    },
    {
      id: "2",
      reviewer: "محمد حسن",
      reviewerEmail: "mohamed@example.com",
      reviewed: "أحمد محمد",
      rating: 2,
      comment: "الحساب لم يكن كما وعد، هناك مشاكل في التسليم",
      productTitle: "حساب تيك توك - 100K متابع",
      date: "2024-01-14",
      status: "flagged",
      reports: 3,
    },
    {
      id: "3",
      reviewer: "سارة أحمد",
      reviewerEmail: "sara@example.com",
      reviewed: "محمد حسن",
      rating: 4,
      comment: "جيد بشكل عام، بعض التأخير في التسليم لكن الحساب ممتاز",
      productTitle: "Whiteout Survival - المستوى 25",
      date: "2024-01-13",
      status: "pending",
      reports: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-400";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "flagged": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "معتمدة";
      case "pending": return "قيد المراجعة";
      case "flagged": return "مبلغ عنها";
      default: return status;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">إدارة المراجعات</h1>
        <p className="text-white/60">مراجعة والموافقة على تقييمات المستخدمين</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
          <Input
            placeholder="البحث في المراجعات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-[hsl(200,70%,15%)] border-white/10 text-white"
          />
        </div>
        <Button className="bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(200,90%,40%)]">
          <Search className="h-4 w-4 mr-2" />
          بحث
        </Button>
      </div>

      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6 bg-[hsl(200,70%,12%)] border-white/10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{review.reviewer}</h3>
                  <StarRating rating={review.rating} readonly />
                  <Badge className={getStatusColor(review.status)}>
                    {getStatusLabel(review.status)}
                  </Badge>
                  {review.reports > 0 && (
                    <Badge className="bg-red-500/20 text-red-400">
                      <Flag className="h-3 w-3 mr-1" />
                      {review.reports} بلاغات
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/60 mb-1">{review.reviewerEmail}</p>
                <p className="text-sm text-white/80 mb-2">
                  مراجعة لـ: <span className="font-medium">{review.reviewed}</span>
                </p>
              </div>
              <span className="text-sm text-white/40">{review.date}</span>
            </div>

            <div className="mb-4">
              <p className="text-white/80 mb-2">{review.comment}</p>
              <p className="text-sm text-white/60">
                المنتج: <span className="font-medium">{review.productTitle}</span>
              </p>
            </div>

            <div className="flex gap-2">
              {review.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-400 border-green-500/30"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    الموافقة
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-500/30"
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    رفض
                  </Button>
                </>
              )}
              {review.status === "flagged" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-400 border-green-500/30"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    قبول المراجعة
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-500/30"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    حذف المراجعة
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mr-auto"
              >
                <Eye className="h-4 w-4 mr-1" />
                عرض التفاصيل
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
