import { useState, useEffect, useCallback } from "react";
import { X, AlertCircle, Package, MessageSquare, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "dispute" | "message" | "system";
  status: "draft" | "published";
}

export function NotificationBanner() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load dismissed IDs once on mount
    const dismissedStr = localStorage.getItem("dismissed_notifications");
    if (dismissedStr) {
      setDismissedIds(new Set(JSON.parse(dismissedStr)));
    }
  }, []);

  const loadNotifications = useCallback(() => {
    const stored = localStorage.getItem("admin_notifications");
    if (stored) {
      const notifications: Notification[] = JSON.parse(stored);
      const published = notifications
        .filter(n => n.status === "published")
        .sort((a, b) => b.id.localeCompare(a.id))[0];
      
      if (published && !dismissedIds.has(published.id)) {
        setNotification(published);
      } else {
        setNotification(null);
      }
    }
  }, [dismissedIds]);

  useEffect(() => {
    loadNotifications();

    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("notificationsUpdated", handleNotificationUpdate);
    window.addEventListener("storage", handleNotificationUpdate);

    return () => {
      window.removeEventListener("notificationsUpdated", handleNotificationUpdate);
      window.removeEventListener("storage", handleNotificationUpdate);
    };
  }, [loadNotifications]);

  const handleDismiss = () => {
    if (notification) {
      const newDismissed = new Set(dismissedIds);
      newDismissed.add(notification.id);
      setDismissedIds(newDismissed);
      localStorage.setItem("dismissed_notifications", JSON.stringify(Array.from(newDismissed)));
      setNotification(null);
    }
  };

  if (!notification) return null;

  const getTypeConfig = (type: string) => {
    const configs = {
      order: {
        color: "bg-blue-600 border-blue-700",
        icon: Package,
        emoji: "📦"
      },
      dispute: {
        color: "bg-red-600 border-red-700",
        icon: AlertCircle,
        emoji: "⚠️"
      },
      message: {
        color: "bg-green-600 border-green-700",
        icon: MessageSquare,
        emoji: "💬"
      },
      system: {
        color: "bg-amber-600 border-amber-700",
        icon: Megaphone,
        emoji: "📢"
      },
    };
    return configs[type as keyof typeof configs] || configs.system;
  };

  const config = getTypeConfig(notification.type);
  const IconComponent = config.icon;

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
