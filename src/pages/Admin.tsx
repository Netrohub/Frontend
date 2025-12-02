import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, ShieldCheck, DollarSign, Package, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AdminNavbar } from "@/components/AdminNavbar";
import { adminApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { getStaticImageUrl } from "@/lib/cloudflareImages";

const Admin = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const isRootAdmin = location.pathname === "/admin";

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats(),
    enabled: isRootAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: () => adminApi.getActivity(),
    enabled: isRootAdmin,
    staleTime: 60 * 1000, // 1 minute
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[hsl(200,70%,15%,0.95)] backdrop-blur-sm border-b border-white/10">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img 
            src={getStaticImageUrl('LOGO', 'public') || '/nxoland-new-logo.png'} 
            alt="NXOLand Logo" 
            width="40"
            height="40"
            className="h-8 w-8"
            style={{ objectFit: 'contain', aspectRatio: '1/1' }}
            loading="eager"
            fetchPriority="high"
            onError={(e) => {
              // Fallback to local logo if Cloudflare image fails
              const img = e.target as HTMLImageElement;
              if (img.src.includes('imagedelivery.net')) {
                img.src = '/nxoland-official-logo.png';
              }
            }}
          />
        </Link>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          لوحة الإدارة
        </Badge>
      </nav>

      {/* Admin Navigation Bar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        {isRootAdmin ? (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">لوحة المعلومات</h1>
              <p className="text-white/60">نظرة عامة على المنصة</p>
            </div>

            {/* Stats Grid */}
            {statsLoading ? (
              <div className="flex justify-center items-center min-h-[200px] mb-8">
                <Loader2 className="h-8 w-8 animate-spin text-white/60" />
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-5 bg-[hsl(195,80%,20%)] border-[hsl(195,80%,50%)] backdrop-blur-sm hover:border-[hsl(195,80%,60%)] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <Users className="h-8 w-8 text-[hsl(195,80%,70%)]" />
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">{stats?.total_users?.toLocaleString('en-US') || 0}</div>
                <div className="text-sm text-white/90 mb-2">إجمالي المستخدمين</div>
                <div className={`text-xs font-medium ${stats?.users_growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats?.users_growth > 0 ? '+' : ''}{stats?.users_growth || 0}% من الشهر الماضي
                </div>
              </Card>

              <Card className="p-5 bg-[hsl(280,70%,20%)] border-[hsl(280,70%,50%)] backdrop-blur-sm hover:border-[hsl(280,70%,60%)] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <Package className="h-8 w-8 text-[hsl(280,70%,70%)]" />
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">{stats?.active_listings?.toLocaleString('en-US') || 0}</div>
                <div className="text-sm text-white/90 mb-2">الإعلانات النشطة</div>
                <div className={`text-xs font-medium ${stats?.listings_growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats?.listings_growth > 0 ? '+' : ''}{stats?.listings_growth || 0}% من الشهر الماضي
                </div>
              </Card>

              <Card className="p-5 bg-[hsl(40,90%,20%)] border-[hsl(40,90%,50%)] backdrop-blur-sm hover:border-[hsl(40,90%,60%)] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <ShoppingCart className="h-8 w-8 text-[hsl(40,90%,70%)]" />
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">{stats?.orders_this_month?.toLocaleString('en-US') || 0}</div>
                <div className="text-sm text-white/90 mb-2">الطلبات هذا الشهر</div>
                <div className={`text-xs font-medium ${stats?.orders_growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats?.orders_growth > 0 ? '+' : ''}{stats?.orders_growth || 0}% من الشهر الماضي
                </div>
              </Card>

              <Card className="p-5 bg-[hsl(120,60%,20%)] border-[hsl(120,60%,50%)] backdrop-blur-sm hover:border-[hsl(120,60%,60%)] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="h-8 w-8 text-[hsl(120,60%,70%)]" />
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">${stats?.total_revenue?.toLocaleString('en-US') || 0}</div>
                <div className="text-sm text-white/90 mb-2">الإيرادات (USD)</div>
                <div className={`text-xs font-medium ${stats?.revenue_growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats?.revenue_growth > 0 ? '+' : ''}{stats?.revenue_growth || 0}% من الشهر الماضي
                </div>
              </Card>
            </div>
            )}

            {/* Quick Actions */}
            {!statsLoading && stats && stats.open_disputes > 0 && (
            <div className="mb-8">
              <Card className="p-5 bg-[hsl(40,80%,20%)] border-[hsl(40,90%,50%)] backdrop-blur-sm hover:border-[hsl(40,90%,60%)] transition-all max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-[hsl(40,90%,60%)]" />
                  <h2 className="text-xl font-bold text-white">النزاعات المفتوحة</h2>
                  <Badge className="bg-[hsl(40,90%,30%)] text-white border-[hsl(40,90%,50%)] mr-auto">
                    {stats.open_disputes} نزاع
                  </Badge>
                </div>
                <p className="text-white/80 text-sm mb-4">يوجد {stats.open_disputes} نزاع يحتاج إلى مراجعة وحل</p>
                <Link to="/admin/disputes">
                  <button className="w-full py-2 bg-[hsl(40,90%,30%)] hover:bg-[hsl(40,90%,35%)] text-white rounded-lg transition-colors border border-[hsl(40,90%,50%)]">
                    عرض جميع النزاعات
                  </button>
                </Link>
              </Card>
            </div>
            )}

            {/* Recent Activity */}
            <Card className="p-6 bg-[hsl(200,70%,18%)] border-white/20 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-4">النشاط الأخير</h2>
              {activityLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-white/60" />
                </div>
              ) : activityData && activityData.length > 0 ? (
                <div className="space-y-3">
                  {activityData.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20 hover:border-white/30 transition-colors">
                      <div>
                        <div className={`font-medium ${item.color}`}>{item.action}</div>
                        <div className="text-sm text-white/90">{item.user}</div>
                      </div>
                      <div className="text-xs text-white/70">{formatTime(item.timestamp)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/60">
                  <p>لا يوجد نشاط حديث</p>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Admin;
