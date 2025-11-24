import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, ArrowRight, Save, Loader2, Camera, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

const EditProfile = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [hasChanges, setHasChanges] = useState(false);

  // Detect changes
  useEffect(() => {
    const changed = 
      formData.name !== (user?.name || "") ||
      formData.email !== (user?.email || "") ||
      formData.phone !== (user?.phone || "");
    setHasChanges(changed);
  }, [formData, user]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; email?: string; phone?: string }) =>
      authApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success(t('editProfile.updateSuccess'));
      navigate("/profile");
    },
    onError: (error: any) => {
      toast.error(error.message || t('editProfile.updateError'));
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => authApi.updateAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success(t('editProfile.avatarUpdateSuccess'));
      setSelectedAvatar(null);
      setAvatarPreview(null);
    },
    onError: (error: any) => {
      toast.error(error.message || t('editProfile.avatarUpdateError'));
    },
  });

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t('editProfile.invalidImageType'));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('editProfile.imageTooLarge'));
      return;
    }

    setSelectedAvatar(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = () => {
    if (!selectedAvatar) return;
    uploadAvatarMutation.mutate(selectedAvatar);
  };

  const handleAvatarCancel = () => {
    setSelectedAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error(t('editProfile.nameRequired'));
      return;
    }
    if (formData.name.trim().length < 3) {
      toast.error(t('editProfile.nameMinLength'));
      return;
    }
    if (formData.name.length > 100) {
      toast.error(t('editProfile.nameTooLong'));
      return;
    }
    if (!formData.email.trim()) {
      toast.error(t('editProfile.emailRequired'));
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast.error(t('editProfile.invalidEmail'));
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <>
      <SEO 
        title={`${t('editProfile.title')} - NXOLand`}
        description={t('editProfile.pageDescription')}
        noIndex={true}
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />

        {/* Skip link for keyboard navigation */}
        <a 
          href="#edit-profile-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          {t('editProfile.skipToForm')}
        </a>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div id="edit-profile-content" className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-2xl pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/profile" className="inline-flex items-center gap-2 text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] transition-colors mb-4">
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
            <span>{t('editProfile.backToProfile')}</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{t('editProfile.pageTitle')}</h1>
          <p className="text-white/60">{t('editProfile.updateInfo')}</p>
        </div>

        {/* Edit Form */}
        <Card className="p-6 md:p-8 bg-white/5 border-white/10 backdrop-blur-sm">
          {hasChanges && (
            <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">لديك تغييرات غير محفوظة</p>
            </div>
          )}
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-white/10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt={t('editProfile.avatarPreview')}
                      className="w-full h-full object-cover"
                    />
                  ) : user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-white" aria-hidden="true" />
                  )}
                </div>
                {!selectedAvatar && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] flex items-center justify-center transition-all shadow-lg"
                    aria-label={t('editProfile.changeAvatar')}
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
                aria-label={t('editProfile.selectImage')}
              />

              {selectedAvatar ? (
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={uploadAvatarMutation.isPending}
                    className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white"
                  >
                    {uploadAvatarMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('editProfile.uploading')}
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {t('editProfile.upload')}
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleAvatarCancel}
                    disabled={uploadAvatarMutation.isPending}
                    className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              ) : (
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {t('editProfile.changeAvatar')}
                </Button>
              )}
              <p className="text-xs text-white/40 text-center">
                {t('editProfile.avatarHint')}
              </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">{t('editProfile.name')}</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pr-12 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  disabled={updateProfileMutation.isPending}
                  aria-label={t('profile.edit.fullNameAriaLabel')}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pr-12 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  disabled={updateProfileMutation.isPending}
                  aria-label={t('profile.edit.emailAriaLabel')}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">رقم الهاتف</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pr-12 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  disabled={updateProfileMutation.isPending}
                  aria-label={t('profile.edit.phoneAriaLabel')}
                />
              </div>
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSave}
              disabled={updateProfileMutation.isPending || !hasChanges}
              className="w-full gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0 min-h-[48px]"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" aria-hidden="true" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </div>
        </Card>
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" aria-hidden="true" />
        
        {/* Bottom Navigation for Mobile */}
        <BottomNav />
      </div>
    </>
  );
};

export default EditProfile;
