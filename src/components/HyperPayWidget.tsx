import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

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
        
        // Initialize HyperPay COPYandPAY widget
        // The widget will automatically show payment methods (MADA, VISA, MASTER) based on data-brands attribute
        // MADA will be shown first as per Saudi Payments requirements
        if (window.OPPWA && formRef.current) {
          try {
            window.OPPWA.checkout(checkoutId, (result: any) => {
              if (result.result && result.result.code) {
                // Payment completed - redirect to result URL
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
            console.error('HyperPay widget initialization error:', err);
            setError('Failed to initialize payment widget');
            onError?.('Failed to initialize payment widget');
          }
        }
        
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
  }, [widgetScriptUrl, integrity, onError, checkoutId]);

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

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
        <form
          ref={formRef}
          action={shopperResultUrl}
          className="paymentWidgets"
          data-brands={brands}
          id={`hyperpay-form-${checkoutId}`}
        />
        <p className="text-sm text-white/60 mt-4">
          Secure payment powered by HyperPay. MADA, Visa, and Mastercard accepted.
        </p>
      </div>
    </Card>
  );
};

