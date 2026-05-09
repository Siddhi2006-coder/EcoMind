import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { FullPageLoader } from "@/components/auth/FullPageLoader";
import type { AppRole } from "@/auth/roles";

interface Props {
  children: ReactNode;
  /** Restrict to specific roles. Omit to allow any authenticated user. */
  roles?: AppRole[];
  /** Restrict to a permission section (see ROLE_PERMISSIONS). */
  section?: string;
}

export function ProtectedRoute({ children, roles, section }: Props) {
  const { loading, user, role, hasAccess } = useAuth();

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  if (roles && (!role || !roles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }
  if (section && !hasAccess(section)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}