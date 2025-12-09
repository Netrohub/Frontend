import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

interface CookieConsentContextType {
  consentStatus: ConsentStatus;
  acceptCookies: () => void;
  rejectCookies: () => void;
  hasConsented: boolean;
  showBanner: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const CONSENT_STORAGE_KEY = 'cookie_consent_status';
const CONSENT_EXPIRY_DAYS = 365; // Consent expires after 1 year

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider = ({ children }: CookieConsentProviderProps) => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    
    if (stored) {
      try {
        const consentData = JSON.parse(stored);
        const expiryDate = new Date(consentData.expiry);
        
        // Check if consent has expired
        if (expiryDate > new Date()) {
          setConsentStatus(consentData.status);
          setShowBanner(false);
        } else {
          // Consent expired, show banner again
          localStorage.removeItem(CONSENT_STORAGE_KEY);
          setConsentStatus('pending');
          setShowBanner(true);
        }
      } catch {
        // Invalid stored data, show banner
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        setConsentStatus('pending');
        setShowBanner(true);
      }
    } else {
      // No consent stored, show banner
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (status: 'accepted' | 'rejected') => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);
    
    const consentData = {
      status,
      date: new Date().toISOString(),
      expiry: expiryDate.toISOString(),
    };
    
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    setConsentStatus(status);
    setShowBanner(false);
    
    // Trigger GTM initialization if accepted
    if (status === 'accepted') {
      // Dispatch custom event for GTM initialization
      window.dispatchEvent(new CustomEvent('cookieConsentAccepted'));
    } else {
      // Dispatch event for rejection
      window.dispatchEvent(new CustomEvent('cookieConsentRejected'));
    }
  };

  const acceptCookies = () => {
    saveConsent('accepted');
  };

  const rejectCookies = () => {
    saveConsent('rejected');
  };

  const hasConsented = consentStatus === 'accepted';

  return (
    <CookieConsentContext.Provider
      value={{
        consentStatus,
        acceptCookies,
        rejectCookies,
        hasConsented,
        showBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

