export const ROLES = [
  "admin",
  "energy_manager",
  "security_officer",
  "maintenance",
  "shop_owner",
  "demo_viewer",
] as const;

export type AppRole = (typeof ROLES)[number];

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrator",
  energy_manager: "Energy Manager",
  security_officer: "Security Officer",
  maintenance: "Maintenance Team",
  shop_owner: "Shop Owner",
  demo_viewer: "Demo Viewer",
};

export const ROLE_DESCRIPTIONS: Record<AppRole, string> = {
  admin: "Full platform access and configuration",
  energy_manager: "Analytics, optimization & sustainability",
  security_officer: "Emergency intelligence & surveillance",
  maintenance: "Predictive maintenance & anomaly systems",
  shop_owner: "Shop-level analytics only",
  demo_viewer: "Read-only platform demo access",
};

// Permissions: which sections each role can access
export const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  admin: ["*"],
  energy_manager: ["analytics", "optimization", "sustainability", "dashboard"],
  security_officer: ["emergency", "surveillance", "alerts", "dashboard"],
  maintenance: ["maintenance", "anomaly", "dashboard"],
  shop_owner: ["shop-analytics", "dashboard"],
  demo_viewer: ["dashboard"],
};

export function roleCanAccess(role: AppRole | null, section: string): boolean {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role];
  return perms.includes("*") || perms.includes(section);
}