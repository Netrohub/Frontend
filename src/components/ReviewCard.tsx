import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/StarRating";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDate } from "@/utils/date";
import { User, ThumbsUp, ThumbsDown, Flag, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    reviewer: {
      name: string;
      avatar_url?: string;
      verified?: boolean;
    };
    order_id?: string;
    helpful_count?: number;
    user_found_helpful?: boolean;
  };
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  isOwnReview?: boolean;
}

export function ReviewCard({ 
  review, 
  onHelpful, 
  onReport, 
  onEdit, 
  onDelete,
  isOwnReview = false 
}: ReviewCardProps) {
  const { language } = useLanguage();

  const formatDate = (dateString: string) => {
    return formatLocalizedDate(dateString, language);
  };

  return (
    <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)]">
            {review.reviewer.avatar_url ? (
              <img src={review.reviewer.avatar_url} alt={review.reviewer.name} />
            ) : (
              <User className="h-6 w-6 text-white" />
            )}
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-white font-bold">{review.reviewer.name}</h4>
              {review.reviewer.verified && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  موثق
                </Badge>
              )}
            </div>
            <p className="text-white/60 text-sm">{formatDate(review.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} readonly size="sm" />
          {isOwnReview && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[hsl(200,70%,20%)] border-white/10">
                <DropdownMenuItem 
                  onClick={() => onEdit?.(review.id)}
                  className="text-white hover:bg-white/10 cursor-pointer"
                >
                  تعديل التقييم
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(review.id)}
                  className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  حذف التقييم
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <p className="text-white/80 mb-4 leading-relaxed">{review.comment}</p>

      {review.order_id && (
        <Badge className="bg-[hsl(195,80%,50%,0.1)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,50%,0.3)] text-xs mb-4">
          عملية شراء موثقة
        </Badge>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onHelpful?.(review.id)}
          className={cn(
            "gap-2 text-white/60 hover:text-white hover:bg-white/5",
            review.user_found_helpful && "text-green-400 hover:text-green-300"
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>مفيد ({review.helpful_count || 0})</span>
        </Button>

        {!isOwnReview && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReport?.(review.id)}
            className="gap-2 text-white/60 hover:text-red-400 hover:bg-red-500/10"
          >
            <Flag className="h-4 w-4" />
            <span>إبلاغ</span>
          </Button>
        )}
      </div>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
