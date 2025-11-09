import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Save, Eye, Code, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siteSettingsApi } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

const LegalContent = () => {
  const { t, language: currentLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("terms");
  const [activeLanguage, setActiveLanguage] = useState<'ar' | 'en'>('ar');
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch terms
  const { data: termsData, isLoading: termsLoading } = useQuery({
    queryKey: ['admin-site-settings', 'terms_and_conditions'],
    queryFn: () => siteSettingsApi.get('terms_and_conditions'),
  });

  // Fetch privacy
  const { data: privacyData, isLoading: privacyLoading } = useQuery({
    queryKey: ['admin-site-settings', 'privacy_policy'],
    queryFn: () => siteSettingsApi.get('privacy_policy'),
  });

  // Fetch refund policy
  const { data: refundData, isLoading: refundLoading } = useQuery({
    queryKey: ['admin-site-settings', 'refund_policy'],
    queryFn: () => siteSettingsApi.get('refund_policy'),
  });

  const [termsAr, setTermsAr] = useState("");
  const [termsEn, setTermsEn] = useState("");
  const [privacyAr, setPrivacyAr] = useState("");
  const [privacyEn, setPrivacyEn] = useState("");
  const [refundAr, setRefundAr] = useState("");
  const [refundEn, setRefundEn] = useState("");

  // Update local state when data is loaded
  useState(() => {
    if (termsData?.data) {
      setTermsAr(termsData.data.value_ar || "");
      setTermsEn(termsData.data.value_en || "");
    }
  });

  useState(() => {
    if (privacyData?.data) {
      setPrivacyAr(privacyData.data.value_ar || "");
      setPrivacyEn(privacyData.data.value_en || "");
    }
  });

  useState(() => {
    if (refundData?.data) {
      setRefundAr(refundData.data.value_ar || "");
      setRefundEn(refundData.data.value_en || "");
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { key: string; value_ar: string; value_en: string }) =>
      siteSettingsApi.update(data.key, { value_ar: data.value_ar, value_en: data.value_en }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-settings', variables.key] });
      queryClient.invalidateQueries({ queryKey: ['site-settings', variables.key] });
      toast.success(activeLanguage === 'ar' ? "تم الحفظ بنجاح!" : "Saved successfully!");
    },
    onError: () => {
      toast.error(activeLanguage === 'ar' ? "فشل الحفظ" : "Save failed");
    },
  });

  const handleSave = () => {
    let data;
    if (activeTab === 'terms') {
      data = { key: 'terms_and_conditions', value_ar: termsAr, value_en: termsEn };
    } else if (activeTab === 'privacy') {
      data = { key: 'privacy_policy', value_ar: privacyAr, value_en: privacyEn };
    } else {
      data = { key: 'refund_policy', value_ar: refundAr, value_en: refundEn };
    }

    updateMutation.mutate(data);
  };

  const getCurrentContent = () => {
    if (activeTab === 'terms') {
      return activeLanguage === 'ar' ? termsAr : termsEn;
    } else if (activeTab === 'privacy') {
      return activeLanguage === 'ar' ? privacyAr : privacyEn;
    }
    return activeLanguage === 'ar' ? refundAr : refundEn;
  };

  const setCurrentContent = (value: string) => {
    if (activeTab === 'terms') {
      activeLanguage === 'ar' ? setTermsAr(value) : setTermsEn(value);
    } else if (activeTab === 'privacy') {
      activeLanguage === 'ar' ? setPrivacyAr(value) : setPrivacyEn(value);
    } else {
      activeLanguage === 'ar' ? setRefundAr(value) : setRefundEn(value);
    }
  };

  const isLoading = termsLoading || privacyLoading || refundLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">المحتوى القانوني</h1>
          <p className="text-white/60">تحرير الشروط والأحكام، سياسة الخصوصية، وسياسة الاسترداد</p>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <div className="p-6">
          {/* Document Type Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-white/5">
              <TabsTrigger value="terms" className="data-[state=active]:bg-[hsl(195,80%,50%)]">
                <FileText className="h-4 w-4 ml-2" />
                الشروط والأحكام
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-[hsl(195,80%,50%)]">
                <FileText className="h-4 w-4 ml-2" />
                سياسة الخصوصية
              </TabsTrigger>
              <TabsTrigger value="refund" className="data-[state=active]:bg-[hsl(195,80%,50%)]">
                <FileText className="h-4 w-4 ml-2" />
                سياسة الاسترداد
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Language Tabs */}
          <div className="flex items-center gap-4 mb-6">
            <Tabs value={activeLanguage} onValueChange={(v) => setActiveLanguage(v as 'ar' | 'en')}>
              <TabsList className="bg-white/5">
                <TabsTrigger value="ar" className="data-[state=active]:bg-[hsl(195,80%,50%)]">
                  العربية
                </TabsTrigger>
                <TabsTrigger value="en" className="data-[state=active]:bg-[hsl(195,80%,50%)]">
                  English
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              {previewMode ? <Code className="h-4 w-4 ml-2" /> : <Eye className="h-4 w-4 ml-2" />}
              {previewMode ? 'تحرير' : 'معاينة'}
            </Button>

            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white mr-auto"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 ml-2" />
              )}
              حفظ التغييرات
            </Button>
          </div>

          {/* Editor/Preview */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            </div>
          ) : previewMode ? (
            <Card className="p-6 bg-[hsl(200,70%,20%)] border-white/10">
              <div 
                className="prose prose-invert max-w-none terms-content privacy-content"
                dangerouslySetInnerHTML={{ __html: getCurrentContent() }}
              />
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-white/60 mb-2">
                <strong className="text-white">نصيحة:</strong> استخدم HTML للتنسيق (h1, h2, h3, p, ul, li, strong, em)
              </div>
              <Textarea
                value={getCurrentContent()}
                onChange={(e) => setCurrentContent(e.target.value)}
                className="min-h-[600px] bg-[hsl(200,70%,20%)] border-white/20 text-white font-mono text-sm"
                placeholder={activeLanguage === 'ar' ? 'أدخل المحتوى بصيغة HTML...' : 'Enter content in HTML format...'}
                dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
              />
              <div className="text-xs text-white/40">
                <strong>أمثلة:</strong> &lt;h2&gt;العنوان&lt;/h2&gt; &lt;p&gt;نص عادي&lt;/p&gt; &lt;ul&gt;&lt;li&gt;عنصر&lt;/li&gt;&lt;/ul&gt;
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick HTML Reference */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-4">
        <h3 className="text-white font-bold mb-3">مرجع HTML السريع:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <code className="bg-[hsl(200,70%,20%)] text-[hsl(195,80%,70%)] px-2 py-1 rounded">&lt;h1&gt;عنوان رئيسي&lt;/h1&gt;</code>
          <code className="bg-[hsl(200,70%,20%)] text-[hsl(195,80%,70%)] px-2 py-1 rounded">&lt;h2&gt;عنوان فرعي&lt;/h2&gt;</code>
          <code className="bg-[hsl(200,70%,20%)] text-[hsl(195,80%,70%)] px-2 py-1 rounded">&lt;p&gt;فقرة&lt;/p&gt;</code>
          <code className="bg-[hsl(200,70%,20%)] text-[hsl(195,80%,70%)] px-2 py-1 rounded">&lt;strong&gt;نص غامق&lt;/strong&gt;</code>
          <code className="bg-[hsl(200,70%,20%)] text-[hsl(195,80%,70%)] px-2 py-1 rounded">&lt;ul&gt;&lt;li&gt;قائمة&lt;/li&gt;&lt;/ul&gt;</code>
          <code className="bg-[hsl(200,70%,20%)] text-[hsl(195,80%,70%)] px-2 py-1 rounded">&lt;hr&gt; فاصل</code>
        </div>
      </Card>
    </div>
  );
};

export default LegalContent;

