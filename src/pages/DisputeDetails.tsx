import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, Loader2, MessageSquare, User, Calendar } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { disputesApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { Dispute } from "@/types/api";

const DisputeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const { data: dispute, isLoading, error } = useQuery({
    queryKey: ['dispute', id],
    queryFn: () => disputesApi.getById(parseInt(id!)),
    enabled: !!id && !!user,
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      open: { text: "مفتوح", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      under_review: { text: "قيد المراجعة", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      resolved: { text: "تم الحل", className: "bg-green-500/20 text-green-400 border-green-500/30" },
      closed: { text: "مغلق", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
    };
    const statusInfo = statusMap[status] || statusMap.open;
    return <Badge className={statusInfo.className}>{statusInfo.text}</Badge>;
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <p className="text-white/60 mb-4">يجب تسجيل الدخول لعرض تفاصيل النزاع</p>
          <Link to="/auth">
            <Button>تسجيل الدخول</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`تفاصيل النزاع - NXOLand`}
        description="تفاصيل النزاع والحل المقترح"
      />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />
        
        <Navbar />

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
          <Link to="/disputes" className="inline-flex items-center gap-2 text-white/60 hover:text-[hsl(195,80%,70%)] mb-6 transition-colors">
            <ArrowRight className="h-4 w-4" />
            العودة إلى النزاعات
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            </div>
          ) : error ? (
            <Card className="p-12 text-center bg-white/5 border-white/10">
              <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-4">فشل تحميل تفاصيل النزاع</p>
              <Link to="/disputes">
                <Button variant="outline">العودة إلى القائمة</Button>
              </Link>
            </Card>
          ) : dispute ? (
            <div className="space-y-6">
              {/* Header */}
              <Card className="p-6 bg-white/5 border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-black text-white mb-2">{dispute.reason}</h1>
                    <p className="text-white/60">نزاع على طلب #{dispute.order_id}</p>
                  </div>
                  {getStatusBadge(dispute.status)}
                </div>
              </Card>

              {/* Dispute Details */}
              <Card className="p-6 bg-white/5 border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[hsl(195,80%,70%)]" />
                  تفاصيل النزاع
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">الوصف</label>
                    <p className="text-white p-4 bg-white/5 rounded-lg border border-white/10">
                      {dispute.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white/60 mb-1 block">المُبلّغ</label>
                      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                        <User className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                        <span className="text-white">{dispute.party === 'buyer' ? 'المشتري' : 'البائع'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-white/60 mb-1 block">تاريخ الإنشاء</label>
                      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                        <Calendar className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                        <span className="text-white">
                          {dispute.created_at ? new Date(dispute.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Order Info */}
              {dispute.order && (
                <Card className="p-6 bg-white/5 border-white/10">
                  <h2 className="text-xl font-bold text-white mb-4">معلومات الطلب</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">رقم الطلب</span>
                      <Link to={`/order/${dispute.order.id}`} className="text-[hsl(195,80%,70%)] hover:underline">
                        #{dispute.order.id}
                      </Link>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">المبلغ</span>
                      <span className="text-white font-bold">{dispute.order.amount?.toLocaleString('ar-SA')} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">حالة الطلب</span>
                      <Badge>{dispute.order.status}</Badge>
                    </div>
                  </div>
                </Card>
              )}

              {/* Resolution (if resolved) */}
              {dispute.status === 'resolved' && dispute.resolution_notes && (
                <Card className="p-6 bg-green-500/10 border-green-500/30">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-green-400" />
                    الحل
                  </h2>
                  <p className="text-white/80 mb-4">{dispute.resolution_notes}</p>
                  {dispute.resolved_at && (
                    <p className="text-sm text-white/60">
                      تم الحل في: {new Date(dispute.resolved_at).toLocaleDateString('ar-SA')}
                    </p>
                  )}
                </Card>
              )}

              {/* Actions */}
              {dispute.status === 'open' && (
                <Card className="p-6 bg-blue-500/10 border-blue-500/30">
                  <div className="flex items-center gap-3 text-blue-400">
                    <AlertTriangle className="h-5 w-5" />
                    <p>النزاع قيد المراجعة. سيتم التواصل معك خلال 24-48 ساعة.</p>
                  </div>
                </Card>
              )}
            </div>
          ) : null}
        </div>

        <BottomNav />
      </div>
    </>
  );
};

export default DisputeDetails;

