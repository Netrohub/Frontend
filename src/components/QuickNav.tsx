import { Link } from "react-router-dom";
import { ShoppingBag, Package, MessageSquare, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export const QuickNav = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAuthenticated = !!user;

  const quickLinks = [
    { 
      path: "/marketplace", 
      label: t('quickNav.browseMarket'), 
      icon: ShoppingBag,
      protected: false,
      color: "bg-[hsl(195,80%,50%,0.15)] border-[hsl(195,80%,70%,0.3)] text-[hsl(195,80%,70%)]"
    },
    { 
      path: "/orders", 
      label: t('quickNav.myOrders'), 
      icon: Package,
      protected: true,
      color: "bg-[hsl(195,80%,50%,0.15)] border-[hsl(195,80%,70%,0.3)] text-[hsl(195,80%,70%)]"
    },
    { 
      path: "/disputes", 
      label: t('quickNav.disputes'), 
      icon: MessageSquare,
      protected: true,
      color: "bg-[hsl(0,70%,60%,0.15)] border-[hsl(0,70%,60%,0.3)] text-[hsl(0,70%,60%)]"
    },
    { 
      path: "/help", 
      label: t('quickNav.help'), 
      icon: HelpCircle,
      protected: false,
      color: "bg-[hsl(40,90%,55%,0.15)] border-[hsl(40,90%,55%,0.3)] text-[hsl(40,90%,55%)]"
    },
  ];

  const visibleLinks = quickLinks.filter(link => !link.protected || isAuthenticated);

  return (
    <div className="fixed bottom-24 md:bottom-8 left-4 z-40 flex flex-col gap-2">
      {visibleLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Button
            key={link.path}
            asChild
            size="icon"
            className={`w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-all ${link.color} border backdrop-blur-sm`}
            title={link.label}
          >
            <Link to={link.path}>
              <Icon className="h-5 w-5" />
            </Link>
          </Button>
        );
      })}
    </div>
  );
};

