import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Eye, Shield, Loader2, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDate } from "@/utils/date";
import { listingsApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Listing } from "@/types/api";
import { useState } from "react";

const MyListings = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch ONLY current user's listings (SECURITY: data isolation)
  const { data: listingsResponse, isLoading } = useQuery({
    queryKey: ['my-listings', user?.id, statusFilter, currentPage],
    queryFn: () => listingsApi.getMyListings({ 
      status: statusFilter,
      page: currentPage,
    }),
    enabled: !!user,
  });

  const listings = listingsResponse?.data || [];
  const pagination = listingsResponse?.meta;

  // Calculate stats in single pass (performance optimization)
  const stats = listings.reduce((acc, listing: Listing) => {
    acc.total++;
    if (listing.status === 'active') acc.active++;
    if (listing.status === 'inactive') acc.inactive++;
    if (listing.status === 'sold') acc.sold++;
    return acc;
  }, { total: 0, active: 0, inactive: 0, sold: 0 });

  // Empty state for when user has no listings
  const showEmptyState = listings.length === 0 && statusFilter === "all";

  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => listingsApi.delete(id),
    onSuccess: () => {
      toast.success(t('myListings.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      setDeleteId(null);
    },
    onError: (error: any) => {
      if (error.error_code === 'HAS_ACTIVE_ORDERS') {
        toast.error(t('myListings.hasActiveOrders'));
      } else {
        toast.error(error.message || t('myListings.deleteError'));
      }
      setDeleteId(null);
    },
  });

  // Update status mutation (deactivate, reactivate only - sold is automatic via payment)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      listingsApi.update(id, { status: status as 'active' | 'inactive' }),
    onSuccess: () => {
      toast.success(t('myListings.updateSuccess'));
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
    onError: (error: any) => {
      toast.error(error.message || t('myListings.updateError'));
    },
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      sold: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    const labels = { 
      active: t('myListings.active'), 
      sold: t('myListings.sold'),
      inactive: t('myListings.inactive')
    };
    return <Badge className={styles[status as keyof typeof styles] || styles.inactive}>{labels[status as keyof typeof labels] || status}</Badge>;
  };

  const formatDate = (dateString: string) => formatLocalizedDate(dateString, language);

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
          <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <p className="text-white/60 mb-4">{t('myListings.loginRequired')}</p>
            <Button asChild className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white">
              <Link to="/auth">{t('myListings.loginButton')}</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
    <div className="min-h-screen relative overflow-hidden pb-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{t('myListings.title')}</h1>
            <p className="text-white/60">{t('myListings.subtitle')}</p>
          </div>
          <Button asChild className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
            <Link to="/sell">
              <Plus className="h-5 w-5" />
              {t('myListings.addAccount')}
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-black text-white mb-1">{stats.total}</div>
            <div className="text-sm text-white/60">{t('myListings.totalListings')}</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-black text-green-400 mb-1">{stats.active}</div>
            <div className="text-sm text-white/60">{t('myListings.active')}</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-black text-gray-400 mb-1">{stats.inactive}</div>
            <div className="text-sm text-white/60">{t('myListings.inactive')}</div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-black text-blue-400 mb-1">{stats.sold}</div>
            <div className="text-sm text-white/60">{t('myListings.sold')}</div>
          </Card>
        </div>

        {/* Status Filter */}
        <Tabs value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }} className="mb-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-[hsl(195,80%,50%)]">{t('myListings.all')}</TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-[hsl(195,80%,50%)]">{t('myListings.active')}</TabsTrigger>
            <TabsTrigger value="inactive" className="data-[state=active]:bg-[hsl(195,80%,50%)]">{t('myListings.inactive')}</TabsTrigger>
            <TabsTrigger value="sold" className="data-[state=active]:bg-[hsl(195,80%,50%)]">{t('myListings.sold')}</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Listings */}
        {showEmptyState ? (
          <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-6 rounded-full bg-white/5">
                <Shield className="h-12 w-12 text-white/40" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{t('myListings.emptyStateTitle')}</h3>
                <p className="text-white/60 mb-6">{t('myListings.emptyStateMessage')}</p>
                <Button asChild className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
                  <Link to="/sell">
                    <Plus className="h-5 w-5" />
                    {t('myListings.addNewAccount')}
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ) : listings.length === 0 ? (
          <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <p className="text-white/60">{t('myListings.noListingsForFilter')}</p>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {listings.map((listing: Listing) => (
                <Card key={listing.id} className="p-4 md:p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:border-[hsl(195,80%,70%,0.5)] transition-all">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-32 h-32 bg-gradient-to-br from-[hsl(195,80%,30%)] to-[hsl(200,70%,20%)] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {listing.images && listing.images.length > 0 ? (
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title}
                          width="128"
                          height="128"
                          className="w-full h-full object-cover"
                          style={{ aspectRatio: '1/1' }}
                        />
                      ) : (
                        <Shield className="h-12 w-12 text-white/20" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{listing.title}</h3>
                          <div className="flex items-center gap-3 flex-wrap">
                            {getStatusBadge(listing.status)}
                            <div className="flex items-center gap-1 text-sm text-white/60">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(listing.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-black text-[hsl(195,80%,70%)]">${listing.price.toLocaleString('en-US')}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Eye className="h-4 w-4" />
                        <span>{listing.views || 0} {t('myListings.viewCount')}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 flex-wrap">
                        {listing.status === "active" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            onClick={() => updateStatusMutation.mutate({ id: listing.id, status: 'inactive' })}
                            disabled={updateStatusMutation.isPending}
                          >
                            <XCircle className="h-4 w-4" />
                            {t('myListings.deactivate')}
                          </Button>
                        )}
                        {listing.status === "inactive" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                            onClick={() => updateStatusMutation.mutate({ id: listing.id, status: 'active' })}
                            disabled={updateStatusMutation.isPending}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            {t('myListings.reactivate')}
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                          onClick={() => setDeleteId(listing.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                          {t('myListings.delete')}
                        </Button>
                        <Button size="sm" asChild className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0 mr-auto">
                          <Link to={`/product/${listing.id}`}>
                            <Eye className="h-4 w-4" />
                            {t('myListings.view')}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  {t('myListings.previous')}
                </Button>
                <span className="text-white/60 px-4">
                  {t('myListings.page')} {pagination.current_page} {t('myListings.of')} {pagination.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                  disabled={currentPage === pagination.last_page}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  {t('myListings.next')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('myListings.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              {t('myListings.deleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              {t('myListings.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {t('myListings.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default MyListings;
