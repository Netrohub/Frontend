import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Snowflake, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Snowflake className="h-12 w-12 text-[hsl(195,80%,70%)]" />
            <span className="text-3xl font-black text-white">
              منصة<span className="text-[hsl(40,90%,55%)]">التداول</span>
            </span>
          </div>
          <p className="text-white/60">تداول آمن وموثوق للحسابات</p>
        </div>

        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5">
              <TabsTrigger value="login" className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white">
                تسجيل الدخول
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white">
                إنشاء حساب
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <a href="#" className="text-sm text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)]">
                  نسيت كلمة المرور؟
                </a>
              </div>

              <Button 
                className="w-full gap-2 py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold border-0"
              >
                تسجيل الدخول
                <ArrowRight className="h-5 w-5" />
              </Button>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">الاسم الكامل</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input 
                    id="name"
                    type="text"
                    placeholder="الاسم الكامل"
                    className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-register" className="text-white">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input 
                    id="email-register"
                    type="email"
                    placeholder="example@email.com"
                    className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-register" className="text-white">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input 
                    id="password-register"
                    type="password"
                    placeholder="••••••••"
                    className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <Button 
                className="w-full gap-2 py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold border-0"
              >
                إنشاء حساب
                <ArrowRight className="h-5 w-5" />
              </Button>

              <p className="text-center text-sm text-white/60">
                بإنشاء حساب، أنت توافق على{" "}
                <a href="#" className="text-[hsl(195,80%,70%)] hover:underline">الشروط والأحكام</a>
              </p>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-white/60 hover:text-[hsl(195,80%,70%)] transition-colors">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[hsl(200,70%,40%,0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default Auth;
