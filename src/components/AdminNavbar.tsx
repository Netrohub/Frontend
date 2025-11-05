import { Home, Users, Package, ShoppingCart, AlertTriangle, ShieldCheck, Settings, Menu, Bell, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const items = [
  { title: "لوحة المعلومات", url: "/admin", icon: Home },
  { title: "المستخدمين", url: "/admin/users", icon: Users },
  { title: "الإعلانات", url: "/admin/listings", icon: Package },
  { title: "الطلبات", url: "/admin/orders", icon: ShoppingCart },
  { title: "النزاعات", url: "/admin/disputes", icon: AlertTriangle },
  { title: "الإشعارات", url: "/admin/notifications", icon: Bell },
  { title: "المحتوى القانوني", url: "/admin/legal", icon: FileText },
  { title: "الإعدادات", url: "/admin/settings", icon: Settings },
];

export function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-[hsl(200,70%,20%)] to-[hsl(195,60%,25%)] border-b border-white/10 backdrop-blur-sm">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1 px-6 py-3">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-[hsl(195,80%,50%)] text-white shadow-lg shadow-[hsl(195,80%,50%,0.3)]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.title}</span>
          </NavLink>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2 w-full px-6 py-3 text-white/80"
        >
          <Menu className="h-5 w-5" />
          <span className="text-sm font-medium">القائمة</span>
        </button>

        {isMobileMenuOpen && (
          <div className="px-3 pb-3 space-y-1 bg-[hsl(200,70%,15%,0.5)]">
            {items.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-[hsl(195,80%,50%)] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.title}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
