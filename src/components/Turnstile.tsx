import { Turnstile as CloudflareTurnstile } from '@marsidev/react-turnstile';
import { useState, useEffect, useMemo, useCallback } from 'react';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  className?: string;
}

export const Turnstile = ({ onVerify, onError, className }: TurnstileProps) => {
  const [isExpired, setIsExpired] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  // Get site key from environment variable
  const envVar = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  
  // Workaround: Try to get from window object (for runtime injection if needed)
  const [runtimeKey, setRuntimeKey] = useState<string | undefined>(
    typeof window !== 'undefined' 
      ? (window as any).__TURNSTILE_SITE_KEY__ 
      : undefined
  );
  
  // Check for runtime key after mount (only once)
  useEffect(() => {
    if (typeof window !== 'undefined' && !runtimeKey) {
      const key = (window as any).__TURNSTILE_SITE_KEY__;
      if (key) {
        setRuntimeKey(key);
      } else {
        // Single delayed check
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
  }, []);
  
  // Memoize site key to prevent unnecessary recalculations
  const siteKey = useMemo(() => {
    return envVar || runtimeKey || '1x00000000000000000000AA';
  }, [envVar, runtimeKey]);
  
  // Initialize widget only when we have a valid key
  // Defer initialization to avoid blocking the main thread
  useEffect(() => {
    if (siteKey && siteKey !== '1x00000000000000000000AA') {
      if (widgetKey === 0) {
        setWidgetKey(1);
      }
      // Defer rendering to next frame to avoid blocking main thread
      // This prevents performance violations from synchronous initialization
      const readyTimeout = requestAnimationFrame(() => {
        setTimeout(() => {
          setIsReady(true);
        }, 100); // Small delay to ensure DOM is ready
      });
      return () => cancelAnimationFrame(readyTimeout);
    }
  }, [siteKey, widgetKey]);
  
  // Memoize callbacks to prevent unnecessary re-renders
  const handleVerify = useCallback((token: string) => {
    setIsExpired(false);
    onVerify(token);
  }, [onVerify]);

  const handleExpire = useCallback(() => {
    setIsExpired(true);
    onVerify(''); // Clear the token
  }, [onVerify]);

  const handleError = useCallback((error?: any) => {
    // Only log in development to reduce console noise
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Turnstile] Widget error:', error);
    }
    // Reset widget on error, but limit resets to prevent infinite loops
    setWidgetKey(prev => prev < 3 ? prev + 1 : prev);
    if (onError) {
      onError();
    }
  }, [onError]);

  // Don't render widget if we don't have a valid key or aren't ready
  if (!siteKey || siteKey === '1x00000000000000000000AA' || !isReady) {
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

