import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Wallet, Bell, User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAuthenticated = !!user;

  const navItems = [
    { path: "/", label: t('nav.home'), icon: Home, protected: false },
    { path: "/marketplace", label: t('nav.marketplace'), icon: ShoppingBag, protected: false },
    { path: "/wallet", label: t('nav.wallet'), icon: Wallet, protected: true },
    { path: "/notifications", label: t('nav.notifications'), icon: Bell, protected: true },
    { path: "/profile", label: t('nav.myAccount'), icon: User, protected: true },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const visibleItems = isAuthenticated 
    ? navItems 
    : [...navItems.filter(item => !item.protected), { path: "/auth", label: t('nav.signIn'), icon: LogIn, protected: false }];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[hsl(200,70%,15%)] border-t border-white/10 backdrop-blur-md" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px] min-h-[56px]",
                active
                  ? "bg-[hsl(195,80%,50%)] text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "animate-pulse")} />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
