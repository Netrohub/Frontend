import { Turnstile as CloudflareTurnstile } from '@marsidev/react-turnstile';
import { useState, useEffect } from 'react';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  className?: string;
}

export const Turnstile = ({ onVerify, onError, className }: TurnstileProps) => {
  const [isExpired, setIsExpired] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0); // Force re-render when key changes
  
  // Get site key from environment variable
  const envVar = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  
  // Workaround: Try to get from window object (for runtime injection if needed)
  // This allows setting it via Cloudflare Pages Functions or Workers if build-time fails
  const [runtimeKey, setRuntimeKey] = useState<string | undefined>(
    typeof window !== 'undefined' 
      ? (window as any).__TURNSTILE_SITE_KEY__ 
      : undefined
  );
  
  // Check for runtime key after mount (in case function injects it after React loads)
  useEffect(() => {
    if (typeof window !== 'undefined' && !runtimeKey) {
      // Check immediately - the function injects before React loads, so this should be sufficient
      const key = (window as any).__TURNSTILE_SITE_KEY__;
      if (key) {
        setRuntimeKey(key);
      } else {
        // Only check once more after a short delay if not found immediately
        const timeout = setTimeout(() => {
          const delayedKey = (window as any).__TURNSTILE_SITE_KEY__;
          if (delayedKey) {
            setRuntimeKey(delayedKey);
          }
        }, 100);
        
        return () => clearTimeout(timeout);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount
  
  const siteKey = envVar || runtimeKey || '1x00000000000000000000AA';
  
  // Initialize widget key when we get a valid key (only once)
  useEffect(() => {
    if (siteKey && siteKey !== '1x00000000000000000000AA' && widgetKey === 0) {
      setWidgetKey(1);
    }
  }, [siteKey, widgetKey]);
  
  // Warn if using test key in production (only warn, no debug spam)
  if (import.meta.env.PROD && siteKey.startsWith('1x')) {
    console.warn('⚠️ Turnstile: Using test key. Set TURNSTILE_SITE_KEY in Cloudflare Pages environment variables.');
  }

  const handleVerify = (token: string) => {
    setIsExpired(false);
    onVerify(token);
  };

  const handleExpire = () => {
    setIsExpired(true);
    onVerify(''); // Clear the token
  };

  const handleError = (error?: any) => {
    console.error('[Turnstile] Widget error:', error);
    // Reset widget on error to prevent hung state
    setWidgetKey(prev => prev + 1);
    if (onError) {
      onError();
    }
  };

  // Don't render widget if we don't have a valid key yet
  if (!siteKey || siteKey === '1x00000000000000000000AA') {
    return null;
  }

  return (
    <div className={className} key={widgetKey}>
      <CloudflareTurnstile
        siteKey={siteKey}
        onSuccess={handleVerify}
        onExpire={handleExpire}
        onError={handleError}
        options={{
          theme: 'dark',
          size: 'normal',
        }}
      />
      {isExpired && (
        <p className="text-sm text-red-400 mt-2">
          التحقق انتهى. يرجى المحاولة مرة أخرى.
        </p>
      )}
    </div>
  );
};

