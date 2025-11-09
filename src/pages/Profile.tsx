import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Package, 
  LogOut, 
  Star, 
  CheckCircle,
  AlertCircle,
  Wallet,
  RefreshCw,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { ErrorState } from "@/components/ErrorState";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

const Profile = () => {
  const { user, loading, logout } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Get user statistics from API
  const { data: userStats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => authApi.getUserStats(),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });

  // Get user activity from API  
  const { data: activities, isLoading: activityLoading, error: activityError, refetch: refetchActivity } = useQuery({
    queryKey: ['user-activity'],
    queryFn: () => authApi.getUserActivity(),
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });

  // Get wallet data (if it exists in user object)
  const userWallet = user?.wallet;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order_created":
      case "order_completed":
        return <ShoppingCart className="h-5 w-5 text-[hsl(195,80%,70%)]" aria-hidden="true" />;
      case "listing_created":
        return <Package className="h-5 w-5 text-[hsl(195,80%,70%)]" aria-hidden="true" />;
      case "kyc_verified":
        return <Shield className="h-5 w-5 text-green-400" aria-hidden="true" />;
      case "withdrawal_completed":
        return <DollarSign className="h-5 w-5 text-green-400" aria-hidden="true" />;
      default:
        return <Star className="h-5 w-5 text-[hsl(195,80%,70%)]" aria-hidden="true" />;
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return t('profile.minutesAgo');
    } else if (diffHours < 24) {
      return t('profile.hoursAgo', { hours: diffHours });
    } else if (diffDays === 1) {
      return t('profile.oneDayAgo');
    } else {
      return t('profile.daysAgo', { days: diffDays });
    }
  };

  const handleRefreshStats = () => {
    refetchStats();
    toast.success(t('profile.statsRefreshed'));
  };

  const handleRefreshActivity = () => {
    refetchActivity();
    toast.success(t('profile.activityRefreshed'));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Format member since date (Gregorian/English format)
  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'غير محدد';

  if (loading) {
    return (
      <>
        <SEO title={`${t('profile.title')} - NXOLand`} />
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <Navbar />
          <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" aria-hidden="true" />
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <SEO title={`${t('profile.title')} - NXOLand`} />
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <Navbar />
          <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 text-center">
            <p className="text-white/60 mb-4">{t('profile.loginRequired')}</p>
            <Button asChild>
              <Link to="/auth">{t('auth.login')}</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${user.name} - ${t('profile.seoTitle')} - NXOLand`}
        description={t('profile.seoDescription', { name: user.name })}
      />
      <div className="min-h-screen relative overflow-hidden" dir="rtl">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />

        {/* Skip link for keyboard navigation */}
        <a 
          href="#profile-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          تخطي إلى المحتوى
        </a>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div id="profile-content" className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{t('profile.pageTitle')}</h1>
          <p className="text-white/60">{t('profile.manageInfo')}</p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 md:p-8 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center">
                <User className="h-12 w-12 text-white" aria-hidden="true" />
              </div>
              {user.kyc_verification?.status === 'verified' && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-green-500">
                  <CheckCircle className="h-5 w-5 text-white" aria-label="موثق" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-2xl font-black text-white mb-2">{user.name}</h2>
              
              {/* Rating Display - Only show if reviews exist */}
              {statsLoading ? (
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Loader2 className="h-4 w-4 animate-spin text-white/60" aria-hidden="true" />
                  <span className="text-sm text-white/60">جاري التحميل...</span>
                </div>
              ) : userStats && userStats.average_rating && userStats.total_reviews > 0 ? (
                <Link 
                  to={`/reviews/${user.id}`}
                  className="flex items-center justify-center md:justify-start gap-2 mb-3 hover:opacity-80 transition-opacity"
                >
                  <Star className="h-5 w-5 text-[hsl(40,90%,55%)] fill-current" aria-hidden="true" />
                  <span className="text-lg font-bold text-white">{userStats.average_rating.toFixed(1)}</span>
                  <span className="text-white/60">({userStats.total_reviews} تقييم)</span>
                </Link>
              ) : userStats && userStats.total_revenue > 0 ? (
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-green-400" aria-hidden="true" />
                  <span className="text-lg font-bold text-white">${userStats.total_revenue.toLocaleString('en-US')}</span>
                  <span className="text-white/60">{t('profile.totalRevenue')}</span>
                </div>
              ) : null}
              
              {user.kyc_verification?.status === 'verified' ? (
                <StatusBadge status="success" label={t('profile.verifiedAccount')} />
              ) : (
                <StatusBadge status="warning" label={t('profile.requiresKYC')} />
              )}
            </div>
          </div>

          {/* Stats Section with Refresh Button */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">{t('profile.accountStats')}</h3>
            <Button
              onClick={handleRefreshStats}
              disabled={statsLoading}
              variant="ghost"
              size="sm"
              className="gap-2 text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)]"
              aria-label={t('profile.refreshStats')}
            >
              <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
              {t('profile.refresh')}
            </Button>
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-white/10">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="text-center p-4 bg-white/5 rounded-lg">
                  <Skeleton className="h-8 w-20 mx-auto mb-2 bg-white/10" />
                  <Skeleton className="h-4 w-24 mx-auto bg-white/10" />
                </div>
              ))}
            </div>
          ) : statsError ? (
            <ErrorState 
              message="فشل تحميل الإحصائيات" 
              onRetry={() => refetchStats()}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-black text-[hsl(195,80%,70%)] mb-1">{userStats?.total_sales || 0}</div>
                <div className="text-sm text-white/60">عدد المبيعات</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-black text-[hsl(195,80%,70%)] mb-1">{userStats?.total_purchases || 0}</div>
                <div className="text-sm text-white/60">عدد المشتريات</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-black text-[hsl(195,80%,70%)] mb-1">{memberSince}</div>
                <div className="text-sm text-white/60">عضو منذ</div>
              </div>
              
              {/* Wallet Balance Quick View */}
              <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Wallet className="h-5 w-5 text-green-400" aria-hidden="true" />
                  <div className="text-2xl font-black text-green-400">
                    ${userWallet?.available_balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                  </div>
                </div>
                <div className="text-sm text-white/60 mb-2">الرصيد المتاح</div>
                <Button 
                  asChild 
                  size="sm" 
                  variant="ghost"
                  className="h-auto py-1 text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10"
                >
                  <Link to="/wallet">عرض المحفظة →</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Contact Info with Verification Indicators */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <Mail className="h-5 w-5 text-[hsl(195,80%,70%)]" aria-hidden="true" />
              <span>{user.email}</span>
              {user.email_verified_at ? (
                <StatusBadge status="success" label="موثق" className="text-xs" />
              ) : (
                <StatusBadge status="warning" label="غير موثق" className="text-xs" />
              )}
            </div>
            
            {user.phone && (
              <div className="flex items-center gap-3 text-white/80">
                <Phone className="h-5 w-5 text-[hsl(195,80%,70%)]" aria-hidden="true" />
                <span>{user.phone}</span>
                {user.phone_verified_at ? (
                  <StatusBadge status="success" label="موثق" className="text-xs" />
                ) : (
                  <StatusBadge status="warning" label="غير موثق" className="text-xs" />
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">النشاط الأخير</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshActivity}
              disabled={activityLoading}
              className="text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)]"
              aria-label="تحديث النشاط"
            >
              <RefreshCw className={`h-4 w-4 ${activityLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            </Button>
          </div>
          
          {activityLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full bg-white/10" />)}
            </div>
          ) : activityError ? (
            <ErrorState 
              message="فشل تحميل النشاط" 
              onRetry={() => refetchActivity()}
            />
          ) : activities && activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((activity: any) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.title}</p>
                    <p className="text-white/60 text-xs">{formatRelativeTime(activity.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-30" aria-hidden="true" />
              <p>لا توجد أنشطة حديثة</p>
            </div>
          )}
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
                <Shield className="h-8 w-8 text-yellow-400" aria-hidden="true" />
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
              <Package className="h-8 w-8 text-[hsl(195,80%,70%)]" aria-hidden="true" />
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
                <User className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{t('profile.editProfileLink')}</span>
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="w-full justify-start gap-3 bg-white/5 hover:bg-white/10 text-white border-white/20 min-h-[48px] text-sm md:text-base"
            >
              <Link to="/security">
                <Shield className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">الأمان والخصوصية</span>
              </Link>
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full justify-start gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30 min-h-[48px] text-sm md:text-base"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">تسجيل الخروج</span>
            </Button>
          </div>
        </Card>
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" aria-hidden="true" />
        
        {/* Bottom Navigation for Mobile */}
        <BottomNav />
      </div>
    </>
  );
};

export default Profile;
