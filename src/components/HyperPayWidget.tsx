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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const scriptLoadedRef = useRef(false);

  // Build the correct action URL for COPYandPAY form
  const baseUrl = widgetScriptUrl.split('/v1/')[0];
  const paymentActionUrl = `${baseUrl}/v1/checkouts/${checkoutId}/payment`;

  useEffect(() => {
    // Skip if already loaded
    if (scriptLoadedRef.current) {
      return;
    }

    // ⚠️ CRITICAL: wpwlOptions MUST be set BEFORE the script loads!
    // COPYandPAY reads wpwlOptions when the script initializes
    // The form MUST be in the DOM when the script loads
    if (typeof window !== 'undefined') {
      const locale = language === 'ar' ? 'ar-SA' : 'en-US';
      
      window.wpwlOptions = {
        // Set locale for Arabic/English support
        locale: locale,
        
        // Style: "card" shows card-style form, "plain" removes styling
        style: "card",
        
        // Customize placeholder styles in iframe (for card number and CVV)
        iframeStyles: {
          'card-number-placeholder': {
            'color': '#9ca3af',
            'font-size': '16px',
            'font-family': 'system-ui, -apple-system, sans-serif'
          },
          'cvv-placeholder': {
            'color': '#9ca3af',
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
          setScriptLoaded(true);
          containers.forEach((container) => {
            console.log(`Container: ${container.containerKey}, Methods: ${container.ccMethods?.join(', ')}`);
          });
        },
        
        // Disable number formatting for Arabic (RTL languages not supported by formatter)
        numberFormatting: language !== 'ar',
      };
    }

    // Wait for form to be in DOM before loading script
    // COPYandPAY widget needs the form element to exist when script initializes
    const checkFormAndLoadScript = () => {
      if (!formRef.current) {
        // Form not ready yet, try again
        setTimeout(checkFormAndLoadScript, 50);
        return;
      }

      // Form is in DOM, now load scripts
      // Load MADA scripts first (required for MADA compliance)
      const madaScript = document.createElement("script");
      madaScript.src = "http://hyperpay-2024.quickconnect.to/d/f/597670674613449940";
      madaScript.async = false; // Load synchronously to ensure order
      
      // Load the main HyperPay widget script
      const script = document.createElement("script");
      script.src = widgetScriptUrl;
      script.async = false; // Load synchronously to ensure initialization happens after form exists
      
      // PCI DSS v4.0 compliance: Add integrity and crossorigin for Subresource Integrity (SRI)
      if (integrity) {
        script.integrity = integrity;
        script.crossOrigin = "anonymous";
      }

      // Load MADA script first, then main widget script
      madaScript.onload = () => {
        // After MADA script loads, load the main widget script
        script.onload = () => {
          scriptLoadedRef.current = true;
          console.log('HyperPay widget script loaded', {
            checkoutId,
            formExists: !!formRef.current,
            wpwlOptionsSet: !!window.wpwlOptions,
          });
          
          // Widget should automatically initialize when script loads
          // The form with class="paymentWidgets" and data-brands will be processed
          // wpwlOptions was already set above, so widget will use those options
        };

        script.onerror = () => {
          setError("Failed to load payment widget");
          onError?.("Failed to load payment widget");
        };

        document.head.appendChild(script);
      };

      madaScript.onerror = () => {
        // If MADA script fails, still try to load main widget
        script.onload = () => {
          scriptLoadedRef.current = true;
        };
        script.onerror = () => {
          setError("Failed to load payment widget");
          onError?.("Failed to load payment widget");
        };
        document.head.appendChild(script);
      };

      document.head.appendChild(madaScript);
    };

    // Start checking for form
    checkFormAndLoadScript();

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
      scriptLoadedRef.current = false;
    };
  }, [widgetScriptUrl, integrity, onError, checkoutId, language]);

  // Handle form submission - widget handles this automatically
  useEffect(() => {
    if (!formRef.current) return;

    const form = formRef.current;
    
    const handleSubmit = (e: Event) => {
      // The HyperPay widget will handle the form submission
      // and redirect to shopperResultUrl with resourcePath parameter
      // We just need to let it proceed
    };

    form.addEventListener("submit", handleSubmit);

    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, [shopperResultUrl]);

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  // Render form immediately - widget script will transform it when it loads
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
        {!scriptLoaded && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-white/60">Loading payment form...</span>
          </div>
        )}
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

