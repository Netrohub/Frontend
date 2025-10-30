import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Wallet, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "الرئيسية", icon: Home },
    { path: "/marketplace", label: "السوق", icon: ShoppingBag },
    { path: "/wallet", label: "المحفظة", icon: Wallet },
    { path: "/notifications", label: "الإشعارات", icon: Bell },
    { path: "/profile", label: "حسابي", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[hsl(200,70%,15%)] border-t border-white/10 backdrop-blur-md pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
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
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "animate-pulse")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
