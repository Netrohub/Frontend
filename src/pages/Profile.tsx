import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Snowflake, User, Mail, Phone, Shield, Package, LogOut, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { MobileNav } from "@/components/MobileNav";
import { BottomNav } from "@/components/BottomNav";
import { NotificationBell } from "@/components/NotificationBell";

const Profile = () => {
  // Mock user data
  const user = {
    name: "محمد أحمد",
    email: "mohamed@example.com",
    phone: "+966 50 123 4567",
    rating: 4.8,
    totalSales: 23,
    totalPurchases: 15,
    memberSince: "يناير 2024",
    kycVerified: true,
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/10 backdrop-blur-md bg-[hsl(200,70%,15%,0.5)]">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Snowflake className="h-8 w-8 text-[hsl(195,80%,70%)]" />
          <span className="text-xl md:text-2xl font-black text-white">
            NXO<span className="text-[hsl(40,90%,55%)]">Land</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <MobileNav />
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">الملف الشخصي</h1>
          <p className="text-white/60">إدارة معلوماتك وإعداداتك</p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 md:p-8 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              {user.kycVerified && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-green-500">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-2xl font-black text-white mb-2">{user.name}</h2>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Star className="h-5 w-5 text-[hsl(40,90%,55%)] fill-current" />
                <span className="text-lg font-bold text-white">{user.rating}</span>
                <span className="text-white/60">تقييم</span>
              </div>
              {user.kycVerified ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Shield className="h-3 w-3 ml-1" />
                  حساب موثق
                </Badge>
              ) : (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  يتطلب توثيق KYC
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-black text-[hsl(195,80%,70%)] mb-1">{user.totalSales}</div>
              <div className="text-sm text-white/60">عدد المبيعات</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-black text-[hsl(195,80%,70%)] mb-1">{user.totalPurchases}</div>
              <div className="text-sm text-white/60">عدد المشتريات</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-black text-[hsl(195,80%,70%)] mb-1">{user.memberSince}</div>
              <div className="text-sm text-white/60">عضو منذ</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <Mail className="h-5 w-5 text-[hsl(195,80%,70%)]" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Phone className="h-5 w-5 text-[hsl(195,80%,70%)]" />
              <span>{user.phone}</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {!user.kycVerified && (
            <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 backdrop-blur-sm group hover:border-yellow-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">توثيق الحساب</h3>
                  <p className="text-sm text-white/70">مطلوب للبيع على المنصة</p>
                </div>
                <Shield className="h-8 w-8 text-yellow-400" />
              </div>
              <Button asChild className="w-full gap-2 bg-yellow-500 hover:bg-yellow-600 text-white border-0 min-h-[48px] text-sm md:text-base">
                <Link to="/kyc">
                  بدء التوثيق
                </Link>
              </Button>
            </Card>
          )}

          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm group hover:border-[hsl(195,80%,70%,0.5)] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">قوائمي</h3>
                <p className="text-sm text-white/70">إدارة حساباتي المعروضة</p>
              </div>
              <Package className="h-8 w-8 text-[hsl(195,80%,70%)]" />
            </div>
            <Button asChild className="w-full gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0 min-h-[48px] text-sm md:text-base">
              <Link to="/my-listings">
                عرض قوائمي
              </Link>
            </Button>
          </Card>
        </div>

        {/* Account Actions */}
        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4">إجراءات الحساب</h3>
          <div className="space-y-3">
            <Button 
              asChild
              variant="outline" 
              className="w-full justify-start gap-3 bg-white/5 hover:bg-white/10 text-white border-white/20 min-h-[48px] text-sm md:text-base"
            >
              <Link to="/edit-profile">
                <User className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">تعديل الملف الشخصي</span>
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="w-full justify-start gap-3 bg-white/5 hover:bg-white/10 text-white border-white/20 min-h-[48px] text-sm md:text-base"
            >
              <Link to="/security">
                <Shield className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">الأمان والخصوصية</span>
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="w-full justify-start gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30 min-h-[48px] text-sm md:text-base"
            >
              <Link to="/">
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">تسجيل الخروج</span>
              </Link>
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

export default Profile;
