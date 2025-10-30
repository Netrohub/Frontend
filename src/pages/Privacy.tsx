import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

const Privacy = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">سياسة الخصوصية</h1>
          <p className="text-white/60">آخر تحديث: يناير 2025</p>
        </div>

        <Card className="p-6 md:p-8 bg-white/5 border-white/10 backdrop-blur-sm space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">مقدمة</h2>
            <p className="text-white/80 leading-relaxed">
              في NXOLand، نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. المعلومات التي نجمعها</h2>
            <div className="text-white/80 leading-relaxed space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">معلومات الحساب</h3>
                <p>• الاسم الكامل</p>
                <p>• عنوان البريد الإلكتروني</p>
                <p>• رقم الهاتف</p>
                <p>• تاريخ الميلاد (للتحقق من العمر)</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">معلومات التحقق (KYC)</h3>
                <p>• صور وثائق الهوية</p>
                <p>• صور السيلفي للتحقق</p>
                <p>• عنوان السكن</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">معلومات المعاملات</h3>
                <p>• تفاصيل عمليات الشراء والبيع</p>
                <p>• تاريخ المعاملات</p>
                <p>• معلومات الدفع (مشفرة)</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">معلومات الاستخدام</h3>
                <p>• عنوان IP</p>
                <p>• نوع المتصفح والجهاز</p>
                <p>• سجل التصفح على المنصة</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. كيف نستخدم معلوماتك</h2>
            <div className="text-white/80 leading-relaxed space-y-3">
              <p>• توفير وتحسين خدماتنا</p>
              <p>• معالجة المعاملات والمدفوعات</p>
              <p>• التحقق من هوية المستخدمين (KYC)</p>
              <p>• منع الاحتيال والأنشطة المشبوهة</p>
              <p>• التواصل معك حول حسابك والتحديثات</p>
              <p>• الامتثال للمتطلبات القانونية</p>
              <p>• تحليل استخدام المنصة لتحسين الخدمات</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. مشاركة المعلومات</h2>
            <div className="text-white/80 leading-relaxed space-y-4">
              <p className="font-bold">لن نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية:</p>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-2">مقدمو الخدمات</h3>
                <p>• نظام Persona للتحقق من الهوية</p>
                <p>• معالجات الدفع (بيانات مشفرة)</p>
                <p>• خدمات الاستضافة والتخزين السحابي</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">متطلبات قانونية</h3>
                <p>• عندما يتطلب القانون ذلك</p>
                <p>• للحماية من الاحتيال أو الأنشطة غير القانونية</p>
                <p>• استجابة لطلبات الجهات الحكومية</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. أمان المعلومات</h2>
            <div className="text-white/80 leading-relaxed space-y-3">
              <p>نتخذ إجراءات أمنية صارمة لحماية معلوماتك:</p>
              <p>• تشفير جميع البيانات الحساسة</p>
              <p>• استخدام بروتوكولات أمان متقدمة (SSL/TLS)</p>
              <p>• مراقبة النظام على مدار الساعة</p>
              <p>• تقييد الوصول إلى البيانات الشخصية</p>
              <p>• نسخ احتياطية منتظمة للبيانات</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. حقوقك</h2>
            <div className="text-white/80 leading-relaxed space-y-3">
              <p>لديك الحق في:</p>
              <p>• الوصول إلى معلوماتك الشخصية</p>
              <p>• تصحيح المعلومات غير الدقيقة</p>
              <p>• طلب حذف حسابك ومعلوماتك</p>
              <p>• الاعتراض على معالجة بياناتك</p>
              <p>• طلب نسخة من بياناتك</p>
              <p>• سحب الموافقة على استخدام البيانات</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. الاحتفاظ بالبيانات</h2>
            <p className="text-white/80 leading-relaxed">
              نحتفظ بمعلوماتك الشخصية طالما كان حسابك نشطًا أو حسب الحاجة لتوفير الخدمات. بعد إغلاق الحساب، قد نحتفظ ببعض المعلومات للامتثال للمتطلبات القانونية أو لحل النزاعات.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. ملفات تعريف الارتباط (Cookies)</h2>
            <div className="text-white/80 leading-relaxed space-y-3">
              <p>نستخدم ملفات تعريف الارتباط لـ:</p>
              <p>• الحفاظ على جلستك</p>
              <p>• تذكر تفضيلاتك</p>
              <p>• تحليل استخدام المنصة</p>
              <p>• تحسين تجربة المستخدم</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. خصوصية الأطفال</h2>
            <p className="text-white/80 leading-relaxed">
              منصتنا غير موجهة للأطفال دون سن 18 عامًا. لا نجمع عن قصد معلومات شخصية من الأطفال. إذا علمنا أننا جمعنا معلومات من طفل، سنحذفها فورًا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. التغييرات على السياسة</h2>
            <p className="text-white/80 leading-relaxed">
              قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة. استمرار استخدامك للمنصة بعد التغييرات يعني موافقتك على السياسة المحدثة.
            </p>
          </section>

          <section className="pt-6 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">التواصل معنا</h2>
            <p className="text-white/80 leading-relaxed">
              إذا كان لديك أي أسئلة حول سياسة الخصوصية أو كيفية التعامل مع معلوماتك، يرجى التواصل معنا عبر صفحة الدعم أو على البريد الإلكتروني: privacy@nxoland.com
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
