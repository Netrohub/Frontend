import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Shield, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { paymentsApi } from "@/lib/api";
import { toast } from "sonner";
import "./HyperPayPayment.css";

declare global {
  interface Window {
    OPPWA?: {
      checkout: (checkoutId: string, callback: (result: any) => void) => void;
    };
    wpwlOptions?: {
      locale?: string;
      style?: string;
      onError?: (error: any) => void;
      onReady?: (containers: any[]) => void;
      requireCvv?: boolean;
      allowEmptyCvv?: boolean;
      showLabels?: boolean;
      showPlaceholders?: boolean;
      labels?: Record<string, string>;
      errorMessages?: Record<string, string>;
      [key: string]: any;
    };
  }
}

const HyperPayPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const orderId = searchParams.get("order_id");
  
  const [checkoutData, setCheckoutData] = useState<{
    checkoutId: string;
    widgetScriptUrl: string;
    integrity?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const scriptsLoaded = useRef(false);

  useEffect(() => {
    if (!user) {
      toast.error(t("checkout.loginRequired") || "Please login to continue");
      navigate("/auth", { replace: true });
      return;
    }

    if (!orderId) {
      toast.error("Invalid order");
      navigate("/", { replace: true });
      return;
    }

    // Fetch checkout data
    const fetchCheckout = async () => {
      try {
        setLoading(true);
        const response = await paymentsApi.prepareHyperPayCheckout({
          order_id: parseInt(orderId),
          browserData: {
            acceptHeader: navigator.userAgent.includes("Chrome") 
              ? "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
              : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            language: navigator.language || "en-US",
            screenHeight: window.screen.height,
            screenWidth: window.screen.width,
            timezone: -new Date().getTimezoneOffset(),
            userAgent: navigator.userAgent,
            javaEnabled: false,
            javascriptEnabled: true,
            screenColorDepth: window.screen.colorDepth,
            challengeWindow: "05",
          },
        });

        setCheckoutData({
          checkoutId: response.checkoutId,
          widgetScriptUrl: response.widgetScriptUrl,
          integrity: response.integrity,
        });
      } catch (err: any) {
        setError(err.message || "Failed to initialize payment");
        toast.error(err.message || "Failed to initialize payment");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckout();
  }, [orderId, user, navigate, t]);

  useEffect(() => {
    if (!checkoutData || scriptsLoaded.current) return;

    const locale = language === "ar" ? "ar-SA" : "en-US";
    const baseUrl = checkoutData.widgetScriptUrl.split("/v1/")[0];
    const paymentActionUrl = `${baseUrl}/v1/checkouts/${checkoutData.checkoutId}/payment`;
    const shopperResultUrl = `${window.location.origin}/payments/hyperpay/callback?order_id=${orderId}`;

    // Set wpwlOptions BEFORE loading scripts
    window.wpwlOptions = {
      locale: locale,
      style: "card",
      
      iframeStyles: {
        "card-number-placeholder": {
          color: "hsl(var(--muted-foreground))",
          "font-size": "16px",
          "font-family": "var(--font-sans)",
        },
        "cvv-placeholder": {
          color: "hsl(var(--muted-foreground))",
          "font-size": "16px",
          "font-family": "var(--font-sans)",
        },
      },
      
      showLabels: true,
      showPlaceholders: true,
      requireCvv: true,
      allowEmptyCvv: false,
      
      labels: {
        cardHolder: language === "ar" ? "اسم حامل البطاقة" : "Card holder",
        cardNumber: language === "ar" ? "رقم البطاقة" : "Card Number",
        cvv: language === "ar" ? "رمز الأمان" : "CVV",
        expiryDate: language === "ar" ? "تاريخ الانتهاء" : "Expiry Date",
        submit: language === "ar" ? "ادفع الآن" : "Pay now",
      },
      
      errorMessages: {
        cardHolderError: language === "ar" ? "اسم حامل البطاقة غير صالح" : "Invalid card holder",
        cardNumberError: language === "ar" ? "رقم البطاقة غير صالح" : "Invalid card number",
        cvvError: language === "ar" ? "رمز الأمان غير صالح" : "Invalid CVV",
        expiryMonthError: language === "ar" ? "تاريخ الانتهاء غير صالح" : "Invalid expiry date",
        expiryYearError: language === "ar" ? "تاريخ الانتهاء غير صالح" : "Invalid expiry date",
      },
      
      onError: function (error: any) {
        console.error("HyperPay widget error:", error);
        const errorMsg = error.message || error.description || "Payment error occurred";
        setError(errorMsg);
        toast.error(errorMsg);
      },
      
      onReady: function (containers: any[]) {
        console.log("HyperPay widget ready", containers);
        setIsInitialized(true);
      },
      
      numberFormatting: language !== "ar",
    };

    // Wait for form to be in DOM
    const initWidget = () => {
      if (!formRef.current) {
        setTimeout(initWidget, 50);
        return;
      }

      // Check if scripts already loaded
      const existingWidget = document.querySelector(`script[src="${checkoutData.widgetScriptUrl}"]`);
      const existingMada = document.querySelector('script[src*="hyperpay-2024.quickconnect.to"]');

      if (existingWidget && existingMada) {
        scriptsLoaded.current = true;
        return;
      }

      // Load MADA script first
      const madaScript = document.createElement("script");
      madaScript.src = "http://hyperpay-2024.quickconnect.to/d/f/597670674613449940";
      madaScript.async = true;

      // Load widget script
      const widgetScript = document.createElement("script");
      widgetScript.src = checkoutData.widgetScriptUrl;
      widgetScript.async = true;

      if (checkoutData.integrity) {
        widgetScript.integrity = checkoutData.integrity;
        widgetScript.crossOrigin = "anonymous";
      }

      madaScript.onload = () => {
        widgetScript.onload = () => {
          console.log("HyperPay scripts loaded");
          scriptsLoaded.current = true;
          
          // Widget should auto-initialize, but ensure form action is set
          if (formRef.current) {
            formRef.current.action = paymentActionUrl;
            const hiddenInput = formRef.current.querySelector('input[name="shopperResultUrl"]');
            if (!hiddenInput) {
              const input = document.createElement("input");
              input.type = "hidden";
              input.name = "shopperResultUrl";
              input.value = shopperResultUrl;
              formRef.current.appendChild(input);
            }
          }
        };

        widgetScript.onerror = () => {
          setError("Failed to load payment widget");
          toast.error("Failed to load payment widget");
        };

        document.head.appendChild(widgetScript);
      };

      madaScript.onerror = () => {
        // Still try to load widget
        widgetScript.onload = () => {
          scriptsLoaded.current = true;
        };
        widgetScript.onerror = () => {
          setError("Failed to load payment widget");
          toast.error("Failed to load payment widget");
        };
        document.head.appendChild(widgetScript);
      };

      document.head.appendChild(madaScript);
    };

    initWidget();
  }, [checkoutData, language, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]">
        <Card className="p-8 max-w-md w-full">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-foreground">Initializing payment...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]">
        <Card className="p-8 max-w-md w-full">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-destructive text-center">
              <p className="font-semibold text-lg mb-2">Payment Error</p>
              <p className="text-sm">{error || "Failed to initialize payment"}</p>
            </div>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const baseUrl = checkoutData.widgetScriptUrl.split("/v1/")[0];
  const paymentActionUrl = `${baseUrl}/v1/checkouts/${checkoutData.checkoutId}/payment`;
  const shopperResultUrl = `${window.location.origin}/payments/hyperpay/callback?order_id=${orderId}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
          <p className="text-white/60">Secure payment powered by HyperPay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card border-border shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Payment Details</h2>
                {!isInitialized && (
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading...</span>
                  </div>
                )}
              </div>

              <form
                ref={formRef}
                action={paymentActionUrl}
                className="paymentWidgets"
                data-brands="MADA VISA MASTER AMEX"
                id={`hyperpay-form-${checkoutData.checkoutId}`}
                style={{ minHeight: "450px" }}
              >
                <input type="hidden" name="shopperResultUrl" value={shopperResultUrl} />
              </form>

              <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Your payment is secured with 256-bit SSL encryption
                </span>
              </div>
            </Card>
          </div>

          {/* Security Info - Takes 1 column */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card border-border shadow-xl h-fit">
              <div className="space-y-6">
                <div>
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">SSL Encrypted</p>
                      <p className="text-xs text-muted-foreground">256-bit encryption</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">PCI Compliant</p>
                      <p className="text-xs text-muted-foreground">Level 1 certified</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">3D Secure</p>
                      <p className="text-xs text-muted-foreground">Additional verification</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Accepted payment methods: MADA, Visa, Mastercard
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HyperPayPayment;

