import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function NotificationBell() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Get unread count from backend
  const { data: unreadData } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled: !!user,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  // Get recent notifications (last 5 for bell dropdown)
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications-recent'],
    queryFn: () => notificationsApi.getAll({ page: 1 }),
    enabled: !!user,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const unreadCount = unreadData?.count || 0;
  const recentNotifications = notificationsData?.data?.slice(0, 5) || [];

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return t('time.now');
    if (minutes < 60) return t('time.minutesAgo', { count: minutes });
    if (hours < 24) return t('time.hoursAgo', { count: hours });
    return t('time.daysAgo', { count: days });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,70%)] focus:ring-offset-2 focus:ring-offset-[hsl(200,70%,15%)]"
          aria-label={`${t('notifications.title')}${unreadCount > 0 ? ` - ${t('notifications.unreadCount', { count: unreadCount })}` : ''}`}
          aria-expanded="false"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              aria-label={t('notifications.unreadCount', { count: unreadCount })}
            >
              <span className="sr-only">{t('notifications.unreadCount', { count: unreadCount })}</span>
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-[hsl(200,70%,20%)] border-white/10"
        role="menu"
        aria-label={t('notifications.title')}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold text-lg text-white" id="notifications-heading">
            {t('notifications.title')}
            {unreadCount > 0 && (
              <Badge className="mr-2 bg-[hsl(195,80%,50%)] text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/notifications')}
            className="text-xs text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)]"
          >
            {t('notifications.viewAll')}
          </Button>
        </div>
        <ScrollArea className="h-[400px]" aria-labelledby="notifications-heading">
          {recentNotifications.length === 0 ? (
            <div className="p-8 text-center text-white/60" role="status" aria-live="polite">
              {t('notifications.empty')}
            </div>
          ) : (
            recentNotifications.map((notification: any) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-2 p-4 cursor-pointer hover:bg-white/10 ${
                  !notification.read ? "bg-white/5" : ""
                }`}
                onClick={() => {
                  if (!notification.read) {
                    handleMarkAsRead(notification.id);
                  }
                  navigate('/notifications');
                }}
                role="menuitem"
                aria-label={`${notification.title}. ${notification.message}`}
              >
                <div className="flex items-start gap-3 w-full">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      !notification.read ? "bg-[hsl(195,80%,50%)]" : "bg-transparent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm mb-1 text-white">
                      {notification.title}
                    </p>
                    <p className="text-xs text-white/60 line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-white/40 mt-1 block">
                      {formatTime(notification.created_at)}
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        {recentNotifications.length > 0 && (
          <div className="p-3 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notifications')}
              className="w-full text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] hover:bg-white/5"
            >
              {t('notifications.viewAllNotifications')}
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
