import { useState, useEffect } from "react";
import { X, Bell } from "lucide-react";
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
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    const loadNotifications = () => {
      const stored = localStorage.getItem("admin_notifications");
      const dismissedIds = localStorage.getItem("dismissed_notifications");
      
      if (dismissedIds) {
        setDismissed(JSON.parse(dismissedIds));
      }

      if (stored) {
        const notifications: Notification[] = JSON.parse(stored);
        // Get the latest published notification
        const published = notifications
          .filter(n => n.status === "published")
          .sort((a, b) => b.id.localeCompare(a.id))[0];
        
        if (published && !dismissed.includes(published.id)) {
          setNotification(published);
        }
      }
    };

    loadNotifications();

    // Listen for new notifications
    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("notificationsUpdated", handleNotificationUpdate);
    window.addEventListener("storage", handleNotificationUpdate);

    return () => {
      window.removeEventListener("notificationsUpdated", handleNotificationUpdate);
      window.removeEventListener("storage", handleNotificationUpdate);
    };
  }, [dismissed]);

  const handleDismiss = () => {
    if (notification) {
      const newDismissed = [...dismissed, notification.id];
      setDismissed(newDismissed);
      localStorage.setItem("dismissed_notifications", JSON.stringify(newDismissed));
      setNotification(null);
    }
  };

  if (!notification) return null;

  const getTypeColor = (type: string) => {
    const colors = {
      order: "bg-blue-500/10 border-blue-500/30",
      dispute: "bg-red-500/10 border-red-500/30",
      message: "bg-green-500/10 border-green-500/30",
      system: "bg-primary/10 border-primary/30",
    };
    return colors[type as keyof typeof colors] || colors.system;
  };

  return (
    <div 
      className={`w-full border-b ${getTypeColor(notification.type)} backdrop-blur-sm`}
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 flex-shrink-0">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-white mb-0.5">
              {notification.title}
            </h4>
            <p className="text-sm text-white/70">
              {notification.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="flex-shrink-0 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
