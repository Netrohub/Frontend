import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Trash2, Package, AlertTriangle, MessageSquare, TrendingUp, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { notificationsApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Map icon names to components
const iconMap: Record<string, any> = {
  Package,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Bell,
};

const Notifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll(),
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
  });

  const notifications = notificationsResponse?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("تم تمييز جميع الإشعارات كمقروءة");
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("تم حذف الإشعار");
    },
  });

  const deleteAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.deleteAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("تم حذف جميع الإشعارات المقروءة");
    },
  });

  const markAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const deleteNotification = (id: number) => {
    deleteNotificationMutation.mutate(id);
  };

  const clearAll = () => {
    deleteAllReadMutation.mutate();
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Bell;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">الإشعارات</h1>
            <p className="text-white/60">
              {unreadCount > 0 ? `لديك ${unreadCount} إشعارات غير مقروءة` : "لا توجد إشعارات جديدة"}
            </p>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  size="sm"
                  disabled={markAllAsReadMutation.isPending}
                  className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
                >
                  {markAllAsReadMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCheck className="h-4 w-4" />
                  )}
                  تعليم الكل كمقروء
                </Button>
              )}
              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                disabled={deleteAllReadMutation.isPending}
                className="gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20"
              >
                {deleteAllReadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                مسح الكل
              </Button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification: any) => {
              const Icon = getIcon(notification.icon);
              return (
                <Card
                  key={notification.id}
                  className={`p-4 bg-white/5 border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 ${
                    !notification.read ? 'border-r-4 border-r-[hsl(195,80%,50%)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-white/5 ${notification.color || 'text-[hsl(195,80%,70%)]'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">{notification.title}</h3>
                        {!notification.read && (
                          <Badge className="bg-[hsl(195,80%,50%)] text-white border-0 text-xs">
                            جديد
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/70 mb-2">{notification.message}</p>
                      <span className="text-xs text-white/50">{formatTime(notification.created_at)}</span>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          size="icon"
                          variant="ghost"
                          disabled={markAsReadMutation.isPending}
                          className="h-8 w-8 hover:bg-white/10"
                        >
                          {markAsReadMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin text-white/60" />
                          ) : (
                            <CheckCheck className="h-4 w-4 text-white/60" />
                          )}
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteNotification(notification.id)}
                        size="icon"
                        variant="ghost"
                        disabled={deleteNotificationMutation.isPending}
                        className="h-8 w-8 hover:bg-white/10"
                      >
                        {deleteNotificationMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin text-white/60" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-white/60" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-6 rounded-full bg-white/5">
                <Bell className="h-12 w-12 text-white/40" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد إشعارات</h3>
                <p className="text-white/60">ستظهر جميع إشعاراتك هنا</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
      
      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
};

export default Notifications;
