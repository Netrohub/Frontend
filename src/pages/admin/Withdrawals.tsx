import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  User, 
  DollarSign, 
  Calendar,
  Filter,
  Eye,
  ArrowDownToLine,
  Building2,
  CreditCard,
  Package
} from "lucide-react";
import { useState } from "react";
import { adminApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDate } from "@/utils/date";

interface OrderBreakdownItem {
  order_id: number;
  order_number: string;
  amount: number;
  listing_title?: string;
  completed_at?: string;
}

interface WithdrawalRequest {
  id: number;
  user_id: number;
  amount: number;
  iban?: string;
  bank_account?: string;
  bank_name?: string;
  account_holder_name?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  tap_transfer_id?: string;
  failure_reason?: string;
  order_breakdown?: OrderBreakdownItem[];
  created_at: string;
  processed_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

const AdminWithdrawals = () => {
  const { t, language } = useLanguage();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: withdrawalsResponse, isLoading } = useQuery({
    queryKey: ['admin-withdrawals', statusFilter, searchTerm],
    queryFn: () => adminApi.withdrawals({ 
      status: statusFilter || undefined,
      search: searchTerm || undefined 
    }),
    staleTime: 30 * 1000, // 30 seconds - refresh frequently for new requests
  });

  const withdrawals: WithdrawalRequest[] = withdrawalsResponse?.data || [];
  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

  const approveMutation = useMutation({
    mutationFn: (id: number) => adminApi.approveWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
      toast.success(t('admin.withdrawalApproved'));
      setIsApproveDialogOpen(false);
      setIsDetailsDialogOpen(false);
      setSelectedWithdrawal(null);
    },
    onError: (error: any) => {
      toast.error(error.message || t('admin.withdrawalApproveError'));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => 
      adminApi.rejectWithdrawal(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
      toast.success(t('admin.withdrawalRejected'));
      setIsRejectDialogOpen(false);
      setIsDetailsDialogOpen(false);
      setSelectedWithdrawal(null);
      setRejectReason("");
    },
    onError: (error: any) => {
      toast.error(error.message || t('admin.withdrawalRejectError'));
    },
  });

