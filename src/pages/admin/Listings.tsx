import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Eye, Ban, CheckCircle, Trash2, Loader2, Package, DollarSign, User, Calendar, ShoppingBag, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { adminApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDate } from "@/utils/date";
import type { Listing } from "@/types/api";

const AdminListings = () => {
  const { t, language } = useLanguage();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteListingId, setDeleteListingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: listingsResponse, isLoading } = useQuery({
    queryKey: ['admin-listings', searchTerm],
    queryFn: () => adminApi.listings({ search: searchTerm || undefined }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const listings: Listing[] = listingsResponse?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' | 'sold' }) =>
      adminApi.updateListingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      toast.success("تم تحديث حالة الإعلان");
      setIsDialogOpen(false);
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
      setDeleteListingId(null);
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("فشل حذف الإعلان");
      setDeleteListingId(null);
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

  const handleDeleteClick = (id: number) => {
    setDeleteListingId(id);
  };

  const confirmDelete = () => {
    if (deleteListingId) {
      deleteListingMutation.mutate(deleteListingId);
    }
  };

  const handleSearch = () => {
    // Search is automatic via queryKey dependency
  };

  const formatDate = (dateString: string) => formatLocalizedDate(dateString, language);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'نشط',
          className: 'bg-green-500/20 text-green-400 border-green-500/30'
        };
      case 'sold':
        return {
          label: 'مباع',
          className: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        };
      case 'inactive':
        return {
          label: 'غير نشط',
          className: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        };
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">إدارة الإعلانات</h1>
        <p className="text-white/60">
          عرض وإدارة جميع الإعلانات على المنصة ({listings.length} إعلان)
        </p>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              placeholder="البحث بالعنوان أو الوصف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
          >
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
          <Package className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60">
            {searchTerm ? 'لا توجد إعلانات مطابقة للبحث' : 'لا توجد إعلانات لعرضها'}
          </p>
        </Card>
      )}

      {/* Listings Grid */}
      {!isLoading && listings.length > 0 && (
      <div className="space-y-4">
        {listings.map((listing) => {
          const statusBadge = getStatusBadge(listing.status);
          
          return (
            <Card key={listing.id} className="p-5 bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{listing.title}</h3>
                    <Badge className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <div className="text-sm text-white/60 space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      البائع: {listing.user?.name || 'غير محدد'}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatPrice(listing.price)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4" />
                        {(listing as any).orders_count || 0} طلب
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(listing.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-white/10">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20" 
                  onClick={() => handleViewDetails(listing)}
                >
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
                ) : listing.status !== "sold" && (
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
                  onClick={() => handleDeleteClick(listing.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  حذف
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">تفاصيل الإعلان</DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              {/* Image */}
              {selectedListing.image_url && (
                <div className="rounded-lg overflow-hidden border border-white/10">
                  <img 
                    src={selectedListing.image_url} 
                    alt={selectedListing.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold mb-2">{selectedListing.title}</h3>
                <Badge className={getStatusBadge(selectedListing.status).className}>
                  {getStatusBadge(selectedListing.status).label}
                </Badge>
              </div>

              <Card className="p-4 bg-white/5 border-white/10">
                <h4 className="text-sm font-bold text-white mb-3">معلومات الإعلان</h4>
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
                    <p className="text-white font-medium">{formatPrice(selectedListing.price)}</p>
                  </div>
                  <div>
                    <span className="text-white/60">الفئة:</span>
                    <p className="text-white font-medium">{selectedListing.category}</p>
                  </div>
                  <div>
                    <span className="text-white/60">عدد الطلبات:</span>
                    <p className="text-white font-medium">{(selectedListing as any).orders_count || 0}</p>
                  </div>
                  <div>
                    <span className="text-white/60">تاريخ النشر:</span>
                    <p className="text-white font-medium">{formatDate(selectedListing.created_at)}</p>
                  </div>
                </div>
              </Card>

              <div>
                <span className="text-white/60 text-sm font-bold">الوصف:</span>
                <p className="text-white mt-2 whitespace-pre-line leading-relaxed">
                  {selectedListing.description}
                </p>
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
                ) : selectedListing.status !== "sold" && (
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
                  onClick={() => handleDeleteClick(selectedListing.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  حذف الإعلان
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteListingId !== null} onOpenChange={() => setDeleteListingId(null)}>
        <AlertDialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">تأكيد حذف الإعلان</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              هل أنت متأكد من حذف هذا الإعلان؟ هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات المتعلقة بالإعلان.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteListingMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteListingMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'حذف'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminListings;
