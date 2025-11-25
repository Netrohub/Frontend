import { Link, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";
import { MobileNav } from "@/components/MobileNav";
import { GlobalSearch } from "@/components/GlobalSearch";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface NavbarProps {
  showDesktopLinks?: boolean;
}

export const Navbar = ({ showDesktopLinks = true }: NavbarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/10 backdrop-blur-md bg-[hsl(200,70%,15%,0.5)]">
      <div className="flex items-center gap-4 order-2">
        {showDesktopLinks && (
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList className="gap-3">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/"
                    className={cn(
                      "inline-flex h-12 min-h-[48px] w-max items-center justify-center rounded-md px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-[hsl(195,80%,70%,0.1)] hover:text-[hsl(195,80%,70%)] focus:bg-[hsl(195,80%,70%,0.1)] focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive("/") ? "bg-[hsl(195,80%,70%,0.2)] text-[hsl(195,80%,70%)] shadow-[0_0_20px_rgba(148,209,240,0.3)]" : "text-white/90"
                    )}
                  >
                    {t('nav.home')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-12 min-h-[48px] bg-transparent text-white/90 hover:bg-[hsl(195,80%,70%,0.1)] hover:text-[hsl(195,80%,70%)] data-[state=open]:bg-[hsl(195,80%,70%,0.2)] data-[state=open]:text-[hsl(195,80%,70%)] transition-all duration-300">
                  {t('nav.marketplace')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-2 p-3 bg-[hsl(200,70%,15%,0.95)] border border-[hsl(195,80%,70%,0.2)] shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl z-50">
                    <li>
                      <Link to="/marketplace" className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-[hsl(195,80%,70%,0.15)] hover:text-[hsl(195,80%,70%)] hover:shadow-[0_0_20px_rgba(148,209,240,0.3)]",
                        isActive("/marketplace") ? "bg-[hsl(195,80%,70%,0.2)] text-[hsl(195,80%,70%)]" : "text-white/90"
                      )}>
                        <div className="text-sm font-semibold leading-none">{t('nav.marketplace')}</div>
                        <p className="line-clamp-2 text-xs leading-snug text-white/50 mt-1">
                          {t('home.hero.browseAccounts')}
                        </p>
                      </Link>
                    </li>
                    {isAuthenticated && (
                      <>
                        <li>
                          <Link to="/sell/gaming" className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-all transition-all duration-300 hover:bg-[hsl(195,80%,70%,0.15)] hover:text-[hsl(195,80%,70%)] hover:shadow-[0_0_20px_rgba(148,209,240,0.3)]",
                            isActive("/sell/gaming") || location.pathname.startsWith("/sell/") ? "bg-[hsl(195,80%,70%,0.2)] text-[hsl(195,80%,70%)]" : "text-white/90"
                          )}>
                            <div className="text-sm font-semibold leading-none">{t('nav.sell')}</div>
                            <p className="line-clamp-2 text-xs leading-snug text-white/50 mt-1">
                              {t('sell.subtitle')}
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link to="/my-listings" className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-[hsl(195,80%,70%,0.15)] hover:text-[hsl(195,80%,70%)] hover:shadow-[0_0_20px_rgba(148,209,240,0.3)]",
                            isActive("/my-listings") ? "bg-[hsl(195,80%,70%,0.2)] text-[hsl(195,80%,70%)]" : "text-white/90"
                          )}>
                            <div className="text-sm font-semibold leading-none">{t('nav.myListings')}</div>
                            <p className="line-clamp-2 text-xs leading-snug text-white/50 mt-1">
                              {t('sell.subtitle')}
                            </p>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-12 min-h-[48px] bg-transparent text-white/90 hover:bg-[hsl(195,80%,70%,0.1)] hover:text-[hsl(195,80%,70%)] data-[state=open]:bg-[hsl(195,80%,70%,0.2)] data-[state=open]:text-[hsl(195,80%,70%)] transition-all duration-300">
                  {t('nav.community')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[220px] gap-2 p-3 bg-[hsl(200,70%,15%,0.95)] border border-[hsl(195,80%,70%,0.2)] shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl z-50">
                    <li>
                      <Link to="/leaderboard" className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-[hsl(195,80%,70%,0.15)] hover:text-[hsl(195,80%,70%)] hover:shadow-[0_0_20px_rgba(148,209,240,0.3)]",
                        isActive("/leaderboard") ? "bg-[hsl(195,80%,70%,0.2)] text-[hsl(195,80%,70%)]" : "text-white/90"
                      )}>
                        <div className="text-sm font-semibold leading-none">{t('nav.leaderboard')}</div>
                        <p className="line-clamp-2 text-xs leading-snug text-white/50 mt-1">
                          {t('leaderboard.navDescription')}
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/members" className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-[hsl(195,80%,70%,0.15)] hover:text-[hsl(195,80%,70%)] hover:shadow-[0_0_20px_rgba(148,209,240,0.3)]",
                        isActive("/members") ? "bg-[hsl(195,80%,70%,0.2)] text-[hsl(195,80%,70%)]" : "text-white/90"
                      )}>
                        <div className="text-sm font-semibold leading-none">{t('nav.members')}</div>
                        <p className="line-clamp-2 text-xs leading-snug text-white/50 mt-1">
                          {t('nav.membersDescription')}
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/suggestions" className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-[hsl(195,80%,70%,0.15)] hover:text-[hsl(195,80%,70%)] hover:shadow-[0_0_20px_rgba(148,209,240,0.3)]",
                        isActive("/suggestions") ? "bg-[hsl(195,80%,70%,0.2)] text-[hsl(195,80%,70%)]" : "text-white/90"
                      )}>
                        <div className="text-sm font-semibold leading-none">{t('nav.suggestions')}</div>
                        <p className="line-clamp-2 text-xs leading-snug text-white/50 mt-1">
                          {t('nav.suggestionsDescription')}
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {isAuthenticated && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/wallet"
                        className={cn(
                          "inline-flex h-12 min-h-[48px] w-max items-center justify-center rounded-md px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-[hsl(195,80%,70%,0.1)] hover:text-[hsl(195,80%,70%)] focus:bg-[hsl(195,80%,70%,0.1)] focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          isActive("/wallet") ? "bg-[hsl(195,80%,70%,0.2)] text-[hsl(195,80%,70%)] shadow-[0_0_20px_rgba(148,209,240,0.3)]" : "text-white/90"
                        )}
                      >
                        {t('nav.wallet')}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/kyc"
                    className={cn(
                      "inline-flex h-12 min-h-[48px] w-max items-center justify-center rounded-md px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-[hsl(195,80%,70%,0.1)] hover:text-[hsl(195,80%,70%)] focus:bg-[hsl(195,80%,70%,0.1)] focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive("/kyc") ? "bg-[hsl(195,80%,70%,0.2)] text-[hsl(195,80%,70%)] shadow-[0_0_20px_rgba(148,209,240,0.3)]" : "text-white/90"
                    )}
                  >
                    {t('nav.kyc')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/profile"
                        className={cn(
                          "inline-flex h-12 min-h-[48px] w-max items-center justify-center rounded-md px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-[hsl(195,80%,70%,0.1)] hover:text-[hsl(195,80%,70%)] focus:bg-[hsl(195,80%,70%,0.1)] focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          isActive("/profile") ? "bg-[hsl(195,80%,70%,0.2)] text-[hsl(195,80%,70%)] shadow-[0_0_20px_rgba(148,209,240,0.3)]" : "text-white/90"
                        )}
                      >
                        {t('nav.profile')}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        )}
        <div className="flex items-center gap-3">
          {isAuthenticated && <NotificationBell />}
          <LanguageSwitcher />
          <GlobalSearch />
          {!isAuthenticated && (
            <Button 
              asChild 
              variant="outline" 
              size="sm"
              className="hidden md:flex border-[hsl(195,80%,70%,0.5)] text-[hsl(195,80%,70%)] hover:bg-[hsl(195,80%,70%)] hover:text-white hover:border-[hsl(195,80%,70%)] hover:shadow-[0_0_20px_rgba(148,209,240,0.3)] transition-all duration-300"
            >
              <Link to="/auth">
                <LogIn className="h-4 w-4 mr-2" />
                {t('nav.login')}
              </Link>
            </Button>
          )}
          <MobileNav />
        </div>
      </div>
      
      <Link 
        to="/" 
        className="flex items-center hover:scale-110 transition-transform duration-300 order-1 cursor-pointer"
        aria-label={t('nav.homeAriaLabel')}
      >
        <img 
          src="/nxoland-new-logo.png" 
          alt="NXOLand - Secure Game Account Trading Platform" 
          width="64"
          height="64"
          className="h-16 md:h-20 w-16 md:w-20"
          style={{ objectFit: 'contain', aspectRatio: '1/1' }}
          loading="eager"
          fetchPriority="high"
          onError={(e) => {
            // Fallback to old logo if new logo fails to load
            const img = e.target as HTMLImageElement;
            if (img.src.includes('new')) {
              img.src = '/nxoland-official-logo.png';
            }
          }}
        />
      </Link>
    </nav>
  );
};
