import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, FileSpreadsheet, Users, Package, Warehouse,
  ShoppingCart, Wallet, BarChart3, Settings, Factory, Ban, PackageX, CreditCard, Upload,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const main = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Cancelled Invoices", url: "/cancelled-invoices", icon: Ban },
  { title: "Import Invoice", url: "/invoices/import", icon: Upload },
  { title: "Quotations", url: "/quotations", icon: FileSpreadsheet },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Products", url: "/products", icon: Package },
  { title: "Inventory", url: "/inventory", icon: Warehouse },
  { title: "Rejected Items", url: "/rejected-items", icon: PackageX },
  { title: "Customer Credits", url: "/customer-credits", icon: CreditCard },
  { title: "Purchases", url: "/purchases", icon: ShoppingCart },
  { title: "Payments", url: "/payments", icon: Wallet },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, signOut } = useAuth();
  const isActive = (u: string) => path === u || path.startsWith(u + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Factory className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">ABJAD</span>
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Engineering Works</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")}>
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="px-2 py-2 text-xs">
            <div className="truncate font-medium text-sidebar-foreground">{user.email}</div>
            <Button
              onClick={() => signOut()}
              variant="ghost"
              size="sm"
              className="mt-1 h-7 w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              Sign out
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}