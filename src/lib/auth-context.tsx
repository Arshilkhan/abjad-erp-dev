import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_ROLES } from "@/lib/panels";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: string[];
  panels: string[];
  isAdmin: boolean;
  canAccess: (panel: string) => boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null, session: null, loading: true, roles: [], panels: [],
  isAdmin: false, canAccess: () => false, signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [panels, setPanels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAccess = async (userId: string) => {
    const [{ data: rd }, { data: pd }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("user_panel_permissions").select("panel").eq("user_id", userId),
    ]);
    setRoles((rd ?? []).map((r) => r.role as string));
    setPanels((pd ?? []).map((p) => p.panel as string));
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => { void loadAccess(s.user.id); }, 0);
      } else {
        setRoles([]);
        setPanels([]);
      }
    });
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) await loadAccess(data.session.user.id);
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
        roles,
        panels,
        isAdmin,
        canAccess: (panel: string) => isAdmin || panels.includes(panel),
        signOut: async () => { await supabase.auth.signOut(); },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() { return useContext(Ctx); }
