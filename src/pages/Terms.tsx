import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { siteSettingsApi } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import DOMPurify from "dompurify";

const Terms = () => {
  const { language } = useLanguage();
  
  const { data: termsData, isLoading } = useQuery({
    queryKey: ['site-settings', 'terms_and_conditions'],
    queryFn: () => siteSettingsApi.get('terms_and_conditions'),
  });

  const content = termsData?.data ? (language === 'en' ? termsData.data.value_en : termsData.data.value_ar) : '';
  const lastUpdated = termsData?.data?.updated_at ? new Date(termsData.data.updated_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : '';

  return (
    <>
      <SEO 
        title="الشروط والأحكام - NXOLand"
        description="اقرأ الشروط والأحكام الخاصة باستخدام منصة NXOLand"
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div id="terms-content" className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl pb-24 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </h1>
          {lastUpdated && (
            <p className="text-white/60">
              {language === 'ar' ? 'آخر تحديث:' : 'Last updated:'} {lastUpdated}
            </p>
          )}
        </div>

        <Card className="p-6 md:p-8 bg-white/5 border-white/10 backdrop-blur-sm">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            </div>
          ) : content ? (
            <div 
              className="prose prose-invert max-w-none terms-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
          ) : (
            <p className="text-white/60 text-center py-8">
              {language === 'ar' ? 'لا توجد شروط وأحكام متاحة حاليًا' : 'No terms and conditions available'}
            </p>
          )}
        </Card>
        </div>

        <BottomNav />
      </div>
    </>
  );
};

export default Terms;
