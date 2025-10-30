import { useEffect } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Notification } from "@/hooks/use-notifications";

export function NotificationListener() {
  useEffect(() => {
    const handleNotificationPublished = (event: Event) => {
      const customEvent = event as CustomEvent<Notification>;
      const notification = customEvent.detail;
      
      console.log("Notification published:", notification);
      
      toast(
        <div className="flex items-start gap-3 w-full p-2">
          <div className="p-2 rounded-lg bg-primary/20 flex-shrink-0">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base mb-1 text-foreground">{notification.title}</h4>
            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          position: "top-center",
        }
      );
    };

    console.log("NotificationListener mounted");
    window.addEventListener("notificationPublished", handleNotificationPublished);

    return () => {
      window.removeEventListener("notificationPublished", handleNotificationPublished);
    };
  }, []);

  return null;
}
