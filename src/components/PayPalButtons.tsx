import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { paymentsApi } from "@/lib/api";
import { toast } from "sonner";

interface PayPalButtonsProps {
  orderId: number;
  amount: number;
  currency?: string;
  onPaymentSuccess?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => {
        render: (selector: string) => void;
      };
    };
  }
}

export const PayPalButtons = ({
  orderId,
  amount,
  currency = "USD",
  onPaymentSuccess,
  onError,
}: PayPalButtonsProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scriptLoaded = useRef(false);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const buttonsRendered = useRef(false);

  useEffect(() => {
    // Load PayPal SDK script
    if (scriptLoaded.current) {
      setLoading(false);
      return;
    }

    // Get PayPal client ID from environment or config
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
    const environment = import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox';
    
    if (!clientId) {
      const errorMsg = 'PayPal client ID not configured';
      setError(errorMsg);
      setLoading(false);
      onError?.(errorMsg);
      return;
    }

    // Load PayPal SDK script
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.async = true;
    script.setAttribute('data-sdk-integration-source', 'button-factory');

    script.onload = () => {
      scriptLoaded.current = true;
      setLoading(false);
      
      // Render PayPal buttons after SDK loads
      if (window.paypal && buttonsContainerRef.current && !buttonsRendered.current) {
        try {
          window.paypal.Buttons({
            style: {
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
            },
            createOrder: async (data: any, actions: any) => {
              try {
                // Call backend to create PayPal order
                const response = await paymentsApi.createPayPalOrder({ order_id: orderId });
                
                if (!response.paypalOrderId) {
                  throw new Error('Failed to create PayPal order');
                }
                
                // Return the PayPal order ID
                return response.paypalOrderId;
              } catch (err: any) {
                const errorMsg = err.message || 'Failed to create order';
                toast.error(errorMsg);
                onError?.(errorMsg);
                throw err;
              }
            },
            onApprove: async (data: any, actions: any) => {
              try {
                // Call backend to capture the payment
                const response = await paymentsApi.capturePayPalOrder({
                  order_id: orderId,
                  paypal_order_id: data.orderID,
                });
                
                if (response.status === 'success') {
                  toast.success('Payment successful!');
                  onPaymentSuccess?.();
                } else {
                  throw new Error(response.response?.message || 'Payment capture failed');
                }
              } catch (err: any) {
                const errorMsg = err.message || 'Failed to capture payment';
                toast.error(errorMsg);
                onError?.(errorMsg);
              }
            },
            onError: (err: any) => {
              const errorMsg = err.message || 'An error occurred with PayPal';
              setError(errorMsg);
              toast.error(errorMsg);
              onError?.(errorMsg);
            },
            onCancel: (data: any) => {
              toast.info('Payment cancelled');
            },
          }).render(buttonsContainerRef.current);
          
          buttonsRendered.current = true;
        } catch (err: any) {
          const errorMsg = err.message || 'Failed to render PayPal buttons';
          setError(errorMsg);
          setLoading(false);
          onError?.(errorMsg);
        }
      }
    };

    script.onerror = () => {
      const errorMsg = 'Failed to load PayPal SDK';
      setError(errorMsg);
      setLoading(false);
      onError?.(errorMsg);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [orderId, currency, onPaymentSuccess, onError]);

  if (error) {
    return (
      <Card className="p-4 bg-red-500/10 border-red-500/30">
        <p className="text-red-400 text-sm">{error}</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6 bg-white/5 border-white/10">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-white/60" />
          <span className="text-white/80">Loading PayPal...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <div ref={buttonsContainerRef} className="paypal-buttons-container" />
    </div>
  );
};

