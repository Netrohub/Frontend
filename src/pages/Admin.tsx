import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Snowflake, Users, AlertTriangle, ShieldCheck, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const disputes = [
    { id: 1, orderId: "#12458", user: "محمد أحمد", status: "open", date: "2025-01-28" },
    { id: 2, orderId: "#12340", user: "سارة علي", status: "review", date: "2025-01-27" },
  ];

  const kycRequests = [
    { id: 1, user: "خالد العتيبي", status: "pending", date: "2025-01-28" },
    { id: 2, user: "نورة السعيد", status: "pending", date: "2025-01-27" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
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
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/10 backdrop-blur-md bg-[hsl(200,70%,15%,0.5)]">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Snowflake className="h-8 w-8 text-[hsl(195,80%,70%)]" />
          <span className="text-xl md:text-2xl font-black text-white">
            NXO<span className="text-[hsl(40,90%,55%)]">Land</span>
          </span>
        </Link>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          لوحة الإدارة
        </Badge>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">لوحة الإدارة</h1>
          <p className="text-white/60">إدارة المنصة والمستخدمين</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-[hsl(195,80%,70%)]" />
              <span className="text-sm text-white/60">المستخدمين</span>
            </div>
            <div className="text-2xl font-black text-white">1,248</div>
          </Card>

          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-white/60">النزاعات</span>
            </div>
            <div className="text-2xl font-black text-yellow-400">12</div>
          </Card>

          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-white/60">طلبات KYC</span>
            </div>
            <div className="text-2xl font-black text-blue-400">8</div>
          </Card>

          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-sm text-white/60">الإيرادات</span>
            </div>
            <div className="text-2xl font-black text-green-400">24,580</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="disputes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-6">
            <TabsTrigger value="disputes">النزاعات</TabsTrigger>
            <TabsTrigger value="kyc">طلبات التوثيق</TabsTrigger>
          </TabsList>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-4">
            {disputes.map((dispute) => (
              <Card key={dispute.id} className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <span className="font-bold text-white">{dispute.orderId}</span>
                    </div>
                    <div className="text-sm text-white/60">المستخدم: {dispute.user}</div>
                    <div className="text-sm text-white/60">التاريخ: {dispute.date}</div>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    {dispute.status === "open" ? "مفتوح" : "قيد المراجعة"}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/10">
                  <Button size="sm" className="flex-1 gap-2 bg-green-500 hover:bg-green-600 text-white border-0">
                    <CheckCircle2 className="h-4 w-4" />
                    قبول
                  </Button>
                  <Button size="sm" className="flex-1 gap-2 bg-red-500 hover:bg-red-600 text-white border-0">
                    <XCircle className="h-4 w-4" />
                    رفض
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc" className="space-y-4">
            {kycRequests.map((request) => (
              <Card key={request.id} className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-5 w-5 text-blue-400" />
                      <span className="font-bold text-white">{request.user}</span>
                    </div>
                    <div className="text-sm text-white/60">التاريخ: {request.date}</div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    قيد الانتظار
                  </Badge>
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/10">
                  <Button size="sm" className="flex-1 gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
                    مراجعة الطلب
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
