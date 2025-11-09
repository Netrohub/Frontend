import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error(t('reviews.pleaseSelectRating'));
      return;
    }

    if (comment.trim().length < 10) {
      toast.error(t('reviews.commentMinLength'));
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Backend integration
      await onSubmit?.({ rating, comment });
      
      toast.success(existingReview ? t('reviews.updateSuccess') : t('reviews.createSuccess'));
      
      if (!existingReview) {
        setRating(0);
        setComment("");
      }
    } catch (error) {
      toast.error(t('common.errorTryAgain'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-[hsl(195,80%,70%)]" />
        <h3 className="text-lg font-bold text-white">
          {existingReview ? t('reviews.editReview') : t('reviews.addReview')}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-white text-sm">{t('reviews.rating')}</Label>
          <div className="flex items-center gap-3">
            <StarRating 
              rating={rating} 
              onRatingChange={setRating} 
              size="lg"
              showValue
            />
            {rating > 0 && (
              <span className="text-white/60 text-sm">
                {rating === 5 && t('reviews.excellent')}
                {rating === 4 && t('reviews.veryGood')}
                {rating === 3 && t('reviews.good')}
                {rating === 2 && t('reviews.acceptable')}
                {rating === 1 && t('reviews.poor')}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment" className="text-white text-sm">
            {t('reviews.comment')} <span className="text-white/60">{t('reviews.minCharacters')}</span>
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('reviews.commentPlaceholder')}
            className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none"
            maxLength={1000}
          />
          <div className="flex justify-between text-xs text-white/60">
            <span>{t('reviews.characterCount', { count: comment.length })}</span>
            <span>{comment.trim().length < 10 ? t('reviews.charactersRemaining', { remaining: 10 - comment.trim().length }) : "✓"}</span>
          </div>
        </div>

        <div className="bg-[hsl(195,80%,50%,0.1)] border border-[hsl(195,80%,50%,0.2)] rounded-lg p-4">
          <p className="text-white/80 text-sm">
            {t('reviews.tip')}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            className="flex-1 gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0 min-h-[48px]"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? t('common.sending') : existingReview ? t('reviews.updateButton') : t('reviews.publishButton')}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="bg-white/5 hover:bg-white/10 text-white border-white/20 min-h-[48px]"
            >
              {t('common.cancel')}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
