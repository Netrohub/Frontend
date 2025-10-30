import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, ArrowRight, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

const EditProfile = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "محمد أحمد",
    email: "mohamed@example.com",
    phone: "+966 50 123 4567",
  });

  const handleSave = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم تحديث معلومات الملف الشخصي",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-2xl pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/profile" className="inline-flex items-center gap-2 text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] transition-colors mb-4">
            <ArrowRight className="h-5 w-5" />
            <span>العودة للملف الشخصي</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">تعديل الملف الشخصي</h1>
          <p className="text-white/60">قم بتحديث معلوماتك الشخصية</p>
        </div>

        {/* Edit Form */}
        <Card className="p-6 md:p-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-white/10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <Button variant="outline" className="bg-white/5 hover:bg-white/10 text-white border-white/20">
                تغيير الصورة
              </Button>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pr-12 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pr-12 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">رقم الهاتف</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pr-12 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSave}
              className="w-full gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
            >
              <Save className="h-5 w-5" />
              حفظ التغييرات
            </Button>
          </div>
        </Card>
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
      
      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
};

export default EditProfile;
