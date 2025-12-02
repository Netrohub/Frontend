import { getStaticImageUrl } from "@/lib/cloudflareImages";

interface LogoProps {
  variant?: 'default' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showAnimation?: boolean;
}

export const Logo = ({ 
  variant = 'default', 
  size = 'md', 
  className = '',
  showAnimation = true 
}: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  // All variants now use the same new logo (PNG format)
  const logoSrc = getStaticImageUrl('LOGO', 'public') || '/nxoland-new-logo.png';

  return (
    <img 
      src={logoSrc}
      alt="NXOLand - Secure Game Account Trading Platform" 
      width={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 40 : 48}
      height={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 40 : 48}
      className={`${sizeClasses[size]} ${showAnimation ? 'hover:scale-105 transition-transform duration-300' : ''} ${className}`}
      style={{ objectFit: 'contain', aspectRatio: '1/1' }}
      loading="lazy"
      onError={(e) => {
        // Fallback to local logo if Cloudflare image fails
        const img = e.target as HTMLImageElement;
        if (img.src.includes('imagedelivery.net')) {
          img.src = '/nxoland-official-logo.png';
        }
      }}
    />
  );
};

