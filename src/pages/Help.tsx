import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Snowflake, MessageCircle, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Help = () => {
  const faqs = [
    {
      q: "كيف أشتري حساباً على المنصة؟",
      a: "تصفح السوق، اختر الحساب المناسب، وأكمل عملية الدفع. ستحصل على معلومات الحساب فوراً مع ضمان 12 ساعة للتحقق."
    },
    {
      q: "ماذا يعني نظام الضمان؟",
      a: "نظام الضمان يحفظ أموالك لمدة 12 ساعة بعد الشراء. خلال هذه الفترة، يمكنك فحص الحساب والتأكد من صحته. إذا وجدت مشكلة، يمكنك فتح نزاع واسترداد أموالك."
    },
    {
      q: "كيف أبيع حساباً؟",
      a: "اذهب لصفحة 'إضافة حساب'، أدخل تفاصيل الحساب وصوره، وحدد السعر. سنراجع إعلانك وننشره خلال 24 ساعة."
    },
    {
      q: "هل المنصة آمنة؟",
      a: "نعم، نستخدم تشفير من الدرجة البنكية ونظام ضمان متكامل. جميع البيانات محمية ومشفرة، ولا يتم مشاركة معلومات الحساب إلا بعد إتمام الدفع."
    },
    {
      q: "ماذا أفعل إذا واجهت مشكلة؟",
      a: "يمكنك فتح نزاع من صفحة الطلب خلال 12 ساعة من الشراء. فريقنا سيراجع القضية خلال 24 ساعة ويتخذ القرار المناسب."
    },
    {
      q: "كيف أسحب أموالي؟",
      a: "بعد إتمام البيع وتأكيد المشتري، يمكنك سحب أموالك عبر التحويل البنكي أو محافظ إلكترونية. عملية السحب تستغرق 1-3 أيام عمل."
    },
  ];

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
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">مركز المساعدة</h1>
          <p className="text-xl text-white/70">إجابات على الأسئلة الشائعة</p>
        </div>

        {/* FAQs */}
        <Card className="p-6 mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6">الأسئلة الشائعة</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                <AccordionTrigger className="text-right text-white hover:text-[hsl(195,80%,70%)] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {/* Contact */}
        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">تواصل معنا</h2>
          <p className="text-center text-white/70 mb-6">لم تجد إجابة؟ تواصل مع فريق الدعم</p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="flex-col h-auto py-6 bg-white/5 hover:bg-white/10 border border-white/20 text-white">
              <MessageCircle className="h-8 w-8 mb-2 text-[hsl(195,80%,70%)]" />
              <span className="font-bold">الدردشة المباشرة</span>
              <span className="text-sm text-white/60">متاح 24/7</span>
            </Button>

            <Button className="flex-col h-auto py-6 bg-white/5 hover:bg-white/10 border border-white/20 text-white">
              <Mail className="h-8 w-8 mb-2 text-[hsl(195,80%,70%)]" />
              <span className="font-bold">البريد الإلكتروني</span>
              <span className="text-sm text-white/60">support@nxoland.com</span>
            </Button>

            <Button className="flex-col h-auto py-6 bg-white/5 hover:bg-white/10 border border-white/20 text-white">
              <Phone className="h-8 w-8 mb-2 text-[hsl(195,80%,70%)]" />
              <span className="font-bold">الهاتف</span>
              <span className="text-sm text-white/60">+966 XX XXX XXXX</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10 backdrop-blur-sm bg-[hsl(200,70%,15%,0.5)]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/50">© 2025 NXOLand. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default Help;
