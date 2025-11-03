import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  fallbackPath?: string;
  label?: string;
  className?: string;
}

export const BackButton = ({ 
  fallbackPath = "/", 
  label = "العودة",
  className 
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      onClick={handleBack}
      variant="ghost"
      className={cn(
        "gap-2 text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] hover:bg-white/10 mb-4",
        className
      )}
    >
      <ArrowRight className="h-4 w-4" />
      {label}
    </Button>
  );
};

