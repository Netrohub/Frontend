import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save, Shield, Bell, DollarSign, Mail, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const AdminSettings = () => {
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

  // Load settings when data is available
  useEffect(() => {
    if (allSettings.general) {
      const general = allSettings.general;
      setSiteName(general.find((s: any) => s.key === 'site_name')?.value || '');
      setSiteDescription(general.find((s: any) => s.key === 'site_description')?.value || '');
      setMaintenanceMode(general.find((s: any) => s.key === 'maintenance_mode')?.value === 'true');
    }
    if (allSettings.security) {
      setEscrowHours(allSettings.security.find((s: any) => s.key === 'escrow_hold_hours')?.value || '72');
    }
    if (allSettings.payments) {
      setMinWithdrawal(allSettings.payments.find((s: any) => s.key === 'min_withdrawal_amount')?.value || '100');
      setPlatformFee(allSettings.payments.find((s: any) => s.key === 'platform_fee_percentage')?.value || '5');
    }
  }, [allSettings]);

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: Array<{ key: string; value: any }>) =>
      settingsApi.bulkUpdate(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success("تم حفظ الإعدادات بنجاح");
    },
    onError: () => {
      toast.error("فشل حفظ الإعدادات");
    },
  });

  const handleSave = () => {
    const settings = [
      { key: 'site_name', value: siteName },
      { key: 'site_description', value: siteDescription },
      { key: 'maintenance_mode', value: maintenanceMode },
      { key: 'escrow_hold_hours', value: escrowHours },
      { key: 'min_withdrawal_amount', value: minWithdrawal },
      { key: 'platform_fee_percentage', value: platformFee },
    ];
    
    updateSettingsMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">إعدادات المنصة</h1>
        <p className="text-white/60">إدارة الإعدادات العامة للمنصة</p>
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
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="text-white/80">وضع الصيانة</Label>
                <p className="text-sm text-white/60">تفعيل وضع الصيانة للمنصة</p>
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
                value={escrowHours}
                onChange={(e) => setEscrowHours(e.target.value)}
                className="mt-2 bg-white/5 border-white/10 text-white"
              />
              <p className="text-xs text-white/50 mt-1">الفترة الافتراضية لحجز الأموال في الضمان قبل تحريرها</p>
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
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                className="mt-2 bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="minWithdraw" className="text-white/80">الحد الأدنى للسحب (ريال)</Label>
              <Input 
                id="minWithdraw"
                type="number"
                value={minWithdrawal}
                onChange={(e) => setMinWithdrawal(e.target.value)}
                className="mt-2 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button 
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
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
    </div>
  );
};

export default AdminSettings;