import { Turnstile as CloudflareTurnstile } from '@marsidev/react-turnstile';
import { useState } from 'react';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  className?: string;
}

export const Turnstile = ({ onVerify, onError, className }: TurnstileProps) => {
  const [isExpired, setIsExpired] = useState(false);
  
  // Get site key from environment variable
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
  
  // Debug: Log key info (temporary - remove after verification)
  console.log('🔍 Turnstile Debug:', {
    hasEnvVar: !!import.meta.env.VITE_TURNSTILE_SITE_KEY,
    keyPrefix: siteKey.substring(0, 4),
    keyLength: siteKey.length,
    isTestKey: siteKey.startsWith('1x') || siteKey.startsWith('2x') || siteKey.startsWith('3x'),
    isRealKey: siteKey.startsWith('0x'),
    environment: import.meta.env.MODE || import.meta.env.NODE_ENV,
  });
  
  // Warn if using test key in production
  if (import.meta.env.PROD && siteKey.startsWith('1x')) {
    console.warn('⚠️ Turnstile: Using test key. Set VITE_TURNSTILE_SITE_KEY in environment variables.');
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

