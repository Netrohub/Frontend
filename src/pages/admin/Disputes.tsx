import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const AdminDisputes = () => {
  const disputes = [
    { 
      id: "DIS-001", 
      orderId: "ORD-045", 
      reporter: "محمد أحمد", 
      reported: "سارة علي", 
      product: "حساب فورتنايت",
      reason: "الحساب لا يعمل بعد التسليم", 
      status: "open",
      priority: "high",
      date: "2025-01-20" 
    },
    { 
      id: "DIS-002", 
      orderId: "ORD-043", 
      reporter: "خالد العتيبي", 
      reported: "أحمد صالح", 
      product: "حساب كول أوف ديوتي",
      reason: "معلومات الحساب غير صحيحة", 
      status: "investigating",
      priority: "medium",
      date: "2025-01-19" 
    },
    { 
      id: "DIS-003", 
      orderId: "ORD-041", 
      reporter: "نورة السعيد", 
      reported: "محمد أحمد", 
      product: "حساب روبلوكس",
      reason: "البائع لم يسلم الحساب", 
      status: "resolved",
      priority: "high",
      date: "2025-01-18" 
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">إدارة النزاعات</h1>
        <p className="text-white/60">مراجعة وحل النزاعات بين المستخدمين</p>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              placeholder="البحث عن نزاع..."
              className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <Button className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
            بحث
          </Button>
        </div>
      </Card>

      {/* Disputes List */}
      <div className="space-y-4">
        {disputes.map((dispute) => (
          <Card key={dispute.id} className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">#{dispute.id}</h3>
                  <Badge className={
                    dispute.status === "open" 
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : dispute.status === "investigating"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-green-500/20 text-green-400 border-green-500/30"
                  }>
                    {dispute.status === "open" ? "مفتوح" : 
                     dispute.status === "investigating" ? "قيد التحقيق" : "محلول"}
                  </Badge>
                  <Badge className={
                    dispute.priority === "high"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  }>
                    {dispute.priority === "high" ? "أولوية عالية" : "أولوية متوسطة"}
                  </Badge>
                </div>
                <div className="text-sm text-white/60 space-y-2">
                  <div className="font-medium text-white/80">الطلب: #{dispute.orderId} - {dispute.product}</div>
                  <div className="flex gap-4">
                    <span>المبلغ: {dispute.reporter}</span>
                    <span>•</span>
                    <span>المبلغ عنه: {dispute.reported}</span>
                  </div>
                  <div className="text-amber-200/80">السبب: {dispute.reason}</div>
                  <div>التاريخ: {dispute.date}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-white/10">
              <Button size="sm" variant="outline" className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20">
                <Eye className="h-4 w-4" />
                عرض التفاصيل
              </Button>
              {dispute.status !== "resolved" && (
                <>
                  <Button size="sm" variant="outline" className="gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="h-4 w-4" />
                    حل لصالح المشتري
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 bg-[hsl(195,80%,50%,0.1)] hover:bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]">
                    <XCircle className="h-4 w-4" />
                    حل لصالح البائع
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDisputes;