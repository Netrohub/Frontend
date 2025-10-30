import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, ShoppingBag, Plus, Users, Trophy, Bell, User, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "الرئيسية", icon: Home },
    { path: "/marketplace", label: "السوق", icon: ShoppingBag },
    { path: "/sell", label: "إضافة حساب", icon: Plus },
    { path: "/members", label: "الأعضاء", icon: Users },
    { path: "/leaderboard", label: "المتصدرين", icon: Trophy },
    { path: "/notifications", label: "الإشعارات", icon: Bell },
    { path: "/profile", label: "الملف الشخصي", icon: User },
    { path: "/help", label: "المساعدة", icon: HelpCircle },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[280px] bg-[hsl(200,70%,15%)] border-white/10 backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">القائمة</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-[hsl(195,80%,50%)] text-white font-bold"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
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
            الشروط والأحكام
          </Link>
          <Link
            to="/privacy"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            سياسة الخصوصية
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
