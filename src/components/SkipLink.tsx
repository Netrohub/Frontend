/**
 * Skip Link Component
 * Provides keyboard navigation to skip to main content
 * Improves accessibility for keyboard and screen reader users
 */
import { Link } from "react-router-dom";

export function SkipLink() {
  return (
    <Link
      to="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-lg focus:ring-2 focus:ring-[hsl(195,80%,70%)] focus:ring-offset-2 focus:font-bold focus:outline-none"
      onClick={(e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }}
    >
      التخطي إلى المحتوى الرئيسي
    </Link>
  );
}

