import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Snowflake, Search, Star, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Members = () => {
  const members = [
    { id: 1, name: "محمد العتيبي", role: "بائع", sales: 142, revenue: "45,200", rating: 4.9, online: true },
    { id: 2, name: "أحمد السعيد", role: "بائع", sales: 98, revenue: "32,100", rating: 4.8, online: false },
    { id: 3, name: "فاطمة النور", role: "بائع", sales: 156, revenue: "52,800", rating: 5.0, online: true },
    { id: 4, name: "سارة المطيري", role: "بائع", sales: 87, revenue: "28,400", rating: 4.7, online: true },
    { id: 5, name: "خالد الدوسري", role: "بائع", sales: 124, revenue: "41,600", rating: 4.9, online: false },
    { id: 6, name: "نورة الغامدي", role: "بائع", sales: 76, revenue: "25,300", rating: 4.6, online: true },
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
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link to="/" className="hover:text-[hsl(195,80%,70%)] transition-colors">الرئيسية</Link>
          <Link to="/marketplace" className="hover:text-[hsl(195,80%,70%)] transition-colors">السوق</Link>
          <Link to="/members" className="text-[hsl(195,80%,70%)]">الأعضاء</Link>
          <Link to="/leaderboard" className="hover:text-[hsl(195,80%,70%)] transition-colors">لوحة الصدارة</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">أعضاء المنصة</h1>
          <p className="text-white/60">تعرف على البائعين الموثوقين</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input 
                placeholder="ابحث عن عضو..."
                className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[hsl(195,80%,70%,0.5)]"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <Select>
                <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="seller">بائعين</SelectItem>
                  <SelectItem value="buyer">مشترين</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="التقييم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التقييمات</SelectItem>
                  <SelectItem value="5">5 نجوم</SelectItem>
                  <SelectItem value="4">4+ نجوم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card 
              key={member.id}
              className="p-6 bg-white/5 border-white/10 hover:border-[hsl(195,80%,70%,0.5)] transition-all hover:-translate-y-1 backdrop-blur-sm"
            >
              {/* Avatar */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    {member.online && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[hsl(200,70%,15%)]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{member.name}</h3>
                    <Badge className="bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)] text-xs">
                      {member.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">عدد المبيعات</span>
                  <span className="font-bold text-white">{member.sales}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">الإيرادات</span>
                  <span className="font-bold text-[hsl(195,80%,70%)]">{member.revenue} ريال</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">التقييم</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-[hsl(40,90%,55%)] fill-current" />
                    <span className="font-bold text-white">{member.rating}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
              >
                عرض الملف الشخصي
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default Members;
