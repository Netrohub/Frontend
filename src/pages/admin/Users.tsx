import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Ban, CheckCircle, UserX, ShieldCheck } from "lucide-react";

const AdminUsers = () => {
  const users = [
    { id: 1, name: "محمد أحمد", email: "mohammed@example.com", status: "active", verified: true, joined: "2025-01-15", orders: 12 },
    { id: 2, name: "سارة علي", email: "sara@example.com", status: "active", verified: true, joined: "2025-01-10", orders: 8 },
    { id: 3, name: "خالد العتيبي", email: "khaled@example.com", status: "suspended", verified: false, joined: "2025-01-08", orders: 3 },
    { id: 4, name: "نورة السعيد", email: "noura@example.com", status: "active", verified: true, joined: "2025-01-05", orders: 15 },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">إدارة المستخدمين</h1>
        <p className="text-white/60">عرض وإدارة جميع مستخدمي المنصة</p>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              placeholder="البحث عن مستخدم..."
              className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <Button className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
            بحث
          </Button>
        </div>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{user.name}</h3>
                  {user.verified && (
                    <ShieldCheck className="h-5 w-5 text-green-400" />
                  )}
                  <Badge className={
                    user.status === "active" 
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {user.status === "active" ? "نشط" : "موقوف"}
                  </Badge>
                </div>
                <div className="text-sm text-white/60 space-y-1">
                  <div>البريد: {user.email}</div>
                  <div className="flex gap-4">
                    <span>تاريخ التسجيل: {user.joined}</span>
                    <span>•</span>
                    <span>عدد الطلبات: {user.orders}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-white/10">
              <Button size="sm" variant="outline" className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20">
                <CheckCircle className="h-4 w-4" />
                عرض التفاصيل
              </Button>
              {user.status === "active" ? (
                <Button size="sm" variant="outline" className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30">
                  <Ban className="h-4 w-4" />
                  إيقاف
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="h-4 w-4" />
                  تفعيل
                </Button>
              )}
              <Button size="sm" variant="outline" className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30">
                <UserX className="h-4 w-4" />
                حذف
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
