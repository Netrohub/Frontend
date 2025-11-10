import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Trash2, Package, AlertTriangle, MessageSquare, TrendingUp, Loader2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { notificationsApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState } from "react";

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
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ['notifications', currentPage, filterStatus, filterType],
    queryFn: () => notificationsApi.getAll({ 
      page: currentPage,
      filter: filterStatus !== 'all' ? filterStatus : undefined,
      type: filterType !== 'all' ? filterType : undefined,
    }),
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Poll every 60 seconds (reduced from 10s)
    refetchOnWindowFocus: false, // Don't refetch on tab switch
  });

  // Get fresh unread count
  const { data: unreadCountData } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Poll every 60 seconds (reduced from 10s)
    refetchOnWindowFocus: false, // Don't refetch on tab switch
  });

  const notifications = notificationsResponse?.data || [];
  const unreadCount = unreadCountData?.count || 0;

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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{t('notifications.pageTitle')}</h1>
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
                    <span className="hidden md:inline">تعليم الكل كمقروء</span>
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
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
                      <span className="hidden md:inline">{t('notifications.clearAll')}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[hsl(200,70%,15%)] border-white/20">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white text-right">
                        حذف جميع الإشعارات المقروءة
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-white/80 text-right">
                        هل أنت متأكد من حذف جميع الإشعارات المقروءة؟ 
                        هذا الإجراء لا يمكن التراجع عنه.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel className="bg-white/10 text-white border-white/20">
                        إلغاء
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={clearAll}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        حذف الكل
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status Filter */}
            <Tabs value={filterStatus} onValueChange={(v) => {
              setFilterStatus(v as 'all' | 'unread' | 'read');
              setCurrentPage(1); // Reset to page 1 when filtering
            }} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70"
                >
                  الكل
                </TabsTrigger>
                <TabsTrigger 
                  value="unread"
                  className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70"
                >
                  غير مقروءة
                  {unreadCount > 0 && (
                    <Badge className="mr-1 bg-red-500 text-white border-0 text-xs h-5 px-1.5">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="read"
                  className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white text-white/70"
                >
                  مقروءة
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={(v) => {
              setFilterType(v);
              setCurrentPage(1); // Reset to page 1 when filtering
            }}>
              <SelectTrigger className="w-full md:w-[200px] bg-white/5 border-white/20 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(200,70%,20%)] border-white/10">
                <SelectItem value="all" className="text-white">{t('notifications.allTypes')}</SelectItem>
                <SelectItem value="order" className="text-white">{t('notifications.orderType')}</SelectItem>
                <SelectItem value="dispute" className="text-white">{t('notifications.disputeType')}</SelectItem>
                <SelectItem value="message" className="text-white">{t('notifications.messageType')}</SelectItem>
                <SelectItem value="system" className="text-white">{t('notifications.systemType')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-4 bg-white/5 border-white/10">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-white/10 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <>
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

            {/* Pagination */}
            {notificationsResponse && notificationsResponse.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="bg-white/5 text-white border-white/20 hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, notificationsResponse.last_page) }, (_, i) => {
                    let page;
                    if (notificationsResponse.last_page <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= notificationsResponse.last_page - 2) {
                      page = notificationsResponse.last_page - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={page}
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        disabled={isLoading}
                        className={`min-w-[40px] ${
                          currentPage === page
                            ? 'bg-[hsl(195,80%,50%)] text-white border-[hsl(195,80%,50%)]'
                            : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(notificationsResponse.last_page, p + 1))}
                  disabled={currentPage === notificationsResponse.last_page || isLoading}
                  className="bg-white/5 text-white border-white/20 hover:bg-white/10"
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-6 rounded-full bg-white/5">
                <Bell className="h-12 w-12 text-white/40" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{t('notifications.noNotificationsTitle')}</h3>
                <p className="text-white/60">
                  {filterStatus !== 'all' || filterType !== 'all' 
                    ? 'لا توجد إشعارات تطابق الفلاتر المحددة'
                    : 'ستظهر جميع إشعاراتك هنا'
                  }
                </p>
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
