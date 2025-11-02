import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

interface ReviewFormProps {
  orderId?: string;
  sellerId?: string;
  existingReview?: {
    id: string;
    rating: number;
    comment: string;
  };
  onSubmit?: (data: { rating: number; comment: string }) => Promise<void>;
  onCancel?: () => void;
}

export function ReviewForm({ 
  orderId, 
  sellerId, 
  existingReview, 
  onSubmit, 
  onCancel 
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("الرجاء اختيار تقييم");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("الرجاء كتابة تعليق لا يقل عن 10 أحرف");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Backend integration
      await onSubmit?.({ rating, comment });
      
      toast.success(existingReview ? "تم تحديث التقييم بنجاح" : "تم إضافة التقييم بنجاح");
      
      if (!existingReview) {
        setRating(0);
        setComment("");
      }
    } catch (error) {
      toast.error("حدث خطأ، الرجاء المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-[hsl(195,80%,70%)]" />
        <h3 className="text-lg font-bold text-white">
          {existingReview ? "تعديل التقييم" : "إضافة تقييم"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-white text-sm">التقييم *</Label>
          <div className="flex items-center gap-3">
            <StarRating 
              rating={rating} 
              onRatingChange={setRating} 
              size="lg"
              showValue
            />
            {rating > 0 && (
              <span className="text-white/60 text-sm">
                {rating === 5 && "ممتاز"}
                {rating === 4 && "جيد جداً"}
                {rating === 3 && "جيد"}
                {rating === 2 && "مقبول"}
                {rating === 1 && "ضعيف"}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment" className="text-white text-sm">
            التعليق * <span className="text-white/60">(10 أحرف على الأقل)</span>
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="شارك تجربتك مع هذا البائع... كيف كانت جودة الخدمة؟ هل كان التسليم سريعاً؟"
            className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none"
            maxLength={1000}
          />
          <div className="flex justify-between text-xs text-white/60">
            <span>{comment.length} / 1000 حرف</span>
            <span>{comment.trim().length < 10 ? `${10 - comment.trim().length} حرف متبقي` : "✓"}</span>
          </div>
        </div>

        <div className="bg-[hsl(195,80%,50%,0.1)] border border-[hsl(195,80%,50%,0.2)] rounded-lg p-4">
          <p className="text-white/80 text-sm">
            💡 نصيحة: التقييمات الصادقة والمفصلة تساعد المشترين الآخرين في اتخاذ قرارات أفضل
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            className="flex-1 gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0 min-h-[48px]"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "جاري الإرسال..." : existingReview ? "تحديث التقييم" : "نشر التقييم"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="bg-white/5 hover:bg-white/10 text-white border-white/20 min-h-[48px]"
            >
              إلغاء
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
