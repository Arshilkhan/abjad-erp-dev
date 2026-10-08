import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_ROLES } from "@/lib/panels";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  organizationId: string | null;
  roles: string[];
  panels: string[];
  isAdmin: boolean;
  canAccess: (panel: string) => boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  organizationId: null,
  roles: [],
  panels: [],
  isAdmin: false,
  canAccess: () => false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [panels, setPanels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAccess = async (userId: string) => {
    const { data: memberships } = await supabase
      .from("organization_members")
      .select("organization_id, role")
      .eq("user_id", userId);

    const membership = memberships?.[0] ?? null;

    if (!membership) {
      setOrganizationId(null);
      setRoles([]);
      setPanels([]);
      return;
    }

    const orgId = membership.organization_id;

    setOrganizationId(orgId);
    setRoles([membership.role as string]);

    const { data: pd } = await supabase
      .from("user_panel_permissions")
      .select("panel")
      .eq("user_id", userId)
      .eq("organization_id", orgId);

    setPanels((pd ?? []).map((p) => p.panel as string));
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);

      if (s?.user) {
        setTimeout(() => {
          void loadAccess(s.user.id);
        }, 0);
      } else {
        setOrganizationId(null);
        setRoles([]);
        setPanels([]);
      }
    });

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        await loadAccess(data.session.user.id);
      }

      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const isAdmin = roles.some((r) => ADMIN_ROLES.includes(r));

  return (
    <Ctx.Provider
      value={{
        user,
        session,
        loading,
        organizationId,
        roles,
        panels,
        isAdmin,
        canAccess: (panel: string) => isAdmin || panels.includes(panel),
        signOut: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
