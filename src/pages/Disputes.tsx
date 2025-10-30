import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Snowflake, AlertTriangle, Upload, MessageSquare, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Disputes = () => {
  const disputes = [
    { id: 1, orderId: "#12458", title: "الحساب لا يعمل", status: "open", date: "منذ 3 ساعات" },
    { id: 2, orderId: "#12340", title: "معلومات خاطئة", status: "review", date: "منذ يوم واحد" },
    { id: 3, orderId: "#12289", title: "تم الحل", status: "resolved", date: "منذ 3 أيام" },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      open: "bg-red-500/20 text-red-400 border-red-500/30",
      review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      resolved: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    const labels = { open: "مفتوح", review: "قيد المراجعة", resolved: "تم الحل" };
    return <Badge className={styles[status as keyof typeof styles]}>{labels[status as keyof typeof labels]}</Badge>;
  };

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
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">مركز النزاعات</h1>
          <p className="text-white/60">إدارة ومتابعة النزاعات</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Disputes List */}
          <div className="lg:col-span-2 space-y-4">
            {disputes.map((dispute) => (
              <Card 
                key={dispute.id}
                className="p-4 bg-white/5 border-white/10 backdrop-blur-sm hover:border-[hsl(195,80%,70%,0.5)] transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <span className="text-sm text-white/60">{dispute.orderId}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{dispute.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Clock className="h-4 w-4" />
                      <span>{dispute.date}</span>
                    </div>
                  </div>
                  {getStatusBadge(dispute.status)}
                </div>
                
                {dispute.status === "open" && (
                  <Button size="sm" className="w-full mt-3 gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
                    <MessageSquare className="h-4 w-4" />
                    إضافة رد
                  </Button>
                )}
              </Card>
            ))}
          </div>

          {/* Open New Dispute */}
          <div>
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm sticky top-8">
              <h2 className="text-xl font-bold text-white mb-4">فتح نزاع جديد</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/80 mb-2 block">رقم الطلب</label>
                  <input 
                    placeholder="#12458"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/80 mb-2 block">المشكلة</label>
                  <Textarea 
                    placeholder="وصف تفصيلي للمشكلة..."
                    rows={4}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/80 mb-2 block">إرفاق أدلة</label>
                  <button className="w-full p-4 bg-white/5 border-2 border-dashed border-white/20 rounded-lg hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-white/40" />
                    <span className="text-sm text-white/60">رفع صور أو فيديوهات</span>
                  </button>
                </div>

                <Button className="w-full gap-2 py-6 bg-red-500 hover:bg-red-600 text-white border-0">
                  <AlertTriangle className="h-5 w-5" />
                  فتح نزاع
                </Button>

                <p className="text-xs text-white/60 text-center">
                  سيتم مراجعة النزاع خلال 24 ساعة
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disputes;
