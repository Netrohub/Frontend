import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Shield, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { listingsApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Listing } from "@/types/api";

const MyListings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all listings and filter by current user
  const { data: listingsResponse, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: () => listingsApi.getAll(),
    enabled: !!user,
  });

  // Filter listings to show only current user's listings
  const listings = listingsResponse?.data?.filter((listing: Listing) => listing.user_id === user?.id) || [];

  // Empty state for when user has no listings
  const showEmptyState = listings.length === 0;

  // Calculate stats
  const stats = {
    total: listings.length,
    active: listings.filter((l: Listing) => l.status === 'active').length,
    pending: listings.filter((l: Listing) => l.status === 'pending').length,
    sold: listings.filter((l: Listing) => l.status === 'sold').length,
  };

  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => listingsApi.delete(id),
    onSuccess: () => {
      toast.success("تم حذف الإعلان بنجاح");
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: () => {
      toast.error("فشل حذف الإعلان");
    },
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      sold: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    const labels = { 
      active: "نشط", 
      pending: "قيد المراجعة", 
      sold: "مباع",
      inactive: "غير نشط"
    };
    return <Badge className={styles[status as keyof typeof styles] || styles.inactive}>{labels[status as keyof typeof labels] || status}</Badge>;
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
          <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <p className="text-white/60 mb-4">يجب تسجيل الدخول لعرض إعلاناتك</p>
            <Button asChild className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white">
              <Link to="/auth">تسجيل الدخول</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" />
          </div>
        </div>
      </div>
    );
  }

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
            <div className="text-2xl font-black text-white mb-1">{stats.total}</div>
            <div className="text-sm text-white/60">إجمالي الإعلانات</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-black text-green-400 mb-1">{stats.active}</div>
            <div className="text-sm text-white/60">نشط</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-black text-yellow-400 mb-1">{stats.pending}</div>
            <div className="text-sm text-white/60">قيد المراجعة</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-black text-blue-400 mb-1">{stats.sold}</div>
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
            {listings.map((listing: Listing) => (
            <Card key={listing.id} className="p-4 md:p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:border-[hsl(195,80%,70%,0.5)] transition-all">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                <div className="w-full md:w-32 h-32 bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Shield className="h-12 w-12 text-white/20" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{listing.title}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(listing.status)}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-black text-[hsl(195,80%,70%)]">{listing.price.toLocaleString('ar-SA')} ر.س</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Eye className="h-4 w-4" />
                    <span>{listing.views || 0} مشاهدة</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                      onClick={() => {
                        if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
                          deleteMutation.mutate(listing.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
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
