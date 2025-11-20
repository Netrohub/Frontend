import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Bell, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Component that polls for new notifications and displays them as toast pop-ups
 * This listens for new notifications from the backend and shows them as toasts
 */
export function NotificationToastListener() {
  const { user } = useAuth();
  const shownNotificationIdsRef = useRef<Set<number>>(new Set());

  // Poll for new notifications every 30 seconds
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications-toast-listener'],
    queryFn: () => notificationsApi.getAll({ page: 1, filter: 'unread' }),
    enabled: !!user,
    staleTime: 0, // Always fetch fresh data
    refetchInterval: 30000, // Poll every 30 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });

  useEffect(() => {
    if (!user || !notificationsData?.data) return;

    const notifications = notificationsData.data || [];
    
    // Find unread notifications that haven't been shown yet
    const newNotifications = notifications.filter((n: any) => 
      !n.read && !shownNotificationIdsRef.current.has(n.id)
    );
    
    // Show each new notification as a toast
    newNotifications.forEach((notification: any) => {
      // Mark as shown
      shownNotificationIdsRef.current.add(notification.id);
      
      // Get icon based on notification type
      const getIcon = () => {
        switch (notification.type) {
          case 'system':
          case 'announcement':
            return <Bell className="h-5 w-5" />;
          case 'order':
            return <CheckCircle className="h-5 w-5" />;
          case 'dispute':
            return <AlertTriangle className="h-5 w-5" />;
          case 'message':
            return <Info className="h-5 w-5" />;
          default:
            return <Bell className="h-5 w-5" />;
        }
      };

      // Get toast style based on type
      const getToastStyle = () => {
        switch (notification.type) {
          case 'system':
          case 'announcement':
            return { duration: 8000 }; // Longer duration for important announcements
          case 'order':
            return { duration: 6000 };
          case 'dispute':
            return { duration: 7000 };
          default:
            return { duration: 5000 };
        }
      };

      // Show toast notification
      toast(notification.title || 'إشعار جديد', {
        description: notification.message || '',
        duration: getToastStyle().duration,
        icon: getIcon(),
        action: {
          label: 'عرض',
          onClick: () => {
            window.location.href = '/notifications';
          },
        },
      });
    });
  }, [notificationsData, user]);

  return null;
}

