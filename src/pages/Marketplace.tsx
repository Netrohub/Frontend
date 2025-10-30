import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Snowflake, Search, Filter, MapPin, Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const accounts = [
    { id: 1, title: "حساب مميز - المستوى 45", server: "Server 101", price: "1,250 ريال", rating: 4.9, level: 45, image: "/placeholder.svg" },
    { id: 2, title: "حساب قوي - المستوى 38", server: "Server 205", price: "890 ريال", rating: 4.8, level: 38, image: "/placeholder.svg" },
    { id: 3, title: "حساب نادر - المستوى 52", server: "Server 150", price: "2,100 ريال", rating: 5.0, level: 52, image: "/placeholder.svg" },
    { id: 4, title: "حساب متقدم - المستوى 41", server: "Server 320", price: "950 ريال", rating: 4.7, level: 41, image: "/placeholder.svg" },
    { id: 5, title: "حساب استثنائي - المستوى 48", server: "Server 180", price: "1,650 ريال", rating: 4.9, level: 48, image: "/placeholder.svg" },
    { id: 6, title: "حساب متميز - المستوى 35", server: "Server 275", price: "720 ريال", rating: 4.6, level: 35, image: "/placeholder.svg" },
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
        <div className="flex items-center gap-2">
          <Snowflake className="h-8 w-8 text-[hsl(195,80%,70%)]" />
          <span className="text-xl md:text-2xl font-black text-white">
            منصة<span className="text-[hsl(40,90%,55%)]">التداول</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link to="/" className="hover:text-[hsl(195,80%,70%)] transition-colors">الرئيسية</Link>
          <Link to="/marketplace" className="text-[hsl(195,80%,70%)]">السوق</Link>
          <Link to="/members" className="hover:text-[hsl(195,80%,70%)] transition-colors">الأعضاء</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">سوق الحسابات</h1>
          <p className="text-white/60">تصفح واختر الحساب المثالي لك</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input 
                placeholder="ابحث عن حساب..."
                className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[hsl(195,80%,70%,0.5)]"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <Select>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="السيرفر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع السيرفرات</SelectItem>
                  <SelectItem value="101-200">101-200</SelectItem>
                  <SelectItem value="201-300">201-300</SelectItem>
                  <SelectItem value="301-400">301-400</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="السعر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأسعار</SelectItem>
                  <SelectItem value="low">أقل من 500</SelectItem>
                  <SelectItem value="mid">500 - 1500</SelectItem>
                  <SelectItem value="high">أكثر من 1500</SelectItem>
                </SelectContent>
              </Select>

              <Button size="icon" className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] border-0">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {accounts.map((account) => (
            <Link key={account.id} to={`/product/${account.id}`}>
              <Card className="overflow-hidden bg-white/5 border-white/10 hover:border-[hsl(195,80%,70%,0.5)] transition-all hover:-translate-y-1 group backdrop-blur-sm">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="h-20 w-20 text-white/20" />
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 bg-[hsl(195,80%,50%)] rounded-full text-xs font-bold text-white">
                    المستوى {account.level}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-[hsl(195,80%,70%)] transition-colors">
                    {account.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <MapPin className="h-4 w-4" />
                    <span>{account.server}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[hsl(40,90%,55%)]">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium">{account.rating}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-2xl font-black text-[hsl(195,80%,70%)]">{account.price}</span>
                    <Button size="sm" className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default Marketplace;
