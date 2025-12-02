import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

/**
 * SEO Component for dynamic meta tags
 * Provides Open Graph and Twitter Card support
 */
export function SEO({
  title = "NXOLand - تداول آمن وموثوق للحسابات",
  description = "منصة NXOLand لتداول الحسابات بأمان مع نظام الضمان",
  url = "",
  type = "website",
  noIndex = false,
}: SEOProps) {
  const fullUrl = url ? `https://nxoland.com${url}` : "https://nxoland.com";
  // SEO uses only the golden "N" logo - nxoland-new-logo.png
  // This ensures consistent branding across all social media and search engine previews
  const seoLogoUrl = "https://nxoland.com/nxoland-new-logo.png";
  const fullImage = seoLogoUrl; // Always use the same logo for SEO

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:locale" content="ar_SA" />
      <meta property="og:site_name" content="NXOLand" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="language" content="Arabic" />
      <meta name="author" content="NXOLand" />
    </Helmet>
  );
}

