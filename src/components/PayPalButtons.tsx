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

// PayPal SDK v6 types
declare global {
  interface Window {
    paypal?: {
      createInstance: (config: {
        clientToken: string;
        components: string[];
        pageType?: string;
      }) => Promise<PayPalSDKInstance>;
    };
  }
}

interface PayPalSDKInstance {
  findEligibleMethods: (options: { currencyCode: string }) => Promise<PayPalEligibleMethods>;
  createPayPalOneTimePaymentSession: (options: PayPalPaymentSessionOptions) => PayPalPaymentSession;
}

interface PayPalEligibleMethods {
  isEligible: (method: string) => boolean;
  getDetails: (method: string) => any;
}

interface PayPalPaymentSession {
  start: (presentationMode: { presentationMode: string }, createOrderPromise: Promise<{ orderId: string }>) => Promise<void>;
}

interface PayPalPaymentSessionOptions {
  onApprove: (data: { orderId: string }) => Promise<void>;
  onCancel?: (data: any) => void;
  onError?: (error: any) => void;
}

export const PayPalButtons = ({
  orderId,
  amount,
  currency = "USD",
  onPaymentSuccess,
  onError,
}: PayPalButtonsProps) => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [sdkInstance, setSdkInstance] = useState<PayPalSDKInstance | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const paymentSessionRef = useRef<PayPalPaymentSession | null>(null);
  const scriptLoaded = useRef(false);

  // Load PayPal SDK v6
  useEffect(() => {
    if (scriptLoaded.current) {
      return;
    }

    const environment = import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox';
    const sdkUrl = environment === 'live'
      ? 'https://www.paypal.com/web-sdk/v6/core'
      : 'https://www.sandbox.paypal.com/web-sdk/v6/core';

    console.log('Loading PayPal SDK v6:', { sdkUrl, environment });

    const script = document.createElement("script");
    script.src = sdkUrl;
    script.async = true;
    
    script.onload = async () => {
      console.log('PayPal SDK v6 loaded successfully');
      scriptLoaded.current = true;
      
      // Get client token from backend
      try {
        const response = await paymentsApi.getPayPalClientToken();
        const token = response.clientToken;
        console.log('PayPal client token obtained');
        setClientToken(token);
        
        // Initialize SDK instance
        if (window.paypal) {
          try {
            const instance = await window.paypal.createInstance({
              clientToken: token,
              components: ["paypal-payments"],
              pageType: "checkout",
            });
            
            console.log('PayPal SDK instance created');
            setSdkInstance(instance);
            setLoading(false);
          } catch (err: any) {
            console.error('PayPal SDK initialization error:', err);
            const errorMsg = err.message || 'Failed to initialize PayPal SDK';
            setError(errorMsg);
            setLoading(false);
            onError?.(errorMsg);
            toast.error(errorMsg);
          }
        }
      } catch (err: any) {
        console.error('Failed to get PayPal client token:', err);
        const errorMsg = err.message || 'Failed to get PayPal client token';
        setError(errorMsg);
        setLoading(false);
        onError?.(errorMsg);
        toast.error(errorMsg);
      }
    };

    script.onerror = (err) => {
      console.error('PayPal SDK v6 load error:', err);
      const errorMsg = 'Failed to load PayPal SDK. Please check your internet connection and try again.';
      setError(errorMsg);
      setLoading(false);
      onError?.(errorMsg);
      toast.error(errorMsg);
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Set up PayPal button when SDK is ready
  useEffect(() => {
    if (!sdkInstance || !buttonRef.current || paymentSessionRef.current) {
      return;
    }

    const setupPayPalButton = async () => {
      try {
        // Check eligibility
        const paymentMethods = await sdkInstance.findEligibleMethods({
          currencyCode: currency,
        });

        if (!paymentMethods.isEligible("paypal")) {
          const errorMsg = 'PayPal is not available for this transaction';
          console.warn('PayPal not eligible:', { currency });
          setError(errorMsg);
          onError?.(errorMsg);
          return;
        }

        // Create payment session
        const paymentSession = sdkInstance.createPayPalOneTimePaymentSession({
          onApprove: async (data) => {
            console.log('PayPal payment approved:', data);
            try {
              setProcessing(true);
              
              const response = await paymentsApi.capturePayPalOrder({
                order_id: orderId,
                paypal_order_id: data.orderId,
              });
              
              console.log('PayPal capture response:', response);
              
              if (response.status === 'success') {
                toast.success('Payment successful!');
                onPaymentSuccess?.();
              } else if (response.status === 'pending') {
                toast.info('Payment is being processed...');
                onPaymentSuccess?.();
              } else {
                const errorMsg = response.response?.message || response.message || 'Payment capture failed';
                throw new Error(errorMsg);
              }
            } catch (err: any) {
              console.error('PayPal capture error:', err);
              const errorMsg = err.message || 'Failed to capture payment. Please contact support if payment was deducted.';
              toast.error(errorMsg);
              onError?.(errorMsg);
            } finally {
              setProcessing(false);
            }
          },
          onCancel: (data) => {
            console.log('PayPal payment cancelled:', data);
            toast.info('Payment cancelled');
          },
          onError: (error) => {
            console.error('PayPal payment error:', error);
            const errorMsg = error.message || 'An error occurred with PayPal';
            toast.error(errorMsg);
            onError?.(errorMsg);
          },
        });

        paymentSessionRef.current = paymentSession;

        // Set up button click handler
        buttonRef.current.addEventListener('click', async () => {
          try {
            console.log('PayPal button clicked, creating order...');
            
            // Create order promise
            const createOrderPromise = (async () => {
              try {
                const response = await paymentsApi.createPayPalOrder({ order_id: orderId });
                console.log('PayPal order created:', response);
                
                if (response.error_code === 'PAYMENT_ALREADY_EXISTS' && response.paypalOrderId) {
                  console.log('Using existing PayPal order:', response.paypalOrderId);
                  return { orderId: response.paypalOrderId };
                }
                
                if (!response.paypalOrderId) {
                  throw new Error('Failed to create PayPal order: No order ID returned');
                }
                
                // v6 requires returning { orderId: "..." } object
                return { orderId: response.paypalOrderId };
              } catch (err: any) {
                console.error('PayPal createOrder error:', err);
                const errorMsg = err.message || 'Failed to create order';
                toast.error(errorMsg);
                onError?.(errorMsg);
                throw err;
              }
            })();

            // Start payment flow with auto presentation mode
            await paymentSession.start(
              { presentationMode: "auto" },
              createOrderPromise
            );
          } catch (err: any) {
            console.error('PayPal payment start error:', err);
            const errorMsg = err.message || 'Failed to start payment';
            toast.error(errorMsg);
            onError?.(errorMsg);
          }
        });

        console.log('PayPal button set up successfully');
      } catch (err: any) {
        console.error('PayPal button setup error:', err);
        const errorMsg = err.message || 'Failed to set up PayPal button';
        setError(errorMsg);
        onError?.(errorMsg);
        toast.error(errorMsg);
      }
    };

    setupPayPalButton();
  }, [sdkInstance, orderId, currency, onPaymentSuccess, onError]);

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
      {processing && (
        <Card className="p-4 bg-white/5 border-white/10 mb-4">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-white/60" />
            <span className="text-white/80 text-sm">Processing payment...</span>
          </div>
        </Card>
      )}
      <button
        ref={buttonRef}
        className="w-full px-6 py-3 bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={processing || !sdkInstance}
      >
        {processing ? 'Processing...' : 'Pay with PayPal'}
      </button>
      {sdkInstance && !loading && !processing && (
        <p className="text-xs text-white/60 mt-2 text-center">
          Click the button above to complete your payment
        </p>
      )}
    </div>
  );
};
