import logoSvg from "@/assets/logo.svg";
import logoHorizontal from "@/assets/logo-horizontal.svg";
import logoIcon from "@/assets/logo-icon.svg";

interface LogoProps {
  variant?: 'default' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showAnimation?: boolean;
}

export const Logo = ({ 
  variant = 'horizontal', 
  size = 'md', 
  className = '',
  showAnimation = true 
}: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
  };

  const logoSrc = {
    default: logoSvg,
    horizontal: logoHorizontal,
    icon: logoIcon,
  };

  return (
    <img 
      src={logoSrc[variant]} 
      alt="NXOLand - Secure Game Account Trading Platform" 
      className={`w-auto ${sizeClasses[size]} ${className}`}
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
};

