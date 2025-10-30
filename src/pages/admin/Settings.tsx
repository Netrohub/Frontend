import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save, Shield, Bell, DollarSign, Mail } from "lucide-react";

const AdminSettings = () => {
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
                defaultValue="NXOLand"
                className="mt-2 bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="siteDesc" className="text-white/80">وصف المنصة</Label>
              <Textarea 
                id="siteDesc"
                defaultValue="منصة آمنة لبيع وشراء حسابات الألعاب"
                className="mt-2 bg-white/5 border-white/10 text-white"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="text-white/80">وضع الصيانة</Label>
                <p className="text-sm text-white/60">تفعيل وضع الصيانة للمنصة</p>
              </div>
              <Switch />
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
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/80">التحقق بخطوتين</Label>
                <p className="text-sm text-white/60">إجبار المستخدمين على التحقق بخطوتين</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/80">التوثيق التلقائي</Label>
                <p className="text-sm text-white/60">تفعيل التوثيق التلقائي عبر Persona</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div>
              <Label htmlFor="minAge" className="text-white/80">الحد الأدنى للعمر</Label>
              <Input 
                id="minAge"
                type="number"
                defaultValue="18"
                className="mt-2 bg-white/5 border-white/10 text-white"
              />
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
                defaultValue="5"
                className="mt-2 bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="minWithdraw" className="text-white/80">الحد الأدنى للسحب (ريال)</Label>
              <Input 
                id="minWithdraw"
                type="number"
                defaultValue="100"
                className="mt-2 bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="text-white/80">الدفع الفوري</Label>
                <p className="text-sm text-white/60">تفعيل الدفع الفوري للبائعين</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">إعدادات الإشعارات</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/80">إشعارات البريد الإلكتروني</Label>
                <p className="text-sm text-white/60">إرسال إشعارات عبر البريد</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/80">إشعارات SMS</Label>
                <p className="text-sm text-white/60">إرسال إشعارات عبر الرسائل النصية</p>
              </div>
              <Switch />
            </div>

            <div>
              <Label htmlFor="adminEmail" className="text-white/80">بريد المدير</Label>
              <div className="flex gap-2 mt-2">
                <Mail className="h-5 w-5 text-white/40 mt-2" />
                <Input 
                  id="adminEmail"
                  type="email"
                  defaultValue="admin@nxoland.com"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0 px-8">
            <Save className="h-5 w-5" />
            حفظ التغييرات
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;