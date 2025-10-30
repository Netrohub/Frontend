import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Shield, Trophy, Swords } from "lucide-react";

const Index = () => {
  const designs = [
    {
      id: 1,
      name: "تصميم القطب الشمالي",
      nameEn: "Modern Arctic",
      description: "تصميم نظيف وبسيط مع ألوان جليدية وأجواء مريحة",
      descriptionEn: "Clean, minimalist with ice-blue tones",
      icon: Sparkles,
      color: "bg-primary",
      route: "/design1",
      preview: "تصميم عصري مع تركيز على البساطة والوضوح"
    },
    {
      id: 2,
      name: "تصميم الألعاب",
      nameEn: "Gaming Premium",
      description: "تصميم جريء وداكن مع تأثيرات نيون وأجواء احترافية",
      descriptionEn: "Bold, dark with vibrant gaming accents",
      icon: Trophy,
      color: "bg-gaming-accent",
      route: "/design2",
      preview: "تصميم قوي يستهدف اللاعبين المحترفين"
    },
    {
      id: 3,
      name: "تصميم الأمان",
      nameEn: "Trust & Safety",
      description: "تصميم احترافي يركز على الثقة والأمان",
      descriptionEn: "Professional, emphasizes security",
      icon: Shield,
      color: "bg-trust-blue",
      route: "/design3",
      preview: "تصميم يبعث الطمأنينة والمصداقية"
    },
    {
      id: 4,
      name: "تصميم Whiteout Survival",
      nameEn: "Tactical Survival",
      description: "تصميم مستوحى من اللعبة مع أجواء تكتيكية داكنة",
      descriptionEn: "Game-inspired with dark tactical theme",
      icon: Swords,
      color: "bg-[#1a2332]",
      route: "/design4",
      preview: "تصميم عسكري مع بطاقات تفاعلية ومؤثرات اللعبة"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-ice">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-arctic bg-clip-text text-transparent">
            منصة تداول حسابات الألعاب
          </h1>
          <p className="text-lg text-muted-foreground">
            اختر التصميم المفضل لديك
          </p>
        </div>
      </header>

      {/* Design Options */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {designs.map((design) => (
              <Card 
                key={design.id} 
                className="p-8 hover:shadow-arctic transition-all hover:-translate-y-2 duration-300 border-2 hover:border-primary group"
              >
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 mx-auto mb-4 ${design.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <design.icon className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{design.name}</h2>
                  <p className="text-sm text-muted-foreground mb-1">{design.nameEn}</p>
                </div>

                <p className="text-muted-foreground mb-4 text-center leading-relaxed">
                  {design.description}
                </p>
                
                <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-center">{design.preview}</p>
                </div>

                <Link to={design.route} className="block">
                  <Button className="w-full" size="lg">
                    معاينة التصميم
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto p-8 bg-card/80 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-4 text-center">ملاحظة مهمة</h3>
          <div className="space-y-3 text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>جميع التصاميم تدعم اللغة العربية بشكل كامل مع تخطيط RTL</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>التصاميم متجاوبة بالكامل مع جميع أحجام الشاشات (موبايل، تابلت، ديسكتوب)</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>كل تصميم يحتوي على نفس الوظائف الأساسية ولكن بأسلوب بصري مختلف</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>يمكنك اختيار التصميم الذي يناسب هوية علامتك التجارية</span>
            </p>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>© 2025 منصة تداول حسابات الألعاب. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default Index;
