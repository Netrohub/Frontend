import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Snowflake, Shield, CreditCard, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Checkout = () => {
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
        <div className="flex items-center gap-2">
          <Snowflake className="h-8 w-8 text-[hsl(195,80%,70%)]" />
          <span className="text-xl md:text-2xl font-black text-white">
            منصة<span className="text-[hsl(40,90%,55%)]">التداول</span>
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">إتمام الشراء</h1>
          <p className="text-white/60">أكمل عملية الدفع بأمان</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method */}
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[hsl(195,80%,50%,0.15)] border border-[hsl(195,80%,70%,0.3)]">
                  <CreditCard className="h-5 w-5 text-[hsl(195,80%,70%)]" />
                </div>
                <h2 className="text-2xl font-bold text-white">طريقة الدفع</h2>
              </div>

              <div className="space-y-4">
                <Card className="p-4 bg-[hsl(195,80%,50%,0.1)] border-2 border-[hsl(195,80%,70%)] cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[hsl(195,80%,70%)] flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-[hsl(195,80%,70%)]" />
                    </div>
                    <span className="font-bold text-white">الدفع عبر تاب</span>
                    <div className="mr-auto px-3 py-1 bg-[hsl(195,80%,50%)] rounded-full text-xs font-bold text-white">
                      موصى به
                    </div>
                  </div>
                </Card>

                <div className="space-y-4 pt-4">
                  <div>
                    <Label className="text-white mb-2 block">رقم الهاتف</Label>
                    <Input 
                      placeholder="05XXXXXXXX"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Protection Notice */}
            <Card className="p-5 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)] backdrop-blur-sm">
              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-[hsl(195,80%,70%)] flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-bold text-white">محمي بنظام الضمان</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    سيتم حفظ المبلغ في حساب ضمان لمدة 12 ساعة. يمكنك فحص الحساب والتأكد من صحته خلال هذه الفترة. إذا واجهت أي مشكلة، يمكنك فتح نزاع واسترداد أموالك بالكامل.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white/80">
                  <span>حساب مميز - المستوى 45</span>
                  <span className="font-medium">1,250 ريال</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>رسوم المنصة</span>
                  <span className="font-medium">50 ريال</span>
                </div>
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Server 101</span>
                </div>
              </div>

              <Separator className="my-6 bg-white/10" />

              <div className="flex justify-between items-baseline mb-6">
                <span className="text-lg text-white">المجموع</span>
                <span className="text-3xl font-black text-[hsl(195,80%,70%)]">1,300 ريال</span>
              </div>

              <Button 
                size="lg" 
                className="w-full gap-2 text-lg py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0"
              >
                <Shield className="h-5 w-5" />
                تأكيد الدفع
              </Button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  <span>دفع آمن ومشفر</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  <span>حماية المشتري لمدة 12 ساعة</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                  <span>استرداد كامل في حالة النزاع</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Glow effects */}
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default Checkout;
