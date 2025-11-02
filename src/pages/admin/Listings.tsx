import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, Ban, CheckCircle, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { adminApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Listing } from "@/types/api";

const AdminListings = () => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: listingsResponse, isLoading } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: () => adminApi.listings(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const listings: Listing[] = listingsResponse?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' | 'sold' }) =>
      adminApi.updateListingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      toast.success("تم تحديث حالة الإعلان");
    },
    onError: () => {
      toast.error("فشل تحديث حالة الإعلان");
    },
  });

  const deleteListingMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      toast.success("تم حذف الإعلان");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("فشل حذف الإعلان");
    },
  });

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (listing: Listing) => {
    const newStatus = listing.status === 'active' ? 'inactive' : 'active';
    updateStatusMutation.mutate({ id: listing.id, status: newStatus });
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.')) {
      deleteListingMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">إدارة الإعلانات</h1>
        <p className="text-white/60">عرض وإدارة جميع الإعلانات على المنصة</p>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              placeholder="البحث عن إعلان..."
              className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <Button className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
            بحث
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && listings.length === 0 && (
        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
          <p className="text-white/60">لا توجد إعلانات لعرضها</p>
        </Card>
      )}

      {/* Listings Grid */}
      {!isLoading && listings.length > 0 && (
      <div className="space-y-4">
        {listings.map((listing) => (
          <Card key={listing.id} className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{listing.title}</h3>
                  <Badge className={
                    listing.status === "active" 
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : listing.status === "sold"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {listing.status === "active" ? "نشط" : listing.status === "sold" ? "مباع" : "غير نشط"}
                  </Badge>
                </div>
                <div className="text-sm text-white/60 space-y-1">
                  <div>البائع: {listing.user?.name || 'غير محدد'}</div>
                  <div className="flex gap-4">
                    <span>السعر: {listing.price} ريال</span>
                    <span>•</span>
                    <span>المشاهدات: {listing.views || 0}</span>
                    <span>•</span>
                    <span>تاريخ النشر: {formatDate(listing.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-white/10">
              <Button size="sm" variant="outline" className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20" onClick={() => handleViewDetails(listing)}>
                <Eye className="h-4 w-4" />
                عرض التفاصيل
              </Button>
              {listing.status === "active" ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                  onClick={() => handleToggleStatus(listing)}
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                  إيقاف
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                  onClick={() => handleToggleStatus(listing)}
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  تفعيل
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                onClick={() => handleDelete(listing.id)}
                disabled={deleteListingMutation.isPending}
              >
                {deleteListingMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                حذف
              </Button>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[hsl(217,33%,17%)] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">تفاصيل الإعلان</DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">{selectedListing.title}</h3>
                <Badge className={
                  selectedListing.status === "active" 
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : selectedListing.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }>
                  {selectedListing.status === "active" ? "نشط" : selectedListing.status === "pending" ? "قيد المراجعة" : "موقوف"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">البائع:</span>
                  <p className="text-white font-medium">{selectedListing.user?.name || 'غير محدد'}</p>
                </div>
                <div>
                  <span className="text-white/60">البريد الإلكتروني:</span>
                  <p className="text-white font-medium">{selectedListing.user?.email || 'غير محدد'}</p>
                </div>
                <div>
                  <span className="text-white/60">السعر:</span>
                  <p className="text-white font-medium">{selectedListing.price} ريال</p>
                </div>
                <div>
                  <span className="text-white/60">الفئة:</span>
                  <p className="text-white font-medium">{selectedListing.category}</p>
                </div>
                <div>
                  <span className="text-white/60">المشاهدات:</span>
                  <p className="text-white font-medium">{selectedListing.views || 0}</p>
                </div>
                <div>
                  <span className="text-white/60">تاريخ النشر:</span>
                  <p className="text-white font-medium">{formatDate(selectedListing.created_at)}</p>
                </div>
              </div>

              <div>
                <span className="text-white/60 text-sm">الوصف:</span>
                <p className="text-white mt-1 whitespace-pre-line">{selectedListing.description}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-white/10">
                {selectedListing.status === "active" ? (
                  <Button 
                    className="flex-1 gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                    onClick={() => handleToggleStatus(selectedListing)}
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                    إيقاف الإعلان
                  </Button>
                ) : (
                  <Button 
                    className="flex-1 gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                    onClick={() => handleToggleStatus(selectedListing)}
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    تفعيل الإعلان
                  </Button>
                )}
                <Button 
                  className="flex-1 gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                  onClick={() => handleDelete(selectedListing.id)}
                  disabled={deleteListingMutation.isPending}
                >
                  {deleteListingMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  حذف الإعلان
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminListings;