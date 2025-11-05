import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Video, Copy, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";

const tiktokSchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(100),
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
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    description: "",
    price: "",
    hasPrimaryEmail: false,
    hasPhoneNumber: false,
    agreeToPledge1: false,
    agreeToPledge2: false,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [deliveryData, setDeliveryData] = useState({
    email: "",
    password: "",
    instructions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      tiktokSchema.parse(formData);
      
      // Generate verification code
      const code = Math.floor(1000000 + Math.random() * 9000000).toString();
      setVerificationCode(code);
      
      // Show confirmation dialog
      setShowConfirmDialog(true);
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

  const handleConfirmOwnership = () => {
    // Close ownership dialog and open delivery dialog
    setShowConfirmDialog(false);
    setShowDeliveryDialog(true);
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Simulate API call with all data
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: t('listing.success'),
        description: t('listing.successDescription'),
      });

      navigate("/my-listings");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationCode);
    toast({
      title: "Copied!",
      description: "Verification code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Snow particles */}
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
        
        <Card className="mt-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 flex items-center justify-center">
                <Video className="h-10 w-10 text-[hsl(180,100%,50%)]" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">{t('sell.social.tiktok.title')}</CardTitle>
                <CardDescription className="text-white/60">{t('sell.social.tiktok.subtitle')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  {t('sell.social.tiktok.username')}
                </Label>
                <Input
                  id="username"
                  placeholder="@username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  maxLength={100}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">
                  {t('sell.price')}
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="100"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>

              {/* Description */}
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
                <p className="text-sm text-white/50">
                  {formData.description.length}/1000
                </p>
              </div>

              {/* Account Details Checkboxes */}
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
                  <Label
                    htmlFor="primaryEmail"
                    className="text-white cursor-pointer"
                  >
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
                  <Label
                    htmlFor="phoneNumber"
                    className="text-white cursor-pointer"
                  >
                    {t('sell.social.accountLinkedToPhone')}
                  </Label>
                </div>
              </div>

              {/* Pledge Agreement */}
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
                  <Label
                    htmlFor="pledge1"
                    className="text-white/90 cursor-pointer text-sm leading-relaxed"
                  >
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
                  <Label
                    htmlFor="pledge2"
                    className="text-white/90 cursor-pointer text-sm leading-relaxed"
                  >
                    {t('sell.social.pledge2')}
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {t('listing.create')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-[hsl(220,15%,12%)] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
              {t('sell.social.confirmOwnership.title')}
            </DialogTitle>
            <DialogDescription className="text-white/60 text-center pt-2">
              {t('sell.social.confirmOwnership.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <p className="text-sm text-white/80 text-center">
                {t('sell.social.confirmOwnership.instruction')}
              </p>
              <p className="text-xs text-white/60 text-center">
                {t('sell.social.confirmOwnership.theWord')}
              </p>
              
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
                <span className="flex-1 text-lg font-mono text-center">
                  {verificationCode}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-primary hover:text-primary/80 hover:bg-white/5"
                >
                  <Copy className="h-4 w-4" />
                  <span className="ml-1 text-sm">{t('sell.social.confirmOwnership.copy')}</span>
                </Button>
              </div>
            </div>

            <Button
              onClick={handleConfirmOwnership}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {t('sell.social.confirmOwnership.confirm')}
            </Button>
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
              disabled={isSubmitting || !deliveryData.email || !deliveryData.password}
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
