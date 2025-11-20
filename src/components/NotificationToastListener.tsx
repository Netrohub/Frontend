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
      
      // Get icon and color based on notification type
      const getIconConfig = () => {
        switch (notification.type) {
          case 'system':
          case 'announcement':
            return {
              icon: <Bell className="h-5 w-5" />,
              color: 'hsl(40, 90%, 55%)', // Amber/Gold
              borderColor: 'rgba(255, 193, 7, 0.3)',
            };
          case 'order':
            return {
              icon: <CheckCircle className="h-5 w-5" />,
              color: 'hsl(160, 60%, 50%)', // Green/Success
              borderColor: 'rgba(16, 185, 129, 0.3)',
            };
          case 'dispute':
            return {
              icon: <AlertTriangle className="h-5 w-5" />,
              color: 'hsl(0, 70%, 60%)', // Red/Error
              borderColor: 'rgba(239, 68, 68, 0.3)',
            };
          case 'message':
            return {
              icon: <Info className="h-5 w-5" />,
              color: 'hsl(200, 85%, 55%)', // Blue/Info
              borderColor: 'rgba(59, 130, 246, 0.3)',
            };
          default:
            return {
              icon: <Bell className="h-5 w-5" />,
              color: 'hsl(200, 85%, 55%)', // Default Blue
              borderColor: 'rgba(59, 130, 246, 0.3)',
            };
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

      const iconConfig = getIconConfig();
      const style = getToastStyle();

      // Show toast notification with beautiful styling
      toast(notification.title || 'إشعار جديد', {
        description: notification.message || '',
        duration: style.duration,
        icon: (
          <div 
            className="flex items-center justify-center w-10 h-10 rounded-lg backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${iconConfig.color}20, ${iconConfig.color}10)`,
              border: `1px solid ${iconConfig.borderColor}`,
            }}
          >
            <div style={{ color: iconConfig.color }}>
              {iconConfig.icon}
            </div>
          </div>
        ),
        action: {
          label: 'عرض',
          onClick: () => {
            window.location.href = '/notifications';
          },
        },
        className: "notification-toast",
        style: {
          borderLeft: `3px solid ${iconConfig.color}`,
        },
      });
    });
  }, [notificationsData, user]);

  return null;
}

