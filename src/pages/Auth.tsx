import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
import { authApi } from "@/lib/api";

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
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

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
      toast.error(t('auth.passwordTooShort', { count: VALIDATION_RULES.PASSWORD_MIN_LENGTH }));
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
      toast.error(t('auth.securityVerification'));
      return;
    }
    
    // Client-side validation
    if (registerData.name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      toast.error(t('auth.nameTooShort', { count: VALIDATION_RULES.NAME_MIN_LENGTH }));
      return;
    }
    
    if (!isValidEmail(registerData.email)) {
      toast.error(t('auth.invalidEmail'));
      return;
    }
    
    if (!isValidPassword(registerData.password)) {
      toast.error(t('auth.passwordTooShort', { count: VALIDATION_RULES.PASSWORD_MIN_LENGTH }));
      return;
    }
    
    if (registerData.password !== registerData.password_confirmation) {
      toast.error(t('auth.passwordMismatch'));
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
      toast.success(t('auth.registerSuccess'));
      navigate("/");
    } catch (error) {
      const apiError = error as Error & ApiError;
      toast.error(apiError.message || t('auth.registerError'));
      setTurnstileToken(""); // Reset turnstile on error
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(resetEmail)) {
      toast.error(t('auth.invalidEmail'));
      return;
    }

    setResetLoading(true);

    try {
      await authApi.requestPasswordReset(resetEmail);
      toast.success(t('auth.passwordResetSuccess'));
      setResetDialogOpen(false);
      setResetEmail("");
    } catch (error) {
      const apiError = error as Error & ApiError;
      toast.error(apiError.message || t('auth.passwordResetError'));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="تسجيل الدخول - NXOLand"
        description="سجل دخولك إلى منصة NXOLand لتداول الحسابات بأمان"
      />
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{t('auth.passwordResetTitle')}</DialogTitle>
            <DialogDescription className="text-white/70">
              {t('auth.passwordResetDescription')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-sm font-medium text-white">
                {t('auth.email')}
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="example@email.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                autoComplete="email"
                required
              />
            </div>
            <DialogFooter className="sm:space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetDialogOpen(false)}
                disabled={resetLoading}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {t('auth.passwordResetCancel')}
              </Button>
              <Button
                type="submit"
                disabled={resetLoading}
                className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
              >
                {resetLoading ? t('common.processing') : t('auth.passwordResetSubmit')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />
        
        {/* Skip link for keyboard navigation */}
        <a 
          href="#auth-form" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          {t('auth.skipToForm')}
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
            <p className="text-white/60">{t('auth.tagline')}</p>
          </div>

          <Card id="auth-form" className="p-6 bg-white/5 border-white/10 backdrop-blur-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5">
              <TabsTrigger value="login" className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white">
                {t('auth.login')}
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-[hsl(195,80%,50%)] data-[state=active]:text-white">
                {t('auth.register')}
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">{t('auth.email')}</Label>
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
                      aria-label={t('auth.email')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">{t('auth.password')}</Label>
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
                      aria-label={t('auth.password')}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,70%)] focus:ring-offset-2 rounded px-1"
                    aria-label={t('auth.forgotPassword')}
                    onClick={() => {
                      setResetEmail(loginData.email);
                      setResetDialogOpen(true);
                    }}
                  >
                    {t('auth.forgotPassword')}
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
                  {loading ? t('common.processing') : t('auth.login')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">{t('auth.fullName')}</Label>
                  <div className="relative">
                    <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                    <Input 
                      id="name"
                      type="text"
                      placeholder={t('auth.fullName')}
                      className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      aria-label={t('auth.fullName')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-register" className="text-white">{t('auth.email')}</Label>
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
                      aria-label={t('auth.email')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">{t('auth.phone')}</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder="05xxxxxxxx"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    autoComplete="tel"
                    aria-label={t('auth.phone')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-register" className="text-white">{t('auth.password')}</Label>
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
                      aria-label={t('auth.password')}
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-confirm" className="text-white">{t('auth.confirmPassword')}</Label>
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
                      aria-label={t('auth.confirmPassword')}
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
                  {loading ? t('common.processing') : t('auth.register')}
                  <ArrowRight className="h-5 w-5" />
                </Button>

                <p className="text-center text-sm text-white/60">
                  {t('auth.termsAgreement')}{" "}
                  <Link to="/terms" className="text-[hsl(195,80%,70%)] hover:underline">{t('auth.terms')}</Link>
                  {" "}{t('common.and')}{" "}
                  <Link to="/privacy" className="text-[hsl(195,80%,70%)] hover:underline">{t('auth.privacy')}</Link>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-white/60 hover:text-[hsl(195,80%,70%)] transition-colors">
            {t('common.backToHome')}
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
