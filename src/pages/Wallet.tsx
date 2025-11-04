import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Wallet as WalletIcon, ArrowDownToLine, Clock, CheckCircle2, XCircle, Loader2, AlertCircle, History } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { walletApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ANIMATION_CONFIG } from "@/config/constants";
import { isValidNumber } from "@/lib/utils/validation";
import type { ApiError } from "@/types/api";

// Withdrawal limits constants
const MIN_WITHDRAWAL = 10;
const MAX_WITHDRAWAL = 2000;
const DAILY_LIMIT = 5000;
const WITHDRAWAL_FEE = 2.50;

const Wallet = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [ibanError, setIbanError] = useState("");

  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletApi.get(),
    enabled: !!user,
  });

  const { data: withdrawals, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: () => walletApi.getWithdrawals(),
    enabled: !!user,
  });

  const withdrawMutation = useMutation({
    mutationFn: (data: { amount: number; bank_account: string }) => walletApi.withdraw(data),
    onSuccess: () => {
      toast.success("تم تقديم طلب السحب بنجاح. سيتم معالجة الطلب خلال 1-3 أيام عمل");
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      setConfirmDialogOpen(false);
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setBankAccount("");
      setIbanError("");
    },
    onError: (error: Error) => {
      const apiError = error as Error & ApiError;
      const errorData = apiError.data || {};
      
      if (errorData.error_code === 'WITHDRAWAL_HOURLY_LIMIT_EXCEEDED') {
        toast.error("لقد تجاوزت الحد الأقصى من طلبات السحب (3 في الساعة)");
      } else if (errorData.error_code === 'DAILY_WITHDRAWAL_LIMIT_EXCEEDED') {
        toast.error(`لقد تجاوزت الحد اليومي ($${errorData.daily_limit}). المتبقي: $${errorData.remaining}`);
      } else {
        toast.error(apiError.message || "فشل طلب السحب");
      }
    },
  });

  const validateIBAN = (value: string): boolean => {
    const cleaned = value.replace(/\s/g, '');
    if (!cleaned.match(/^SA\d{22}$/)) {
      setIbanError("رقم الحساب البنكي يجب أن يكون بصيغة IBAN السعودي (SA + 22 رقم)");
      return false;
    }
    setIbanError("");
    return true;
  };

  const handleWithdrawClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate amount
    const amount = parseFloat(withdrawAmount);
    
    if (!withdrawAmount || isNaN(amount)) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }
    
    if (amount < MIN_WITHDRAWAL) {
      toast.error(`الحد الأدنى للسحب هو $${MIN_WITHDRAWAL}`);
      return;
    }
    
    if (amount > MAX_WITHDRAWAL) {
      toast.error(`الحد الأقصى للسحب هو $${MAX_WITHDRAWAL} لكل عملية`);
      return;
    }
    
    if (amount > availableBalance) {
      toast.error("المبلغ أكبر من الرصيد المتاح");
      return;
    }
    
    // Validate bank account
    if (!bankAccount || !validateIBAN(bankAccount)) {
      if (!ibanError) {
        toast.error("يرجى إدخال رقم IBAN صحيح");
      }
      return;
    }
    
    // Show confirmation dialog
    setConfirmDialogOpen(true);
  };

  const handleWithdrawConfirm = () => {
    const amount = parseFloat(withdrawAmount);
    withdrawMutation.mutate({ amount, bank_account: bankAccount.trim() });
  };

  const formatPrice = (price: number) => {
    return '$' + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      pending: {
        label: 'قيد الانتظار',
        className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: Clock,
      },
      processing: {
        label: 'قيد المعالجة',
        className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: Loader2,
      },
      completed: {
        label: 'مكتمل',
        className: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: CheckCircle2,
      },
      failed: {
        label: 'فشل',
        className: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: XCircle,
      },
      cancelled: {
        label: 'ملغي',
        className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <p className="text-white/60 mb-4">يجب تسجيل الدخول لعرض المحفظة</p>
          <Button asChild>
            <Link to="/auth">تسجيل الدخول</Link>
          </Button>
        </div>
      </div>
    );
  }

  const availableBalance = wallet?.available_balance || 0;
  const onHoldBalance = wallet?.on_hold_balance || 0;
  const withdrawnTotal = wallet?.withdrawn_total || 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
      {/* Animated snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {useMemo(() => 
          [...Array(Math.floor(ANIMATION_CONFIG.SNOW_PARTICLES_COUNT * 0.6))].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDuration: `${ANIMATION_CONFIG.SNOW_FALL_DURATION_MIN + Math.random() * (ANIMATION_CONFIG.SNOW_FALL_DURATION_MAX - ANIMATION_CONFIG.SNOW_FALL_DURATION_MIN)}s`,
                animationDelay: `${Math.random() * ANIMATION_CONFIG.SNOW_DELAY_MAX}s`,
              }}
            />
          )), []
        )}
      </div>

      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-8 pb-24">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-8">المحفظة</h1>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <WalletIcon className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-2">الرصيد المتاح</p>
                <p className="text-3xl font-black text-white">{formatPrice(availableBalance)}</p>
              </Card>

              <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-yellow-500/20">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-2">قيد الانتظار</p>
                <p className="text-3xl font-black text-white">{formatPrice(onHoldBalance)}</p>
              </Card>

              <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <ArrowDownToLine className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-2">إجمالي المسحوب</p>
                <p className="text-3xl font-black text-white">{formatPrice(withdrawnTotal)}</p>
              </Card>
            </div>

        {/* Withdraw Button */}
        <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto mb-8 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]">
              <ArrowDownToLine className="mr-2 h-5 w-5" />
              سحب الأموال
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>سحب الأموال</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleWithdrawClick} className="space-y-4">
              {/* Withdrawal Limits Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-400 text-sm font-semibold mb-1">💰 حدود السحب</p>
                <div className="text-white/70 text-xs space-y-1">
                  <p>• الحد الأدنى: ${MIN_WITHDRAWAL}</p>
                  <p>• الحد الأقصى: ${MAX_WITHDRAWAL} لكل عملية</p>
                  <p>• الحد اليومي: ${DAILY_LIMIT}</p>
                  <p>• رسوم السحب: ${WITHDRAWAL_FEE} لكل عملية</p>
                </div>
              </div>

              <div>
                <Label>المبلغ</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={MIN_WITHDRAWAL}
                  max={Math.min(MAX_WITHDRAWAL, availableBalance)}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder={`الحد الأدنى: $${MIN_WITHDRAWAL}`}
                  required
                />
                <p className="text-sm text-white/60 mt-1">
                  الرصيد المتاح: {formatPrice(availableBalance)}
                </p>
              </div>

              {/* Fee Calculation */}
              {withdrawAmount && parseFloat(withdrawAmount) >= MIN_WITHDRAWAL && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">المبلغ المطلوب:</span>
                    <span className="text-white">${parseFloat(withdrawAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">رسوم السحب:</span>
                    <span className="text-red-400">-${WITHDRAWAL_FEE.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 my-2"></div>
                  <div className="flex justify-between font-bold">
                    <span className="text-white">المبلغ الصافي:</span>
                    <span className="text-green-400">
                      ${(parseFloat(withdrawAmount) - WITHDRAWAL_FEE).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <Label>رقم الحساب البنكي (IBAN)</Label>
                <Input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => {
                    setBankAccount(e.target.value);
                    if (e.target.value) {
                      validateIBAN(e.target.value);
                    }
                  }}
                  className={`bg-white/5 text-white ${
                    ibanError ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="SA1234567890123456789012"
                  required
                />
                {ibanError && (
                  <p className="text-red-400 text-xs mt-1">{ibanError}</p>
                )}
                <p className="text-xs text-white/60 mt-1">
                  يجب أن يبدأ بـ SA ويتبعه 22 رقماً
                </p>
              </div>

              <Button
                type="submit"
                disabled={withdrawMutation.isPending || !!ibanError}
                className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]"
              >
                متابعة
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Withdrawal History */}
        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <History className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">سجل السحوبات</h2>
              <p className="text-sm text-white/60">آخر 50 عملية سحب</p>
            </div>
          </div>

          {withdrawalsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-white/60" />
            </div>
          ) : !withdrawals || withdrawals.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 mx-auto mb-4 text-white/30" />
              <p className="text-white/60">لا توجد عمليات سحب بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((withdrawal: any) => (
                <Card key={withdrawal.id} className="p-4 bg-white/5 border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-2xl font-bold text-white">
                          {formatPrice(withdrawal.amount)}
                        </p>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      <p className="text-sm text-white/60">
                        {withdrawal.bank_account}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-white/60">
                    <p>📅 {formatDate(withdrawal.created_at)}</p>
                    {withdrawal.tap_transfer_id && (
                      <p>🔖 معرف التحويل: {withdrawal.tap_transfer_id}</p>
                    )}
                    {withdrawal.failure_reason && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mt-2">
                        <p className="text-red-400 text-sm">
                          ❌ سبب الفشل: {withdrawal.failure_reason}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      <BottomNav />

      {/* Withdrawal Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="bg-[hsl(200,70%,15%)] border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-right">
              تأكيد طلب السحب
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/80 text-right">
              يرجى مراجعة تفاصيل السحب بعناية:
              <br /><br />
              <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">المبلغ المطلوب:</span>
                  <span className="text-white font-bold">${parseFloat(withdrawAmount || "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">رسوم السحب:</span>
                  <span className="text-red-400">-${WITHDRAWAL_FEE.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/20 pt-2 flex justify-between">
                  <span className="text-white font-bold">المبلغ الصافي:</span>
                  <span className="text-green-400 font-bold">
                    ${(parseFloat(withdrawAmount || "0") - WITHDRAWAL_FEE).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-white/20 pt-2">
                  <span className="text-white/60">الحساب البنكي:</span>
                  <p className="text-white font-mono text-xs mt-1">{bankAccount}</p>
                </div>
              </div>
              <br />
              <strong className="text-yellow-400">⚠️ تنبيهات مهمة:</strong>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>لا يمكن إلغاء الطلب بعد التأكيد</li>
                <li>قد تستغرق المعالجة من 1-3 أيام عمل</li>
                <li>تأكد من صحة رقم الحساب البنكي</li>
                <li>سيتم خصم الرسوم من المبلغ المسحوب</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              disabled={withdrawMutation.isPending}
            >
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdrawConfirm}
              disabled={withdrawMutation.isPending}
              className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white"
            >
              {withdrawMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                'تأكيد السحب'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Wallet;
