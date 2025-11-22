import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Video, Copy, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { listingsApi } from "@/lib/api";
import { tiktokApi, type TikTokProfile } from "@/lib/tiktok-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast as sonnerToast } from "sonner";

const tiktokSchema = z.object({
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000),
  price: z.string().trim().min(1, "Price is required"),
  hasPrimaryEmail: z.boolean(),
  hasPhoneNumber: z.boolean(),
  agreeToPledge1: z.boolean().refine((val) => val === true, {
    message: "You must agree to the first pledge",
  }),
  agreeToPledge2: z.boolean().refine((val) => val === true, {
    message: "You must agree to the second pledge",
  }),
});

const TikTok = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if returning from OAuth
  const connected = searchParams.get('connected') === 'true';
  const oauthUsername = searchParams.get('username');

  // Get TikTok profile
  const { data: tiktokData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['tiktok-profile'],
    queryFn: () => tiktokApi.getProfile(),
    retry: false,
  });

  const tiktokProfile = tiktokData?.profile;
  const isConnected = tiktokData?.connected || false;

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      price: number;
      category: string;
      account_email: string;
      account_password: string;
      account_metadata: any;
      verification_code?: string;
    }) => listingsApi.create(data),
    onSuccess: () => {
      sonnerToast.success(t('listing.success'));
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      navigate("/my-listings");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create listing",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const [formData, setFormData] = useState({
    description: "",
    price: "",
    hasPrimaryEmail: false,
    hasPhoneNumber: false,
    agreeToPledge1: false,
    agreeToPledge2: false,
  });

  const [showBioDialog, setShowBioDialog] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [bioVerified, setBioVerified] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    email: "",
    password: "",
    instructions: "",
  });

  // Handle OAuth connection success
  useEffect(() => {
    if (connected && oauthUsername) {
      sonnerToast.success(t('tiktok.connected').replace('{username}', oauthUsername));
    }
  }, [connected, oauthUsername, language]);

  const handleConnectTikTok = async () => {
    try {
      const { authorization_url } = await tiktokApi.authorize();
      // Redirect to TikTok OAuth
      window.location.href = authorization_url;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect to TikTok",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: t('common.error'),
        description: t('tiktok.connectError'),
        variant: "destructive",
      });
      return;
    }

    try {
      tiktokSchema.parse(formData);
      
      // Generate verification code
      const code = Math.floor(1000000 + Math.random() * 9000000).toString();
      setVerificationCode(code);
      setBioVerified(false);
      
      // Show bio verification dialog
      setShowBioDialog(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleVerifyBio = async () => {
    try {
      setIsVerifying(true);
      
      const result = await tiktokApi.verifyBio(verificationCode);
      
      if (result.verified) {
        setBioVerified(true);
        sonnerToast.success(t('tiktok.bioVerified'));
        
        // Wait a moment then proceed to delivery info
        setTimeout(() => {
          setShowBioDialog(false);
          setShowDeliveryDialog(true);
        }, 1500);
      } else {
        toast({
          title: t('tiktok.verificationFailed'),
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify bio",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!bioVerified) {
      toast({
        title: t('common.error'),
        description: t('tiktok.pleaseVerifyBio'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      createListingMutation.mutate({
        title: `TikTok Account - @${tiktokProfile?.username || 'Unknown'}`,
        description: formData.description,
        price: parseFloat(formData.price),
        category: 'tiktok',
        account_email: deliveryData.email,
        account_password: deliveryData.password,
        verification_code: verificationCode,
        account_metadata: {
          tiktok_username: tiktokProfile?.username,
          tiktok_display_name: tiktokProfile?.display_name,
          tiktok_avatar: tiktokProfile?.avatar_url,
          tiktok_verified: tiktokProfile?.is_verified,
          has_primary_email: formData.hasPrimaryEmail,
          has_phone_number: formData.hasPhoneNumber,
          delivery_instructions: deliveryData.instructions,
          bio_verified: true,
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationCode);
    toast({
      title: t('tiktok.copied'),
      description: t('tiktok.codeCopied'),
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <Navbar />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <BackButton className="text-white/80 hover:text-white" />
        
        {/* TikTok Connection Card */}
        {!isConnected && !isLoadingProfile && (
          <Card className="mt-8 bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Video className="h-10 w-10 text-[hsl(180,100%,50%)]" />
                <div>
                  <CardTitle className="text-2xl text-white">
                    {t('tiktok.connectTitle')}
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    {t('tiktok.connectDescription')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="bg-blue-500/10 border-blue-500/20 mb-4">
                <AlertDescription className="text-white/90">
                  {t('tiktok.privacyNote')}
                </AlertDescription>
              </Alert>
              
              <Button
                onClick={handleConnectTikTok}
                className="w-full bg-[hsl(180,100%,50%)] hover:bg-[hsl(180,100%,45%)] text-black font-semibold"
                size="lg"
              >
                <Video className="h-5 w-5 mr-2" />
                {t('tiktok.connectButton')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Form (shows after connection) */}
        {isConnected && tiktokProfile && (
          <Card className="mt-8 bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={tiktokProfile.avatar_url}
                  alt={tiktokProfile.display_name}
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />
                <div className="flex-1">
                  <CardTitle className="text-2xl text-white">
                    {t('tiktok.sellAccount')}
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    @{tiktokProfile.username} {tiktokProfile.is_verified && '✓'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Alert className="bg-green-500/10 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-white/90">
                    {t('tiktok.connectedAs').replace('{name}', tiktokProfile.display_name)}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">{t('sell.price')}</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    {t('sell.social.accountDescription')}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t('sell.social.descriptionPlaceholder')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    maxLength={1000}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                  <p className="text-sm text-white/50">{formData.description.length}/1000</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="primaryEmail"
                      checked={formData.hasPrimaryEmail}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, hasPrimaryEmail: checked as boolean })
                      }
                      className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="primaryEmail" className="text-white cursor-pointer">
                      {t('sell.social.accountWithPrimaryEmail')}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="phoneNumber"
                      checked={formData.hasPhoneNumber}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, hasPhoneNumber: checked as boolean })
                      }
                      className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="phoneNumber" className="text-white cursor-pointer">
                      {t('sell.social.accountLinkedToPhone')}
                    </Label>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="pledge1"
                      checked={formData.agreeToPledge1}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agreeToPledge1: checked as boolean })
                      }
                      className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1"
                    />
                    <Label htmlFor="pledge1" className="text-white/90 cursor-pointer text-sm leading-relaxed">
                      {t('sell.social.pledge1')}
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="pledge2"
                      checked={formData.agreeToPledge2}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agreeToPledge2: checked as boolean })
                      }
                      className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1"
                    />
                    <Label htmlFor="pledge2" className="text-white/90 cursor-pointer text-sm leading-relaxed">
                      {t('sell.social.pledge2')}
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {t('tiktok.continue')}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bio Verification Dialog */}
      <Dialog open={showBioDialog} onOpenChange={setShowBioDialog}>
        <DialogContent className="bg-[hsl(220,15%,12%)] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
              {t('tiktok.verifyOwnership')}
            </DialogTitle>
            <DialogDescription className="text-white/60 text-center pt-2">
              {t('tiktok.addCodeToBio')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {!bioVerified ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-4">
                    <span className="flex-1 text-2xl font-mono text-center tracking-wider">
                      {verificationCode}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      className="text-primary hover:text-primary/80"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-sm text-white/70 space-y-2 p-3 bg-white/5 rounded-lg">
                    <p className="font-semibold">{t('tiktok.steps')}</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>{t('tiktok.step1')}</li>
                      <li>{t('tiktok.step2')}</li>
                      <li>{t('tiktok.step3')}</li>
                      <li>{t('tiktok.step4')}</li>
                      <li>{t('tiktok.step5')}</li>
                      <li>{t('tiktok.step6')}</li>
                      <li>{t('tiktok.step7')}</li>
                    </ol>
                  </div>
                </div>

                <Button
                  onClick={handleVerifyBio}
                  disabled={isVerifying}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {t('tiktok.verifying')}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {t('tiktok.verifyNow')}
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto" />
                <p className="text-lg text-green-400 font-semibold">
                  {t('tiktok.verifiedSuccess')}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delivery Information Dialog */}
      <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
        <DialogContent className="bg-[hsl(220,15%,12%)] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
              {t('sell.social.deliveryInfo.title')}
            </DialogTitle>
            <DialogDescription className="text-white/60 text-center pt-2">
              {t('sell.social.deliveryInfo.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="delivery-email" className="text-white">
                {t('sell.social.deliveryInfo.email')}
              </Label>
              <Input
                id="delivery-email"
                type="email"
                placeholder="example@email.com"
                value={deliveryData.email}
                onChange={(e) => setDeliveryData({ ...deliveryData, email: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery-password" className="text-white">
                {t('sell.social.deliveryInfo.password')}
              </Label>
              <Input
                id="delivery-password"
                type="password"
                placeholder="••••••••"
                value={deliveryData.password}
                onChange={(e) => setDeliveryData({ ...deliveryData, password: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery-instructions" className="text-white">
                {t('sell.social.deliveryInfo.instructions')}
              </Label>
              <Textarea
                id="delivery-instructions"
                placeholder={t('sell.social.deliveryInfo.instructionsPlaceholder')}
                value={deliveryData.instructions}
                onChange={(e) => setDeliveryData({ ...deliveryData, instructions: e.target.value })}
                rows={4}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <Button
              onClick={handleFinalSubmit}
              disabled={isSubmitting || !deliveryData.email || !deliveryData.password || !bioVerified}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isSubmitting ? t('listing.creating') : t('listing.create')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TikTok;

