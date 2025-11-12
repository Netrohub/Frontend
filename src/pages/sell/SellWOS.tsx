import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Plus, X, ShieldAlert, ArrowRight, Users, Zap, MapPin, GraduationCap, PawPrint, Crown, Swords, Loader2, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import stoveLv1 from "@/assets/stove_lv_1.png";
import stoveLv2 from "@/assets/stove_lv_2.png";
import stoveLv3 from "@/assets/stove_lv_3.png";
import stoveLv4 from "@/assets/stove_lv_4.png";
import stoveLv5 from "@/assets/stove_lv_5.png";
import stoveLv6 from "@/assets/stove_lv_6.png";
import stoveLv7 from "@/assets/stove_lv_7.png";
import stoveLv8 from "@/assets/stove_lv_8.png";
import stoveLv9 from "@/assets/stove_lv_9.png";
import stoveLv10 from "@/assets/stove_lv_10.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { listingsApi, imagesApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";

const SellWOS = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const billImagesInstructions = language === 'ar'
    ? 'قم برفع لقطات من فواتير الشراء — ستُعرض للمشتري بعد الدفع.'
    : 'Upload purchase receipts — visible to the buyer after payment confirmation.';
  const billImagesSecurityNote = language === 'ar'
    ? 'معلومات الحساب ستكون محمية ومشفرة. سيتم عرضها للمشتري فقط بعد إتمام عملية الدفع.'
    : 'Account information is protected and encrypted. It will be visible to the buyer only after payment is completed.';
  const isVerified = user?.is_verified || false;

  // Form state
  const [title, setTitle] = useState("");
  const [server, setServer] = useState("");
  const [price, setPrice] = useState("");
  const [stoveLevel, setStoveLevel] = useState("");
  const [helios, setHelios] = useState<string[]>([]);
  const [troops, setTroops] = useState("");
  const [totalPower, setTotalPower] = useState("");
  const [heroPower, setHeroPower] = useState("");
  const [island, setIsland] = useState("");
  const [expertPower, setExpertPower] = useState("");
  const [heroTotalPower, setHeroTotalPower] = useState("");
  const [petPower, setPetPower] = useState("");
  const [hasEmail, setHasEmail] = useState("no");
  const [hasApple, setHasApple] = useState("no");
  const [hasGoogle, setHasGoogle] = useState("no");
  const [hasFacebook, setHasFacebook] = useState("no");
  const [hasGameCenter, setHasGameCenter] = useState("no");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [billImages, setBillImages] = useState<{ first: string | null; three: string | null; last: string | null }>({
    first: null,
    three: null,
    last: null,
  });
  const [billFiles, setBillFiles] = useState<{ first: File | null; three: File | null; last: File | null }>({
    first: null,
    three: null,
    last: null,
  });

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const billFirstRef = useRef<HTMLInputElement>(null);
  const billThreeRef = useRef<HTMLInputElement>(null);
  const billLastRef = useRef<HTMLInputElement>(null);

  // Handle image upload - convert to preview URLs immediately, upload on submit
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 8) {
      toast.error(t('listing.maxImages'));
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    // Create preview URLs and store files
    const newImages: string[] = [];
    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(t('listing.imageTooLarge', { name: file.name, size: (file.size / 1024 / 1024).toFixed(1) }));
        continue; // Skip this file
      }
      
      const previewUrl = URL.createObjectURL(file);
      newImages.push(previewUrl);
      newFiles.push(file);
    }
    
    if (newImages.length === 0) {
      return; // All files were too large
    }
    
    setImages([...images, ...newImages]);
    setImageFiles([...imageFiles, ...newFiles]);
  };

  // Handle bill image upload - create preview
  const handleBillImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'first' | 'three' | 'last') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t('listing.imageTooLargeCurrent', { size: (file.size / 1024 / 1024).toFixed(1) }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setBillImages({ ...billImages, [type]: previewUrl });
    setBillFiles({ ...billFiles, [type]: file });
  };

  // Handle helios checkbox
  const handleHeliosChange = (value: string) => {
    if (value === "none") {
      setHelios([]);
    } else {
      setHelios(prev => 
        prev.includes(value) 
          ? prev.filter(h => h !== value)
          : [...prev, value]
      );
    }
  };

  // Helper function for numeric input validation
  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    // Allow only numbers and commas
    const cleaned = value.replace(/[^\d,]/g, '');
    setter(cleaned);
  };

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Revoke all listing image URLs
      images.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // Already revoked or invalid
        }
      });
      
      // Revoke all bill image URLs
      [billImages.first, billImages.three, billImages.last].forEach(url => {
        if (url) {
          try {
            URL.revokeObjectURL(url);
          } catch (e) {
            // Already revoked or invalid
          }
        }
      });
    };
  }, [images, billImages]);

  // Handle cancel with confirmation
  const handleCancel = () => {
    const hasData = title || images.length > 0 || accountEmail || accountPassword || 
                   server || price || stoveLevel || troops || totalPower;
    
    if (hasData) {
      const confirmed = window.confirm(
        'هل أنت متأكد من الإلغاء؟ ستفقد جميع البيانات المدخلة.'
      );
      if (!confirmed) return;
    }
    
    navigate('/my-listings');
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
      
      // Handle specific error codes
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

    if (!isVerified) {
      toast.error(t('listing.verificationRequired'));
      return;
    }

    // Validation
    if (!title.trim()) {
      toast.error(t('listing.titleRequired'));
      return;
    }

    if (!server) {
      toast.error(t('listing.serverRequired'));
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error(t('listing.priceRequired'));
      return;
    }

    if (!stoveLevel) {
      toast.error(t('listing.stoveLevelRequired'));
      return;
    }

    if (!troops || !totalPower || !heroPower || !island || !expertPower || !heroTotalPower || !petPower) {
      toast.error(t('listing.allFieldsRequired'));
      return;
    }

    if (images.length === 0) {
      toast.error(t('listing.imagesRequired'));
      return;
    }

    if (!billImages.first || !billImages.three || !billImages.last) {
      toast.error(t('listing.billImagesRequired'));
      return;
    }

    if (!accountEmail || !accountPassword) {
      toast.error(t('listing.accountCredentialsRequired'));
      return;
    }

    try {
      // Collect all File objects
      const allFiles: File[] = [];

      // Add listing images
      allFiles.push(...imageFiles);

      // Add bill images
      if (billFiles.first) allFiles.push(billFiles.first);
      if (billFiles.three) allFiles.push(billFiles.three);
      if (billFiles.last) allFiles.push(billFiles.last);

      if (allFiles.length === 0) {
        toast.error(t('listing.imagesRequired'));
        return;
      }

      toast.info(t('listing.uploadingImages'));
      const uploadedUrls = await imagesApi.upload(allFiles);

      // Split images: first images are listing images, last 3 are bill images
      const listingImageCount = imageFiles.length;
      const listingImages = uploadedUrls.slice(0, listingImageCount);
      const billImagesUrls = {
        first: uploadedUrls[listingImageCount],
        three: uploadedUrls[listingImageCount + 1],
        last: uploadedUrls[listingImageCount + 2],
      };

      // Build description from form data (NO passwords/emails!)
      const descriptionParts = [
        `السيرفر: ${server}`,
        `حجرة الاحتراق: ${stoveLevel}`,
        helios.length > 0 ? `هيليوس: ${helios.join(', ')}` : 'هيليوس: لا يوجد',
        `عدد الجنود: ${troops}`,
        `القوة الشخصية: ${totalPower}`,
        `قوة البطل: ${heroPower}`,
        `الجزيرة: ${island}`,
        `قوة الخبير: ${expertPower}`,
        `قوة البطل الإجمالية: ${heroTotalPower}`,
        `قوة الحيوانات: ${petPower}`,
        `مع البريد الإلكتروني الأساسي: ${hasEmail === 'yes' ? 'نعم' : 'لا'}`,
        `مربوط في أبل: ${hasApple === 'yes' ? 'نعم' : 'لا'}`,
        `مربوط في قوقل: ${hasGoogle === 'yes' ? 'نعم' : 'لا'}`,
        `مربوط في فيسبوك: ${hasFacebook === 'yes' ? 'نعم' : 'لا'}`,
        `مربوط في قيم سنتر: ${hasGameCenter === 'yes' ? 'نعم' : 'لا'}`,
      ];

      const description = descriptionParts.join('\n');

      // Build account metadata
      const accountMetadata = {
        server,
        stove_level: stoveLevel,
        helios: helios.length > 0 ? helios : null,
        troops,
        total_power: totalPower,
        hero_power: heroPower,
        island,
        expert_power: expertPower,
        hero_total_power: heroTotalPower,
        pet_power: petPower,
        has_email: hasEmail === 'yes',
        has_apple: hasApple === 'yes',
        has_google: hasGoogle === 'yes',
        has_facebook: hasFacebook === 'yes',
        has_game_center: hasGameCenter === 'yes',
        bill_images: billImagesUrls,
      };

      // Use uploaded URLs - send credentials as SEPARATE fields (will be encrypted)
      createListingMutation.mutate({
        title: title.trim(),
        description, // NO passwords here!
        price: parseFloat(price),
        category: 'game_account',
        images: listingImages,
        account_email: accountEmail,      // Separate field (will be encrypted)
        account_password: accountPassword, // Separate field (will be encrypted)
        account_metadata: accountMetadata, // Game-specific data
      });
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast.error(t('listing.uploadFailed'));
    }
  };

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
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">إضافة حساب Whiteout Survival للبيع</h1>
          <p className="text-white/60">أضف تفاصيل الحساب وابدأ البيع</p>
        </div>

        {/* KYC Required Warning */}
        {!isVerified && (
          <Card className="p-6 bg-red-500/10 border-2 border-red-500/30 backdrop-blur-sm mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex gap-4 flex-1">
                <ShieldAlert className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">التحقق من الهوية (KYC) مطلوب</h3>
                  <p className="text-white/80 text-sm mb-1">
                    يجب إكمال عملية التحقق من الهوية قبل أن تتمكن من عرض حسابات للبيع على المنصة.
                  </p>
                  <p className="text-white/80 text-sm">
                    هذا الإجراء إلزامي لضمان أمان وموثوقية جميع البائعين على المنصة.
                  </p>
                </div>
              </div>
              <Button 
                asChild
                className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0 whitespace-nowrap"
              >
                <Link to="/kyc">
                  ابدأ التحقق الآن
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        )}

        <Card className={`p-6 bg-white/5 border-white/10 backdrop-blur-sm ${!isVerified ? 'opacity-60 pointer-events-none' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">المعلومات الأساسية</h2>
              
              <div>
                <Label className="text-white mb-2 block">عنوان الإعلان *</Label>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: حساب قوي - المستوى 45"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  maxLength={255}
                  required
                />
                <p className="text-sm text-white/60 mt-1">
                  {title.length}/255 حرف
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 block">السيرفر *</Label>
                    <Select value={server} onValueChange={setServer} required>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="اختر السيرفر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-99">0-99</SelectItem>
                        <SelectItem value="100-200">100-200</SelectItem>
                        <SelectItem value="201-300">201-300</SelectItem>
                        <SelectItem value="301-400">301-400</SelectItem>
                        <SelectItem value="401-500">401-500</SelectItem>
                        <SelectItem value="501-600">501-600</SelectItem>
                        <SelectItem value="601-700">601-700</SelectItem>
                        <SelectItem value="701-800">701-800</SelectItem>
                        <SelectItem value="801-900">801-900</SelectItem>
                        <SelectItem value="901-1000">901-1000</SelectItem>
                        <SelectItem value="other">آخر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">السعر ($) *</Label>
                <Input 
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="100"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  min="10"
                  max="10000"
                  step="0.01"
                  required
                />
                <p className="text-sm text-white/60 mt-1">
                  {t('listing.priceRange')}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">تفاصيل الحساب (إلزامية)</h3>
                
                <div>
                  <Label className="text-white mb-2 block">حجرة الاحتراق *</Label>
                  <Select value={stoveLevel} onValueChange={setStoveLevel} required>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="اختر حجرة الاحتراق" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FC1">
                        <div className="flex items-center gap-2">
                          <img src={stoveLv1} alt="FC1" className="w-8 h-8" />
                          <span>FC1</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FC2">
                        <div className="flex items-center gap-2">
                          <img src={stoveLv2} alt="FC2" className="w-8 h-8" />
                          <span>FC2</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FC3">
                        <div className="flex items-center gap-2">
                          <img src={stoveLv3} alt="FC3" className="w-8 h-8" />
                          <span>FC3</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FC4">
                        <div className="flex items-center gap-2">
                          <img src={stoveLv4} alt="FC4" className="w-8 h-8" />
                          <span>FC4</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FC5">
                        <div className="flex items-center gap-2">
                          <img src={stoveLv5} alt="FC5" className="w-8 h-8" />
                          <span>FC5</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FC6">
                        <div className="flex items-center gap-2">
                          <img src={stoveLv6} alt="FC6" className="w-8 h-8" />
                          <span>FC6</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FC7">
                        <div className="flex items-center gap-2">
                          <img src={stoveLv7} alt="FC7" className="w-8 h-8" />
                          <span>FC7</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FC8">
                        <div className="flex items-center gap-2">
                          <img src={stoveLv8} alt="FC8" className="w-8 h-8" />
                          <span>FC8</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FC9">
                        <div className="flex items-center gap-2">
                          <img src={stoveLv9} alt="FC9" className="w-8 h-8" />
                          <span>FC9</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FC10">
                        <div className="flex items-center gap-2">
                          <img src={stoveLv10} alt="FC10" className="w-8 h-8" />
                          <span>FC10</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white mb-2 block">هيليوس (يمكن اختيار أكثر من واحد)</Label>
                  <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="infantry"
                        checked={helios.includes("المشاة")}
                        onChange={() => handleHeliosChange("المشاة")}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[hsl(195,80%,50%)] focus:ring-[hsl(195,80%,50%)]"
                      />
                      <label htmlFor="infantry" className="text-white text-sm cursor-pointer">المشاة</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="archers"
                        checked={helios.includes("الرماه")}
                        onChange={() => handleHeliosChange("الرماه")}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[hsl(195,80%,50%)] focus:ring-[hsl(195,80%,50%)]"
                      />
                      <label htmlFor="archers" className="text-white text-sm cursor-pointer">الرماه</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="spear"
                        checked={helios.includes("الرمح")}
                        onChange={() => handleHeliosChange("الرمح")}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[hsl(195,80%,50%)] focus:ring-[hsl(195,80%,50%)]"
                      />
                      <label htmlFor="spear" className="text-white text-sm cursor-pointer">الرمح</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="none"
                        checked={helios.length === 0}
                        onChange={() => handleHeliosChange("none")}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[hsl(195,80%,50%)] focus:ring-[hsl(195,80%,50%)]"
                      />
                      <label htmlFor="none" className="text-white text-sm cursor-pointer">ولا شي</label>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 block flex items-center gap-2">
                      <Users className="h-4 w-4 text-[hsl(195,80%,70%)]" />
                      عدد الجنود *
                    </Label>
                    <Input 
                      type="text"
                      value={troops}
                      onChange={(e) => handleNumericInput(e.target.value, setTroops)}
                      placeholder="مثال: 1,500,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      pattern="[\d,]+"
                      title="يرجى إدخال أرقام فقط"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[hsl(40,90%,55%)]" />
                      القوة الشخصية (Total Power) *
                    </Label>
                    <Input 
                      type="text"
                      value={totalPower}
                      onChange={(e) => handleNumericInput(e.target.value, setTotalPower)}
                      placeholder="مثال: 50,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      pattern="[\d,]+"
                      title="يرجى إدخال أرقام فقط"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 block flex items-center gap-2">
                      <Swords className="h-4 w-4 text-[hsl(340,70%,70%)]" />
                      قوة البطل (Hero Power) *
                    </Label>
                    <Input 
                      type="text"
                      value={heroPower}
                      onChange={(e) => handleNumericInput(e.target.value, setHeroPower)}
                      placeholder="مثال: 10,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      pattern="[\d,]+"
                      title="يرجى إدخال أرقام فقط"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[hsl(220,70%,70%)]" />
                      الجزيرة (Island) *
                    </Label>
                    <Input 
                      type="text"
                      value={island}
                      onChange={(e) => handleNumericInput(e.target.value, setIsland)}
                      placeholder="مثال: 7"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      pattern="[\d,]+"
                      title="يرجى إدخال أرقام فقط"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 block flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-[hsl(120,60%,70%)]" />
                      قوة الخبير (Expert Power) *
                    </Label>
                    <Input 
                      type="text"
                      value={expertPower}
                      onChange={(e) => handleNumericInput(e.target.value, setExpertPower)}
                      placeholder="مثال: 5,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      pattern="[\d,]+"
                      title="يرجى إدخال أرقام فقط"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block flex items-center gap-2">
                      <Crown className="h-4 w-4 text-[hsl(40,90%,55%)]" />
                      قوة البطل الإجمالية (Hero's total Power) *
                    </Label>
                    <Input 
                      type="text"
                      value={heroTotalPower}
                      onChange={(e) => handleNumericInput(e.target.value, setHeroTotalPower)}
                      placeholder="مثال: 15,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      pattern="[\d,]+"
                      title="يرجى إدخال أرقام فقط"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block flex items-center gap-2">
                    <PawPrint className="h-4 w-4 text-[hsl(280,70%,70%)]" />
                    قوة الحيوانات (Pet Power) *
                  </Label>
                  <Input 
                    type="text"
                    value={petPower}
                    onChange={(e) => handleNumericInput(e.target.value, setPetPower)}
                    placeholder="مثال: 3,000,000"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    pattern="[\d,]+"
                    title="يرجى إدخال أرقام فقط"
                    required
                  />
                </div>

                <div>
                  <Label className="text-white mb-3 block">مع البريد الإلكتروني الأساسي؟</Label>
                  <RadioGroup value={hasEmail} onValueChange={setHasEmail} className="flex gap-6">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="yes" id="email-yes" className="border-white/30" />
                      <Label htmlFor="email-yes" className="text-white cursor-pointer font-normal">نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="no" id="email-no" className="border-white/30" />
                      <Label htmlFor="email-no" className="text-white cursor-pointer font-normal">لا</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-white mb-3 block">هل الحساب مربوط في أبل؟</Label>
                  <RadioGroup value={hasApple} onValueChange={setHasApple} className="flex gap-6">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="yes" id="apple-yes" className="border-white/30" />
                      <Label htmlFor="apple-yes" className="text-white cursor-pointer font-normal">نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="no" id="apple-no" className="border-white/30" />
                      <Label htmlFor="apple-no" className="text-white cursor-pointer font-normal">لا</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-white mb-3 block">هل الحساب مربوط في قوقل؟</Label>
                  <RadioGroup value={hasGoogle} onValueChange={setHasGoogle} className="flex gap-6">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="yes" id="google-yes" className="border-white/30" />
                      <Label htmlFor="google-yes" className="text-white cursor-pointer font-normal">نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="no" id="google-no" className="border-white/30" />
                      <Label htmlFor="google-no" className="text-white cursor-pointer font-normal">لا</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-white mb-3 block">هل الحساب مربوط في فيسبوك؟</Label>
                  <RadioGroup value={hasFacebook} onValueChange={setHasFacebook} className="flex gap-6">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="yes" id="facebook-yes" className="border-white/30" />
                      <Label htmlFor="facebook-yes" className="text-white cursor-pointer font-normal">نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="no" id="facebook-no" className="border-white/30" />
                      <Label htmlFor="facebook-no" className="text-white cursor-pointer font-normal">لا</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-white mb-3 block">هل الحساب مربوط في قيم سنتر؟</Label>
                  <RadioGroup value={hasGameCenter} onValueChange={setHasGameCenter} className="flex gap-6">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="yes" id="gamecenter-yes" className="border-white/30" />
                      <Label htmlFor="gamecenter-yes" className="text-white cursor-pointer font-normal">نعم</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="no" id="gamecenter-no" className="border-white/30" />
                      <Label htmlFor="gamecenter-no" className="text-white cursor-pointer font-normal">لا</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">{t('listing.accountImages')}</h2>
              <p className="text-sm text-white/60">{t('listing.accountImagesDesc')}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <Dialog key={i}>
                    <div className="relative group">
                      <DialogTrigger asChild>
                        <button 
                          type="button"
                          className="relative w-full bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:border-[hsl(195,80%,50%)] transition-all cursor-pointer"
                        >
                          <img src={img} alt={`صورة ${i + 1}`} className="w-full h-auto object-contain max-h-48" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="h-8 w-8 text-white" />
                          </div>
                        </button>
                      </DialogTrigger>
                      <button 
                        type="button"
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                        onClick={() => {
                          URL.revokeObjectURL(images[i]);
                          setImages(images.filter((_, idx) => idx !== i));
                          setImageFiles(imageFiles.filter((_, idx) => idx !== i));
                        }}
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-2 bg-black/90 border-white/20">
                      <img 
                        src={img} 
                        alt={`صورة ${i + 1}`} 
                        className="w-full h-auto object-contain max-h-[85vh] mx-auto"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
                
                {images.length < 8 && (
                  <>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="aspect-square bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-white/40" />
                      <span className="text-sm text-white/60">{t('listing.uploadImage')}</span>
                    </button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      key={images.length}
                    />
                  </>
                )}
              </div>
              
              <p className="text-sm text-white/60">{t('listing.imageCount', { count: images.length })}</p>
            </div>

            {/* Account Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">تفاصيل الحساب</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">البريد الإلكتروني *</Label>
                  <Input 
                    type="email"
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    placeholder="account@example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    required
                  />
                </div>

                <div>
                  <Label className="text-white mb-2 block">كلمة المرور *</Label>
                  <Input 
                    type="password"
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mt-4">{t('listing.billImagesTitle')}</h3>
                <p className="text-sm text-white/60">{billImagesInstructions}</p>
                
                <div>
                  <Label className="text-white mb-2 block">{t('listing.firstBillImage')}</Label>
                  {billImages.first ? (
                    <Dialog>
                      <div className="relative inline-block group">
                        <DialogTrigger asChild>
                          <button 
                            type="button"
                            className="relative bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:border-[hsl(195,80%,50%)] transition-all cursor-pointer"
                          >
                            <img src={billImages.first} alt="أول فاتورة" className="h-32 w-auto object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="h-6 w-6 text-white" />
                            </div>
                          </button>
                        </DialogTrigger>
                        <button 
                          type="button"
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                          onClick={() => {
                            if (billImages.first) URL.revokeObjectURL(billImages.first);
                            setBillImages({ ...billImages, first: null });
                            setBillFiles({ ...billFiles, first: null });
                          }}
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                      <DialogContent className="max-w-4xl max-h-[90vh] p-2 bg-black/90 border-white/20">
                        <img src={billImages.first} alt="أول فاتورة" className="w-full h-auto object-contain max-h-[85vh] mx-auto" />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <button
                      type="button"
                      onClick={() => billFirstRef.current?.click()}
                      className="px-4 py-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex items-center gap-2"
                    >
                      <Upload className="h-5 w-5 text-white/40" />
                      <span className="text-sm text-white/60">{t('listing.chooseImage')}</span>
                    </button>
                  )}
                  <input
                    ref={billFirstRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBillImageUpload(e, 'first')}
                    className="hidden"
                  />
                </div>

                <div>
                  <Label className="text-white mb-2 block">{t('listing.threeBillImages')}</Label>
                  {billImages.three ? (
                    <Dialog>
                      <div className="relative inline-block group">
                        <DialogTrigger asChild>
                          <button 
                            type="button"
                            className="relative bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:border-[hsl(195,80%,50%)] transition-all cursor-pointer"
                          >
                            <img src={billImages.three} alt="فواتير متعددة" className="h-32 w-auto object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="h-6 w-6 text-white" />
                            </div>
                          </button>
                        </DialogTrigger>
                        <button 
                          type="button"
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                          onClick={() => {
                            if (billImages.three) URL.revokeObjectURL(billImages.three);
                            setBillImages({ ...billImages, three: null });
                            setBillFiles({ ...billFiles, three: null });
                          }}
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                      <DialogContent className="max-w-4xl max-h-[90vh] p-2 bg-black/90 border-white/20">
                        <img src={billImages.three} alt="فواتير متعددة" className="w-full h-auto object-contain max-h-[85vh] mx-auto" />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <button
                      type="button"
                      onClick={() => billThreeRef.current?.click()}
                      className="px-4 py-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex items-center gap-2"
                    >
                      <Upload className="h-5 w-5 text-white/40" />
                      <span className="text-sm text-white/60">{t('listing.chooseImage')}</span>
                    </button>
                  )}
                  <input
                    ref={billThreeRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBillImageUpload(e, 'three')}
                    className="hidden"
                  />
                </div>

                <div>
                  <Label className="text-white mb-2 block">{t('listing.lastBillImage')}</Label>
                  {billImages.last ? (
                    <Dialog>
                      <div className="relative inline-block group">
                        <DialogTrigger asChild>
                          <button 
                            type="button"
                            className="relative bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:border-[hsl(195,80%,50%)] transition-all cursor-pointer"
                          >
                            <img src={billImages.last} alt="آخر فاتورة" className="h-32 w-auto object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="h-6 w-6 text-white" />
                            </div>
                          </button>
                        </DialogTrigger>
                        <button 
                          type="button"
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                          onClick={() => {
                            if (billImages.last) URL.revokeObjectURL(billImages.last);
                            setBillImages({ ...billImages, last: null });
                            setBillFiles({ ...billFiles, last: null });
                          }}
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                      <DialogContent className="max-w-4xl max-h-[90vh] p-2 bg-black/90 border-white/20">
                        <img src={billImages.last} alt="آخر فاتورة" className="w-full h-auto object-contain max-h-[85vh] mx-auto" />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <button
                      type="button"
                      onClick={() => billLastRef.current?.click()}
                      className="px-4 py-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex items-center gap-2"
                    >
                      <Upload className="h-5 w-5 text-white/40" />
                      <span className="text-sm text-white/60">{t('listing.chooseImage')}</span>
                    </button>
                  )}
                  <input
                    ref={billLastRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBillImageUpload(e, 'last')}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="p-4 bg-[hsl(40,90%,55%,0.1)] rounded-lg border border-[hsl(40,90%,55%,0.3)]">
                <p className="text-sm text-white/80">
                  ⚠️ {billImagesSecurityNote}
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit"
                disabled={createListingMutation.isPending || !isVerified}
                className="flex-1 gap-2 py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createListingMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري النشر...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    نشر الإعلان
                  </>
                )}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-8 py-6 bg-white/5 hover:bg-white/10 text-white border-white/20"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SellWOS;

