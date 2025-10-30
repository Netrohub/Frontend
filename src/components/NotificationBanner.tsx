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
      className={`w-full border-b-2 ${config.color} shadow-lg`}
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl" role="img" aria-label="notification-icon">
              {config.emoji}
            </span>
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <IconComponent className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">
                إعلان رسمي من المنصة
              </span>
            </div>
            <h4 className="font-bold text-base text-white mb-1">
              {notification.title}
            </h4>
            <p className="text-sm text-white/90 leading-relaxed">
              {notification.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="flex-shrink-0 h-9 w-9 p-0 hover:bg-white/20 text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
