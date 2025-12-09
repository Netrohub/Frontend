import { useState, useEffect, useCallback } from "react";
import { X, AlertCircle, Bell, Package, MessageSquare, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "dispute" | "message" | "system" | "announcement";
  status: "draft" | "published" | "stopped";
}

export function NotificationBanner() {
  const { t } = useLanguage();
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
      // Get the most recent published notification that hasn't been dismissed
      const published = notifications
        .filter(n => n.status === "published")
        .sort((a, b) => b.id.localeCompare(a.id))
        .find(n => !dismissedIds.has(n.id));
      
      if (published) {
        setNotification(published);
      } else {
        setNotification(null);
      }
    } else {
      setNotification(null);
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

  const getIcon = () => {
    switch (notification.type) {
      case 'order':
        return Package;
      case 'dispute':
        return AlertCircle;
      case 'message':
        return MessageSquare;
      case 'announcement':
        return Megaphone;
      default:
        return Bell;
    }
  };

  const IconComponent = getIcon();

  return (
    <div 
      className="w-full bg-white border-b border-gray-200 shadow-md"
      dir="rtl"
    >
      <div className="w-full px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                <IconComponent className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <h4 className="text-sm md:text-base font-semibold text-gray-900 leading-tight">
                {notification.title}
              </h4>
              {notification.message && (
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {notification.message}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
            aria-label={t('common.close')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
