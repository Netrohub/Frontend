import { DollarSign, TrendingUp, TrendingDown, Download, Calendar, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { adminApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { formatLocalizedDate } from "@/utils/date";

export default function AdminFinancial() {
  const { t, language } = useLanguage();

  const { data: financialData, isLoading } = useQuery({
    queryKey: ['admin-financial'],
    queryFn: () => adminApi.financial(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const stats = financialData?.stats ? [
    {
      title: language === 'ar' ? "إجمالي الإيرادات" : "Total Revenue",
      value: `$${financialData.stats.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${financialData.stats.revenue_growth >= 0 ? '+' : ''}${financialData.stats.revenue_growth.toFixed(1)}%`,
      trend: financialData.stats.revenue_growth >= 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      title: language === 'ar' ? "العمولات المحصلة" : "Commissions Collected",
      value: `$${financialData.stats.total_commissions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${financialData.stats.commissions_growth >= 0 ? '+' : ''}${financialData.stats.commissions_growth.toFixed(1)}%`,
      trend: financialData.stats.commissions_growth >= 0 ? "up" : "down",
      icon: TrendingUp,
    },
    {
      title: language === 'ar' ? "المدفوعات المعلقة" : "Pending Payments",
      value: `$${financialData.stats.pending_payments.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "-", // Pending payments don't have growth
      trend: "neutral" as const,
      icon: TrendingDown,
    },
    {
      title: language === 'ar' ? "المسحوبات" : "Total Withdrawals",
      value: `$${financialData.stats.total_withdrawals.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${financialData.stats.withdrawals_growth >= 0 ? '+' : ''}${financialData.stats.withdrawals_growth.toFixed(1)}%`,
      trend: financialData.stats.withdrawals_growth >= 0 ? "up" : "down",
      icon: DollarSign,
    },
  ] : [];

  const transactions = financialData?.transactions || [];

  const getTransactionTypeLabel = (type: string) => {
    if (language === 'ar') {
      switch (type) {
        case "order": return "طلب";
        case "withdrawal": return "سحب";
        case "refund": return "استرداد";
        default: return type;
      }
    } else {
      switch (type) {
        case "order": return "Order";
        case "withdrawal": return "Withdrawal";
        case "refund": return "Refund";
        default: return type;
      }
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "order": return "text-green-400";
      case "withdrawal": return "text-blue-400";
      case "refund": return "text-red-400";
      default: return "text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "processing":
        return "bg-blue-500/20 text-blue-400";
      case "escrow_hold":
        return "bg-orange-500/20 text-orange-400";
      case "failed":
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    if (language === 'ar') {
      switch (status) {
        case "completed": return "مكتمل";
        case "pending": return "قيد الانتظار";
        case "processing": return "قيد المعالجة";
        case "escrow_hold": return "في الضمان";
        case "failed": return "فشل";
        case "cancelled": return "ملغي";
        default: return status;
      }
    } else {
      switch (status) {
        case "completed": return "Completed";
        case "pending": return "Pending";
        case "processing": return "Processing";
        case "escrow_hold": return "Escrow Hold";
        case "failed": return "Failed";
        case "cancelled": return "Cancelled";
        default: return status;
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            {language === 'ar' ? 'التقارير المالية' : 'Financial Reports'}
          </h1>
          <p className="text-white/60">
            {language === 'ar' ? 'إدارة ومراقبة العمليات المالية' : 'Manage and monitor financial operations'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/30">
            <Calendar className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'تحديد الفترة' : 'Select Period'}
          </Button>
          <Button className="bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(200,90%,40%)]">
            <Download className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.title} className="p-6 bg-gradient-to-br from-[hsl(200,70%,12%)] to-[hsl(195,60%,10%)] border-white/10 backdrop-blur-sm hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-[hsl(195,80%,50%,0.2)]">
                    <stat.icon className="h-6 w-6 text-[hsl(195,80%,50%)]" />
                  </div>
                  {stat.change !== "-" && (
                    <Badge className={stat.trend === "up" ? "bg-green-500/20 text-green-400 border-green-500/30" : stat.trend === "down" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}>
                      {stat.change}
                    </Badge>
                  )}
                </div>
                <h3 className="text-sm text-white/60 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </Card>
            ))}
          </div>

          <Card className="p-6 bg-[hsl(200,70%,12%)] border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">
              {language === 'ar' ? 'المعاملات الأخيرة' : 'Recent Transactions'}
            </h2>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <p>{language === 'ar' ? 'لا توجد معاملات' : 'No transactions found'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">
                        {language === 'ar' ? 'المعرف' : 'ID'}
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">
                        {language === 'ar' ? 'النوع' : 'Type'}
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">
                        {language === 'ar' ? 'المبلغ' : 'Amount'}
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">
                        {language === 'ar' ? 'التفاصيل' : 'Details'}
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">
                        {language === 'ar' ? 'التاريخ' : 'Date'}
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-white/60">
                        {language === 'ar' ? 'الحالة' : 'Status'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-4 px-4 text-sm text-white font-mono">
                          {transaction.order_number || transaction.id}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                            {getTransactionTypeLabel(transaction.type)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-white">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-sm text-white/60">
                          {transaction.type === 'order' && (
                            <>
                              {transaction.order_number && (
                                <div>{language === 'ar' ? 'رقم الطلب:' : 'Order:'} {transaction.order_number}</div>
                              )}
                              {transaction.seller && (
                                <div>{language === 'ar' ? 'البائع:' : 'Seller:'} {transaction.seller}</div>
                              )}
                              {transaction.buyer && (
                                <div>{language === 'ar' ? 'المشتري:' : 'Buyer:'} {transaction.buyer}</div>
                              )}
                              {transaction.listing_title && (
                                <div className="text-xs text-white/50">{transaction.listing_title}</div>
                              )}
                            </>
                          )}
                          {transaction.type === 'withdrawal' && transaction.user && (
                            <div>{language === 'ar' ? 'المستخدم:' : 'User:'} {transaction.user}</div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-white/60">
                          {formatLocalizedDate(transaction.date, language, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
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
            )}
          </Card>
        </>
      )}
    </div>
  );
}
