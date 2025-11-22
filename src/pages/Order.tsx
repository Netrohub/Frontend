import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Shield, Clock, CheckCircle2, AlertTriangle, Copy, Eye, EyeOff, Loader2, Calendar } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ordersApi, listingsApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDateTime } from "@/utils/date";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [showCredentials, setShowCredentials] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const orderId = id ? parseInt(id) : 0;

  // Fetch order details
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getById(orderId),
    enabled: !!orderId && !!user,
    refetchInterval: (data) => {
      // Refetch every 30 seconds if order is in escrow_hold
      return data?.status === 'escrow_hold' ? 30000 : false;
    },
  });

  // Check if current user is the buyer
  const isBuyer = order?.buyer_id === user?.id;
  const isSeller = order?.seller_id === user?.id;

  // Fetch credentials separately (SECURITY: only when authorized)
  const shouldFetchCredentials = isBuyer && order?.listing_id && 
    (order?.status === 'escrow_hold' || order?.status === 'completed');

  const { data: credentials, isLoading: credentialsLoading } = useQuery({
    queryKey: ['listing-credentials', order?.listing_id],
    queryFn: () => order?.listing_id ? listingsApi.getCredentials(order.listing_id) : Promise.reject(),
    enabled: shouldFetchCredentials,
  });

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (order?.escrow_release_at) {
      const updateTimer = () => {
        const releaseTime = new Date(order.escrow_release_at).getTime();
        const now = new Date().getTime();
        const diff = releaseTime - now;

        if (diff <= 0) {
          setTimeLeft("00:00:00");
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [order?.escrow_release_at]);

  // Confirm order mutation (buyer only)
  const confirmMutation = useMutation({
    mutationFn: () => ordersApi.confirm(orderId),
    onSuccess: () => {
      toast.success(t('order.confirmSuccess'));
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      if (order?.listing_id) {
        queryClient.invalidateQueries({ queryKey: ['listing-credentials', order.listing_id] });
      }
      setShowConfirmDialog(false);
    },
    onError: (error: any) => {
      if (error.error_code === 'ONLY_BUYER_CAN_CONFIRM') {
        toast.error(t('order.onlyBuyerCanConfirm'));
      } else if (error.error_code === 'INVALID_ORDER_STATUS') {
        toast.error(t('order.cannotConfirmStatus'));
      } else {
        toast.error(error.message || t('order.confirmError'));
      }
      setShowConfirmDialog(false);
    },
  });

  // Cancel order mutation
  const cancelMutation = useMutation({
    mutationFn: () => ordersApi.cancel(orderId),
    onSuccess: () => {
      toast.success(t('order.cancelSuccess'));
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      if (error.error_code === 'CANNOT_CANCEL_COMPLETED') {
        toast.error(t('order.cannotCancelCompleted'));
      } else {
        toast.error(error.message || t('order.cancelError'));
      }
    },
  });

  const handleOpenDispute = () => {
    navigate(`/disputes?order_id=${orderId}`);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      payment_intent: { text: t('order.statusPending'), className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      pending: { text: t('order.statusPending'), className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      paid: { text: t('order.statusPaid'), className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      escrow_hold: { text: t('order.statusEscrow'), className: "bg-[hsl(40,90%,55%,0.2)] text-[hsl(40,90%,55%)] border-[hsl(40,90%,55%,0.3)]" },
      completed: { text: t('order.statusCompleted'), className: "bg-green-500/20 text-green-400 border-green-500/30" },
      cancelled: { text: t('order.statusCancelled'), className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
      disputed: { text: t('order.statusDisputed'), className: "bg-red-500/20 text-red-400 border-red-500/30" },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <Badge className={statusInfo.className}>{statusInfo.text}</Badge>;
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) =>
    formatLocalizedDateTime(dateString, language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleCopyCredential = (text: string, label: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      toast.success(t('order.copied', { label }));
    } else {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast.success(t('order.copied', { label }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar showDesktopLinks={false} />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar showDesktopLinks={false} />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 text-center">
          <Card className="p-12 bg-white/5 border-white/10 backdrop-blur-sm">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">{t('order.notFound')}</h2>
            <p className="text-white/60 mb-6">{t('order.notFoundMessage')}</p>
            <Button asChild className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]">
              <Link to="/orders">{t('order.backToOrders')}</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const canConfirm = isBuyer && order.status === 'escrow_hold';
  const canDispute = isBuyer && (order.status === 'escrow_hold' || order.status === 'disputed');
  // CRITICAL: Digital products (accounts) CANNOT be cancelled once payment is confirmed
  // Once credentials are shared (escrow_hold), cancellation is impossible
  // Only allow cancellation for payment_intent (before payment is confirmed)
  const canCancel = (isBuyer || isSeller) && order.status === 'payment_intent';

  return (
    <div className="min-h-screen relative overflow-hidden pb-20" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
      
      {/* Snow particles */}
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

      {/* Navigation */}
      <Navbar showDesktopLinks={false} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-black text-white">طلب #{order.id}</h1>
            {getStatusBadge(order.status)}
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Calendar className="h-4 w-4" />
            <p>{formatDate(order.created_at)}</p>
          </div>
        </div>

        {/* Timer Card - Only show if in escrow */}
        {order.status === 'escrow_hold' && order.escrow_release_at && (
          <Card className="p-6 mb-6 bg-gradient-to-br from-[hsl(40,90%,15%)] to-[hsl(40,80%,10%)] border-[hsl(40,90%,55%,0.5)] backdrop-blur-sm shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 rounded-full bg-[hsl(40,90%,55%,0.3)] border border-[hsl(40,90%,55%,0.5)]">
                <Clock className="h-8 w-8 text-[hsl(40,90%,55%)]" />
              </div>
              <div className="flex-1 text-center md:text-right">
                <h3 className="font-bold text-white text-lg mb-1">فترة الضمان النشطة</h3>
                <p className="text-white/80 text-sm">الوقت المتبقي لفحص الحساب وتأكيد الاستلام</p>
              </div>
              <div className="text-center md:text-left">
                <div className="text-4xl md:text-3xl font-black text-[hsl(40,90%,55%)]">{timeLeft || "00:00:00"}</div>
                <div className="text-xs text-white/70 mt-1">ساعة:دقيقة:ثانية</div>
              </div>
            </div>
          </Card>
        )}

        {/* Credentials Card - Only show for BUYER in escrow_hold or completed */}
        {isBuyer && (order.status === 'escrow_hold' || order.status === 'completed') && (
          <Card className="p-6 mb-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">معلومات الحساب</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,80%)] hover:bg-white/5"
              >
                {showCredentials ? (
                  <>
                    <EyeOff className="h-4 w-4 ml-2" />
                    إخفاء
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 ml-2" />
                    عرض
                  </>
                )}
              </Button>
            </div>

            {showCredentials ? (
              credentialsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-white/60" />
                </div>
              ) : credentials ? (
                <div className="space-y-4">
                  {credentials.account_email && (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/60">البريد الإلكتروني</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-[hsl(195,80%,70%)]"
                          onClick={() => handleCopyCredential(credentials.account_email, 'البريد الإلكتروني')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="font-mono text-white font-medium break-all">{credentials.account_email}</div>
                    </div>
                  )}

                  {credentials.account_password && (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/60">كلمة المرور</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-[hsl(195,80%,70%)]"
                          onClick={() => handleCopyCredential(credentials.account_password, 'كلمة المرور')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="font-mono text-white font-medium break-all">{credentials.account_password}</div>
                    </div>
                  )}

                  {/* Delivery Description */}
                  {credentials.account_metadata?.delivery_description && (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="mb-2">
                        <span className="text-sm text-white/60">{t('order.deliveryDescription')}</span>
                      </div>
                      <div className="text-white whitespace-pre-wrap">{credentials.account_metadata.delivery_description}</div>
                    </div>
                  )}

                  {/* Bill Images */}
                  {credentials.bill_images_unlocked && credentials.account_metadata?.bill_images ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-white">{t('order.billImagesTitle')}</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {credentials.account_metadata.bill_images.first && (
                          <div className="bg-white/5 rounded-lg border border-white/10 p-2">
                            <img src={credentials.account_metadata.bill_images.first} alt={t('sell.wos.firstBillAlt')} className="w-full h-auto rounded" />
                            <p className="text-xs text-white/60 text-center mt-1">{t('sell.wos.firstBillAlt')}</p>
                          </div>
                        )}
                        {credentials.account_metadata.bill_images.second && (
                          <div className="bg-white/5 rounded-lg border border-white/10 p-2">
                            <img src={credentials.account_metadata.bill_images.second} alt={t('sell.wos.secondBillAlt')} className="w-full h-auto rounded" />
                            <p className="text-xs text-white/60 text-center mt-1">{t('sell.wos.secondBillAlt')}</p>
                          </div>
                        )}
                        {credentials.account_metadata.bill_images.third && (
                          <div className="bg-white/5 rounded-lg border border-white/10 p-2">
                            <img src={credentials.account_metadata.bill_images.third} alt={t('sell.wos.thirdBillAlt')} className="w-full h-auto rounded" />
                            <p className="text-xs text-white/60 text-center mt-1">{t('sell.wos.thirdBillAlt')}</p>
                          </div>
                        )}
                        {credentials.account_metadata.bill_images.last && (
                          <div className="bg-white/5 rounded-lg border border-white/10 p-2">
                            <img src={credentials.account_metadata.bill_images.last} alt={t('sell.wos.lastBillAlt')} className="w-full h-auto rounded" />
                            <p className="text-xs text-white/60 text-center mt-1">{t('sell.wos.lastBillAlt')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    order?.status === 'escrow_hold' && (
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-white/70">{t('product.billImagesInfo')}</p>
                      </div>
                    )
                  )}

                  <div className="p-4 bg-[hsl(40,90%,55%,0.1)] rounded-lg border border-[hsl(40,90%,55%,0.3)]">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-[hsl(40,90%,55%)] flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-white/80">
                        <p className="font-bold mb-1">تحذير هام:</p>
                        <p>قم بتغيير كلمة المرور فوراً بعد تسجيل الدخول. لا تشارك هذه المعلومات مع أي شخص.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                  <p className="text-white/60">فشل تحميل بيانات الحساب</p>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">{t('order.revealAccountInfo')}</p>
              </div>
            )}
          </Card>
        )}

        {/* Seller View - Waiting for buyer confirmation */}
        {isSeller && order.status === 'escrow_hold' && (
          <Card className="p-6 mb-6 bg-blue-500/10 border-blue-500/30">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-blue-400 font-bold">{t('order.waitingBuyerConfirmation')}</p>
                <p className="text-white/70 text-sm mt-1">{t('order.escrowHoldMessage')}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Order Details */}
        <Card className="p-6 mb-6 bg-white/5 border-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4">تفاصيل الطلب</h3>
          <div className="space-y-3">
            {order.listing && (
              <div className="flex justify-between text-white/80">
                <span>اسم الحساب:</span>
                <span className="font-medium">{order.listing.title}</span>
              </div>
            )}
            {isBuyer && order.seller && (
              <div className="flex justify-between text-white/80">
                <span>البائع:</span>
                <Link to={`/profile/${order.seller.id}`} className="font-medium text-[hsl(195,80%,70%)] hover:underline">
                  {order.seller.name}
                </Link>
              </div>
            )}
            {isSeller && order.buyer && (
              <div className="flex justify-between text-white/80">
                <span>المشتري:</span>
                <Link to={`/profile/${order.buyer.id}`} className="font-medium text-[hsl(195,80%,70%)] hover:underline">
                  {order.buyer.name}
                </Link>
              </div>
            )}
            <div className="flex justify-between text-white/80">
              <span>المبلغ المدفوع:</span>
              <span className="font-bold text-[hsl(195,80%,70%)] text-xl">{formatPrice(order.amount)}</span>
            </div>
            {order.notes && (
              <div className="pt-3 border-t border-white/10">
                <span className="text-sm text-white/60 block mb-2">ملاحظات:</span>
                <p className="text-white/80">{order.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons for Buyer */}
        {canConfirm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              size="lg"
              onClick={() => setShowConfirmDialog(true)}
              disabled={confirmMutation.isPending}
              className="gap-2 text-sm md:text-base py-4 md:py-6 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white font-bold border-0 disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] touch-manipulation active:scale-95 transition-transform"
            >
              {confirmMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التأكيد...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <span className="hidden md:inline">تأكيد - الحساب يعمل بشكل صحيح</span>
                  <span className="md:hidden">تأكيد الاستلام</span>
                </>
              )}
            </Button>

            <Button 
              size="lg"
              variant="outline"
              onClick={handleOpenDispute}
              disabled={confirmMutation.isPending}
              className="gap-2 text-sm md:text-base py-4 md:py-6 bg-white/5 hover:bg-white/10 text-white border-white/20 font-bold disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] touch-manipulation active:scale-95 transition-transform"
            >
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <span className="hidden md:inline">فتح نزاع - هناك مشكلة</span>
              <span className="md:hidden">فتح نزاع</span>
            </Button>
          </div>
        )}

        {/* Cancel Button */}
        {canCancel && (
          <Button 
            variant="outline"
            size="lg"
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
            className="w-full gap-2 mb-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
          >
            {cancelMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري الإلغاء...
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5" />
                إلغاء الطلب {order.status === 'escrow_hold' && '(مع استرجاع المبلغ)'}
              </>
            )}
          </Button>
        )}

        {/* Completed Status */}
        {order.status === 'completed' && (
          <Card className="p-6 bg-green-500/10 border-green-500/30 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-green-400 font-bold">تم تأكيد الطلب بنجاح</p>
                {order.confirmed_at && (
                  <p className="text-white/60 text-sm mt-1">تاريخ التأكيد: {formatDate(order.confirmed_at)}</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Cancelled Status */}
        {order.status === 'cancelled' && (
          <Card className="p-6 bg-gray-500/10 border-gray-500/30 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-gray-400" />
              <p className="text-gray-400 font-bold">تم إلغاء الطلب</p>
            </div>
          </Card>
        )}

        {/* Dispute Info */}
        {order.dispute && (
          <Card className="p-6 bg-red-500/10 border-red-500/30 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-bold">يوجد نزاع مفتوح</p>
                  <p className="text-white/70 text-sm mt-1">تم فتح نزاع على هذا الطلب</p>
                </div>
              </div>
              <Button asChild variant="outline" className="bg-white/5 border-white/20 text-white">
                <Link to={`/disputes/${order.dispute.id}`}>
                  عرض النزاع
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Confirm Order Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد استلام الحساب</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              هل أنت متأكد أن الحساب يعمل بشكل صحيح وتريد تأكيد الاستلام؟
              <br /><br />
              <span className="text-[hsl(40,90%,55%)] font-semibold">⚠️ تحذير:</span> بعد التأكيد، سيتم تحويل الأموال للبائع ولن يمكنك فتح نزاع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmMutation.mutate()}
              className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white"
              disabled={confirmMutation.isPending}
            >
              {confirmMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري التأكيد...
                </>
              ) : (
                'نعم، تأكيد الاستلام'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Glow effects */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" />
    </div>
  );
};

export default Order;
