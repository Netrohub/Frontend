import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Snowflake, Shield, Star, MapPin, ArrowRight, CheckCircle2, Users, Check, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();

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
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-white/60 hover:text-[hsl(195,80%,70%)] mb-6 transition-colors">
          <ArrowRight className="h-4 w-4" />
          العودة للسوق
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="aspect-video bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] flex items-center justify-center">
                <Shield className="h-32 w-32 text-white/20" />
              </div>
            </Card>
            
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="aspect-square bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white/20" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]">
                  متاح الآن
                </Badge>
                <Badge className="bg-[hsl(40,90%,55%,0.2)] text-[hsl(40,90%,55%)] border-[hsl(40,90%,55%,0.3)]">
                  حساب مميز
                </Badge>
              </div>
              
              <h1 className="text-4xl font-black text-white mb-4">حساب مميز - السيرفر 201-300</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-[hsl(40,90%,55%)]">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-bold">4.9</span>
                  <span className="text-white/60 text-sm">(127 تقييم)</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4" />
                  <span>السيرفر: 201-300</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black text-[hsl(195,80%,70%)]">1,250</span>
                <span className="text-2xl text-white/60">ريال</span>
              </div>
            </div>

            {/* Seller Info */}
            <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    محمد العتيبي
                    <CheckCircle2 className="h-5 w-5 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" />
                  </div>
                  <div className="text-sm text-white/60">بائع موثوق</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[hsl(195,80%,70%)]">142</div>
                  <div className="text-xs text-white/60">عملية بيع</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[hsl(40,90%,55%)]">4.9</div>
                  <div className="text-xs text-white/60">التقييم</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">98%</div>
                  <div className="text-xs text-white/60">معدل النجاح</div>
                </div>
              </div>
            </Card>

            {/* Account Details */}
            <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[hsl(195,80%,70%)] to-[hsl(40,90%,55%)] rounded-full" />
                تفاصيل الحساب
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gradient-to-br from-[hsl(195,80%,50%,0.15)] to-[hsl(195,80%,30%,0.1)] rounded-lg border border-[hsl(195,80%,70%,0.2)]">
                  <div className="text-xs text-[hsl(195,80%,70%)] mb-1">السيرفر</div>
                  <div className="font-bold text-white text-lg">201-300</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-[hsl(280,70%,50%,0.15)] to-[hsl(280,70%,30%,0.1)] rounded-lg border border-[hsl(280,70%,70%,0.2)]">
                  <div className="text-xs text-[hsl(280,70%,70%)] mb-1">حجرة الاحتراق</div>
                  <div className="font-bold text-white text-lg">FC8</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-[hsl(40,90%,55%,0.15)] to-[hsl(40,90%,40%,0.1)] rounded-lg border border-[hsl(40,90%,70%,0.2)]">
                  <div className="text-xs text-[hsl(40,90%,70%)] mb-1">هيليوس</div>
                  <div className="font-bold text-white">المشاة، الرماه</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-[hsl(160,60%,50%,0.15)] to-[hsl(160,60%,30%,0.1)] rounded-lg border border-[hsl(160,60%,70%,0.2)]">
                  <div className="text-xs text-[hsl(160,60%,70%)] mb-1">عدد الجنود</div>
                  <div className="font-bold text-white">1,500,000</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-[hsl(195,80%,50%,0.2)] to-[hsl(195,80%,30%,0.15)] rounded-lg border-2 border-[hsl(195,80%,70%,0.4)] shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                  <div className="text-xs text-[hsl(195,80%,70%)] mb-1 font-bold">Total Power</div>
                  <div className="font-black text-[hsl(195,80%,70%)] text-xl">50,000,000</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-[hsl(340,70%,50%,0.15)] to-[hsl(340,70%,30%,0.1)] rounded-lg border border-[hsl(340,70%,70%,0.2)]">
                  <div className="text-xs text-[hsl(340,70%,70%)] mb-1">Hero Power</div>
                  <div className="font-bold text-white">10,000,000</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-[hsl(220,70%,50%,0.15)] to-[hsl(220,70%,30%,0.1)] rounded-lg border border-[hsl(220,70%,70%,0.2)]">
                  <div className="text-xs text-[hsl(220,70%,70%)] mb-1">Island</div>
                  <div className="font-bold text-white text-lg">7</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-[hsl(120,60%,50%,0.15)] to-[hsl(120,60%,30%,0.1)] rounded-lg border border-[hsl(120,60%,70%,0.2)]">
                  <div className="text-xs text-[hsl(120,60%,70%)] mb-1">Expert Power</div>
                  <div className="font-bold text-white">5,000,000</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-[hsl(40,90%,55%,0.15)] to-[hsl(40,90%,40%,0.1)] rounded-lg border border-[hsl(40,90%,70%,0.2)]">
                  <div className="text-xs text-[hsl(40,90%,70%)] mb-1">Hero's total Power</div>
                  <div className="font-bold text-white">15,000,000</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-[hsl(280,70%,50%,0.15)] to-[hsl(280,70%,30%,0.1)] rounded-lg border border-[hsl(280,70%,70%,0.2)]">
                  <div className="text-xs text-[hsl(280,70%,70%)] mb-1">Pet Power</div>
                  <div className="font-bold text-white">3,000,000</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-[hsl(120,60%,50%,0.15)] to-[hsl(120,60%,30%,0.1)] rounded-lg border border-[hsl(120,60%,70%,0.2)] col-span-2">
                  <div className="text-xs text-[hsl(120,60%,70%)] mb-1">مع البريد الإلكتروني الأساسي</div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                    <span className="font-bold text-[hsl(120,70%,50%)] text-lg">نعم</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Bindings */}
            <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[hsl(195,80%,70%)] to-[hsl(40,90%,55%)] rounded-full" />
                ربط الحساب
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-white/60 mb-2">أبل</div>
                  <div className="flex items-center gap-2">
                    <X className="h-5 w-5 text-red-400" />
                    <span className="font-bold text-red-400">غير مربوط</span>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-white/60 mb-2">قوقل</div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                    <span className="font-bold text-[hsl(120,70%,50%)]">مربوط</span>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-white/60 mb-2">فيسبوك</div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                    <span className="font-bold text-[hsl(120,70%,50%)]">مربوط</span>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-white/60 mb-2">قيم سنتر</div>
                  <div className="flex items-center gap-2">
                    <X className="h-5 w-5 text-red-400" />
                    <span className="font-bold text-red-400">غير مربوط</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Invoice Images Status */}
            <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[hsl(195,80%,70%)] to-[hsl(40,90%,55%)] rounded-full" />
                صور الفواتير
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80 text-sm">أول فاتورة شراء</span>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                    <span className="text-[hsl(120,70%,50%)] font-semibold text-sm">مرفقة</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80 text-sm">ثلاث فواتير مختلفة</span>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                    <span className="text-[hsl(120,70%,50%)] font-semibold text-sm">مرفقة</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80 text-sm">آخر فاتورة شراء</span>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[hsl(120,70%,50%)]" />
                    <span className="text-[hsl(120,70%,50%)] font-semibold text-sm">مرفقة</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-[hsl(195,80%,50%,0.1)] rounded-lg border border-[hsl(195,80%,50%,0.3)]">
                <p className="text-xs text-white/70">
                  ℹ️ ستتمكن من مشاهدة صور الفواتير بعد إتمام عملية الشراء
                </p>
              </div>
            </Card>

            {/* CTA */}
            <div className="space-y-3">
              <Button 
                asChild
                size="lg" 
                className="w-full gap-2 text-lg py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] border-0"
              >
                <Link to="/checkout">
                  <Shield className="h-5 w-5" />
                  شراء الآن بأمان
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                <Shield className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                <span>محمي بنظام الضمان لمدة 12 ساعة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default ProductDetails;
