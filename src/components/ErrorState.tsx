import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({ message, onRetry, showRetry = true }: ErrorStateProps) {
  return (
    <div className="text-center py-8">
      <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-red-400" />
      <p className="text-red-400 mb-4">{message}</p>
      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
        >
          <RefreshCw className="h-4 w-4" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
