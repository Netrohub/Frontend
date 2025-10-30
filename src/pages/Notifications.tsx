import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Trash2, Package, AlertTriangle, MessageSquare, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: "order", 
      title: "طلب جديد", 
      message: "تم شراء حسابك 'حساب مميز - المستوى 45'", 
      time: "منذ 5 دقائق", 
      read: false,
      icon: Package,
      color: "text-[hsl(195,80%,70%)]"
    },
    { 
      id: 2, 
      type: "dispute", 
      title: "نزاع جديد", 
      message: "تم فتح نزاع على الطلب #12458", 
      time: "منذ ساعتين", 
      read: false,
      icon: AlertTriangle,
      color: "text-red-400"
    },
    { 
      id: 3, 
      type: "message", 
      title: "رسالة جديدة", 
      message: "رد جديد من البائع على نزاعك", 
      time: "منذ 3 ساعات", 
      read: true,
      icon: MessageSquare,
      color: "text-[hsl(40,90%,55%)]"
    },
    { 
      id: 4, 
      type: "achievement", 
      title: "إنجاز جديد", 
      message: "ارتفع تقييمك إلى 4.9 نجوم!", 
      time: "منذ يوم واحد", 
      read: true,
      icon: TrendingUp,
      color: "text-green-400"
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
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
                  className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
                >
                  <CheckCheck className="h-4 w-4" />
                  تعليم الكل كمقروء
                </Button>
              )}
              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                className="gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20"
              >
                <Trash2 className="h-4 w-4" />
                مسح الكل
              </Button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`p-4 bg-white/5 border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 ${
                    !notification.read ? 'border-r-4 border-r-[hsl(195,80%,50%)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-white/5 ${notification.color}`}>
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
                      <span className="text-xs text-white/50">{notification.time}</span>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-white/10"
                        >
                          <CheckCheck className="h-4 w-4 text-white/60" />
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteNotification(notification.id)}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-white/10"
                      >
                        <Trash2 className="h-4 w-4 text-white/60" />
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
