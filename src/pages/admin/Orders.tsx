import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";

const AdminOrders = () => {
  const orders = [
    { id: "ORD-001", buyer: "محمد أحمد", seller: "سارة علي", product: "حساب فورتنايت", price: 500, status: "completed", date: "2025-01-20" },
    { id: "ORD-002", buyer: "خالد العتيبي", seller: "محمد أحمد", product: "حساب كول أوف ديوتي", price: 350, status: "pending", date: "2025-01-19" },
    { id: "ORD-003", buyer: "نورة السعيد", seller: "سارة علي", product: "حساب روبلوكس", price: 280, status: "processing", date: "2025-01-18" },
    { id: "ORD-004", buyer: "أحمد صالح", seller: "خالد العتيبي", product: "حساب ماين كرافت", price: 420, status: "cancelled", date: "2025-01-17" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">إدارة الطلبات</h1>
        <p className="text-white/60">عرض وإدارة جميع الطلبات على المنصة</p>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              placeholder="البحث عن طلب..."
              className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <Button className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
            بحث
          </Button>
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">#{order.id}</h3>
                  <Badge className={
                    order.status === "completed" 
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : order.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : order.status === "processing"
                      ? "bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {order.status === "completed" ? "مكتمل" : 
                     order.status === "pending" ? "قيد الانتظار" : 
                     order.status === "processing" ? "قيد المعالجة" : "ملغي"}
                  </Badge>
                </div>
                <div className="text-sm text-white/60 space-y-1">
                  <div className="font-medium text-white/80">{order.product}</div>
                  <div className="flex gap-4">
                    <span>المشتري: {order.buyer}</span>
                    <span>•</span>
                    <span>البائع: {order.seller}</span>
                  </div>
                  <div className="flex gap-4">
                    <span>السعر: {order.price} ريال</span>
                    <span>•</span>
                    <span>التاريخ: {order.date}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-white/10">
              <Button size="sm" variant="outline" className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20">
                <Eye className="h-4 w-4" />
                عرض التفاصيل
              </Button>
              {order.status === "pending" && (
                <>
                  <Button size="sm" variant="outline" className="gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="h-4 w-4" />
                    قبول
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30">
                    <XCircle className="h-4 w-4" />
                    رفض
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

export default AdminOrders;