import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Plus, X, ShieldAlert, ArrowRight, Users, Zap, MapPin, GraduationCap, PawPrint, Crown, Swords, Loader2 } from "lucide-react";
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
import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { listingsApi, imagesApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";

const Sell = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
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
      toast.error("يمكنك رفع حتى 8 صور فقط");
      return;
    }

    // Create preview URLs and store files
    const newImages: string[] = [];
    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const previewUrl = URL.createObjectURL(file);
      newImages.push(previewUrl);
      newFiles.push(file);
    }
    setImages([...images, ...newImages]);
    setImageFiles([...imageFiles, ...newFiles]);
  };

  // Handle bill image upload - create preview
  const handleBillImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'first' | 'three' | 'last') => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: (data: { title: string; description: string; price: number; category: string; images?: string[] }) =>
      listingsApi.create(data),
    onSuccess: () => {
      toast.success("تم نشر الإعلان بنجاح!");
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      navigate('/my-listings');
    },
    onError: (error: Error) => {
      const apiError = error as Error & ApiError;
      const errorMessage = apiError.message || "فشل نشر الإعلان";
      toast.error(errorMessage);
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      toast.error("يجب إكمال التحقق من الهوية أولاً");
      return;
    }

    // Validation
    if (!title.trim()) {
      toast.error("يرجى إدخال عنوان الإعلان");
      return;
    }

    if (!server) {
      toast.error("يرجى اختيار السيرفر");
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error("يرجى إدخال سعر صحيح");
      return;
    }

    if (!stoveLevel) {
      toast.error("يرجى اختيار حجرة الاحتراق");
      return;
    }

    if (!troops || !totalPower || !heroPower || !island || !expertPower || !heroTotalPower || !petPower) {
      toast.error("يرجى إدخال جميع معلومات الحساب المطلوبة");
      return;
    }

    if (images.length === 0) {
      toast.error("يرجى رفع صورة واحدة على الأقل");
      return;
    }

    if (!billImages.first || !billImages.three || !billImages.last) {
      toast.error("يرجى رفع جميع صور الفواتير المطلوبة");
      return;
    }

    if (!accountEmail || !accountPassword) {
      toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
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
        toast.error("يرجى رفع الصور");
        return;
      }

      toast.info("جاري رفع الصور...");
      const uploadedUrls = await imagesApi.upload(allFiles);

      // Build description from form data
      const descriptionParts = [
        `البريد الإلكتروني: ${accountEmail}`,
        `كلمة المرور: ${accountPassword}`,
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

      // Use uploaded URLs
      createListingMutation.mutate({
        title: title.trim(),
        description,
        price: parseFloat(price),
        category: 'game_account', // Default category
        images: uploadedUrls,
      });
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast.error("فشل رفع الصور. يرجى المحاولة مرة أخرى");
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
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">إضافة حساب للبيع</h1>
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
                  required
                />
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
                <Label className="text-white mb-2 block">السعر (ريال) *</Label>
                <Input 
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1250"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  min="0"
                  step="0.01"
                  required
                />
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
                      onChange={(e) => setTroops(e.target.value)}
                      placeholder="مثال: 1,500,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
                      onChange={(e) => setTotalPower(e.target.value)}
                      placeholder="مثال: 50,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
                      onChange={(e) => setHeroPower(e.target.value)}
                      placeholder="مثال: 10,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
                      onChange={(e) => setIsland(e.target.value)}
                      placeholder="مثال: 7"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
                      onChange={(e) => setExpertPower(e.target.value)}
                      placeholder="مثال: 5,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
                      onChange={(e) => setHeroTotalPower(e.target.value)}
                      placeholder="مثال: 15,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
                    onChange={(e) => setPetPower(e.target.value)}
                    placeholder="مثال: 3,000,000"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
              <h2 className="text-xl font-bold text-white">صور الحساب</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square bg-white/5 rounded-lg border border-white/10 overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        URL.revokeObjectURL(images[i]);
                        setImages(images.filter((_, idx) => idx !== i));
                        setImageFiles(imageFiles.filter((_, idx) => idx !== i));
                      }}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                
                {images.length < 8 && (
                  <>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="aspect-square bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-white/40" />
                      <span className="text-sm text-white/60">رفع صورة</span>
                    </button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      key={images.length} // Reset input after selection
                    />
                  </>
                )}
              </div>
              
              <p className="text-sm text-white/60">يمكنك رفع حتى 8 صور (تم رفع {images.length})</p>
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
                <h3 className="text-lg font-semibold text-white mt-4">صور الفواتير (إلزامية)</h3>
                <p className="text-sm text-white/60">سيتم عرض هذه الصور للمشتري بعد إتمام عملية الدفع</p>
                
                <div>
                  <Label className="text-white mb-2 block">صورة أول فاتورة شراء *</Label>
                  <div className="flex items-center gap-4">
                    {billImages.first ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                        <img src={billImages.first} alt="First bill" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            if (billImages.first) URL.revokeObjectURL(billImages.first);
                            setBillImages({ ...billImages, first: null });
                            setBillFiles({ ...billFiles, first: null });
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => billFirstRef.current?.click()}
                      className="px-4 py-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex items-center gap-2"
                    >
                      <Upload className="h-5 w-5 text-white/40" />
                      <span className="text-sm text-white/60">{billImages.first ? 'تغيير الصورة' : 'اختر صورة'}</span>
                    </button>
                    <input
                      ref={billFirstRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBillImageUpload(e, 'first')}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">صورة ثلاث فواتير مختلفة التوقيت *</Label>
                  <div className="flex items-center gap-4">
                    {billImages.three ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                        <img src={billImages.three} alt="Three bills" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            if (billImages.three) URL.revokeObjectURL(billImages.three);
                            setBillImages({ ...billImages, three: null });
                            setBillFiles({ ...billFiles, three: null });
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => billThreeRef.current?.click()}
                      className="px-4 py-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex items-center gap-2"
                    >
                      <Upload className="h-5 w-5 text-white/40" />
                      <span className="text-sm text-white/60">{billImages.three ? 'تغيير الصورة' : 'اختر صورة'}</span>
                    </button>
                    <input
                      ref={billThreeRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBillImageUpload(e, 'three')}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">صورة آخر فاتورة شراء *</Label>
                  <div className="flex items-center gap-4">
                    {billImages.last ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                        <img src={billImages.last} alt="Last bill" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            if (billImages.last) URL.revokeObjectURL(billImages.last);
                            setBillImages({ ...billImages, last: null });
                            setBillFiles({ ...billFiles, last: null });
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => billLastRef.current?.click()}
                      className="px-4 py-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex items-center gap-2"
                    >
                      <Upload className="h-5 w-5 text-white/40" />
                      <span className="text-sm text-white/60">{billImages.last ? 'تغيير الصورة' : 'اختر صورة'}</span>
                    </button>
                    <input
                      ref={billLastRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBillImageUpload(e, 'last')}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[hsl(40,90%,55%,0.1)] rounded-lg border border-[hsl(40,90%,55%,0.3)]">
                <p className="text-sm text-white/80">
                  ⚠️ معلومات الحساب ستكون محمية ومشفرة. سيتم عرضها للمشتري فقط بعد إتمام عملية الدفع.
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
                className="px-8 py-6 bg-white/5 hover:bg-white/10 text-white border-white/20"
                asChild
              >
                <Link to="/my-listings">إلغاء</Link>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Sell;
