import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { PANELS } from "@/lib/panels";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { GlobalSearch } from "@/components/global-search";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthedLayout,
});

function AuthedLayout() {
  const { user, loading, isAdmin, canAccess } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading, nav]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const matched = [...PANELS]
    .sort((a, b) => b.url.length - a.url.length)
    .find((p) => path === p.url || path.startsWith(p.url + "/"));
  const allowed = isAdmin || !matched || canAccess(matched.key);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <GlobalSearch />
            <div className="ml-auto flex shrink-0 items-center gap-1">
              {canAccess("invoices") && (
                <Button asChild size="sm">
                  <Link to="/invoices/new" search={{ type: "tax_invoice" }}><Plus className="mr-1 h-4 w-4" /> New Invoice</Link>
                </Button>
              )}
            </div>
          </header>
          <main className="flex-1 p-6">
            {allowed ? (
              <Outlet />
            ) : (
              <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
                You don't have permission to access this section.
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}