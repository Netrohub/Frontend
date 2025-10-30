import { Home, Users, Package, ShoppingCart, AlertTriangle, ShieldCheck, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "لوحة المعلومات", url: "/admin", icon: Home },
  { title: "المستخدمين", url: "/admin/users", icon: Users },
  { title: "الإعلانات", url: "/admin/listings", icon: Package },
  { title: "الطلبات", url: "/admin/orders", icon: ShoppingCart },
  { title: "النزاعات", url: "/admin/disputes", icon: AlertTriangle },
  { title: "طلبات KYC", url: "/admin/kyc", icon: ShieldCheck },
  { title: "الإعدادات", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className={open ? "w-64" : "w-16"} collapsible="icon">
      <SidebarContent className="bg-white/5 border-r border-white/10">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80 px-3 py-2">
            {open && "القائمة"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? "bg-[hsl(195,80%,50%)] text-white" 
                            : "text-white/80 hover:bg-white/10"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
