import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { paymentsApi } from "@/lib/api";
import { toast } from "sonner";

interface PayPalButtonsProps {
  orderId: number;
  amount: number;
  currency?: string;
  onPaymentSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * PayPal payment button using Orders v2 API redirect flow
 * Reference: https://developer.paypal.com/docs/api/orders/v2/
 * 
 * Flow:
 * 1. User clicks button
 * 2. Backend creates PayPal order with payment_source
 * 3. User is redirected to PayPal approval page
 * 4. User approves payment on PayPal
 * 5. PayPal redirects back to return_url
 * 6. Backend captures the order
 */
export const PayPalButtons = ({
  orderId,
  amount,
  currency = "USD",
  onPaymentSuccess,
  onError,
}: PayPalButtonsProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayPalPayment = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // Create PayPal order - backend returns approval URL
      const response = await paymentsApi.createPayPalOrder({ order_id: orderId });
      
      if (response.error_code === 'PAYMENT_ALREADY_EXISTS' && response.paypalOrderId) {
        // Order already exists, get approval URL from order details
        toast.info('Using existing PayPal order');
        // We need to get the approval URL - for now, redirect to callback
        window.location.href = `/payments/paypal/callback?order_id=${orderId}&token=${response.paypalOrderId}`;
        return;
      }

      if (!response.approvalUrl) {
        throw new Error('No approval URL returned from PayPal');
      }

      // Redirect to PayPal approval page
      window.location.href = response.approvalUrl;
    } catch (err: any) {
      console.error('PayPal payment error:', err);
      const errorMsg = err.message || 'Failed to initiate PayPal payment';
      toast.error(errorMsg);
      onError?.(errorMsg);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayPalPayment}
      disabled={loading}
      className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold py-6 text-base"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.174 1.351 1.05 3.3.93 4.676-.016.232-.033.463-.048.69-.07 1.293-.137 2.514-.137 3.514v.25h3.35c.83 0 1.523.558 1.716 1.327l1.542 7.345c.09.426-.24.808-.653.808h-4.74c-.535 0-.988.35-1.14.832l-1.012 3.04c-.152.48-.605.83-1.14.83H7.076z"/>
          </svg>
          Pay with PayPal
        </>
      )}
    </Button>
  );
};
