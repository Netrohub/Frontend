import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Snowflake, Upload, Plus, X, ShieldAlert, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

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
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/10 backdrop-blur-md bg-[hsl(200,70%,15%,0.5)]">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Snowflake className="h-8 w-8 text-[hsl(195,80%,70%)]" />
          <span className="text-xl md:text-2xl font-black text-white">
            NXO<span className="text-[hsl(40,90%,55%)]">Land</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link to="/" className="hover:text-[hsl(195,80%,70%)] transition-colors">الرئيسية</Link>
          <Link to="/my-listings" className="hover:text-[hsl(195,80%,70%)] transition-colors">قائمتي</Link>
          <Link to="/sell" className="text-[hsl(195,80%,70%)]">إضافة حساب</Link>
        </div>
      </nav>

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
                      <SelectItem value="FC1">FC1</SelectItem>
                      <SelectItem value="FC2">FC2</SelectItem>
                      <SelectItem value="FC3">FC3</SelectItem>
                      <SelectItem value="FC4">FC4</SelectItem>
                      <SelectItem value="FC5">FC5</SelectItem>
                      <SelectItem value="FC6">FC6</SelectItem>
                      <SelectItem value="FC7">FC7</SelectItem>
                      <SelectItem value="FC8">FC8</SelectItem>
                      <SelectItem value="FC9">FC9</SelectItem>
                      <SelectItem value="FC10">FC10</SelectItem>
                      <SelectItem value="other">آخر</SelectItem>
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
                    <Label className="text-white mb-2 block">عدد الجنود</Label>
                    <Input 
                      type="text"
                      placeholder="مثال: 1,500,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Total Power</Label>
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
                    <Label className="text-white mb-2 block">Hero Power</Label>
                    <Input 
                      type="text"
                      placeholder="مثال: 10,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Island</Label>
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
                    <Label className="text-white mb-2 block">Expert Power</Label>
                    <Input 
                      type="text"
                      placeholder="مثال: 5,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Hero's total Power</Label>
                    <Input 
                      type="text"
                      placeholder="مثال: 15,000,000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Pet Power</Label>
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
