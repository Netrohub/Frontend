import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { Settings as SettingsIcon, Save, Shield, DollarSign, Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const AdminSettings = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  
  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => settingsApi.getAll(),
  });

  const allSettings = settingsResponse || {};
  
  // State for form values
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [escrowHours, setEscrowHours] = useState('72');
  const [minWithdrawal, setMinWithdrawal] = useState('100');
  const [platformFee, setPlatformFee] = useState('5');
  const [withdrawalFee, setWithdrawalFee] = useState('5');
  
  // Track original values for change detection
  const [originalValues, setOriginalValues] = useState<any>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings when data is available
  useEffect(() => {
    if (allSettings.general) {
      const general = allSettings.general;
      const nameValue = general.find((s: any) => s.key === 'site_name')?.value || 'NXOLand';
      const descValue = general.find((s: any) => s.key === 'site_description')?.value || '';
      const maintenanceValue = general.find((s: any) => s.key === 'maintenance_mode')?.value === 'true';
      
      setSiteName(nameValue);
      setSiteDescription(descValue);
      setMaintenanceMode(maintenanceValue);
      
      setOriginalValues(prev => ({
        ...prev,
        siteName: nameValue,
        siteDescription: descValue,
        maintenanceMode: maintenanceValue,
      }));
    }
    if (allSettings.security) {
      const escrowValue = allSettings.security.find((s: any) => s.key === 'escrow_hold_hours')?.value || '72';
      setEscrowHours(escrowValue);
      setOriginalValues(prev => ({ ...prev, escrowHours: escrowValue }));
    }
    if (allSettings.payments) {
      const minWithdrawValue = allSettings.payments.find((s: any) => s.key === 'min_withdrawal_amount')?.value || '100';
      const feeValue = allSettings.payments.find((s: any) => s.key === 'platform_fee_percentage')?.value || '5';
      const withdrawalFeeValue = allSettings.payments.find((s: any) => s.key === 'withdrawal_fee_percentage')?.value || feeValue;
      
      setMinWithdrawal(minWithdrawValue);
      setPlatformFee(feeValue);
      setWithdrawalFee(withdrawalFeeValue);
      
      setOriginalValues(prev => ({
        ...prev,
        minWithdrawal: minWithdrawValue,
        platformFee: feeValue,
        withdrawalFee: withdrawalFeeValue,
      }));
    }
  }, [allSettings]);

  // Detect changes
  useEffect(() => {
    const changed = 
      siteName !== originalValues.siteName ||
      siteDescription !== originalValues.siteDescription ||
      maintenanceMode !== originalValues.maintenanceMode ||
      escrowHours !== originalValues.escrowHours ||
      minWithdrawal !== originalValues.minWithdrawal ||
      platformFee !== originalValues.platformFee ||
      withdrawalFee !== originalValues.withdrawalFee;
    
    setHasChanges(changed);
  }, [siteName, siteDescription, maintenanceMode, escrowHours, minWithdrawal, platformFee, originalValues]);

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: Array<{ key: string; value: any }>) =>
      settingsApi.bulkUpdate(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success("تم حفظ الإعدادات بنجاح");
      setShowConfirmDialog(false);
      setHasChanges(false);
    },
    onError: () => {
      toast.error("فشل حفظ الإعدادات");
      setShowConfirmDialog(false);
    },
  });

  const handleSaveClick = () => {
    // Validate inputs
    const escrowNum = Number(escrowHours);
    const minWithdrawNum = Number(minWithdrawal);
    const feeNum = Number(platformFee);

    if (escrowNum < 1 || escrowNum > 720) {
      toast.error("فترة الضمان يجب أن تكون بين 1 و 720 ساعة");
      return;
    }
    if (minWithdrawNum < 10 || minWithdrawNum > 10000) {
      toast.error("الحد الأدنى للسحب يجب أن يكون بين $10 و $10,000");
      return;
    }
    if (feeNum < 0 || feeNum > 20) {
      toast.error("نسبة العمولة يجب أن تكون بين 0% و 20%");
      return;
    }
    const withdrawalFeeNum = Number(withdrawalFee);
    if (withdrawalFeeNum < 0 || withdrawalFeeNum > 20) {
      toast.error("نسبة رسوم السحب يجب أن تكون بين 0% و 20%");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmSave = () => {
    const settings = [
      { key: 'site_name', value: siteName },
      { key: 'site_description', value: siteDescription },
      { key: 'maintenance_mode', value: maintenanceMode },
      { key: 'escrow_hold_hours', value: escrowHours },
      { key: 'min_withdrawal_amount', value: minWithdrawal },
      { key: 'platform_fee_percentage', value: platformFee },
      { key: 'withdrawal_fee_percentage', value: withdrawalFee },
    ];
    
    updateSettingsMutation.mutate(settings);
  };

  const handleResetDefaults = () => {
    setSiteName('NXOLand');
    setSiteDescription('منصة آمنة لبيع وشراء حسابات الألعاب');
    setMaintenanceMode(false);
    setEscrowHours('72');
    setMinWithdrawal('100');
    setPlatformFee('5');
    setWithdrawalFee('5');
    toast.success("تم إعادة تعيين القيم الافتراضية");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="إعدادات المنصة - NXOLand Admin"
        description="إدارة الإعدادات العامة للمنصة"
        noIndex={true}
      />
      <div>
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">إعدادات المنصة</h1>
            <p className="text-white/60">إدارة الإعدادات العامة للمنصة</p>
          </div>
          {hasChanges && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              تغييرات غير محفوظة
            </Badge>
          )}
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <SettingsIcon className="h-6 w-6 text-[hsl(195,80%,70%)]" />
              <h2 className="text-xl font-bold text-white">الإعدادات العامة</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="siteName" className="text-white/80">اسم المنصة</Label>
                <Input 
                  id="siteName"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="mt-2 bg-white/5 border-white/10 text-white"
                  maxLength={100}
                />
              </div>
              
              <div>
                <Label htmlFor="siteDesc" className="text-white/80">وصف المنصة</Label>
                <Textarea 
                  id="siteDesc"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  className="mt-2 bg-white/5 border-white/10 text-white"
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="flex items-center justify-between pt-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div>
                  <Label className="text-white/80 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    وضع الصيانة
                  </Label>
                  <p className="text-sm text-red-400 mt-1">⚠️ سيتم تعطيل المنصة للجميع ما عدا المديرين</p>
                </div>
                <Switch 
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">إعدادات الأمان</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="escrowHours" className="text-white/80">فترة حجز الضمان (ساعات)</Label>
                <Input 
                  id="escrowHours"
                  type="number"
                  min="1"
                  max="720"
                  value={escrowHours}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(720, Number(e.target.value) || 1));
                    setEscrowHours(value.toString());
                  }}
                  className="mt-2 bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-white/50 mt-1">الفترة الافتراضية لحجز الأموال في الضمان قبل تحريرها (1-720 ساعة)</p>
              </div>
            </div>
          </Card>

          {/* Payment Settings */}
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="h-6 w-6 text-[hsl(120,60%,70%)]" />
              <h2 className="text-xl font-bold text-white">إعدادات الدفع</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="commission" className="text-white/80">نسبة العمولة (%)</Label>
                <Input 
                  id="commission"
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={platformFee}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(20, Number(e.target.value) || 0));
                    setPlatformFee(value.toString());
                  }}
                  className="mt-2 bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-white/50 mt-1">نسبة عمولة المنصة من كل عملية (0-20%)</p>
              </div>

              <div>
                <Label htmlFor="minWithdraw" className="text-white/80">الحد الأدنى للسحب (USD)</Label>
                <Input 
                  id="minWithdraw"
                  type="number"
                  min="10"
                  max="10000"
                  value={minWithdrawal}
                  onChange={(e) => {
                    const value = Math.max(10, Math.min(10000, Number(e.target.value) || 10));
                    setMinWithdrawal(value.toString());
                  }}
                  className="mt-2 bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-white/50 mt-1">الحد الأدنى لسحب الأموال من المحفظة ($10-$10,000)</p>
              </div>

              <div>
                <Label htmlFor="withdrawalFee" className="text-white/80">نسبة رسوم السحب (%)</Label>
                <Input 
                  id="withdrawalFee"
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={withdrawalFee}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(20, Number(e.target.value) || 0));
                    setWithdrawalFee(value.toString());
                  }}
                  className="mt-2 bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-white/50 mt-1">نسبة الرسوم المقتطعة من كل عملية سحب (0-20%). إذا لم يتم تحديدها، سيتم استخدام نسبة عمولة المنصة.</p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button 
              onClick={handleResetDefaults}
              variant="outline"
              className="gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20"
            >
              <RotateCcw className="h-4 w-4" />
              إعادة تعيين الافتراضيات
            </Button>
            
            <Button 
              onClick={handleSaveClick}
              disabled={updateSettingsMutation.isPending || !hasChanges}
              className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0 px-8"
            >
              {updateSettingsMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">تأكيد حفظ الإعدادات</AlertDialogTitle>
              <AlertDialogDescription className="text-white/70">
                هل أنت متأكد من حفظ هذه التغييرات؟ بعض الإعدادات قد تؤثر على جميع المستخدمين.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            {/* Show warnings for critical changes */}
            {maintenanceMode && maintenanceMode !== originalValues.maintenanceMode && (
              <Card className="p-4 bg-red-500/20 border-red-500/40">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-bold mb-1">تحذير: تفعيل وضع الصيانة</p>
                    <p className="text-red-300 text-sm">
                      سيتم تعطيل المنصة بالكامل لجميع المستخدمين. فقط المديرون يمكنهم الدخول.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {Number(platformFee) !== Number(originalValues.platformFee) && (
              <Card className="p-3 bg-yellow-500/10 border-yellow-500/30">
                <p className="text-yellow-400 text-sm">
                  ℹ️ تغيير نسبة العمولة سيؤثر على جميع العمليات الجديدة
                </p>
              </Card>
            )}
            
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                إلغاء
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmSave}
                disabled={updateSettingsMutation.isPending}
                className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white"
              >
                {updateSettingsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'تأكيد الحفظ'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default AdminSettings;
