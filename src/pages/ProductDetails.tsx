import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Snowflake, Shield, Star, MapPin, ArrowRight, CheckCircle2, Users } from "lucide-react";
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
              
              <h1 className="text-4xl font-black text-white mb-4">حساب مميز - المستوى 45</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-[hsl(40,90%,55%)]">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-bold">4.9</span>
                  <span className="text-white/60 text-sm">(127 تقييم)</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4" />
                  <span>Server 101</span>
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
                  <div className="font-bold text-white">محمد العتيبي</div>
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

            {/* Features */}
            <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4">مميزات الحساب</h3>
              <div className="space-y-3">
                {[
                  "المستوى 45 - تقدم كبير في اللعبة",
                  "موارد وفيرة ومخزون ضخم",
                  "أبطال نادرون ومعدات قوية",
                  "عضوية في تحالف نشط",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(195,80%,70%)] flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
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
