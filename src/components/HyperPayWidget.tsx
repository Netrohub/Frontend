import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import "./HyperPayWidget.css";

interface HyperPayWidgetProps {
  checkoutId: string;
  widgetScriptUrl: string;
  integrity?: string;
  shopperResultUrl: string;
  brands?: string;
  showMadaFirst?: boolean;
  onPaymentComplete?: (resourcePath: string) => void;
  onError?: (error: string) => void;
}

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

export const HyperPayWidget = ({
  checkoutId,
  widgetScriptUrl,
  integrity,
  shopperResultUrl,
  brands = "MADA VISA MASTER AMEX",
  showMadaFirst = true,
  onPaymentComplete,
  onError,
}: HyperPayWidgetProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scriptLoaded = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Load the HyperPay widget script
    if (scriptLoaded.current) {
      setLoading(false);
      return;
    }

    // ⚠️ CRITICAL: wpwlOptions MUST be set BEFORE the script loads!
    // COPYandPAY reads wpwlOptions when the script initializes
    // If set after, the widget will render basic HTML instead of styled widget
    if (typeof window !== 'undefined') {
      // Use current language from context
      const locale = language === 'ar' ? 'ar-SA' : 'en-US';
      
      window.wpwlOptions = {
            // Set locale for Arabic/English support
            locale: locale,
            
            // Style: "card" shows card-style form, "plain" removes styling
            style: "card",
            
            // Customize placeholder styles in iframe (for card number and CVV)
            iframeStyles: {
              'card-number-placeholder': {
                'color': '#9ca3af', // gray-400
                'font-size': '16px',
                'font-family': 'system-ui, -apple-system, sans-serif'
              },
              'cvv-placeholder': {
                'color': '#9ca3af', // gray-400
                'font-size': '16px',
                'font-family': 'system-ui, -apple-system, sans-serif'
              }
            },
            
            // Show labels and placeholders
            showLabels: true,
            showPlaceholders: true,
            
            // Require CVV (security best practice)
            requireCvv: true,
            allowEmptyCvv: false,
            
            // Custom labels (can be translated)
            labels: {
              cardHolder: language === 'ar' ? 'اسم حامل البطاقة' : 'Card holder',
              cardNumber: language === 'ar' ? 'رقم البطاقة' : 'Card Number',
              cvv: language === 'ar' ? 'رمز الأمان' : 'CVV',
              expiryDate: language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date',
              submit: language === 'ar' ? 'ادفع الآن' : 'Pay now',
            },
            
            // Custom error messages
            errorMessages: {
              cardHolderError: language === 'ar' ? 'اسم حامل البطاقة غير صالح' : 'Invalid card holder',
              cardNumberError: language === 'ar' ? 'رقم البطاقة غير صالح' : 'Invalid card number or brand',
              cvvError: language === 'ar' ? 'رمز الأمان غير صالح' : 'Invalid CVV',
              expiryMonthError: language === 'ar' ? 'تاريخ الانتهاء غير صالح' : 'Invalid expiry date',
              expiryYearError: language === 'ar' ? 'تاريخ الانتهاء غير صالح' : 'Invalid expiry date',
            },
            
            // Error handling callback
            onError: function(error: any) {
              console.error('HyperPay widget error:', error);
              
              if (error.name === 'InvalidCheckoutIdError') {
                onError?.('Payment session expired. Please try again.');
              } else if (error.name === 'WidgetError') {
                onError?.(`Payment widget error: ${error.brand} - ${error.event}`);
              } else if (error.name === 'PciIframeSubmitError') {
                onError?.('Payment form submission error. Please check your card details.');
              } else {
                onError?.(error.message || 'An error occurred during payment');
              }
            },
            
            // Widget ready callback
            onReady: function(containers: any[]) {
              console.log('HyperPay widget ready', containers);
              // Log available payment methods
              containers.forEach((container) => {
                console.log(`Container: ${container.containerKey}, Methods: ${container.ccMethods?.join(', ')}`);
              });
            },
            
        // Disable number formatting for Arabic (RTL languages not supported by formatter)
        numberFormatting: language !== 'ar',
      };
    }

    // Load MADA scripts first (required for MADA compliance)
    const madaScript = document.createElement("script");
    madaScript.src = "http://hyperpay-2024.quickconnect.to/d/f/597670674613449940";
    madaScript.async = true;
    
    // Load the main HyperPay widget script
    const script = document.createElement("script");
    script.src = widgetScriptUrl;
    script.async = true;
    
    // PCI DSS v4.0 compliance: Add integrity and crossorigin for Subresource Integrity (SRI)
    if (integrity) {
      script.integrity = integrity;
      script.crossOrigin = "anonymous"; // Required when using integrity
    }

    // Load MADA script first, then main widget script
    madaScript.onload = () => {
      // After MADA script loads, load the main widget script
      script.onload = () => {
        scriptLoaded.current = true;
        setLoading(false);
        
        // Widget should automatically initialize when script loads
        // The form with class="paymentWidgets" and data-brands will be processed
        // wpwlOptions was already set above, so widget will use those options
        
        console.log('HyperPay widget script loaded', {
          checkoutId,
          formExists: !!formRef.current,
          wpwlOptionsSet: !!window.wpwlOptions,
        });
        
        // Note: HyperPay mentioned adding a 3D Secure redirection script after paymentWidgets.js
        // The exact script URL should be provided by HyperPay support. For now, the widget should work
        // with the current setup. If 3DS redirection issues occur, contact HyperPay for the script URL.
      };

      script.onerror = () => {
        setError("Failed to load payment widget");
        setLoading(false);
        onError?.("Failed to load payment widget");
      };

      document.head.appendChild(script);
    };

    madaScript.onerror = () => {
      // If MADA script fails, still try to load main widget
      script.onload = () => {
        scriptLoaded.current = true;
        setLoading(false);
      };
      script.onerror = () => {
        setError("Failed to load payment widget");
        setLoading(false);
        onError?.("Failed to load payment widget");
      };
      document.head.appendChild(script);
    };

    document.head.appendChild(madaScript);

    return () => {
      // Cleanup: remove scripts if component unmounts
      const existingWidgetScript = document.querySelector(`script[src="${widgetScriptUrl}"]`);
      if (existingWidgetScript) {
        existingWidgetScript.remove();
      }
      const existingMadaScript = document.querySelector(`script[src="http://hyperpay-2024.quickconnect.to/d/f/597670674613449940"]`);
      if (existingMadaScript) {
        existingMadaScript.remove();
      }
      scriptLoaded.current = false;
    };
  }, [widgetScriptUrl, integrity, onError, checkoutId, language]);

  // Handle form submission
  useEffect(() => {
    if (!formRef.current || loading) return;

    const form = formRef.current;
    
    const handleSubmit = (e: Event) => {
      e.preventDefault();
      
      // The HyperPay widget will handle the form submission
      // and redirect to shopperResultUrl with resourcePath parameter
      // We just need to let it proceed
    };

    form.addEventListener("submit", handleSubmit);

    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, [loading, shopperResultUrl]);

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading payment form...</span>
        </div>
      </Card>
    );
  }

  // Build the correct action URL for COPYandPAY form
  // Format: https://eu-test.oppwa.com/v1/checkouts/{checkoutId}/payment
  const baseUrl = widgetScriptUrl.split('/v1/')[0]; // Extract base URL from script URL
  const paymentActionUrl = `${baseUrl}/v1/checkouts/${checkoutId}/payment`;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
        <form
          ref={formRef}
          action={paymentActionUrl}
          className="paymentWidgets"
          data-brands={brands}
          id={`hyperpay-form-${checkoutId}`}
        >
          {/* Hidden field for shopperResultUrl - widget will use this for redirect */}
          <input type="hidden" name="shopperResultUrl" value={shopperResultUrl} />
        </form>
        <p className="text-sm text-white/60 mt-4">
          Secure payment powered by HyperPay. MADA, Visa, and Mastercard accepted.
        </p>
      </div>
    </Card>
  );
};

