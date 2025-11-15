import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import { VALIDATION_RULES } from "@/config/constants";
import { isValidPassword } from "@/lib/utils/validation";
import type { ApiError } from "@/types/api";

const ResetPassword = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailFromLink = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    email: emailFromLink,
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);

  const isLinkValid = Boolean(token && emailFromLink);

  const handleChange = (field: "email" | "password" | "password_confirmation") => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isLinkValid) {
      toast.error(t("auth.passwordResetInvalidLink"));
      return;
    }

    if (!formData.email) {
      toast.error(t("auth.invalidEmail"));
      return;
    }

    if (!isValidPassword(formData.password)) {
      toast.error(t("auth.passwordTooShort", { count: VALIDATION_RULES.PASSWORD_MIN_LENGTH }));
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        ...formData,
        token,
      });
      toast.success(t("auth.passwordResetComplete"));
      navigate("/auth");
    } catch (error) {
      const apiError = error as Error & ApiError;
      toast.error(apiError.message || t("auth.passwordResetError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={`${t("auth.setNewPasswordTitle")} - NXOLand`}
        description={t("auth.setNewPasswordDescription")}
      />
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-md px-4">
          <Card className="p-6 md:p-8 bg-white/5 border-white/10 backdrop-blur-md">
            <h1 className="text-2xl font-black text-white mb-2">{t("auth.setNewPasswordTitle")}</h1>
            <p className="text-white/60 text-sm mb-6">{t("auth.setNewPasswordDescription")}</p>

            {isLinkValid ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-white">{t("auth.email")}</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reset-password" className="text-white">{t("auth.password")}</Label>
                  <Input
                    id="reset-password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reset-password-confirmation" className="text-white">{t("auth.confirmPassword")}</Label>
                  <Input
                    id="reset-password-confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange("password_confirmation")}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
                >
                  {loading ? t("common.processing") : t("auth.passwordResetSubmitNew")}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-white/80">
                <p>{t("auth.passwordResetInvalidLink")}</p>
                <Button asChild variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                  <Link to="/auth">{t("auth.passwordResetBackToLogin")}</Link>
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;

