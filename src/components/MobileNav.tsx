import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, ShoppingBag, Plus, Users, Trophy, Bell, User, HelpCircle, Wallet, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAuthenticated = !!user;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: t('nav.home'), icon: Home, protected: false },
    { path: "/marketplace", label: t('nav.marketplace'), icon: ShoppingBag, protected: false },
    { path: "/wallet", label: t('nav.wallet'), icon: Wallet, protected: true },
    { path: "/sell", label: t('nav.sell'), icon: Plus, protected: true },
    { path: "/members", label: t('nav.members'), icon: Users, protected: false },
    { path: "/leaderboard", label: t('nav.leaderboard'), icon: Trophy, protected: false },
    { path: "/notifications", label: t('nav.notifications'), icon: Bell, protected: true },
    { path: "/profile", label: t('nav.profile'), icon: User, protected: true },
    { path: "/help", label: t('nav.help'), icon: HelpCircle, protected: false },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,70%)] focus:ring-offset-2 focus:ring-offset-[hsl(200,70%,15%)]"
          aria-label={t('nav.openMenu')}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">{t('nav.menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[280px] bg-[hsl(200,70%,15%)] border-white/10 backdrop-blur-md"
        id="mobile-nav-menu"
        aria-label={t('nav.navigationLinks')}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">{t('nav.menu')}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,70%)] focus:ring-offset-2 focus:ring-offset-[hsl(200,70%,15%)]"
            aria-label={t('nav.closeMenu')}
          >
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">{t('nav.close')}</span>
          </Button>
        </div>

        <nav className="space-y-2" aria-label={t('nav.navigationLinks')}>
          {!isAuthenticated && (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[hsl(195,80%,50%)] text-white hover:bg-[hsl(195,80%,60%)] transition-colors font-bold mb-2 focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,70%)] focus:ring-offset-2"
            >
              <LogIn className="h-5 w-5" aria-hidden="true" />
              <span>{t('nav.login')}</span>
            </Link>
          )}
          {navItems
            .filter(item => !item.protected || isAuthenticated)
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[hsl(195,80%,70%)] focus:ring-offset-2 focus:ring-offset-[hsl(200,70%,15%)] ${
                    isActive(item.path)
                      ? "bg-[hsl(195,80%,50%)] text-white font-bold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
        </nav>

        <Separator className="my-6 bg-white/10" />

        <div className="space-y-2">
          <Link
            to="/terms"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            {t('nav.termsAndConditions')}
          </Link>
          <Link
            to="/privacy"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            {t('nav.privacyPolicy')}
          </Link>
          <Link
            to="/refund-policy"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            {t('nav.refundPolicy')}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
