import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Shield, Package, LogOut, CheckCircle, Loader2, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api";

const Profile = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Get user statistics from API
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => authApi.getUserStats(),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 text-center">
          <p className="text-white/60 mb-4">يجب تسجيل الدخول لعرض الملف الشخصي</p>
          <Button asChild>
            <Link to="/auth">تسجيل الدخول</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Format member since date (Gregorian/English format)
  const memberSince = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'غير محدد';

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />

      {/* Navigation */}
      <Navbar />

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
              {user.kyc_verification?.status === 'verified' && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-green-500">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-2xl font-black text-white mb-2">{user.name}</h2>
              {statsLoading ? (
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Loader2 className="h-4 w-4 animate-spin text-white/60" />
                  <span className="text-sm text-white/60">جاري التحميل...</span>
                </div>
              ) : userStats && userStats.total_revenue > 0 ? (
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-lg font-bold text-white">${userStats.total_revenue.toLocaleString('en-US')}</span>
                  <span className="text-white/60">إجمالي الأرباح</span>
                </div>
              ) : null}
              {user.kyc_verification?.status === 'verified' ? (
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
              <div className="text-2xl font-black text-[hsl(195,80%,70%)] mb-1">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-white/60" /> : (userStats?.total_sales || 0)}
              </div>
              <div className="text-sm text-white/60">عدد المبيعات</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-black text-[hsl(195,80%,70%)] mb-1">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-white/60" /> : (userStats?.total_purchases || 0)}
              </div>
              <div className="text-sm text-white/60">عدد المشتريات</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-black text-[hsl(195,80%,70%)] mb-1">{memberSince}</div>
              <div className="text-sm text-white/60">عضو منذ</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <Mail className="h-5 w-5 text-[hsl(195,80%,70%)]" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 text-white/80">
                <Phone className="h-5 w-5 text-[hsl(195,80%,70%)]" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {user.kyc_verification?.status !== 'verified' && (
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
              variant="outline" 
              className="w-full justify-start gap-3 bg-white/5 text-white/40 border-white/10 cursor-not-allowed min-h-[48px] text-sm md:text-base"
              disabled
              title="قريباً"
            >
              <User className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">تعديل الملف الشخصي (قريباً)</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 bg-white/5 text-white/40 border-white/10 cursor-not-allowed min-h-[48px] text-sm md:text-base"
              disabled
              title="قريباً"
            >
              <Shield className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">الأمان والخصوصية (قريباً)</span>
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full justify-start gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30 min-h-[48px] text-sm md:text-base"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">تسجيل الخروج</span>
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
