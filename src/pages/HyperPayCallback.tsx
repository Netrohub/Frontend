import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { paymentsApi } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";

const HyperPayCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const orderId = searchParams.get("order_id");
  const resourcePath = searchParams.get("resourcePath");
  const checkoutId = searchParams.get("id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      setMessage(t("hyperpayPayment.invalidOrder") || "Invalid order ID.");
      toast.error(t("hyperpayPayment.invalidOrder") || "Invalid order ID.");
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    if (!resourcePath) {
      setStatus("error");
      setMessage(t("hyperpayPayment.invalidCallback") || "Invalid payment callback.");
      toast.error(t("hyperpayPayment.invalidCallback") || "Invalid payment callback.");
      setTimeout(() => navigate(`/order/${orderId}?payment=failed`), 3000);
      return;
    }

    // Verify payment status with backend
    const verifyPayment = async () => {
      try {
        setStatus("loading");
        setMessage(t("hyperpayPayment.verifying") || "Verifying payment...");

        const response = await paymentsApi.getHyperPayStatus({
          resourcePath: decodeURIComponent(resourcePath),
          order_id: parseInt(orderId),
        });

        if (response.status === "success") {
          setStatus("success");
          setMessage(t("hyperpayPayment.paymentSuccess") || "Payment successful!");
          toast.success(t("hyperpayPayment.paymentSuccess") || "Payment successful!");
        } else {
          setStatus("error");
          if (response.isMadaCard && response.resultDescription) {
            setMessage(response.resultDescription);
            toast.error(response.resultDescription);
          } else {
            const errorMsg = response.resultDescription || t("hyperpayPayment.paymentFailed") || "Payment failed";
            setMessage(errorMsg);
            toast.error(errorMsg);
          }
        }
      } catch (err) {
        const apiError = err as Error & ApiError;
        setStatus("error");
        const errorMsg = apiError.message || t("hyperpayPayment.failedToVerify") || "Failed to verify payment status.";
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    };

    verifyPayment();
  }, [orderId, resourcePath, navigate, t]);

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (status === "success" && orderId) {
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            navigate(`/order/${orderId}?payment=success`, { replace: true });
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (status === "error" && orderId) {
      const timer = setTimeout(() => {
        navigate(`/order/${orderId}?payment=failed`, { replace: true });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status, orderId, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-16 w-16 text-success animate-in fade-in zoom-in duration-500" />;
      case "error":
        return <XCircle className="h-16 w-16 text-destructive animate-in fade-in zoom-in duration-500" />;
      default:
        return <Loader2 className="h-16 w-16 text-primary animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-success";
      case "error":
        return "text-destructive";
      case "pending":
        return "text-warning";
      default:
        return "text-primary";
    }
  };

  return (
    <>
      <SEO
        title={`${t("hyperpayPayment.paymentStatus") || "Payment Status"} - NXOLand`}
        description={t("hyperpayPayment.paymentStatusDescription") || "Payment processing status"}
        noIndex={true}
      />
      <div className="min-h-screen relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(200,85%,45%,0.1),transparent_50%)]" />
        </div>

        <Navbar showDesktopLinks={false} />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 md:p-12 bg-white/95 dark:bg-[hsl(220,30%,12%)]/95 backdrop-blur-sm border-white/20 shadow-2xl">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Status Icon */}
                <div className="flex items-center justify-center">{getStatusIcon()}</div>

                {/* Status Message */}
                <div className="space-y-2">
                  <h1 className={`text-3xl md:text-4xl font-black ${getStatusColor()}`}>
                    {status === "success"
                      ? t("hyperpayPayment.paymentSuccess") || "Payment Successful!"
                      : status === "error"
                      ? t("hyperpayPayment.paymentFailed") || "Payment Failed"
                      : t("hyperpayPayment.verifying") || "Verifying Payment..."}
                  </h1>
                  <p className="text-lg text-muted-foreground">{message}</p>
                </div>

                {/* Countdown */}
                {status === "success" && countdown > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? `سيتم إعادة التوجيه خلال ${countdown} ثانية...`
                      : `Redirecting in ${countdown} seconds...`}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                  {orderId && (
                    <Button
                      onClick={() => navigate(`/order/${orderId}`, { replace: true })}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white w-full sm:w-auto"
                    >
                      {t("hyperpayPayment.viewOrder") || "View Order"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate("/orders", { replace: true })}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {t("hyperpayPayment.viewAllOrders") || "View All Orders"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default HyperPayCallback;

