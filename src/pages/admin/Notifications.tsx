import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { Bell, Plus, Loader2, Send, Users, CheckCircle, Calendar, StopCircle, Play } from "lucide-react";
import { adminApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDateTime } from "@/utils/date";
import { useNotifications } from "@/hooks/use-notifications";

const AdminNotifications = () => {
  const { t, language } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "system",
    targetAudience: "all",
  });
  const queryClient = useQueryClient();
  const { notifications: localNotifications, addNotification, updateNotification } = useNotifications();
  const [stopDialogOpen, setStopDialogOpen] = useState<string | null>(null);

  // Fetch notification history from backend
  const { data: notificationHistory, isLoading } = useQuery({
    queryKey: ['admin-notification-history'],
    queryFn: () => adminApi.getNotificationHistory(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Combine backend notifications with local notifications
  const allNotifications = [...(notificationHistory || []), ...localNotifications];
  const notifications = allNotifications.sort((a: any, b: any) => {
    const dateA = new Date(a.sent_at || a.createdAt || 0).getTime();
    const dateB = new Date(b.sent_at || b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      adminApi.createNotification({
        broadcast: true,  // Always broadcast to all users
        target_role: data.targetAudience as 'all' | 'buyer' | 'seller',
        type: data.type,
        title: data.title,
        message: data.message,
        icon: 'Bell',
        color: 'blue',
      }),
    onSuccess: (response) => {
      const usersCount = response.users_count || 0;
      
      // Also save to localStorage for banner display
      addNotification({
        title: formData.title,
        message: formData.message,
        type: formData.type as any,
        targetAudience: formData.targetAudience as any,
        status: "published",
      });
      
      toast.success(`تم إرسال الإشعار بنجاح إلى ${usersCount} مستخدم`);
      queryClient.invalidateQueries({ queryKey: ['admin-notification-history'] });
      setFormData({
        title: "",
        message: "",
        type: "system",
        targetAudience: "all",
      });
      setShowDialog(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل إرسال الإشعار");
    },
  });

  const handleStopNotification = (notificationId: string) => {
    // Update notification status to stopped
    updateNotification(notificationId, { status: "stopped" });
    toast.success("تم إيقاف الإشعار بنجاح");
    setStopDialogOpen(null);
  };

  const handleResumeNotification = (notificationId: string) => {
    // Update notification status back to published
    updateNotification(notificationId, { status: "published" });
    toast.success("تم استئناف الإشعار بنجاح");
  };

  const handleSend = () => {
    if (!formData.title || !formData.message) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    sendNotificationMutation.mutate(formData);
  };

  const handleDialogChange = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      // Reset form when closing
      setFormData({
        title: "",
        message: "",
        type: "system",
        targetAudience: "all",
      });
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      order: "طلب",
      dispute: "نزاع",
      message: "رسالة",
      system: "نظام",
      announcement: "إعلان",
    };
    return labels[type] || type;
  };

  const getAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      all: "الجميع",
      buyers: "المشترين",
      sellers: "البائعين",
    };
    return labels[audience] || audience;
  };

  const formatDate = (dateString: string) =>
    formatLocalizedDateTime(dateString, language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <>
      <SEO 
        title="إدارة الإشعارات - NXOLand Admin"
        description="إرسال إشعارات للمستخدمين عبر المنصة"
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(195,80%,50%,0.2)]">
                <Bell className="h-6 w-6 text-[hsl(195,80%,70%)]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">إدارة الإشعارات</h1>
                <p className="text-white/60">
                  إرسال إشعارات للمستخدمين عبر المنصة ({notifications.length} إشعار مُرسل)
                </p>
              </div>
            </div>

            <Dialog open={showDialog} onOpenChange={handleDialogChange}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white">
                  <Plus className="h-4 w-4" />
                  إشعار جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-[hsl(200,70%,15%)] border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">إشعار جديد</DialogTitle>
                  <DialogDescription className="text-white/70">
                    إنشاء وإرسال إشعار فوري لجميع المستخدمين
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white/80">العنوان</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="عنوان الإشعار"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white/80">الرسالة</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="محتوى الإشعار"
                      rows={4}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-white/80">النوع</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger id="type" className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">نظام</SelectItem>
                        <SelectItem value="announcement">إعلان</SelectItem>
                        <SelectItem value="order">طلب</SelectItem>
                        <SelectItem value="dispute">نزاع</SelectItem>
                        <SelectItem value="message">رسالة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audience" className="text-white/80">الجمهور المستهدف</Label>
                    <Select
                      value={formData.targetAudience}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          targetAudience: value,
                        })
                      }
                    >
                      <SelectTrigger id="audience" className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">الجميع</SelectItem>
                        <SelectItem value="buyers">المشترين فقط</SelectItem>
                        <SelectItem value="sellers">البائعين فقط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Card className="p-3 bg-green-500/10 border-green-500/30">
                    <p className="text-sm text-green-400">
                      ✅ سيتم إرسال هذا الإشعار فوراً إلى جميع المستخدمين المستهدفين
                    </p>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSend}
                    disabled={sendNotificationMutation.isPending}
                    className="flex-1 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white"
                  >
                    {sendNotificationMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        إرسال الإشعار
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDialogChange(false)}
                    disabled={sendNotificationMutation.isPending}
                    className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                  >
                    إلغاء
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && notifications.length === 0 && (
            <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <Bell className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">لم يتم إرسال أي إشعارات بعد</p>
              <p className="text-white/40 text-sm mt-2">انقر على "إشعار جديد" لإرسال إشعار للمستخدمين</p>
            </Card>
          )}

          {/* Notifications History */}
          {!isLoading && notifications.length > 0 && (
            <div className="grid gap-4">
              {notifications.map((notification: any, index: number) => (
                <Card key={index} className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-xl text-white">{notification.title}</CardTitle>
                          {notification.status === "published" ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="h-3 w-3 ml-1" />
                              نشط
                            </Badge>
                          ) : notification.status === "stopped" ? (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              <StopCircle className="h-3 w-3 ml-1" />
                              متوقف
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              مسودة
                            </Badge>
                          )}
                          <Badge variant="outline" className="border-white/20 text-white/70">
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/50">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {notification.recipients_count} مستخدم
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(notification.sent_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 mb-4">{notification.message}</p>
                    <div className="flex gap-2">
                      {notification.status === "published" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStopDialogOpen(notification.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                        >
                          <StopCircle className="h-4 w-4 mr-2" />
                          إيقاف الإشعار
                        </Button>
                      ) : notification.status === "stopped" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResumeNotification(notification.id)}
                          className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          استئناف الإشعار
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stop Notification Dialog */}
          <AlertDialog open={stopDialogOpen !== null} onOpenChange={(open) => !open && setStopDialogOpen(null)}>
            <AlertDialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>إيقاف الإشعار</AlertDialogTitle>
                <AlertDialogDescription className="text-white/70">
                  هل أنت متأكد من إيقاف هذا الإشعار؟ سيتم إخفاؤه من جميع المستخدمين.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/5 hover:bg-white/10 text-white border-white/20">
                  إلغاء
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => stopDialogOpen && handleStopNotification(stopDialogOpen)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  إيقاف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default AdminNotifications;
