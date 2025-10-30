import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Bell, Plus, Trash2, Edit, Eye, EyeOff } from "lucide-react";
import { useNotifications, Notification } from "@/hooks/use-notifications";

const AdminNotifications = () => {
  const { notifications, addNotification, updateNotification, deleteNotification } = useNotifications();
  const [showDialog, setShowDialog] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "system" as Notification["type"],
    targetAudience: "all" as Notification["targetAudience"],
  });

  const handleCreate = () => {
    if (!formData.title || !formData.message) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    addNotification({
      ...formData,
      status: "draft",
    });

    setFormData({
      title: "",
      message: "",
      type: "system",
      targetAudience: "all",
    });
    setShowDialog(false);
    toast({
      title: "تم الإنشاء",
      description: "تم إنشاء الإشعار بنجاح",
    });
  };

  const handleUpdate = () => {
    if (!editingNotification || !formData.title || !formData.message) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    updateNotification(editingNotification.id, formData);
    
    setEditingNotification(null);
    setFormData({
      title: "",
      message: "",
      type: "system",
      targetAudience: "all",
    });
    setShowDialog(false);
    toast({
      title: "تم التحديث",
      description: "تم تحديث الإشعار بنجاح",
    });
  };

  const handlePublish = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;
    
    console.log("Publishing notification:", notification);
    
    updateNotification(id, { status: "published" });
    
    // Trigger the notification popup
    const publishedNotification = { ...notification, status: "published" as const };
    console.log("Dispatching event with:", publishedNotification);
    window.dispatchEvent(new CustomEvent("notificationPublished", { 
      detail: publishedNotification
    }));
    
    toast({
      title: "تم النشر",
      description: "تم نشر الإشعار للمستخدمين - سيظهر في جرس الإشعارات وكإشعار منبثق",
    });
  };

  const handleUnpublish = (id: string) => {
    updateNotification(id, { status: "draft" });
    toast({
      title: "تم الإلغاء",
      description: "تم إلغاء نشر الإشعار",
    });
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    toast({
      title: "تم الحذف",
      description: "تم حذف الإشعار بنجاح",
    });
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      targetAudience: notification.targetAudience,
    });
    setShowDialog(true);
  };

  const handleDialogChange = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      // Reset form when closing
      setEditingNotification(null);
      setFormData({
        title: "",
        message: "",
        type: "system",
        targetAudience: "all",
      });
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      order: "طلب",
      dispute: "نزاع",
      message: "رسالة",
      system: "نظام",
    };
    return labels[type as keyof typeof labels];
  };

  const getAudienceLabel = (audience: string) => {
    const labels = {
      all: "الجميع",
      buyers: "المشترين",
      sellers: "البائعين",
    };
    return labels[audience as keyof typeof labels];
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">إدارة الإشعارات</h1>
              <p className="text-white/60">إنشاء ونشر إشعارات للمستخدمين</p>
            </div>
          </div>

          <Dialog open={showDialog} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إشعار جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingNotification ? "تعديل الإشعار" : "إشعار جديد"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">العنوان</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="عنوان الإشعار"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="محتوى الإشعار"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">النوع</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value as Notification["type"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">نظام</SelectItem>
                      <SelectItem value="order">طلب</SelectItem>
                      <SelectItem value="dispute">نزاع</SelectItem>
                      <SelectItem value="message">رسالة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">الجمهور المستهدف</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        targetAudience: value as Notification["targetAudience"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الجميع</SelectItem>
                      <SelectItem value="buyers">المشترين فقط</SelectItem>
                      <SelectItem value="sellers">البائعين فقط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={editingNotification ? handleUpdate : handleCreate} className="flex-1">
                  {editingNotification ? "تحديث" : "إنشاء"}
                </Button>
                <Button variant="outline" onClick={() => handleDialogChange(false)}>
                  إلغاء
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl text-white">{notification.title}</CardTitle>
                      <Badge variant={notification.status === "published" ? "default" : "secondary"}>
                        {notification.status === "published" ? "منشور" : "مسودة"}
                      </Badge>
                      <Badge variant="outline">{getTypeLabel(notification.type)}</Badge>
                      <Badge variant="outline">{getAudienceLabel(notification.targetAudience)}</Badge>
                    </div>
                    <p className="text-sm text-white/50">
                      تاريخ الإنشاء: {notification.createdAt}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-4">{notification.message}</p>
                <div className="flex gap-2">
                  {notification.status === "draft" ? (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(notification.id)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      نشر
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnpublish(notification.id)}
                      className="gap-2"
                    >
                      <EyeOff className="h-4 w-4" />
                      إلغاء النشر
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(notification)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(notification.id)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
