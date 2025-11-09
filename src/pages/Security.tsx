import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, Key, ArrowRight, Bell, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
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

// Password strength calculator
const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
};

const getPasswordStrengthLabel = (strength: number, t: any): string => {
  const labels = [t('security.veryWeak'), t('security.weak'), t('security.medium'), t('security.strong'), t('security.veryStrong')];
  return labels[Math.max(0, strength - 1)] || labels[0];
};

const getPasswordStrengthColor = (strength: number): string => {
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  return colors[Math.max(0, strength - 1)] || colors[0];
};

const Security = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [twoFactor, setTwoFactor] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: { current_password: string; password: string; password_confirmation: string }) =>
      authApi.updatePassword(data),
    onSuccess: () => {
      toast.success(t('security.passwordUpdateSuccess'));
      setPasswordData({ current_password: "", password: "", password_confirmation: "" });
      setIsConfirmOpen(false);
    },
    onError: (error: any) => {
      const errorData = error.data || {};
      
      if (errorData.error_code === 'TOO_MANY_ATTEMPTS') {
        const retryAfter = errorData.retry_after || 15;
        toast.error(t('security.tooManyAttempts', { minutes: retryAfter }), {
          duration: 8000,
        });
      } else if (errorData.error_code === 'INVALID_CURRENT_PASSWORD' && errorData.attempts_remaining !== undefined) {
        toast.error(`${error.message || t('security.invalidCurrentPassword')}\n${t('security.attemptsRemaining')}: ${errorData.attempts_remaining}`, {
          duration: 6000,
        });
      } else {
        toast.error(error.message || t('security.passwordUpdateError'));
      }
    },
  });

  const handlePasswordChangeClick = () => {
    // Validate current password
    if (!passwordData.current_password) {
      toast.error(t('security.currentPasswordRequired'));
      return;
    }

    // Validate new password length
    if (!passwordData.password || passwordData.password.length < 8) {
      toast.error(t('security.newPasswordTooShort'));
      return;
    }

    // Check password strength
    const strength = getPasswordStrength(passwordData.password);
    if (strength < 3) {
      toast.error(t('security.passwordWeakMix'), {
        duration: 5000,
      });
      return;
    }

    // Check for uppercase
    if (!/[A-Z]/.test(passwordData.password)) {
      toast.error(t('security.needUppercase'));
      return;
    }

    // Check for lowercase
    if (!/[a-z]/.test(passwordData.password)) {
      toast.error(t('security.needLowercase'));
      return;
    }

    // Check for number
    if (!/[0-9]/.test(passwordData.password)) {
      toast.error(t('security.needNumber'));
      return;
    }

    // Check for special character
    if (!/[^a-zA-Z0-9]/.test(passwordData.password)) {
      toast.error(t('security.needSymbol'));
      return;
    }

    // Check password confirmation
    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error(t('security.passwordsNotMatch'));
      return;
    }

    // Show confirmation dialog
    setIsConfirmOpen(true);
  };

  const handlePasswordChangeConfirm = () => {
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
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 pr-10"
                    placeholder="أدخل كلمة المرور الحالية"
                    disabled={updatePasswordMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    disabled={updatePasswordMutation.isPending}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white">كلمة المرور الجديدة</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 pr-10"
                    placeholder="أدخل كلمة المرور الجديدة (8 أحرف على الأقل)"
                    disabled={updatePasswordMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    disabled={updatePasswordMutation.isPending}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password strength indicator */}
                {passwordData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((level) => {
                        const strength = getPasswordStrength(passwordData.password);
                        return (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded transition-colors ${
                              level < strength 
                                ? getPasswordStrengthColor(strength)
                                : 'bg-white/10'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-white/60">
                        القوة: <span className="font-semibold">
                          {getPasswordStrengthLabel(getPasswordStrength(passwordData.password))}
                        </span>
                      </p>
                      <p className="text-xs text-white/40">
                        يجب: أحرف كبيرة، صغيرة، أرقام، رموز خاصة
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.password_confirmation}
                    onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 pr-10"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    disabled={updatePasswordMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    disabled={updatePasswordMutation.isPending}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button 
                onClick={handlePasswordChangeClick}
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

          {/* Confirmation Dialog */}
          <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent className="bg-[hsl(200,70%,15%)] border-white/20">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white text-right">تأكيد تغيير كلمة المرور</AlertDialogTitle>
                <AlertDialogDescription className="text-white/80 text-right">
                  {t('security.changePasswordConfirm')}
                  <br /><br />
                  <strong className="text-yellow-400">{t('security.securityWarning')}</strong>
                  <br />
                  {t('security.logoutOtherDevices')}
                  <br />
                  {t('security.needRelogin')}
                  <br />
                  {t('security.emailNotification')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel 
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  disabled={updatePasswordMutation.isPending}
                >
                  {t('common.cancel')}
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handlePasswordChangeConfirm}
                  className="bg-[hsl(195,80%,50%)] text-white hover:bg-[hsl(195,80%,60%)]"
                  disabled={updatePasswordMutation.isPending}
                >
                  {updatePasswordMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      {t('security.updating')}
                    </>
                  ) : (
                    t('security.confirmChange')
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Two-Factor Authentication - Coming Soon */}
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm opacity-60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{t('security.twoFactorComingSoon')}</h2>
                <p className="text-sm text-white/60">{t('security.twoFactorDesc')}</p>
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
                <h2 className="text-xl font-bold text-white">{t('security.privacyComingSoon')}</h2>
                <p className="text-sm text-white/60">{t('security.privacyDesc')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{t('security.emailNotificationsSetting')}</p>
                  <p className="text-sm text-white/60">{t('security.receiveEmailUpdates')}</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  disabled
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{t('security.loginAlerts')}</p>
                  <p className="text-sm text-white/60">{t('security.newLoginNotification')}</p>
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
