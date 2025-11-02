import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, Key, ArrowRight, Bell, Eye, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

const Security = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [twoFactor, setTwoFactor] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: { current_password: string; password: string; password_confirmation: string }) =>
      authApi.updatePassword(data),
    onSuccess: () => {
      toast.success("تم تحديث كلمة المرور بنجاح");
      setPasswordData({ current_password: "", password: "", password_confirmation: "" });
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل تحديث كلمة المرور");
    },
  });

  const handlePasswordChange = () => {
    if (!passwordData.current_password) {
      toast.error("يرجى إدخال كلمة المرور الحالية");
      return;
    }
    if (!passwordData.password || passwordData.password.length < 8) {
      toast.error("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error("كلمة المرور غير متطابقة");
      return;
    }

    updatePasswordMutation.mutate(passwordData);
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-3xl pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/profile" className="inline-flex items-center gap-2 text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] transition-colors mb-4">
            <ArrowRight className="h-5 w-5" />
            <span>العودة للملف الشخصي</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">الأمان والخصوصية</h1>
          <p className="text-white/60">إدارة إعدادات الأمان والخصوصية الخاصة بك</p>
        </div>

        <div className="space-y-6">
          {/* Password Section */}
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[hsl(195,80%,50%,0.2)]">
                <Lock className="h-6 w-6 text-[hsl(195,80%,70%)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">كلمة المرور</h2>
                <p className="text-sm text-white/60">تغيير كلمة المرور الخاصة بك</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-white">كلمة المرور الحالية</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="أدخل كلمة المرور الحالية"
                  disabled={updatePasswordMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white">كلمة المرور الجديدة</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="أدخل كلمة المرور الجديدة (8 أحرف على الأقل)"
                  disabled={updatePasswordMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">تأكيد كلمة المرور</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.password_confirmation}
                  onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  disabled={updatePasswordMutation.isPending}
                />
              </div>
              <Button 
                onClick={handlePasswordChange}
                disabled={updatePasswordMutation.isPending}
                className="w-full gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0 min-h-[48px]"
              >
                {updatePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  <>
                    <Key className="h-5 w-5" />
                    تحديث كلمة المرور
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Two-Factor Authentication - Coming Soon */}
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm opacity-60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">المصادقة الثنائية (قريباً)</h2>
                <p className="text-sm text-white/60">حماية إضافية لحسابك</p>
              </div>
              <Switch
                checked={twoFactor}
                onCheckedChange={setTwoFactor}
                disabled
              />
            </div>
          </Card>

          {/* Privacy Settings - Coming Soon */}
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm opacity-60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Eye className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">الخصوصية (قريباً)</h2>
                <p className="text-sm text-white/60">إدارة إعدادات الخصوصية</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">إشعارات البريد الإلكتروني</p>
                  <p className="text-sm text-white/60">تلقي التحديثات عبر البريد</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  disabled
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">تنبيهات تسجيل الدخول</p>
                  <p className="text-sm text-white/60">إشعار عند كل تسجيل دخول جديد</p>
                </div>
                <Switch
                  checked={loginAlerts}
                  onCheckedChange={setLoginAlerts}
                  disabled
                />
              </div>
            </div>
          </Card>

          {/* Sessions - Coming Soon */}
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm opacity-60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Bell className="h-6 w-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">الجلسات النشطة (قريباً)</h2>
                <p className="text-sm text-white/60">إدارة الأجهزة المتصلة</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">الجهاز الحالي</p>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">نشط الآن</span>
                </div>
                <p className="text-sm text-white/60">آخر نشاط: الآن</p>
              </div>
              <Button 
                variant="outline"
                className="w-full bg-red-500/10 text-red-400/40 border-red-500/20 cursor-not-allowed"
                disabled
              >
                إنهاء جميع الجلسات الأخرى (قريباً)
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
      
      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
};

export default Security;
