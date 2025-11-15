import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, UserX, ShieldCheck, Loader2, Shield, Mail, Phone, Calendar, DollarSign, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { adminApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDate } from "@/utils/date";
import type { User } from "@/types/api";

const AdminUsers = () => {
  const { t, language } = useLanguage();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: () => adminApi.users({ search: searchTerm || undefined }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const users: User[] = usersResponse?.data || [];

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => adminApi.deleteUser(userId),
    onSuccess: () => {
      toast.success('تم حذف المستخدم بنجاح');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDeleteUserId(null);
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'فشل حذف المستخدم');
    },
  });

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    setDeleteUserId(userId);
  };

  const confirmDelete = () => {
    if (deleteUserId) {
      deleteUserMutation.mutate(deleteUserId);
    }
  };

  const handleSearch = () => {
    // Search is automatic via queryKey dependency
    // This function exists for the button click
  };

  const formatDate = (dateString: string) => formatLocalizedDate(dateString, language);

  const getUserStatus = (user: User) => {
    // Check if user is soft deleted
    if (user.deleted_at) {
      return { label: 'محذوف', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    }
    return { label: 'نشط', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
  };

  const getTotalOrders = (user: any) => {
    const buyerCount = user.orders_as_buyer_count || 0;
    const sellerCount = user.orders_as_seller_count || 0;
    return buyerCount + sellerCount;
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">إدارة المستخدمين</h1>
        <p className="text-white/60">عرض وإدارة جميع مستخدمي المنصة ({users.length} مستخدم)</p>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              placeholder="البحث بالاسم أو البريد الإلكتروني..."
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
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(195,80%,70%)]" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && users.length === 0 && (
        <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm text-center">
          <p className="text-white/60">لا يوجد مستخدمين{searchTerm ? ' مطابقين للبحث' : ''}</p>
        </Card>
      )}

      {/* Users List */}
      {!isLoading && users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => {
            const status = getUserStatus(user);
            const totalOrders = getTotalOrders(user);
            
            return (
              <Card key={user.id} className="p-5 bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{user.name}</h3>
                      {user.is_verified && (
                        <ShieldCheck className="h-5 w-5 text-green-400" title="موثق" />
                      )}
                      {user.role === 'admin' && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          <Shield className="h-3 w-3 ml-1" />
                          مدير
                        </Badge>
                      )}
                      <Badge className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-white/60 space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(user.created_at)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="h-4 w-4" />
                          {totalOrders} طلب
                        </span>
                        {(user as any).listings_count > 0 && (
                          <>
                            <span>•</span>
                            <span>{(user as any).listings_count} إعلان</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/10">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20"
                    onClick={() => handleViewDetails(user)}
                  >
                    عرض التفاصيل
                  </Button>
                  {!user.deleted_at && user.role !== 'admin' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <UserX className="h-4 w-4" />
                      حذف
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              {selectedUser?.name}
              {selectedUser?.is_verified && <ShieldCheck className="h-6 w-6 text-green-400" />}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              معلومات تفصيلية عن المستخدم
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 mt-4">
              {/* Status Badges */}
              <div className="flex gap-3">
                <Badge className={getUserStatus(selectedUser).color}>
                  {getUserStatus(selectedUser).label}
                </Badge>
                {selectedUser.is_verified && (
                  <Badge className="bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]">
                    موثق بالبريد
                  </Badge>
                )}
                {selectedUser.role === 'admin' && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    مدير
                  </Badge>
                )}
                {(selectedUser as any).kyc_verification?.status === 'approved' && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <ShieldCheck className="h-3 w-3 ml-1" />
                    KYC موثق
                  </Badge>
                )}
              </div>

              {/* Contact Information */}
              <Card className="p-4 bg-white/5 border-white/10">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[hsl(195,80%,70%)]" />
                  معلومات الاتصال
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">البريد الإلكتروني:</span>
                    <span className="text-[hsl(195,80%,80%)]">{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">معرف المستخدم:</span>
                    <span className="text-white/80">#{selectedUser.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">الدور:</span>
                    <span className="text-white/80">{selectedUser.role === 'admin' ? 'مدير' : 'مستخدم'}</span>
                  </div>
                </div>
              </Card>

              {/* Activity Statistics */}
              <Card className="p-4 bg-white/5 border-white/10">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-[hsl(195,80%,70%)]" />
                  إحصائيات النشاط
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-white">{getTotalOrders(selectedUser)}</div>
                    <div className="text-sm text-white/60">إجمالي الطلبات</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-white">{(selectedUser as any).listings_count || 0}</div>
                    <div className="text-sm text-white/60">إجمالي الإعلانات</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-sm text-[hsl(195,80%,80%)]">{formatDate(selectedUser.created_at)}</div>
                    <div className="text-sm text-white/60">تاريخ التسجيل</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-sm text-[hsl(195,80%,80%)]">
                      {(selectedUser as any).wallet?.available_balance !== undefined 
                        ? `$${(selectedUser as any).wallet.available_balance.toLocaleString('en-US')}` 
                        : 'N/A'}
                    </div>
                    <div className="text-sm text-white/60">رصيد المحفظة</div>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              {!selectedUser.deleted_at && selectedUser.role !== 'admin' && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                    onClick={() => {
                      handleDeleteUser(selectedUser.id);
                      setIsDialogOpen(false);
                    }}
                  >
                    <UserX className="h-4 w-4" />
                    حذف المستخدم
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteUserId !== null} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteUserMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteUserMutation.isPending ? (
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

export default AdminUsers;
