import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Plus, X, ShieldAlert, Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { listingsApi, imagesApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";
import { GAMES, getGameById } from "@/config/games";

const SellGame = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // Get game info
  const game = gameId ? getGameById(gameId) : undefined;

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(200,70%,15%)] to-[hsl(195,60%,25%)] px-4 py-12">
        <Card className="max-w-xl w-full p-6 bg-white/5 border-white/10 backdrop-blur-sm space-y-5">
          <h1 className="text-2xl font-black text-white">{t('sell.game.notFound')}</h1>
          <p className="text-white/70">{t('sell.game.notFoundDescription')}</p>
          <Button
            onClick={() => navigate('/sell/gaming')}
            className="w-full justify-center gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white"
          >
            {t('sell.game.backToGames')}
          </Button>
        </Card>
      </div>
    );
  }

  if (user && !user.is_verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(200,70%,15%)] to-[hsl(195,60%,25%)] px-4 py-12">
        <Card className="max-w-xl w-full p-6 bg-white/5 border-white/10 backdrop-blur-sm space-y-5">
          <h1 className="text-2xl font-black text-white">{t('sell.wos.kycRequired')}</h1>
          <p className="text-white/70">{t('sell.wos.kycDescription1')}</p>
          <p className="text-white/70">{t('sell.wos.kycDescription2')}</p>
          <Button
            asChild
            className="w-full justify-center gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white"
          >
            <Link to="/kyc">{t('sell.wos.startVerification')}</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [deliveryDescription, setDeliveryDescription] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // Already revoked or invalid
        }
      });
    };
  }, [images]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 8) {
      toast.error(t('listing.maxImages'));
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const newImages: string[] = [];
    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > MAX_FILE_SIZE) {
        toast.error(t('listing.imageTooLarge', { name: file.name, size: (file.size / 1024 / 1024).toFixed(1) }));
        continue;
      }
      
      const previewUrl = URL.createObjectURL(file);
      newImages.push(previewUrl);
      newFiles.push(file);
    }
    
    if (newImages.length === 0) {
      return;
    }

    setImages(prev => [...prev, ...newImages]);
    setImageFiles(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    const urlToRevoke = images[index];
    URL.revokeObjectURL(urlToRevoke);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: (data: { 
      title: string; 
      description: string; 
      price: number; 
      category: string; 
      images?: string[];
      account_email: string;
      account_password: string;
      account_metadata?: any;
    }) => listingsApi.create(data),
    onSuccess: () => {
      toast.success(t('listing.published'));
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      navigate('/my-listings');
    },
    onError: (error: Error) => {
      const apiError = error as Error & ApiError;
      
      if ('error_code' in apiError) {
        const errorCode = (apiError as any).error_code;
        
        if (errorCode === 'PRICE_TOO_LOW') {
          toast.error(t('listing.priceTooLow'));
        } else if (errorCode === 'DUPLICATE_LISTING_DETECTED') {
          toast.error(t('listing.duplicateDetected'));
        } else if (errorCode === 'MAX_ACTIVE_LISTINGS_REACHED') {
          toast.error(t('listing.maxListingsReached'));
        } else {
          toast.error(apiError.message || t('listing.uploadFailed'));
        }
      } else {
        toast.error(apiError.message || t('listing.uploadFailed'));
      }
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error(t('listing.titleRequired'));
      return;
    }

    if (!description.trim()) {
      toast.error(t('listing.descriptionRequired') || 'Description is required');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error(t('listing.priceRequired'));
      return;
    }

    if (images.length === 0) {
      toast.error(t('listing.imagesRequired'));
      return;
    }

    if (!termsAccepted) {
      toast.error(t('listing.termsAcceptanceRequired'));
      return;
    }

    if (!accountEmail || !accountPassword) {
      toast.error(t('listing.accountCredentialsRequired'));
      return;
    }

    try {
      toast.info(t('listing.uploadingImages'));
      const uploadedUrls = await imagesApi.upload(imageFiles);

      // Build account metadata
      const accountMetadata = {
        delivery_description: deliveryDescription.trim(),
      };

      // Create listing
      createListingMutation.mutate({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: game.category,
        images: uploadedUrls,
        account_email: accountEmail,
        account_password: accountPassword,
        account_metadata: accountMetadata,
      });
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast.error(t('listing.uploadFailed'));
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Particles */}
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
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <BackButton />
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            {language === 'ar' && game.nameAr ? game.nameAr : game.name} - {t('nav.sell')}
          </h1>
          <p className="text-white/60">{t('sell.gaming.description')}</p>
        </div>

        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-white">
                {t('listing.title')} *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('listing.titlePlaceholder')}
                className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-white">
                {t('listing.description')} *
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('listing.descriptionPlaceholder') || 'Describe your account...'}
                className="mt-2 w-full min-h-[120px] px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,50%)]"
                required
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price" className="text-white">
                {t('listing.price')} *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                required
              />
            </div>

            {/* Images */}
            <div>
              <Label className="text-white">
                {t('listing.images')} * (Max 8)
              </Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                {images.length < 8 && (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="h-32 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center hover:border-white/40 transition-colors"
                  >
                    <Plus className="h-6 w-6 text-white/60" />
                  </button>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Account Credentials */}
            <div className="space-y-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <ShieldAlert className="h-5 w-5 text-yellow-500 mt-0.5" />
                <p className="text-sm text-yellow-200">
                  {t('listing.credentialsSecurityNote') || 'Your credentials will be encrypted and only shared with the buyer after payment.'}
                </p>
              </div>

              <div>
                <Label htmlFor="accountEmail" className="text-white">
                  {t('listing.accountEmail')} *
                </Label>
                <Input
                  id="accountEmail"
                  type="email"
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                  placeholder={t('listing.accountEmailPlaceholder')}
                  className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  required
                />
              </div>

              <div>
                <Label htmlFor="accountPassword" className="text-white">
                  {t('listing.accountPassword')} *
                </Label>
                <Input
                  id="accountPassword"
                  type="password"
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder={t('listing.accountPasswordPlaceholder')}
                  className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  required
                />
              </div>
            </div>

            {/* Delivery Description */}
            <div>
              <Label htmlFor="deliveryDescription" className="text-white">
                {t('listing.deliveryDescription') || 'Delivery Instructions (Optional)'}
              </Label>
              <textarea
                id="deliveryDescription"
                value={deliveryDescription}
                onChange={(e) => setDeliveryDescription(e.target.value)}
                placeholder={t('listing.deliveryDescriptionPlaceholder') || 'Instructions for account delivery...'}
                className="mt-2 w-full min-h-[80px] px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,50%)]"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1"
                required
              />
              <Label htmlFor="terms" className="text-white/80 text-sm">
                {t('listing.termsAcceptance') || 'I agree to the terms and conditions'}
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={createListingMutation.isPending}
              className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white"
            >
              {createListingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('listing.publishing')}
                </>
              ) : (
                t('listing.publish')
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SellGame;

