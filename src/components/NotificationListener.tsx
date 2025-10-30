import { useEffect } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Notification } from "@/hooks/use-notifications";

export function NotificationListener() {
  useEffect(() => {
    const handleNotificationPublished = (event: CustomEvent<Notification>) => {
      const notification = event.detail;
      
      toast(
        <div className="flex items-start gap-3 w-full">
          <div className="p-2 rounded-lg bg-primary/20 flex-shrink-0">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base mb-1">{notification.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {notification.message}
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          position: "top-center",
          className: "!bg-card !border-primary/30 !shadow-lg",
        }
      );
    };

    window.addEventListener("notificationPublished", handleNotificationPublished as EventListener);

    return () => {
      window.removeEventListener("notificationPublished", handleNotificationPublished as EventListener);
    };
  }, []);

  return null;
}
