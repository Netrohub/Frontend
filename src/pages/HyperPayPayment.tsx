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
  const paymentMethod = searchParams.get("payment_method") as "MADA" | "VISA" | "MASTERCARD" | null;
  
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

    // Validate payment method
    if (!paymentMethod || !["MADA", "VISA", "MASTERCARD"].includes(paymentMethod)) {
      toast.error("Please select a payment method");
      navigate(`/checkout?order_id=${orderId}`, { replace: true });
      return;
    }

    // Fetch checkout data
    const fetchCheckout = async () => {
      try {
        setLoading(true);
        const response = await paymentsApi.prepareHyperPayCheckout({
          order_id: parseInt(orderId),
          payment_method: paymentMethod,
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
  }, [orderId, paymentMethod, user, navigate, t]);

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
      
      // Display billing address fields so shopper can edit them
      billingAddress: {},
      mandatoryBillingFields: {
        country: true,
        state: true,
        city: true,
        postcode: true,
        street1: true,
        street2: false, // Optional field
      },
      
      // Mask CVV for security
      maskCvv: true,
      
      // Brand detection configuration
      brandDetection: true,
      brandDetectionType: "binlist", // Use internal BIN list for precise detection
      brandDetectionPriority: ["MADA", "VISA", "MASTER", "AMEX"], // Priority order for detected brands
      
      // Callback to disable non-detected brands (only show detected brands)
      onDetectBrand: function (detectedBrands: string[]) {
        console.log("HyperPay: Detected brands", detectedBrands);
        // Only allow detected brands - widget will handle disabling others automatically
      },
      
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

      // Load MADA script first (use HTTPS to avoid mixed content errors)
      const madaScript = document.createElement("script");
      madaScript.src = "https://hyperpay-2024.quickconnect.to/d/f/597670674613449940";
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
          
          // Widget should auto-initialize
          // NOTE: For COPYandPAY widget:
          // - Use data-checkout-id attribute (not action attribute) to prevent widget from using form action as shopperResultUrl
          // - shopperResultUrl is set during checkout creation and widget uses it automatically
          // - Widget will handle form submission internally
          if (formRef.current) {
            // Ensure data-checkout-id is set (widget uses this to find the checkout)
            if (!formRef.current.getAttribute('data-checkout-id')) {
              formRef.current.setAttribute('data-checkout-id', checkoutData.checkoutId);
            }
            // Remove action attribute if it exists (widget handles submission internally)
            if (formRef.current.action) {
              formRef.current.removeAttribute('action');
            }
            // Remove any shopperResultUrl input if it exists (widget handles this automatically)
            const existingShopperResultUrl = formRef.current.querySelector('input[name="shopperResultUrl"]');
            if (existingShopperResultUrl) {
              existingShopperResultUrl.remove();
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
    <div className="min-h-screen relative overflow-hidden hyperpay-payment-page">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(200,85%,45%,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(195,80%,70%,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "ar" ? "رجوع" : "Back"}
          </Button>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
              {language === "ar" ? "أكمل الدفع" : "Complete Your Payment"}
            </h1>
            <p className="text-white/70 text-lg">
              {language === "ar" ? "دفع آمن مدعوم من HyperPay" : "Secure payment powered by HyperPay"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white/95 dark:bg-[hsl(220,30%,12%)]/95 backdrop-blur-sm border-white/20 shadow-2xl hover:shadow-[0_20px_60px_-15px_hsl(200,85%,45%,0.3)] transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-foreground">
                  {language === "ar" ? "تفاصيل الدفع" : "Payment Details"}
                </h2>
                {!isInitialized && (
                  <div className="flex items-center text-muted-foreground text-sm animate-pulse">
                    <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary" />
                    <span>{language === "ar" ? "جاري التحميل..." : "Loading..."}</span>
                  </div>
                )}
              </div>

              <form
                ref={formRef}
                className="paymentWidgets"
                data-brands="MADA VISA MASTER AMEX"
                data-checkout-id={checkoutData.checkoutId}
                id={`hyperpay-form-${checkoutData.checkoutId}`}
                style={{ minHeight: "450px" }}
              >
                {/* NOTE: For COPYandPAY widget:
                    - Use data-checkout-id attribute (not action attribute)
                    - shopperResultUrl is set during checkout creation and widget uses it automatically
                    - Widget will handle form submission to the correct payment endpoint */}
              </form>

              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border/50">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {language === "ar" 
                    ? "دفعك محمي بتشفير SSL 256 بت" 
                    : "Your payment is secured with 256-bit SSL encryption"}
                </span>
              </div>
            </Card>
          </div>

          {/* Security Info - Takes 1 column */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white/95 dark:bg-[hsl(220,30%,12%)]/95 backdrop-blur-sm border-white/20 shadow-2xl h-fit sticky top-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-3">
                    {language === "ar" ? "دفع آمن" : "Secure Payment"}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language === "ar"
                      ? "معلومات الدفع الخاصة بك مشفرة وآمنة. نحن لا نخزن تفاصيل بطاقتك أبداً."
                      : "Your payment information is encrypted and secure. We never store your card details."}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all duration-300">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-primary/30">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground mb-1">
                        {language === "ar" ? "مشفّر SSL" : "SSL Encrypted"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === "ar" ? "تشفير 256 بت" : "256-bit encryption"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-accent/5 to-transparent hover:from-accent/10 transition-all duration-300">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-success flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-accent/30">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground mb-1">
                        {language === "ar" ? "متوافق مع PCI" : "PCI Compliant"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === "ar" ? "معتمد من المستوى 1" : "Level 1 certified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-success/5 to-transparent hover:from-success/10 transition-all duration-300">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-success/30">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground mb-1">
                        {language === "ar" ? "3D Secure" : "3D Secure"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === "ar" ? "التحقق الإضافي" : "Additional verification"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center font-medium">
                    {language === "ar"
                      ? "طرق الدفع المقبولة: مدى، فيزا، ماستركارد"
                      : "Accepted payment methods: MADA, Visa, Mastercard"}
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

