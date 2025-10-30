import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const MyListings = () => {
  // Mock user's own listings - can be bought AND sold by same account
  const listings = [
    { id: 1, title: "حساب مميز - المستوى 45", status: "active", price: "1,250", views: 48, level: 45 },
    { id: 2, title: "حساب قوي - المستوى 38", status: "pending", price: "890", views: 23, level: 38 },
    { id: 3, title: "حساب نادر - المستوى 52", status: "sold", price: "2,100", views: 156, level: 52 },
  ];

  // Empty state for when user has no listings
  const showEmptyState = listings.length === 0;

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      sold: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    const labels = { active: "نشط", pending: "قيد المراجعة", sold: "مباع" };
    return <Badge className={styles[status as keyof typeof styles]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">إعلاناتي</h1>
            <p className="text-white/60">إدارة حساباتي المعروضة للبيع (يمكنك البيع والشراء بنفس الحساب)</p>
          </div>
          <Button asChild className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
            <Link to="/sell">
              <Plus className="h-5 w-5" />
              إضافة حساب
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-black text-white mb-1">3</div>
            <div className="text-sm text-white/60">إجمالي الإعلانات</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-black text-green-400 mb-1">1</div>
            <div className="text-sm text-white/60">نشط</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-black text-yellow-400 mb-1">1</div>
            <div className="text-sm text-white/60">قيد المراجعة</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-black text-blue-400 mb-1">1</div>
            <div className="text-sm text-white/60">مباع</div>
          </Card>
        </div>

        {/* Listings */}
        {showEmptyState ? (
          <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-6 rounded-full bg-white/5">
                <Shield className="h-12 w-12 text-white/40" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد إعلانات</h3>
                <p className="text-white/60 mb-6">ابدأ بإضافة حسابك الأول للبيع على المنصة</p>
                <Button asChild className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
                  <Link to="/sell">
                    <Plus className="h-5 w-5" />
                    إضافة حساب جديد
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
            <Card key={listing.id} className="p-4 md:p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:border-[hsl(195,80%,70%,0.5)] transition-all">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                <div className="w-full md:w-32 h-32 bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-12 w-12 text-white/20" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{listing.title}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(listing.status)}
                        <Badge className="bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]">
                          المستوى {listing.level}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-black text-[hsl(195,80%,70%)]">{listing.price}</div>
                      <div className="text-sm text-white/60">ريال</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Eye className="h-4 w-4" />
                    <span>{listing.views} مشاهدة</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20">
                      <Edit className="h-4 w-4" />
                      تعديل
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30">
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </Button>
                    {listing.status === "active" && (
                      <Button size="sm" asChild className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0 mr-auto">
                        <Link to={`/product/${listing.id}`}>
                          <Eye className="h-4 w-4" />
                          معاينة
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          </div>
        )}
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default MyListings;
