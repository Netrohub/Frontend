import { DollarSign, TrendingUp, TrendingDown, Download, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminFinancial() {
  const stats = [
    {
      title: "إجمالي الإيرادات",
      value: "$45,231",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "العمولات المحصلة",
      value: "$4,523",
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "المدفوعات المعلقة",
      value: "$2,150",
      change: "-5.4%",
      trend: "down",
      icon: TrendingDown,
    },
    {
      title: "المسحوبات",
      value: "$38,500",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
    },
  ];

  const transactions = [
    {
      id: "1",
      type: "commission",
      amount: 45.50,
      orderId: "ORD-001",
      seller: "أحمد محمد",
      buyer: "فاطمة علي",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "2",
      type: "withdrawal",
      amount: 500.00,
      seller: "محمد حسن",
      date: "2024-01-14",
      status: "pending",
    },
    {
      id: "3",
      type: "commission",
      amount: 32.75,
      orderId: "ORD-002",
      seller: "سارة أحمد",
      buyer: "علي حسن",
      date: "2024-01-13",
      status: "completed",
    },
    {
      id: "4",
      type: "refund",
      amount: 150.00,
      orderId: "ORD-003",
      buyer: "فاطمة علي",
      date: "2024-01-12",
      status: "processing",
    },
  ];

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "commission": return "عمولة";
      case "withdrawal": return "سحب";
      case "refund": return "استرداد";
      default: return type;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "commission": return "text-green-400";
      case "withdrawal": return "text-blue-400";
      case "refund": return "text-red-400";
      default: return "text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "processing": return "bg-blue-500/20 text-blue-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "مكتمل";
      case "pending": return "قيد الانتظار";
      case "processing": return "قيد المعالجة";
      default: return status;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">التقارير المالية</h1>
          <p className="text-white/60">إدارة ومراقبة العمليات المالية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10">
            <Calendar className="h-4 w-4 mr-2" />
            تحديد الفترة
          </Button>
          <Button className="bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(200,90%,40%)]">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6 bg-gradient-to-br from-[hsl(200,70%,12%)] to-[hsl(195,60%,10%)] border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-[hsl(195,80%,50%,0.2)]">
                <stat.icon className="h-6 w-6 text-[hsl(195,80%,50%)]" />
              </div>
              <Badge className={stat.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                {stat.change}
              </Badge>
            </div>
            <h3 className="text-sm text-white/60 mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-[hsl(200,70%,12%)] border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">المعاملات الأخيرة</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-4 text-sm font-medium text-white/60">المعرف</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-white/60">النوع</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-white/60">المبلغ</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-white/60">التفاصيل</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-white/60">التاريخ</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-white/60">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-4 text-sm text-white">{transaction.id}</td>
                  <td className="py-4 px-4">
                    <span className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                      {getTransactionTypeLabel(transaction.type)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-white">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-sm text-white/60">
                    {transaction.orderId && <div>رقم الطلب: {transaction.orderId}</div>}
                    {transaction.seller && <div>البائع: {transaction.seller}</div>}
                    {transaction.buyer && <div>المشتري: {transaction.buyer}</div>}
                  </td>
                  <td className="py-4 px-4 text-sm text-white/60">{transaction.date}</td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(transaction.status)}>
                      {getStatusLabel(transaction.status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
