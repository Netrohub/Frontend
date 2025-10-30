import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Snowflake, Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { NotificationBell } from "@/components/NotificationBell";
import { MobileNav } from "@/components/MobileNav";

const Wallet = () => {
  // Mock data for transactions
  const transactions = [
    { id: 1, type: "deposit", amount: 500, status: "completed", date: "2025-01-15 14:30", method: "تاب" },
    { id: 2, type: "withdraw", amount: 200, status: "pending", date: "2025-01-14 10:20", method: "تاب" },
    { id: 3, type: "deposit", amount: 1000, status: "completed", date: "2025-01-13 16:45", method: "تاب" },
    { id: 4, type: "withdraw", amount: 300, status: "completed", date: "2025-01-12 09:15", method: "تاب" },
    { id: 5, type: "deposit", amount: 750, status: "failed", date: "2025-01-11 12:00", method: "تاب" },
  ];

  const balance = 1750; // Mock balance

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "pending":
        return "قيد المعالجة";
      case "failed":
        return "فشل";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
      {/* Animated snow particles */}
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

      {/* Frost overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[hsl(195,80%,50%,0.05)] to-transparent opacity-40" />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/10 backdrop-blur-md bg-[hsl(200,70%,15%,0.5)]">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Snowflake className="h-8 w-8 text-[hsl(195,80%,70%)]" />
          <span className="text-xl md:text-2xl font-black text-white">
            NXO<span className="text-[hsl(40,90%,55%)]">Land</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
            <Link to="/" className="hover:text-[hsl(195,80%,70%)] transition-colors">الرئيسية</Link>
            <Link to="/marketplace" className="hover:text-[hsl(195,80%,70%)] transition-colors">السوق</Link>
            <Link to="/wallet" className="text-[hsl(195,80%,70%)]">المحفظة</Link>
            <Link to="/profile" className="hover:text-[hsl(195,80%,70%)] transition-colors">الملف الشخصي</Link>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 flex items-center gap-3">
            <WalletIcon className="h-10 w-10 text-[hsl(195,80%,70%)]" />
            المحفظة
          </h1>
          <p className="text-white/60 text-lg">إدارة رصيدك ومعاملاتك المالية</p>
        </div>

        {/* Balance Card */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] border-white/20 shadow-[0_0_40px_rgba(56,189,248,0.3)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white/80 text-sm mb-2">الرصيد الحالي</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-black text-white">{balance}</span>
                <span className="text-2xl text-white/80 font-bold">ريال</span>
              </div>
              <p className="text-white/70 text-sm mt-2">آخر تحديث: اليوم، 14:30</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Button 
                size="lg"
                className="gap-2 bg-white hover:bg-white/90 text-[hsl(195,80%,50%)] font-bold min-h-[56px] px-8"
              >
                <ArrowDownToLine className="h-5 w-5" />
                إيداع
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 font-bold min-h-[56px] px-8"
              >
                <ArrowUpFromLine className="h-5 w-5" />
                سحب
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">إجمالي الإيداعات</p>
                <p className="text-2xl font-bold text-white">2,250 ريال</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                <ArrowDownToLine className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">إجمالي السحوبات</p>
                <p className="text-2xl font-bold text-white">500 ريال</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <ArrowUpFromLine className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">المعاملات الشهرية</p>
                <p className="text-2xl font-bold text-white">12 معاملة</p>
              </div>
              <div className="p-3 rounded-lg bg-[hsl(195,80%,50%,0.2)] border border-[hsl(195,80%,70%,0.3)]">
                <WalletIcon className="h-6 w-6 text-[hsl(195,80%,70%)]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Transactions History */}
        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6">سجل المعاملات</h2>
          
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[hsl(195,80%,70%,0.3)] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    transaction.type === "deposit" 
                      ? "bg-green-500/20 border border-green-500/30" 
                      : "bg-blue-500/20 border border-blue-500/30"
                  }`}>
                    {transaction.type === "deposit" ? (
                      <ArrowDownToLine className="h-5 w-5 text-green-400" />
                    ) : (
                      <ArrowUpFromLine className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-bold">
                      {transaction.type === "deposit" ? "إيداع" : "سحب"}
                    </p>
                    <p className="text-white/60 text-sm">{transaction.date}</p>
                    <p className="text-white/50 text-xs">عبر {transaction.method}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-left">
                    <p className={`text-xl font-bold ${
                      transaction.type === "deposit" ? "text-green-400" : "text-blue-400"
                    }`}>
                      {transaction.type === "deposit" ? "+" : "-"}{transaction.amount} ريال
                    </p>
                    <div className="flex items-center gap-2 justify-end mt-1">
                      {getStatusIcon(transaction.status)}
                      <span className="text-xs text-white/60">{getStatusText(transaction.status)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-6 text-center">
            <Button 
              variant="outline"
              className="bg-white/5 hover:bg-white/10 text-white border-white/20"
            >
              عرض جميع المعاملات
            </Button>
          </div>
        </Card>

        {/* Help Card */}
        <Card className="mt-8 p-6 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)] backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">بحاجة إلى مساعدة؟</h3>
              <p className="text-white/70">تواصل مع فريق الدعم للمساعدة في أي استفسار يتعلق بالمحفظة</p>
            </div>
            <Button 
              asChild
              className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold border-0"
            >
              <Link to="/help">
                تواصل معنا
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(200,70%,40%,0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default Wallet;
