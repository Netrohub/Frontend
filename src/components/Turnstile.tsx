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
      // Check again after a short delay
      const checkKey = () => {
        const key = (window as any).__TURNSTILE_SITE_KEY__;
        if (key && key !== runtimeKey) {
          setRuntimeKey(key);
        }
      };
      // Check immediately
      checkKey();
      // Also check after a delay in case script loads later
      const timeout1 = setTimeout(checkKey, 100);
      const timeout2 = setTimeout(checkKey, 500);
      
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [runtimeKey]);
  
  const siteKey = envVar || runtimeKey || '1x00000000000000000000AA';
  
  // Debug: Log key info (temporary - remove after verification)
  console.log('🔍 Turnstile Debug:', {
    hasEnvVar: !!envVar,
    hasRuntimeKey: !!runtimeKey,
    envVarType: typeof envVar,
    envVarValue: envVar ? `${envVar.substring(0, 10)}...` : 'undefined',
    runtimeKeyValue: runtimeKey ? `${runtimeKey.substring(0, 10)}...` : 'undefined',
    keyPrefix: siteKey.substring(0, 4),
    keyLength: siteKey.length,
    isTestKey: siteKey.startsWith('1x') || siteKey.startsWith('2x') || siteKey.startsWith('3x'),
    isRealKey: siteKey.startsWith('0x'),
    environment: import.meta.env.MODE || import.meta.env.NODE_ENV,
    isProd: import.meta.env.PROD,
    allEnvKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
  });
  
  // Warn if using test key in production
  if (import.meta.env.PROD && siteKey.startsWith('1x')) {
    console.warn('⚠️ Turnstile: Using test key. Set VITE_TURNSTILE_SITE_KEY in environment variables.');
    console.warn('Available VITE_ env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
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

