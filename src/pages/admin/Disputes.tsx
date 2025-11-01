import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface AdminDispute {
  id: string;
  orderId: string;
  reporter: string;
  reporterEmail: string;
  reported: string;
  reportedEmail: string;
  product: string;
  reason: string;
  description: string;
  status: "open" | "investigating" | "resolved" | "closed";
  priority: "high" | "medium" | "low";
  date: string;
  price: number;
}

const AdminDisputes = () => {
  const [selectedDispute, setSelectedDispute] = useState<AdminDispute | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const disputes = [
    { 
      id: "DIS-001", 
      orderId: "ORD-045", 
      reporter: "محمد أحمد",
      reporterEmail: "mohammed@example.com", 
      reported: "سارة علي",
      reportedEmail: "sara@example.com", 
      product: "حساب فورتنايت",
      reason: "الحساب لا يعمل بعد التسليم",
      description: "قمت بشراء الحساب وعند تسجيل الدخول وجدت أنه محظور ولا يمكن استخدامه. حاولت التواصل مع البائع لكن لم يرد.",
      status: "open",
      priority: "high",
      date: "2025-01-20",
      price: 500
    },
    { 
      id: "DIS-002", 
      orderId: "ORD-043", 
      reporter: "خالد العتيبي",
      reporterEmail: "khalid@example.com", 
      reported: "أحمد صالح",
      reportedEmail: "ahmed@example.com", 
      product: "حساب كول أوف ديوتي",
      reason: "معلومات الحساب غير صحيحة",
      description: "المستوى والأسلحة المعلنة في الإعلان لا تطابق الحساب الفعلي. تم تضليلي.",
      status: "investigating",
      priority: "medium",
      date: "2025-01-19",
      price: 350
    },
    { 
      id: "DIS-003", 
      orderId: "ORD-041", 
      reporter: "نورة السعيد",
      reporterEmail: "noura@example.com", 
      reported: "محمد أحمد",
      reportedEmail: "mohammed@example.com", 
      product: "حساب روبلوكس",
      reason: "البائع لم يسلم الحساب",
      description: "دفعت المبلغ منذ 3 أيام ولم أستلم معلومات الحساب حتى الآن رغم التواصل المتكرر.",
      status: "resolved",
      priority: "high",
      date: "2025-01-18",
      price: 280
    },
  ];

  const handleViewDetails = (dispute: AdminDispute) => {
    setSelectedDispute(dispute);
    setIsDialogOpen(true);
  };

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
              <Button size="sm" variant="outline" className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20" onClick={() => handleViewDetails(dispute)}>
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

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[hsl(217,33%,17%)] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              تفاصيل النزاع
            </DialogTitle>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">#{selectedDispute.id}</h3>
                <div className="flex gap-2">
                  <Badge className={
                    selectedDispute.status === "open" 
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : selectedDispute.status === "investigating"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-green-500/20 text-green-400 border-green-500/30"
                  }>
                    {selectedDispute.status === "open" ? "مفتوح" : 
                     selectedDispute.status === "investigating" ? "قيد التحقيق" : "محلول"}
                  </Badge>
                  <Badge className={
                    selectedDispute.priority === "high"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  }>
                    {selectedDispute.priority === "high" ? "أولوية عالية" : "أولوية متوسطة"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <h4 className="text-sm text-white/60 mb-2">معلومات الطلب</h4>
                  <p className="text-white font-medium">#{selectedDispute.orderId} - {selectedDispute.product}</p>
                  <p className="text-sm text-white/50 mt-1">السعر: {selectedDispute.price} ريال</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-sm text-white/60 mb-1">المُبلِّغ</h4>
                    <p className="text-white font-medium">{selectedDispute.reporter}</p>
                    <p className="text-sm text-white/50">{selectedDispute.reporterEmail}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-sm text-white/60 mb-1">المُبلَّغ عنه</h4>
                    <p className="text-white font-medium">{selectedDispute.reported}</p>
                    <p className="text-sm text-white/50">{selectedDispute.reportedEmail}</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <h4 className="text-sm text-amber-400 mb-1 font-medium">السبب</h4>
                  <p className="text-white">{selectedDispute.reason}</p>
                </div>

                <div className="p-3 bg-white/5 rounded-lg">
                  <h4 className="text-sm text-white/60 mb-2">تفاصيل النزاع</h4>
                  <p className="text-white/80 text-sm leading-relaxed">{selectedDispute.description}</p>
                </div>

                <div className="text-sm text-white/50">
                  تاريخ الإبلاغ: {selectedDispute.date}
                </div>
              </div>

              {selectedDispute.status !== "resolved" && (
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button className="flex-1 gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="h-4 w-4" />
                    حل لصالح المشتري
                  </Button>
                  <Button className="flex-1 gap-2 bg-[hsl(195,80%,50%,0.1)] hover:bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]">
                    <XCircle className="h-4 w-4" />
                    حل لصالح البائع
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDisputes;