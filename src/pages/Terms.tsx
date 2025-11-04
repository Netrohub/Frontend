import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";

const Terms = () => {
  return (
    <>
      <SEO 
        title="الشروط والأحكام - NXOLand"
        description="اقرأ الشروط والأحكام الخاصة باستخدام منصة NXOLand. تعرف على قواعد البيع والشراء، نظام الضمان، والسياسات المتبعة."
      />
      <div className="min-h-screen relative overflow-hidden" dir="rtl">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />

        {/* Skip link for keyboard navigation */}
        <a 
          href="#terms-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          تخطي إلى المحتوى
        </a>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div id="terms-content" className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl pb-24 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">الشروط والأحكام</h1>
          <p className="text-white/60">آخر تحديث: يناير 2025</p>
        </div>

        <Card className="p-6 md:p-8 bg-white/5 border-white/10 backdrop-blur-sm space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. القبول بالشروط</h2>
            <p className="text-white/80 leading-relaxed">
              باستخدامك لمنصة NXOLand، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. التسجيل والحساب</h2>
            <div className="text-white/80 leading-relaxed space-y-3">
              <p>• يجب أن تكون بعمر 18 عامًا على الأقل لاستخدام المنصة</p>
              <p>• يجب تقديم معلومات صحيحة ودقيقة عند التسجيل</p>
              <p>• أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور</p>
              <p>• يجب إكمال عملية التحقق من الهوية (KYC) قبل البيع على المنصة</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. البيع والشراء</h2>
            <div className="text-white/80 leading-relaxed space-y-3">
              <p>• يجب أن تكون جميع الحسابات المعروضة للبيع ملكًا قانونيًا للبائع</p>
              <p>• يحظر بيع الحسابات المسروقة أو المخترقة</p>
              <p>• يجب تقديم معلومات دقيقة وصادقة عن الحساب</p>
              <p>• المنصة توفر نظام ضمان لمدة 12 ساعة لحماية المشترين</p>
              <p>• يحق للمنصة إلغاء أي صفقة مشبوهة</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. المدفوعات والعمولات</h2>
            <div className="text-white/80 leading-relaxed space-y-3">
              <p>• تفرض المنصة عمولة على كل عملية بيع ناجحة</p>
              <p>• جميع المدفوعات تتم بشكل آمن من خلال المنصة</p>
              <p>• يمكن للبائع سحب أرباحه بعد انتهاء فترة الضمان</p>
              <p>• المبالغ المستردة تتم وفقًا لسياسة الاسترداد الخاصة بنا</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. المحتوى المحظور</h2>
            <div className="text-white/80 leading-relaxed space-y-3">
              <p>• يحظر نشر محتوى مسيء أو غير قانوني</p>
              <p>• يحظر الاحتيال أو التضليل</p>
              <p>• يحظر انتهاك حقوق الملكية الفكرية</p>
              <p>• يحظر التلاعب بالتقييمات أو الأسعار</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. النزاعات والشكاوى</h2>
            <p className="text-white/80 leading-relaxed">
              في حالة وجود نزاع، يجب على المستخدمين تقديم شكوى من خلال نظام النزاعات في المنصة. سيتم مراجعة جميع الشكاوى من قبل فريقنا خلال 48 ساعة عمل.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. إنهاء الحساب</h2>
            <div className="text-white/80 leading-relaxed space-y-3">
              <p>• يحق للمنصة إيقاف أو إغلاق أي حساب ينتهك الشروط</p>
              <p>• يمكنك إغلاق حسابك في أي وقت من إعدادات الحساب</p>
              <p>• لن يتم استرداد العمولات في حالة إغلاق الحساب</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. حدود المسؤولية</h2>
            <p className="text-white/80 leading-relaxed">
              المنصة تعمل كوسيط بين المشترين والبائعين ولا تتحمل مسؤولية مباشرة عن المحتوى أو جودة الحسابات المعروضة. نبذل قصارى جهدنا لتوفير بيئة آمنة، لكننا لا نضمن خلو المنصة تمامًا من المشاكل.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. التعديلات على الشروط</h2>
            <p className="text-white/80 leading-relaxed">
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. القانون الساري</h2>
            <p className="text-white/80 leading-relaxed">
              تخضع هذه الشروط والأحكام لقوانين المملكة العربية السعودية، ويتم حل أي نزاعات وفقًا للأنظمة المعمول بها.
            </p>
          </section>

          <section className="pt-6 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">التواصل معنا</h2>
            <p className="text-white/80 leading-relaxed">
              إذا كان لديك أي استفسارات حول الشروط والأحكام، يرجى التواصل معنا عبر صفحة الدعم.
            </p>
          </section>
        </Card>
        </div>

        <BottomNav />
      </div>
    </>
  );
};

export default Terms;
