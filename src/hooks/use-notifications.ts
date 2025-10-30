import { useState, useEffect } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "order" | "dispute" | "message" | "system";
  targetAudience: "all" | "buyers" | "sellers";
  status: "draft" | "published";
  createdAt: string;
}

// This would typically come from a database/API
const getStoredNotifications = (): Notification[] => {
  const stored = localStorage.getItem("admin_notifications");
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    {
      id: "1",
      title: "مرحباً في NXOLand",
      message: "نرحب بك في منصة NXOLand لتداول الحسابات بأمان",
      time: "منذ يوم",
      read: false,
      type: "system",
      targetAudience: "all",
      status: "published",
      createdAt: "2025-01-15",
    },
  ];
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(getStoredNotifications());

    // Listen for storage changes to sync across tabs and components
    const handleStorageChange = () => {
      setNotifications(getStoredNotifications());
    };

    window.addEventListener("storage", handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener("notificationsUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("notificationsUpdated", handleStorageChange);
    };
  }, []);

  const saveNotifications = (newNotifications: Notification[]) => {
    localStorage.setItem("admin_notifications", JSON.stringify(newNotifications));
    setNotifications(newNotifications);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("notificationsUpdated"));
  };

  const publishNotification = (notification: Notification) => {
    // Dispatch event with notification data for toast display
    window.dispatchEvent(new CustomEvent("notificationPublished", { 
      detail: notification 
    }));
  };

  const getPublishedNotifications = () => {
    return notifications.filter((n) => n.status === "published");
  };

  const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "read" | "time">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      read: false,
      time: "الآن",
    };
    const updated = [newNotification, ...notifications];
    saveNotifications(updated);
    return newNotification;
  };

  const updateNotification = (id: string, updates: Partial<Notification>) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, ...updates } : n));
    saveNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const markAsRead = (id: string) => {
    updateNotification(id, { read: true });
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  return {
    notifications,
    publishedNotifications: getPublishedNotifications(),
    addNotification,
    updateNotification,
    deleteNotification,
    markAsRead,
    markAllAsRead,
    publishNotification,
  };
};
