import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Slash key - Open search (handled by GlobalSearch component)
      if (e.key === '/') {
        e.preventDefault();
      }

      // G + H - Go Home
      if (e.key === 'h' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigate('/');
      }

      // G + M - Go Marketplace
      if (e.key === 'm' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigate('/marketplace');
      }

      // G + O - Go Orders
      if (e.key === 'o' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigate('/orders');
      }

      // G + P - Go Profile
      if (e.key === 'p' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigate('/profile');
      }

      // G + W - Go Wallet
      if (e.key === 'w' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigate('/wallet');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
};

