import { Turnstile as CloudflareTurnstile } from '@marsidev/react-turnstile';
import { useState, useEffect } from 'react';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  className?: string;
}

export const Turnstile = ({ onVerify, onError, className }: TurnstileProps) => {
  const [isExpired, setIsExpired] = useState(false);
  
  // Get site key from environment variable
  // Try multiple ways to access the variable (for debugging)
  const envVar = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  
  // Workaround: Try to get from window object (for runtime injection if needed)
  // This allows setting it via Cloudflare Pages Functions or Workers if build-time fails
  // Check immediately and also use useEffect to catch it if injected after component mount
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
        // This handles edge cases where script injection is slightly delayed
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

  const handleError = () => {
    if (onError) {
      onError();
    }
  };

  return (
    <div className={className}>
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

