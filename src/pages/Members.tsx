import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Star, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";

interface Member {
  id: number;
  name: string;
  role: string;
  sales: number;
  revenue: string;
  rating: number;
  online: boolean;
  isVerified: boolean;
  email: string;
  phone: string;
  joined: string;
  successRate: string;
}

const Members = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const members = [
    { id: 1, name: "محمد العتيبي", role: "بائع", sales: 142, revenue: "45,200", rating: 4.9, online: true, isVerified: true, email: "mohammed@example.com", phone: "+966501234567", joined: "2025-01-15", successRate: "98%" },
    { id: 2, name: "أحمد السعيد", role: "بائع", sales: 98, revenue: "32,100", rating: 4.8, online: false, isVerified: true, email: "ahmed@example.com", phone: "+966509876543", joined: "2025-01-10", successRate: "96%" },
    { id: 3, name: "فاطمة النور", role: "بائع", sales: 156, revenue: "52,800", rating: 5.0, online: true, isVerified: true, email: "fatima@example.com", phone: "+966551234567", joined: "2025-01-05", successRate: "99%" },
    { id: 4, name: "سارة المطيري", role: "بائع", sales: 87, revenue: "28,400", rating: 4.7, online: true, isVerified: false, email: "sara@example.com", phone: "+966555555555", joined: "2025-01-12", successRate: "95%" },
    { id: 5, name: "خالد الدوسري", role: "بائع", sales: 124, revenue: "41,600", rating: 4.9, online: false, isVerified: true, email: "khalid@example.com", phone: "+966507777777", joined: "2025-01-08", successRate: "97%" },
    { id: 6, name: "نورة الغامدي", role: "بائع", sales: 76, revenue: "25,300", rating: 4.6, online: true, isVerified: false, email: "noura@example.com", phone: "+966508888888", joined: "2025-01-18", successRate: "94%" },
  ];

  const handleViewProfile = (member: Member) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

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
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                      {member.name}
                      {member.isVerified && (
                        <CheckCircle2 className="h-5 w-5 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" />
                      )}
                    </h3>
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
                onClick={() => handleViewProfile(member)}
                className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
              >
                عرض الملف الشخصي
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[hsl(217,33%,17%)] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              الملف الشخصي
            </DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  {selectedMember.online && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-[hsl(217,33%,17%)]" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                    {selectedMember.name}
                    {selectedMember.isVerified && (
                      <CheckCircle2 className="h-6 w-6 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" />
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]">
                      {selectedMember.role}
                    </Badge>
                    {selectedMember.online ? (
                      <span className="text-sm text-green-400">• متصل الآن</span>
                    ) : (
                      <span className="text-sm text-white/60">• غير متصل</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-white/5 border-white/10 text-center">
                  <div className="text-2xl font-bold text-[hsl(195,80%,70%)] mb-1">{selectedMember.sales}</div>
                  <div className="text-xs text-white/60">عملية بيع</div>
                </Card>
                <Card className="p-4 bg-white/5 border-white/10 text-center">
                  <div className="text-2xl font-bold text-[hsl(40,90%,55%)] mb-1">{selectedMember.rating}</div>
                  <div className="text-xs text-white/60">التقييم</div>
                </Card>
                <Card className="p-4 bg-white/5 border-white/10 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">{selectedMember.successRate}</div>
                  <div className="text-xs text-white/60">معدل النجاح</div>
                </Card>
                <Card className="p-4 bg-white/5 border-white/10 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{selectedMember.revenue}</div>
                  <div className="text-xs text-white/60">الإيرادات (ريال)</div>
                </Card>
              </div>

              {/* Member Info */}
              <Card className="p-4 bg-white/5 border-white/10">
                <h4 className="font-bold text-white mb-3">معلومات العضو</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">تاريخ الانضمام:</span>
                    <span className="text-[hsl(195,80%,80%)]">{selectedMember.joined}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">إجمالي المبيعات:</span>
                    <span className="text-[hsl(195,80%,80%)]">{selectedMember.sales} عملية</span>
                  </div>
                </div>
              </Card>

              {/* Rating */}
              <Card className="p-4 bg-white/5 border-white/10">
                <h4 className="font-bold text-white mb-3">التقييم</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(selectedMember.rating) ? 'text-[hsl(40,90%,55%)] fill-current' : 'text-white/20'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-white">{selectedMember.rating}</span>
                  <span className="text-sm text-white/60">من 5.0</span>
                </div>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default Members;
