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
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const widgetInitialized = useRef(false);

  // Build the correct action URL for COPYandPAY form
  const baseUrl = widgetScriptUrl.split('/v1/')[0];
  const paymentActionUrl = `${baseUrl}/v1/checkouts/${checkoutId}/payment`;

  useEffect(() => {
    // Prevent multiple initializations
    if (widgetInitialized.current) {
      return;
    }

    // Set wpwlOptions BEFORE script loads
    const locale = language === 'ar' ? 'ar-SA' : 'en-US';
    
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
        console.log('HyperPay: Detected brands', detectedBrands);
        // Only allow detected brands - widget will handle disabling others automatically
      },
      
      // Custom styling for iframe inputs
      iframeStyles: {
        'card-number-placeholder': {
          'color': 'hsl(var(--muted-foreground))',
          'font-size': '16px',
          'font-family': 'var(--font-sans)',
        },
        'cvv-placeholder': {
          'color': 'hsl(var(--muted-foreground))',
          'font-size': '16px',
          'font-family': 'var(--font-sans)',
        },
      },
      
      showLabels: true,
      showPlaceholders: true,
      requireCvv: true,
      allowEmptyCvv: false,
      
      labels: {
        cardHolder: language === 'ar' ? 'اسم حامل البطاقة' : 'Card holder',
        cardNumber: language === 'ar' ? 'رقم البطاقة' : 'Card Number',
        cvv: language === 'ar' ? 'رمز الأمان' : 'CVV',
        expiryDate: language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date',
        submit: language === 'ar' ? 'ادفع الآن' : 'Pay now',
      },
      
      errorMessages: {
        cardHolderError: language === 'ar' ? 'اسم حامل البطاقة غير صالح' : 'Invalid card holder',
        cardNumberError: language === 'ar' ? 'رقم البطاقة غير صالح' : 'Invalid card number',
        cvvError: language === 'ar' ? 'رمز الأمان غير صالح' : 'Invalid CVV',
        expiryMonthError: language === 'ar' ? 'تاريخ الانتهاء غير صالح' : 'Invalid expiry date',
        expiryYearError: language === 'ar' ? 'تاريخ الانتهاء غير صالح' : 'Invalid expiry date',
      },
      
      onError: function(error: any) {
        console.error('HyperPay widget error:', error);
        const errorMsg = error.message || error.description || 'Payment error occurred';
        setError(errorMsg);
        onError?.(errorMsg);
      },
      
      onReady: function(containers: any[]) {
        console.log('HyperPay widget ready', containers);
        setIsInitialized(true);
        widgetInitialized.current = true;
      },
      
      numberFormatting: language !== 'ar',
    };

    // Function to load scripts and initialize widget
    const initializeWidget = () => {
      // Check if scripts already exist
      const existingWidgetScript = document.querySelector(`script[src="${widgetScriptUrl}"]`);
      const existingMadaScript = document.querySelector('script[src*="hyperpay-2024.quickconnect.to"]');
      
      if (existingWidgetScript && existingMadaScript) {
        // Scripts already loaded, try to initialize widget
        setTimeout(() => {
          if (window.OPPWA && formRef.current) {
            try {
              window.OPPWA.checkout(checkoutId, (result: any) => {
                if (result.result && result.result.code) {
                  const resourcePath = result.resourcePath || '';
                  if (resourcePath) {
                    onPaymentComplete?.(resourcePath);
                  } else {
                    onError?.('Payment completed but no resource path returned');
                  }
                } else {
                  onError?.('Payment failed: ' + (result.result?.description || 'Unknown error'));
                }
              });
            } catch (err) {
              console.error('Widget initialization error:', err);
            }
          }
        }, 100);
        return;
      }

      // Load MADA script first (use HTTPS to avoid mixed content errors)
      const madaScript = document.createElement("script");
      madaScript.src = "https://hyperpay-2024.quickconnect.to/d/f/597670674613449940";
      madaScript.async = true;
      
      // Load main widget script
      const widgetScript = document.createElement("script");
      widgetScript.src = widgetScriptUrl;
      widgetScript.async = true;
      
      if (integrity) {
        widgetScript.integrity = integrity;
        widgetScript.crossOrigin = "anonymous";
      }

      // Load MADA script first
      madaScript.onload = () => {
        // Then load widget script
        widgetScript.onload = () => {
          console.log('HyperPay scripts loaded successfully');
          
          // Widget should auto-initialize, but we can also manually trigger if needed
          setTimeout(() => {
            if (window.OPPWA && formRef.current && !isInitialized) {
              try {
                window.OPPWA.checkout(checkoutId, (result: any) => {
                  if (result.result && result.result.code) {
                    const resourcePath = result.resourcePath || '';
                    if (resourcePath) {
                      onPaymentComplete?.(resourcePath);
                    }
                  } else {
                    onError?.('Payment failed: ' + (result.result?.description || 'Unknown error'));
                  }
                });
              } catch (err) {
                console.error('Manual widget initialization error:', err);
              }
            }
          }, 500);
        };

        widgetScript.onerror = () => {
          setError("Failed to load payment widget script");
          onError?.("Failed to load payment widget script");
        };

        document.head.appendChild(widgetScript);
      };

      madaScript.onerror = () => {
        // Still try to load widget even if MADA script fails
        widgetScript.onload = () => {
          console.log('HyperPay widget script loaded (MADA script failed)');
        };
        widgetScript.onerror = () => {
          setError("Failed to load payment widget");
          onError?.("Failed to load payment widget");
        };
        document.head.appendChild(widgetScript);
      };

      document.head.appendChild(madaScript);
    };

    // Wait for form to be in DOM, then initialize
    const checkForm = setInterval(() => {
      if (formRef.current) {
        clearInterval(checkForm);
        initializeWidget();
      }
    }, 50);

    // Cleanup
    return () => {
      clearInterval(checkForm);
      widgetInitialized.current = false;
    };
  }, [checkoutId, widgetScriptUrl, integrity, shopperResultUrl, language, onPaymentComplete, onError, isInitialized]);

  if (error) {
    return (
      <Card className="p-6 bg-card border-destructive">
        <div className="text-center text-destructive">
          <p className="font-semibold">Payment Error</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Payment Details</h3>
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
          data-brands={brands}
          id={`hyperpay-form-${checkoutId}`}
          style={{ minHeight: '400px' }}
        >
          <input type="hidden" name="shopperResultUrl" value={shopperResultUrl} />
        </form>
        
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure payment powered by HyperPay</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
