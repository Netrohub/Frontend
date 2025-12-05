import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { paymentsApi } from "@/lib/api";
import { toast } from "sonner";

interface PayPalButtonsProps {
  orderId: number;
  amount: number;
  currency?: string;
  onPaymentSuccess?: () => void;
  onError?: (error: string) => void;
}

// PayPal JavaScript SDK types for Expanded Checkout
declare global {
  interface Window {
    paypal?: {
      CardFields: (config: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderId: string; liabilityShift?: string }) => Promise<void>;
        onError?: (error: any) => void;
        style?: any;
      }) => {
        render: (selector: string) => void;
      };
      Buttons: (config: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderId: string }) => Promise<void>;
        onError?: (error: any) => void;
        style?: any;
      }) => {
        render: (selector: string) => void;
      };
    };
  }
}

/**
 * PayPal Expanded Checkout with Hosted Card Fields
 * Reference: https://developer.paypal.com/studio/checkout/advanced/getstarted
 * 
 * Features:
 * - Hosted card fields (PCI compliant)
 * - PayPal button
 * - Pay Later options
 * - Venmo (US only)
 * - 3D Secure support
 */
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
  const [cardFieldsEligible, setCardFieldsEligible] = useState<boolean | null>(null);
  const scriptLoaded = useRef(false);
  const cardFieldsContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonsContainerRef = useRef<HTMLDivElement>(null);
  const cardFieldsRef = useRef<any>(null);
  const paypalButtonsRef = useRef<any>(null);
  const paypalOrderIdRef = useRef<string | null>(null); // Store PayPal order ID from createOrder

  useEffect(() => {
    // Load PayPal JavaScript SDK
    if (scriptLoaded.current) {
      setLoading(false);
      return;
    }

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
    const environment = import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox';
    
    if (!clientId) {
      const errorMsg = 'PayPal client ID not configured. Please set VITE_PAYPAL_CLIENT_ID in your .env file.';
      console.error('PayPal Error:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      onError?.(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // SDK URL based on environment
    const sdkUrl = environment === 'live'
      ? 'https://www.paypal.com/sdk/js'
      : 'https://www.sandbox.paypal.com/sdk/js';

    console.log('Loading PayPal SDK for Expanded Checkout:', { sdkUrl, environment });

    // Load SDK with buttons first, then check for card-fields eligibility
    // We'll try to load card-fields, but handle gracefully if not eligible
    const script = document.createElement("script");
    script.src = `${sdkUrl}?client-id=${clientId}&currency=${currency}&components=buttons,card-fields`;
    script.async = true;
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    
    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      scriptLoaded.current = true;
      setLoading(false);
      
      // Small delay to ensure SDK is fully initialized
      setTimeout(() => {
        checkEligibilityAndInitialize();
      }, 100);
    };

    script.onerror = (err) => {
      console.error('PayPal SDK load error:', err);
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
  }, [orderId, currency, onPaymentSuccess, onError]);

  const checkEligibilityAndInitialize = () => {
    if (!window.paypal) {
      console.error('PayPal SDK not available');
      setError('PayPal SDK not loaded');
      return;
    }

    // Check if CardFields API is available
    // If not available, card payments are not eligible for this account
    const hasCardFieldsAPI = typeof window.paypal.CardFields === 'function';
    
    if (!hasCardFieldsAPI) {
      console.warn('PayPal Card Fields API not available - card payments not eligible');
      setCardFieldsEligible(false);
      // Still initialize PayPal buttons
      initializePayPalComponents(false);
      return;
    }

    // CardFields API is available, try to initialize
    // If initialization fails with eligibility error, we'll catch it
    setCardFieldsEligible(true);
    initializePayPalComponents(true);
  };

  const initializePayPalComponents = (cardFieldsAvailable: boolean) => {
    if (!window.paypal) {
      console.error('PayPal SDK not available');
      setError('PayPal SDK not loaded');
      return;
    }

    // Shared createOrder function
    const createOrder = async (): Promise<string> => {
      console.log('PayPal createOrder called', { orderId });
      try {
        const response = await paymentsApi.createPayPalOrder({ order_id: orderId });
        console.log('PayPal order created:', response);
        
        let paypalOrderId: string;
        
        if (response.error_code === 'PAYMENT_ALREADY_EXISTS' && response.paypalOrderId) {
          console.log('Using existing PayPal order:', response.paypalOrderId);
          paypalOrderId = response.paypalOrderId;
        } else if (response.paypalOrderId) {
          paypalOrderId = response.paypalOrderId;
        } else {
          throw new Error('Failed to create PayPal order: No order ID returned');
        }
        
        // Store PayPal order ID for use in onApprove
        paypalOrderIdRef.current = paypalOrderId;
        console.log('Stored PayPal order ID:', paypalOrderId);
        
        return paypalOrderId;
      } catch (err: any) {
        console.error('PayPal createOrder error:', err);
        const errorMsg = err.message || 'Failed to create order';
        toast.error(errorMsg);
        onError?.(errorMsg);
        throw err;
      }
    };

    // Shared onApprove function
    // PayPal SDK may pass orderId in different formats depending on payment method
    // For Expanded Checkout, the orderId in data should be the PayPal order ID returned from createOrder
    const onApprove = async (data: any) => {
      // Extract PayPal order ID - try multiple possible fields
      // Also use stored order ID from createOrder as fallback
      const paypalOrderId = data.orderId || data.orderID || data.id || data.token || paypalOrderIdRef.current;
      
      console.log('PayPal onApprove called', { 
        internalOrderId: orderId, 
        paypalOrderId,
        storedPaypalOrderId: paypalOrderIdRef.current,
        fullData: data 
      });
      
      if (!paypalOrderId) {
        const errorMsg = 'PayPal order ID not found. Please try again.';
        console.error('PayPal onApprove error:', errorMsg, { data, stored: paypalOrderIdRef.current });
        toast.error(errorMsg);
        onError?.(errorMsg);
        return;
      }
      
      try {
        setProcessing(true);
        
        const response = await paymentsApi.capturePayPalOrder({
          order_id: orderId,
          paypal_order_id: paypalOrderId,
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
    };

    // Shared onError function
    const handleError = (err: any) => {
      console.error('PayPal error:', err);
      const errorMsg = err.message || 'An error occurred with PayPal';
      setError(errorMsg);
      toast.error(errorMsg);
      onError?.(errorMsg);
    };

    // Initialize Card Fields (hosted card fields) - only if eligible
    // CardFields API for Expanded Checkout with 3D Secure support
    if (cardFieldsAvailable && window.paypal.CardFields && cardFieldsContainerRef.current) {
      try {
        console.log('Initializing PayPal Card Fields...');
        cardFieldsRef.current = window.paypal.CardFields({
          createOrder,
          onApprove: async (data: any) => {
            console.log('Card Fields onApprove:', data);
            // Check liability shift for 3D Secure
            if (data.liabilityShift === 'NO') {
              console.warn('Liability shift: NO - payment may require additional verification');
            }
            await onApprove(data);
          },
          onError: (err: any) => {
            // If card fields error is about eligibility, just hide them
            if (err?.message?.includes('not eligible') || err?.message?.includes('card payments')) {
              console.warn('Card fields not eligible, hiding card fields component');
              setCardFieldsEligible(false);
              return;
            }
            handleError(err);
          },
          style: {
            // Customize card fields styling to match your theme
            '.input': {
              'font-size': '16px',
              'color': '#ffffff',
            },
            '.invalid': {
              'color': '#ff6b6b',
            },
          },
        });
        cardFieldsRef.current.render(cardFieldsContainerRef.current);
        console.log('PayPal Card Fields rendered successfully');
      } catch (err: any) {
        console.error('PayPal Card Fields render error:', err);
        // If error is about eligibility, just mark as not eligible
        if (err?.message?.includes('not eligible') || err?.message?.includes('card payments')) {
          console.warn('Card fields not eligible for this account');
          setCardFieldsEligible(false);
        } else {
          toast.error('Failed to render card fields');
        }
      }
    } else if (!cardFieldsAvailable) {
      console.log('Card Fields not available - skipping card fields initialization');
    }

    // Initialize PayPal Buttons
    if (window.paypal.Buttons && paypalButtonsContainerRef.current) {
      try {
        console.log('Initializing PayPal Buttons...');
        paypalButtonsRef.current = window.paypal.Buttons({
          createOrder,
          onApprove,
          onError: handleError,
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            height: 45,
          },
        });
        paypalButtonsRef.current.render(paypalButtonsContainerRef.current);
        console.log('PayPal Buttons rendered successfully');
      } catch (err: any) {
        console.error('PayPal Buttons render error:', err);
        toast.error('Failed to render PayPal buttons');
      }
    }
  };

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
    <div className="w-full space-y-4">
      {processing && (
        <Card className="p-4 bg-white/5 border-white/10">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-white/60" />
            <span className="text-white/80 text-sm">Processing payment...</span>
          </div>
        </Card>
      )}
      
      {/* PayPal Buttons (PayPal account, Pay Later, Venmo) */}
      <div>
        <p className="text-sm text-white/60 mb-2">Pay with PayPal</p>
        <div ref={paypalButtonsContainerRef} className="paypal-buttons-container" style={{ minHeight: '50px' }} />
      </div>

      {/* Only show card fields if eligible */}
      {cardFieldsEligible !== false && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-white/60">Or</span>
            </div>
          </div>

          {/* Hosted Card Fields */}
          <div>
            <p className="text-sm text-white/60 mb-2">Pay with Card</p>
            <Card className="p-4 bg-white/5 border-white/10">
              <div ref={cardFieldsContainerRef} className="paypal-card-fields" style={{ minHeight: '200px' }} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
