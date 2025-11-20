import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed
    const dismissed = localStorage.getItem("scammer_warning_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("scammer_warning_dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <div 
      className="w-full bg-white border-b-2 border-red-500 shadow-md"
      dir="rtl"
    >
      <div className="w-full px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                <span className="font-semibold">احذر المحتالين</span> - المنصة لا تتواصل بأي طريقة خارج الموقع الرسمي{' '}
                <a 
                  href="/about" 
                  className="text-red-600 hover:text-red-700 underline font-medium"
                >
                  معرفة المزيد
                </a>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-full"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