  const handleViewDetails = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setIsDetailsDialogOpen(true);
  };

  const handleApprove = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setIsApproveDialogOpen(true);
  };

  const handleReject = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmApprove = () => {
    if (selectedWithdrawal) {
      approveMutation.mutate(selectedWithdrawal.id);
    }
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error(t('admin.rejectReasonRequired'));
      return;
    }
    if (selectedWithdrawal) {
      rejectMutation.mutate({ 
        id: selectedWithdrawal.id, 
        reason: rejectReason.trim() 
      });
    }
  };

  const formatPrice = (amount: number) => {
    return '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (dateString: string) => 
    formatLocalizedDate(dateString, language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      pending: {
        label: t('admin.pending'),
        className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: Clock,
      },
      processing: {
        label: t('admin.processing'),
        className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: Loader2,
      },
      completed: {
        label: t('admin.completed'),
        className: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: CheckCircle2,
      },
      failed: {
        label: t('admin.failed'),
        className: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: XCircle,
      },
      cancelled: {
        label: t('admin.cancelled'),
        className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <Icon className={`h-3 w-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
    );
  };

  const formatIBAN = (iban?: string) => {
    if (!iban) return '-';
    // Show first 4 and last 4 characters, mask the rest
    if (iban.length <= 8) return iban;
    return `${iban.substring(0, 4)}****${iban.substring(iban.length - 4)}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)] p-4 md:p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
              {t('admin.withdrawals')}
            </h1>
            <p className="text-white/60">{t('admin.withdrawalsSubtitle')}</p>
          </div>
          {pendingCount > 0 && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-lg px-4 py-2">
              {pendingCount} {t('admin.pending')}
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder={t('admin.searchByNameOrEmail')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border-white/10 text-white pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,50%)]"
            >
              <option value="">{t('admin.allStatuses')}</option>
              <option value="pending">{t('admin.pending')}</option>
              <option value="processing">{t('admin.processing')}</option>
              <option value="completed">{t('admin.completed')}</option>
              <option value="failed">{t('admin.failed')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Withdrawals List */}
      {withdrawals.length === 0 ? (
        <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm">
          <div className="text-center">
            <DollarSign className="h-16 w-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/60 text-lg">{t('admin.noWithdrawals')}</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <Card 
              key={withdrawal.id} 
              className="p-4 md:p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left: User & Amount Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-[hsl(195,80%,50%,0.2)]">
                      <DollarSign className="h-6 w-6 text-[hsl(195,80%,70%)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {formatPrice(withdrawal.amount)}
                        </h3>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      
                      <div className="space-y-1 text-sm text-white/70">
                        {withdrawal.user && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{withdrawal.user.name}</span>
                            <span className="text-white/50">({withdrawal.user.email})</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-mono">{formatIBAN(withdrawal.iban || withdrawal.bank_account)}</span>
                        </div>
                        {withdrawal.bank_name && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>{withdrawal.bank_name}</span>
                          </div>
                        )}
                        {withdrawal.account_holder_name && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{withdrawal.account_holder_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(withdrawal.created_at)}</span>
                        </div>
                        {withdrawal.order_breakdown && withdrawal.order_breakdown.length > 0 && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                            <Package className="h-4 w-4" />
                            <span className="text-xs text-white/60">
                              {withdrawal.order_breakdown.length} {t('admin.order')}{withdrawal.order_breakdown.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(withdrawal)}
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('admin.viewDetails')}
                  </Button>
                  
                  {withdrawal.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(withdrawal)}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {t('admin.approve')}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(withdrawal)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {t('admin.reject')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{t('admin.withdrawalDetails')}</DialogTitle>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">{t('admin.amount')}</Label>
                  <p className="text-white text-lg font-bold">{formatPrice(selectedWithdrawal.amount)}</p>
                </div>
                <div>
                  <Label className="text-white/60">{t('admin.status')}</Label>
                  <div className="mt-1">{getStatusBadge(selectedWithdrawal.status)}</div>
                </div>
              </div>

              {selectedWithdrawal.user && (
                <div>
                  <Label className="text-white/60">{t('admin.user')}</Label>
                  <p className="text-white">{selectedWithdrawal.user.name}</p>
                  <p className="text-white/70 text-sm">{selectedWithdrawal.user.email}</p>
                </div>
              )}

              <div>
                <Label className="text-white/60">{t('admin.iban')}</Label>
                <p className="text-white font-mono">{selectedWithdrawal.iban || selectedWithdrawal.bank_account || '-'}</p>
              </div>

              {selectedWithdrawal.bank_name && (
                <div>
                  <Label className="text-white/60">{t('admin.bankName')}</Label>
                  <p className="text-white">{selectedWithdrawal.bank_name}</p>
                </div>
              )}

              {selectedWithdrawal.account_holder_name && (
                <div>
                  <Label className="text-white/60">{t('admin.accountHolderName')}</Label>
                  <p className="text-white">{selectedWithdrawal.account_holder_name}</p>
                </div>
              )}

              <div>
                <Label className="text-white/60">{t('admin.requestDate')}</Label>
                <p className="text-white">{formatDate(selectedWithdrawal.created_at)}</p>
              </div>

              {selectedWithdrawal.processed_at && (
                <div>
                  <Label className="text-white/60">{t('admin.processedDate')}</Label>
                  <p className="text-white">{formatDate(selectedWithdrawal.processed_at)}</p>
                </div>
              )}

              {selectedWithdrawal.tap_transfer_id && (
                <div>
                  <Label className="text-white/60">{t('admin.transferId')}</Label>
                  <p className="text-white font-mono text-sm">{selectedWithdrawal.tap_transfer_id}</p>
                </div>
              )}

              {selectedWithdrawal.failure_reason && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <Label className="text-red-400">{t('admin.failureReason')}</Label>
                  <p className="text-red-300 mt-1">{selectedWithdrawal.failure_reason}</p>
                </div>
              )}

              {/* Order Breakdown */}
              {selectedWithdrawal.order_breakdown && selectedWithdrawal.order_breakdown.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <Label className="text-white/60 mb-3 block">{t('admin.orderBreakdown')}</Label>
                  <div className="space-y-2">
                    {selectedWithdrawal.order_breakdown.map((item, index) => (
                      <div 
                        key={item.order_id} 
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className="bg-[hsl(195,80%,30%)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,50%)]">
                            {t('admin.item')} {index + 1}
                          </Badge>
                          <div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-white/60" />
                              <span className="text-white font-medium">{item.order_number}</span>
                            </div>
                            {item.listing_title && (
                              <p className="text-xs text-white/60 mt-1">{item.listing_title}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{formatPrice(item.amount)}</p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-white/20 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 font-medium">{t('admin.total')}:</span>
                        <span className="text-white font-bold text-lg">{formatPrice(selectedWithdrawal.amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedWithdrawal.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      handleApprove(selectedWithdrawal);
                    }}
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {t('admin.approve')}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      handleReject(selectedWithdrawal);
                    }}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {t('admin.reject')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>{t('admin.confirmApprove')}</DialogTitle>
            <DialogDescription className="text-white/80">
              {t('admin.confirmApproveMessage')}
            </DialogDescription>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">{t('admin.amount')}:</span>
                  <span className="text-white font-bold">{formatPrice(selectedWithdrawal.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">{t('admin.user')}:</span>
                  <span className="text-white">{selectedWithdrawal.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">{t('admin.bankName')}:</span>
                  <span className="text-white">{selectedWithdrawal.bank_name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">{t('admin.iban')}:</span>
                  <span className="text-white font-mono text-sm">{formatIBAN(selectedWithdrawal.iban || selectedWithdrawal.bank_account)}</span>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-yellow-300 text-sm">
                  ⚠️ {t('admin.approveWarning')}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsApproveDialogOpen(false)}
                  disabled={approveMutation.isPending}
                  className="flex-1 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={handleConfirmApprove}
                  disabled={approveMutation.isPending}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                >
                  {approveMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('common.processing')}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {t('admin.confirmApprove')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="bg-[hsl(200,70%,15%)] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>{t('admin.rejectWithdrawal')}</DialogTitle>
            <DialogDescription className="text-white/80">
              {t('admin.rejectMessage')}
            </DialogDescription>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-white/60">{t('admin.amount')}:</span>
                  <span className="text-white font-bold">{formatPrice(selectedWithdrawal.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">{t('admin.user')}:</span>
                  <span className="text-white">{selectedWithdrawal.user?.name}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="reject-reason" className="text-white mb-2 block">
                  {t('admin.rejectReason')} <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="reject-reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={t('admin.rejectReasonPlaceholder')}
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  required
                />
                <p className="text-white/50 text-xs mt-1">{t('admin.rejectReasonHint')}</p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-yellow-300 text-sm">
                  ⚠️ {t('admin.rejectWarning')}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRejectDialogOpen(false);
                    setRejectReason("");
                  }}
                  disabled={rejectMutation.isPending}
                  className="flex-1 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmReject}
                  disabled={rejectMutation.isPending || !rejectReason.trim()}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                >
                  {rejectMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('common.processing')}
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('admin.confirmReject')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWithdrawals;

