import { Search, Shield, User, Package, ShoppingCart, AlertTriangle, Settings, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminActivity() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const activities = [
    {
      id: "1",
      admin: "أحمد محمد",
      action: "تعليق مستخدم",
      target: "محمد حسن",
      type: "user",
      details: "تم تعليق الحساب بسبب مخالفة الشروط",
      timestamp: "2024-01-15 14:30",
      severity: "high",
    },
    {
      id: "2",
      admin: "فاطمة علي",
      action: "الموافقة على إعلان",
      target: "حساب إنستغرام - 50K",
      type: "listing",
      details: "تمت مراجعة والموافقة على الإعلان",
      timestamp: "2024-01-15 13:15",
      severity: "low",
    },
    {
      id: "3",
      admin: "أحمد محمد",
      action: "حل نزاع",
      target: "ORD-001",
      type: "dispute",
      details: "تم حل النزاع لصالح المشتري",
      timestamp: "2024-01-15 12:00",
      severity: "medium",
    },
    {
      id: "4",
      admin: "سارة أحمد",
      action: "تحديث إعدادات",
      target: "نسبة العمولة",
      type: "settings",
      details: "تم تغيير نسبة العمولة من 5% إلى 7%",
      timestamp: "2024-01-15 10:45",
      severity: "high",
    },
    {
      id: "5",
      admin: "علي حسن",
      action: "حذف مراجعة",
      target: "مراجعة #234",
      type: "review",
      details: "تم حذف المراجعة بسبب محتوى غير لائق",
      timestamp: "2024-01-15 09:30",
      severity: "medium",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user": return User;
      case "listing": return Package;
      case "order": return ShoppingCart;
      case "dispute": return AlertTriangle;
      case "settings": return Settings;
      default: return Shield;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "user": return "bg-blue-500/20 text-blue-400";
      case "listing": return "bg-purple-500/20 text-purple-400";
      case "order": return "bg-green-500/20 text-green-400";
      case "dispute": return "bg-red-500/20 text-red-400";
      case "settings": return "bg-orange-500/20 text-orange-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high": return "عالية";
      case "medium": return "متوسطة";
      case "low": return "منخفضة";
      default: return severity;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">سجل النشاطات</h1>
        <p className="text-white/60">تتبع جميع إجراءات المسؤولين والمشرفين</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
          <Input
            placeholder="البحث في السجل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-[hsl(200,70%,15%)] border-white/10 text-white"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px] bg-[hsl(200,70%,15%)] border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع النشاطات</SelectItem>
            <SelectItem value="user">المستخدمين</SelectItem>
            <SelectItem value="listing">الإعلانات</SelectItem>
            <SelectItem value="order">الطلبات</SelectItem>
            <SelectItem value="dispute">النزاعات</SelectItem>
            <SelectItem value="settings">الإعدادات</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(200,90%,40%)]">
          <Search className="h-4 w-4 mr-2" />
          بحث
        </Button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = getTypeIcon(activity.type);
          return (
            <Card key={activity.id} className="p-6 bg-[hsl(200,70%,12%)] border-white/10">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getTypeColor(activity.type)}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{activity.action}</h3>
                    <Badge className={getSeverityColor(activity.severity)}>
                      أهمية {getSeverityLabel(activity.severity)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-3 text-sm">
                    <p className="text-white/60">
                      المسؤول: <span className="text-white font-medium">{activity.admin}</span>
                    </p>
                    <p className="text-white/60">
                      الهدف: <span className="text-white font-medium">{activity.target}</span>
                    </p>
                    <p className="text-white/60">
                      الوقت: <span className="text-white font-medium">{activity.timestamp}</span>
                    </p>
                  </div>
                  
                  <p className="text-white/80 text-sm bg-white/5 p-3 rounded-lg">
                    {activity.details}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
