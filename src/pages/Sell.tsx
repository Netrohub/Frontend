import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Plus, X, ShieldAlert, ArrowRight, Users, Zap, MapPin, GraduationCap, PawPrint, Crown, Swords } from "lucide-react";
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
import { Link } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";

const Sell = () => {
  const [images, setImages] = useState<string[]>([]);
  // TODO: Replace with actual user verification status from backend
  const isVerified = false; // Change to true to test verified state

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
          <form className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">المعلومات الأساسية</h2>
              
              <div>
                <Label className="text-white mb-2 block">عنوان الإعلان</Label>
                <Input 
                  placeholder="مثال: حساب قوي - المستوى 45"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 block">السيرفر</Label>
                    <Select>
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
                <Label className="text-white mb-2 block">السعر (ريال)</Label>
                <Input 
                  type="number"
                  placeholder="1250"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">تفاصيل الحساب (إلزامية)</h3>
                
                <div>
                  <Label className="text-white mb-2 block">حجرة الاحتراق</Label>
                  <Select>
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
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[hsl(195,80%,50%)] focus:ring-[hsl(195,80%,50%)]"
                      />
                      <label htmlFor="infantry" className="text-white text-sm cursor-pointer">المشاة</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="archers"
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[hsl(195,80%,50%)] focus:ring-[hsl(195,80%,50%)]"
                      />
                      <label htmlFor="archers" className="text-white text-sm cursor-pointer">الرماه</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="spear"
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[hsl(195,80%,50%)] focus:ring-[hsl(195,80%,50%)]"
                      />
                      <label htmlFor="spear" className="text-white text-sm cursor-pointer">الرمح</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="none"
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
                      عدد الجنود
                    </Label>
                    <Input 
                      type="text"
                      placeholder="مثال: 1,500,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[hsl(40,90%,55%)]" />
                      القوة الشخصية (Total Power)
                    </Label>
                    <Input 
                      type="text"
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
                      قوة البطل (Hero Power)
                    </Label>
                    <Input 
                      type="text"
                      placeholder="مثال: 10,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[hsl(220,70%,70%)]" />
                      الجزيرة (Island)
                    </Label>
                    <Input 
                      type="text"
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
                      قوة الخبير (Expert Power)
                    </Label>
                    <Input 
                      type="text"
                      placeholder="مثال: 5,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block flex items-center gap-2">
                      <Crown className="h-4 w-4 text-[hsl(40,90%,55%)]" />
                      قوة البطل الإجمالية (Hero's total Power)
                    </Label>
                    <Input 
                      type="text"
                      placeholder="مثال: 15,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block flex items-center gap-2">
                    <PawPrint className="h-4 w-4 text-[hsl(280,70%,70%)]" />
                    قوة الحيوانات (Pet Power)
                  </Label>
                  <Input 
                    type="text"
                    placeholder="مثال: 3,000,000"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    required
                  />
                </div>

                <div>
                  <Label className="text-white mb-3 block">مع البريد الإلكتروني الأساسي؟</Label>
                  <RadioGroup defaultValue="no" className="flex gap-6">
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
                  <RadioGroup defaultValue="no" className="flex gap-6">
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
                  <RadioGroup defaultValue="no" className="flex gap-6">
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
                  <RadioGroup defaultValue="no" className="flex gap-6">
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
                  <RadioGroup defaultValue="no" className="flex gap-6">
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
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="aspect-square bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="h-8 w-8 text-white/40" />
                  <span className="text-sm text-white/60">رفع صورة</span>
                </button>
              </div>
              
              <p className="text-sm text-white/60">يمكنك رفع حتى 8 صور</p>
            </div>

            {/* Account Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">تفاصيل الحساب</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">البريد الإلكتروني</Label>
                  <Input 
                    type="email"
                    placeholder="account@example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <div>
                  <Label className="text-white mb-2 block">كلمة المرور</Label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mt-4">صور الفواتير (إلزامية)</h3>
                <p className="text-sm text-white/60">سيتم عرض هذه الصور للمشتري بعد إتمام عملية الدفع</p>
                
                <div>
                  <Label className="text-white mb-2 block">صورة أول فاتورة شراء</Label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="px-4 py-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex items-center gap-2"
                    >
                      <Upload className="h-5 w-5 text-white/40" />
                      <span className="text-sm text-white/60">اختر صورة</span>
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">صورة ثلاث فواتير مختلفة التوقيت</Label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="px-4 py-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex items-center gap-2"
                    >
                      <Upload className="h-5 w-5 text-white/40" />
                      <span className="text-sm text-white/60">اختر صورة</span>
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">صورة آخر فاتورة شراء</Label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="px-4 py-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex items-center gap-2"
                    >
                      <Upload className="h-5 w-5 text-white/40" />
                      <span className="text-sm text-white/60">اختر صورة</span>
                    </button>
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
                className="flex-1 gap-2 py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold border-0"
              >
                <Plus className="h-5 w-5" />
                نشر الإعلان
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
