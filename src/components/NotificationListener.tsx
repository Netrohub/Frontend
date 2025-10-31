import { useEffect } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Notification } from "@/hooks/use-notifications";

export function NotificationListener() {
  useEffect(() => {
    const handleNotificationPublished = (event: Event) => {
      const customEvent = event as CustomEvent<Notification>;
      const notification = customEvent.detail;
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("🔔 Received notification event:", notification);
      }
      
      toast(notification.title, {
        description: notification.message,
        duration: 5000,
        icon: <Bell className="h-5 w-5 text-primary" />,
      });
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log("✅ NotificationListener mounted and listening");
    }
    window.addEventListener("notificationPublished", handleNotificationPublished);

    return () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log("❌ NotificationListener unmounted");
      }
      window.removeEventListener("notificationPublished", handleNotificationPublished);
    };
  }, []);

  return null;
}
