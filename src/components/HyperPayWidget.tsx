import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface HyperPayWidgetProps {
  checkoutId: string;
  widgetScriptUrl: string;
  integrity?: string;
  shopperResultUrl: string;
  brands?: string;
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
  brands = "VISA MASTER AMEX",
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

    const script = document.createElement("script");
    script.src = widgetScriptUrl;
    script.async = true;
    
    if (integrity) {
      script.integrity = integrity;
      script.crossOrigin = "anonymous";
    }

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

    return () => {
      // Cleanup: remove script if component unmounts
      const existingScript = document.querySelector(`script[src="${widgetScriptUrl}"]`);
      if (existingScript) {
        existingScript.remove();
        scriptLoaded.current = false;
      }
    };
  }, [widgetScriptUrl, integrity, onError]);

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
      <form
        ref={formRef}
        action={shopperResultUrl}
        className="paymentWidgets"
        data-brands={brands}
      />
    </Card>
  );
};

