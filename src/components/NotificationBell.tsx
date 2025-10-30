import { useState } from "react";
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

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "order" | "dispute" | "message" | "system";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "طلب جديد",
    message: "لديك طلب جديد من المشتري أحمد",
    time: "منذ 5 دقائق",
    read: false,
    type: "order",
  },
  {
    id: "2",
    title: "تحديث النزاع",
    message: "تم الرد على نزاعك #1234",
    time: "منذ ساعة",
    read: false,
    type: "dispute",
  },
  {
    id: "3",
    title: "رسالة جديدة",
    message: "رسالة جديدة من البائع محمد",
    time: "منذ ساعتين",
    read: true,
    type: "message",
  },
  {
    id: "4",
    title: "تأكيد الطلب",
    message: "تم تأكيد طلبك #5678 بنجاح",
    time: "منذ 3 ساعات",
    read: true,
    type: "system",
  },
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    const colors = {
      order: "bg-primary/10 text-primary",
      dispute: "bg-destructive/10 text-destructive",
      message: "bg-accent/10 text-accent-foreground",
      system: "bg-muted text-muted-foreground",
    };
    return colors[type];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-background border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-lg">الإشعارات</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              تحديد الكل كمقروء
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              لا توجد إشعارات
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-2 p-4 cursor-pointer ${
                  !notification.read ? "bg-accent/5" : ""
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      !notification.read ? "bg-primary" : "bg-transparent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getNotificationIcon(
                          notification.type
                        )}`}
                      >
                        {notification.type === "order" && "طلب"}
                        {notification.type === "dispute" && "نزاع"}
                        {notification.type === "message" && "رسالة"}
                        {notification.type === "system" && "نظام"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="font-medium text-sm mb-1">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
