import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Snowflake, Users, AlertTriangle, ShieldCheck, DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AdminNavbar } from "@/components/AdminNavbar";

const Admin = () => {
  const location = useLocation();
  const isRootAdmin = location.pathname === "/admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" dir="rtl">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Snowflake className="h-8 w-8 text-blue-400" />
          <span className="text-xl md:text-2xl font-black text-white">
            NXO<span className="text-amber-400">Land</span>
          </span>
        </Link>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
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
              <p className="text-slate-400">نظرة عامة على المنصة</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <Users className="h-8 w-8 text-blue-400" />
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">1,248</div>
                <div className="text-sm text-slate-400 mb-2">إجمالي المستخدمين</div>
                <div className="text-xs text-emerald-400">+12% من الشهر الماضي</div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <Package className="h-8 w-8 text-purple-400" />
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">342</div>
                <div className="text-sm text-slate-400 mb-2">الإعلانات النشطة</div>
                <div className="text-xs text-emerald-400">+8% من الشهر الماضي</div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20 backdrop-blur-sm hover:border-amber-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <ShoppingCart className="h-8 w-8 text-amber-400" />
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">156</div>
                <div className="text-sm text-slate-400 mb-2">الطلبات هذا الشهر</div>
                <div className="text-xs text-emerald-400">+23% من الشهر الماضي</div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 backdrop-blur-sm hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="h-8 w-8 text-emerald-400" />
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">24,580</div>
                <div className="text-sm text-slate-400 mb-2">الإيرادات (ريال)</div>
                <div className="text-xs text-emerald-400">+18% من الشهر الماضي</div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-xl font-bold text-white">النزاعات المفتوحة</h2>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 mr-auto">
                    12 نزاع
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm mb-4">يوجد 12 نزاع يحتاج إلى مراجعة وحل</p>
                <Link to="/admin/disputes">
                  <button className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors border border-yellow-500/30">
                    عرض جميع النزاعات
                  </button>
                </Link>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">طلبات التوثيق</h2>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 mr-auto">
                    8 طلبات
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm mb-4">يوجد 8 طلبات KYC بانتظار المراجعة</p>
                <Link to="/admin/kyc">
                  <button className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors border border-blue-500/30">
                    عرض طلبات التوثيق
                  </button>
                </Link>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-4">النشاط الأخير</h2>
              <div className="space-y-3">
                {[
                  { action: "مستخدم جديد انضم", user: "أحمد محمد", time: "منذ 5 دقائق", color: "text-blue-400" },
                  { action: "طلب جديد", user: "سارة علي", time: "منذ 12 دقيقة", color: "text-emerald-400" },
                  { action: "نزاع تم حله", user: "خالد العتيبي", time: "منذ 30 دقيقة", color: "text-purple-400" },
                  { action: "إعلان جديد", user: "نورة السعيد", time: "منذ ساعة", color: "text-amber-400" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                    <div>
                      <div className={`font-medium ${item.color}`}>{item.action}</div>
                      <div className="text-sm text-slate-400">{item.user}</div>
                    </div>
                    <div className="text-xs text-slate-500">{item.time}</div>
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
  );
};

export default Admin;
