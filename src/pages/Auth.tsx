import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User as UserIcon, ArrowRight, Snowflake } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { sanitizeString, isValidEmail, isValidPassword } from "@/lib/utils/validation";
import { VALIDATION_RULES, ANIMATION_CONFIG } from "@/config/constants";
import type { ApiError } from "@/types/api";
import { Turnstile } from "@/components/Turnstile";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
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
    
    // Turnstile validation
    if (!turnstileToken) {
      toast.error(t('auth.securityVerification'));
      return;
    }
    
    // Client-side validation
    if (!isValidEmail(loginData.email)) {
      toast.error(t('auth.invalidEmail'));
      return;
    }
    
    if (!isValidPassword(loginData.password)) {
      toast.error(`${t('auth.passwordTooShort')} ${VALIDATION_RULES.PASSWORD_MIN_LENGTH}`);
      return;
    }
    
    setLoading(true);
    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeString(loginData.email);
      await login(sanitizedEmail, loginData.password, turnstileToken);
      toast.success(t('auth.loginSuccess'));
      navigate("/");
    } catch (error) {
      const apiError = error as Error & ApiError;
      toast.error(apiError.message || t('auth.loginError'));
      setTurnstileToken(""); // Reset turnstile on error
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Turnstile validation
    if (!turnstileToken) {
      toast.error("يرجى إكمال التحقق الأمني");
      return;
    }
    
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
        turnstile_token: turnstileToken,
      };
      
      await register(sanitizedData);
      toast.success("تم إنشاء الحساب بنجاح");
      navigate("/");
    } catch (error) {
      const apiError = error as Error & ApiError;
      toast.error(apiError.message || "فشل إنشاء الحساب");
      setTurnstileToken(""); // Reset turnstile on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="تسجيل الدخول - NXOLand"
        description="سجل دخولك إلى NXOLand لبدء تداول الحسابات بأمان. منصة موثوقة لشراء وبيع حسابات الألعاب."
      />
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center" dir="rtl">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />
        
        {/* Skip link for keyboard navigation */}
        <a 
          href="#auth-form" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          تخطي إلى نموذج التسجيل
        </a>
        
        {/* Snow particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {useMemo(() => 
            [...Array(30)].map((_, i) => (
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

          <Card id="auth-form" className="p-6 bg-white/5 border-white/10 backdrop-blur-md">
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
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      autoComplete="email"
                      aria-label="البريد الإلكتروني"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                    <Input 
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      autoComplete="current-password"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck="false"
                      aria-label="كلمة المرور"
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

                <Turnstile 
                  onVerify={setTurnstileToken}
                  className="flex justify-center"
                />

                <Button 
                  type="submit"
                  disabled={loading || !turnstileToken}
                  className="w-full gap-2 py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold border-0 disabled:opacity-50"
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
                    <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                    <Input 
                      id="name"
                      type="text"
                      placeholder="الاسم الكامل"
                      className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      aria-label="الاسم الكامل"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-register" className="text-white">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                    <Input 
                      id="email-register"
                      type="email"
                      placeholder="example@email.com"
                      className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      autoComplete="email"
                      aria-label="البريد الإلكتروني"
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
                    aria-label="رقم الهاتف"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-register" className="text-white">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                    <Input 
                      id="password-register"
                      type="password"
                      placeholder="••••••••"
                      className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      autoComplete="new-password"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck="false"
                      aria-label="كلمة المرور"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-confirm" className="text-white">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                    <Input 
                      id="password-confirm"
                      type="password"
                      placeholder="••••••••"
                      className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={registerData.password_confirmation}
                      onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                      autoComplete="new-password"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck="false"
                      aria-label="تأكيد كلمة المرور"
                      required
                    />
                  </div>
                </div>

                <Turnstile 
                  onVerify={setTurnstileToken}
                  className="flex justify-center"
                />

                <Button 
                  type="submit"
                  disabled={loading || !turnstileToken}
                  className="w-full gap-2 py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold border-0 disabled:opacity-50"
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
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[hsl(200,70%,40%,0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} aria-hidden="true" />
      </div>
    </>
  );
};

export default Auth;
