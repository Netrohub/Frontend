import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Snowflake, Users, AlertTriangle, ShieldCheck, DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

const Admin = () => {
  const location = useLocation();
  const isRootAdmin = location.pathname === "/admin";

  return (
    <SidebarProvider>
      <div className="min-h-screen relative overflow-hidden w-full" dir="rtl">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        
        {/* Snow particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDuration: `${10 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md bg-[hsl(200,70%,15%,0.5)]">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white" />
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Snowflake className="h-8 w-8 text-[hsl(195,80%,70%)]" />
              <span className="text-xl md:text-2xl font-black text-white">
                NXO<span className="text-[hsl(40,90%,55%)]">Land</span>
              </span>
            </Link>
          </div>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            لوحة الإدارة
          </Badge>
        </nav>

        {/* Main Layout with Sidebar */}
        <div className="flex min-h-screen w-full relative z-10">
          <AdminSidebar />
          
          <main className="flex-1 overflow-y-auto">
            {isRootAdmin ? (
              <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2">لوحة المعلومات</h1>
                  <p className="text-white/60">نظرة عامة على المنصة</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card className="p-5 bg-gradient-to-br from-[hsl(195,80%,50%,0.15)] to-[hsl(195,80%,30%,0.05)] border-[hsl(195,80%,70%,0.2)] backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <Users className="h-8 w-8 text-[hsl(195,80%,70%)]" />
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">1,248</div>
                    <div className="text-sm text-white/60">إجمالي المستخدمين</div>
                    <div className="text-xs text-green-400 mt-2">+12% من الشهر الماضي</div>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-[hsl(280,70%,50%,0.15)] to-[hsl(280,70%,30%,0.05)] border-[hsl(280,70%,70%,0.2)] backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <Package className="h-8 w-8 text-[hsl(280,70%,70%)]" />
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">342</div>
                    <div className="text-sm text-white/60">الإعلانات النشطة</div>
                    <div className="text-xs text-green-400 mt-2">+8% من الشهر الماضي</div>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-[hsl(40,90%,55%,0.15)] to-[hsl(40,90%,40%,0.05)] border-[hsl(40,90%,70%,0.2)] backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <ShoppingCart className="h-8 w-8 text-[hsl(40,90%,70%)]" />
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">156</div>
                    <div className="text-sm text-white/60">الطلبات هذا الشهر</div>
                    <div className="text-xs text-green-400 mt-2">+23% من الشهر الماضي</div>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-[hsl(120,60%,50%,0.15)] to-[hsl(120,60%,30%,0.05)] border-[hsl(120,60%,70%,0.2)] backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <DollarSign className="h-8 w-8 text-[hsl(120,60%,70%)]" />
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">24,580</div>
                    <div className="text-sm text-white/60">الإيرادات (ريال)</div>
                    <div className="text-xs text-green-400 mt-2">+18% من الشهر الماضي</div>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="h-6 w-6 text-yellow-400" />
                      <h2 className="text-xl font-bold text-white">النزاعات المفتوحة</h2>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mr-auto">
                        12 نزاع
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm mb-4">يوجد 12 نزاع يحتاج إلى مراجعة وحل</p>
                    <Link to="/admin/disputes">
                      <button className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors">
                        عرض جميع النزاعات
                      </button>
                    </Link>
                  </Card>

                  <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheck className="h-6 w-6 text-blue-400" />
                      <h2 className="text-xl font-bold text-white">طلبات التوثيق</h2>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mr-auto">
                        8 طلبات
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm mb-4">يوجد 8 طلبات KYC بانتظار المراجعة</p>
                    <Link to="/admin/kyc">
                      <button className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors">
                        عرض طلبات التوثيق
                      </button>
                    </Link>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-white mb-4">النشاط الأخير</h2>
                  <div className="space-y-3">
                    {[
                      { action: "مستخدم جديد انضم", user: "أحمد محمد", time: "منذ 5 دقائق" },
                      { action: "طلب جديد", user: "سارة علي", time: "منذ 12 دقيقة" },
                      { action: "نزاع تم حله", user: "خالد العتيبي", time: "منذ 30 دقيقة" },
                      { action: "إعلان جديد", user: "نورة السعيد", time: "منذ ساعة" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{item.action}</div>
                          <div className="text-sm text-white/60">{item.user}</div>
                        </div>
                        <div className="text-xs text-white/60">{item.time}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
