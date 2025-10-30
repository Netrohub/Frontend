import { Home, Users, Package, ShoppingCart, AlertTriangle, ShieldCheck, Settings, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const items = [
  { title: "لوحة المعلومات", url: "/admin", icon: Home },
  { title: "المستخدمين", url: "/admin/users", icon: Users },
  { title: "الإعلانات", url: "/admin/listings", icon: Package },
  { title: "الطلبات", url: "/admin/orders", icon: ShoppingCart },
  { title: "النزاعات", url: "/admin/disputes", icon: AlertTriangle },
  { title: "طلبات KYC", url: "/admin/kyc", icon: ShieldCheck },
  { title: "الإعدادات", url: "/admin/settings", icon: Settings },
];

export function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1 px-6 py-3">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
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
          className="flex items-center gap-2 w-full px-6 py-3 text-slate-300"
        >
          <Menu className="h-5 w-5" />
          <span className="text-sm font-medium">القائمة</span>
        </button>

        {isMobileMenuOpen && (
          <div className="px-3 pb-3 space-y-1 bg-slate-800/50">
            {items.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
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
