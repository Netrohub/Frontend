import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User as UserIcon, ArrowRight, Snowflake } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { sanitizeString, isValidEmail, isValidPassword } from "@/lib/utils/validation";
import { VALIDATION_RULES, ANIMATION_CONFIG } from "@/config/constants";
import type { ApiError } from "@/types/api";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!isValidEmail(loginData.email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    
    if (!isValidPassword(loginData.password)) {
      toast.error(`كلمة المرور يجب أن تكون ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} أحرف على الأقل`);
      return;
    }
    
    setLoading(true);
    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeString(loginData.email);
      await login(sanitizedEmail, loginData.password); // Password shouldn't be sanitized
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/");
    } catch (error) {
      const apiError = error as Error & ApiError;
      toast.error(apiError.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (registerData.name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      toast.error(`الاسم يجب أن يكون ${VALIDATION_RULES.NAME_MIN_LENGTH} أحرف على الأقل`);
      return;
    }
    
    if (!isValidEmail(registerData.email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    
    if (!isValidPassword(registerData.password)) {
      toast.error(`كلمة المرور يجب أن تكون ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} أحرف على الأقل`);
      return;
    }
    
    if (registerData.password !== registerData.password_confirmation) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }
    
    setLoading(true);
    try {
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeString(registerData.name),
        email: sanitizeString(registerData.email),
        password: registerData.password, // Don't sanitize passwords
        password_confirmation: registerData.password_confirmation,
        phone: registerData.phone ? sanitizeString(registerData.phone) : undefined,
      };
      
      await register(sanitizedData);
      toast.success("تم إنشاء الحساب بنجاح");
      navigate("/");
    } catch (error) {
      const apiError = error as Error & ApiError;
      toast.error(apiError.message || "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {useMemo(() => 
          [...Array(ANIMATION_CONFIG.SNOW_PARTICLES_COUNT)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDuration: `${ANIMATION_CONFIG.SNOW_FALL_DURATION_MIN + Math.random() * (ANIMATION_CONFIG.SNOW_FALL_DURATION_MAX - ANIMATION_CONFIG.SNOW_FALL_DURATION_MIN)}s`,
                animationDelay: `${Math.random() * ANIMATION_CONFIG.SNOW_DELAY_MAX}s`,
              }}
            />
          )), []
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <Snowflake className="h-12 w-12 text-[hsl(195,80%,70%)]" />
            <span className="text-3xl font-black text-white">
              NXO<span className="text-[hsl(40,90%,55%)]">Land</span>
            </span>
          </Link>
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
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      autoComplete="email"
                      required
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
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,70%)] focus:ring-offset-2 rounded px-1"
                    aria-label="نسيت كلمة المرور"
                    onClick={() => toast.info("ميزة استعادة كلمة المرور قريباً")}
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full gap-2 py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold border-0"
                >
                  {loading ? "جاري المعالجة..." : "تسجيل الدخول"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">الاسم الكامل</Label>
                  <div className="relative">
                    <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <Input 
                      id="name"
                      type="text"
                      placeholder="الاسم الكامل"
                      className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
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
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">رقم الهاتف (اختياري)</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder="05xxxxxxxx"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    autoComplete="tel"
                  />
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
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      autoComplete="new-password"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-confirm" className="text-white">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <Input 
                      id="password-confirm"
                      type="password"
                      placeholder="••••••••"
                      className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={registerData.password_confirmation}
                      onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full gap-2 py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold border-0"
                >
                  {loading ? "جاري المعالجة..." : "إنشاء حساب"}
                  <ArrowRight className="h-5 w-5" />
                </Button>

                <p className="text-center text-sm text-white/60">
                  بإنشاء حساب، أنت توافق على{" "}
                  <Link to="/terms" className="text-[hsl(195,80%,70%)] hover:underline">الشروط والأحكام</Link>
                  {" "}و{" "}
                  <Link to="/privacy" className="text-[hsl(195,80%,70%)] hover:underline">سياسة الخصوصية</Link>
                </p>
              </form>
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
