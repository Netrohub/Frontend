import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet as WalletIcon, ArrowDownToLine, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { walletApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Wallet = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletApi.get(),
    enabled: !!user,
  });

  const withdrawMutation = useMutation({
    mutationFn: (data: { amount: number; bank_account: string }) => walletApi.withdraw(data),
    onSuccess: () => {
      toast.success("تم تقديم طلب السحب بنجاح");
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setBankAccount("");
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل طلب السحب");
    },
  });

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }
    if (!bankAccount) {
      toast.error("يرجى إدخال رقم الحساب البنكي");
      return;
    }
    withdrawMutation.mutate({ amount, bank_account: bankAccount });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
        <Navbar />
        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <p className="text-white/60 mb-4">يجب تسجيل الدخول لعرض المحفظة</p>
        </div>
      </div>
    );
  }

  const availableBalance = wallet?.available_balance || 0;
  const onHoldBalance = wallet?.on_hold_balance || 0;
  const withdrawnTotal = wallet?.withdrawn_total || 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir="rtl">
      {/* Animated snow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-8 pb-24">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-8">المحفظة</h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" />
          </div>
        ) : (
          <>
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
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <Label>المبلغ</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={availableBalance}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-white/5 border-white/10"
                      required
                    />
                    <p className="text-sm text-white/60 mt-1">
                      الرصيد المتاح: {formatPrice(availableBalance)}
                    </p>
                  </div>
                  <div>
                    <Label>رقم الحساب البنكي</Label>
                    <Input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="bg-white/5 border-white/10"
                      placeholder="SA..."
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={withdrawMutation.isPending}
                    className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]"
                  >
                    {withdrawMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري المعالجة...
                      </>
                    ) : (
                      "تأكيد السحب"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Wallet;
