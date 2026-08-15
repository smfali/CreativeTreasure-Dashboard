export type MemberStatus = "active" | "invited" | "suspended";
export type InvitationStatus = "pending" | "expired" | "cancelled";
export type TeamActivityType = "login" | "member" | "product" | "order" | "settings" | "campaign" | "role" | "finance" | "customer";
export type TeamActivityResult = "success" | "warning" | "error" | "neutral";

/** Reference "today" for the team module, aligned with the rest of the app (2026-08-12). */
export const TEAM_TODAY = "2026-08-12";

export const memberStatusLabels: Record<MemberStatus, string> = {
  active: "Active",
  invited: "Invited",
  suspended: "Suspended",
};

export const invitationStatusLabels: Record<InvitationStatus, string> = {
  pending: "Pending",
  expired: "Expired",
  cancelled: "Cancelled",
};

export const teamActivityTypeLabels: Record<TeamActivityType, string> = {
  login: "Sign-in",
  member: "Member",
  product: "Product",
  order: "Order",
  settings: "Settings",
  campaign: "Campaign",
  role: "Role",
  finance: "Finance",
  customer: "Customer",
};

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

export const permissionGroups = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "High-level store and analytics overview.",
    permissions: [
      { key: "view_dashboard", label: "View dashboard", description: "See the store overview page." },
      { key: "view_analytics", label: "View analytics", description: "See revenue and traffic analytics." },
    ],
  },
  {
    id: "products",
    label: "Products",
    description: "Manage digital products, kits and memberships.",
    permissions: [
      { key: "view_products", label: "View products", description: "Browse the product catalog." },
      { key: "create_products", label: "Create products", description: "Add new products." },
      { key: "edit_products", label: "Edit products", description: "Update product details and pricing." },
      { key: "delete_products", label: "Delete products", description: "Remove products from the catalog." },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    description: "Handle customer purchases and fulfilment.",
    permissions: [
      { key: "view_orders", label: "View orders", description: "See all orders." },
      { key: "manage_orders", label: "Manage orders", description: "Update order status and details." },
      { key: "refund_orders", label: "Refund orders", description: "Process refunds." },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    description: "Understand and support your audience.",
    permissions: [
      { key: "view_customers", label: "View customers", description: "Browse customer profiles." },
      { key: "edit_customers", label: "Edit customers", description: "Update customer details and notes." },
    ],
  },
  {
    id: "finance",
    label: "Revenue & finance",
    description: "Financial reporting and payouts.",
    permissions: [
      { key: "view_revenue", label: "View revenue", description: "See revenue reports." },
      { key: "view_finance", label: "View finance", description: "See transactions, fees and payouts." },
      { key: "manage_payouts", label: "Manage payouts", description: "Create and edit payout settings." },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Campaigns, promotions and segments.",
    permissions: [
      { key: "view_campaigns", label: "View campaigns", description: "See marketing campaigns." },
      { key: "manage_campaigns", label: "Manage campaigns", description: "Create and edit campaigns." },
    ],
  },
  {
    id: "team",
    label: "Team",
    description: "Manage your workspace members and roles.",
    permissions: [
      { key: "view_team", label: "View team", description: "See team members and roles." },
      { key: "manage_team", label: "Manage team", description: "Invite, edit and remove members." },
      { key: "manage_roles", label: "Manage roles", description: "Create and edit roles and permissions." },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    description: "Store and workspace configuration.",
    permissions: [
      { key: "view_settings", label: "View settings", description: "See workspace settings." },
      { key: "manage_settings", label: "Manage settings", description: "Change workspace settings." },
    ],
  },
] as const;

export type PermissionGroupId = (typeof permissionGroups)[number]["id"];
export type PermissionKey = (typeof permissionGroups)[number]["permissions"][number]["key"];

export interface PermissionGroupSummary {
  id: string;
  label: string;
  granted: number;
  total: number;
}

export const allPermissionKeys: PermissionKey[] = permissionGroups.flatMap((g) =>
  g.permissions.map((p) => p.key)
) as unknown as PermissionKey[];

export function getPermissionLabel(key: string): string {
  for (const group of permissionGroups) {
    const perm = group.permissions.find((p) => p.key === key);
    if (perm) return perm.label;
  }
  return key;
}

export function getPermissionGroupId(key: string): string {
  for (const group of permissionGroups) {
    if (group.permissions.some((p) => p.key === key)) return group.id;
  }
  return "dashboard";
}

export function getPermissionSummary(keys: string[]): PermissionGroupSummary[] {
  return permissionGroups.map((group) => ({
    id: group.id,
    label: group.label,
    granted: group.permissions.filter((p) => keys.includes(p.key)).length,
    total: group.permissions.length,
  }));
}

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  protected?: boolean;
  createdAt: string;
}

export const roles: Role[] = [
  {
    id: "role-owner",
    name: "Owner",
    description: "Full control over the workspace, members, roles and settings.",
    permissions: [
      "view_dashboard", "view_analytics",
      "view_products", "create_products", "edit_products", "delete_products",
      "view_orders", "manage_orders", "refund_orders",
      "view_customers", "edit_customers",
      "view_revenue", "view_finance", "manage_payouts",
      "view_campaigns", "manage_campaigns",
      "view_team", "manage_team", "manage_roles",
      "view_settings", "manage_settings",
    ],
    protected: true,
    createdAt: "2024-02-12",
  },
  {
    id: "role-admin",
    name: "Administrator",
    description: "Manages day-to-day operations with full access except role management.",
    permissions: [
      "view_dashboard", "view_analytics",
      "view_products", "create_products", "edit_products", "delete_products",
      "view_orders", "manage_orders", "refund_orders",
      "view_customers", "edit_customers",
      "view_revenue", "view_finance", "manage_payouts",
      "view_campaigns", "manage_campaigns",
      "view_team", "manage_team",
      "view_settings", "manage_settings",
    ],
    createdAt: "2024-05-03",
  },
  {
    id: "role-manager",
    name: "Manager",
    description: "Runs products, orders and campaigns but cannot touch payouts or roles.",
    permissions: [
      "view_dashboard", "view_analytics",
      "view_products", "create_products", "edit_products",
      "view_orders", "manage_orders",
      "view_customers", "edit_customers",
      "view_revenue", "view_finance",
      "view_campaigns", "manage_campaigns",
      "view_team", "manage_team",
      "view_settings",
    ],
    createdAt: "2025-01-15",
  },
  {
    id: "role-editor",
    name: "Editor",
    description: "Creates and updates products and campaigns.",
    permissions: [
      "view_dashboard", "view_analytics",
      "view_products", "create_products", "edit_products",
      "view_orders",
      "view_campaigns", "manage_campaigns",
      "view_team",
    ],
    createdAt: "2025-05-27",
  },
  {
    id: "role-analyst",
    name: "Analyst",
    description: "Read-only access to reports, orders, customers and analytics.",
    permissions: [
      "view_dashboard", "view_analytics",
      "view_products",
      "view_orders",
      "view_customers",
      "view_revenue", "view_finance",
      "view_campaigns",
      "view_team",
    ],
    createdAt: "2025-09-02",
  },
  {
    id: "role-support",
    name: "Support",
    description: "Helps customers with orders and account issues.",
    permissions: [
      "view_dashboard",
      "view_orders", "manage_orders",
      "view_customers", "edit_customers",
      "view_team",
    ],
    createdAt: "2026-01-22",
  },
];

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  roleId: string;
  department: string;
  status: MemberStatus;
  joinedAt: string;
  lastActive: string;
  phone?: string;
  location?: string;
}

export const members: TeamMember[] = [
  { id: "m-6001", name: "Alex Rivera", email: "alex@creativetreasury.com", roleId: "role-owner", department: "Operations", status: "active", joinedAt: "2024-02-12", lastActive: "2026-08-12", phone: "+1 (555) 010-1101", location: "Portland, US" },
  { id: "m-6002", name: "Maya Chen", email: "maya@creativetreasury.com", roleId: "role-admin", department: "Engineering", status: "active", joinedAt: "2024-05-03", lastActive: "2026-08-12", phone: "+1 (555) 010-1102", location: "Seattle, US" },
  { id: "m-6003", name: "Omar Haddad", email: "omar@creativetreasury.com", roleId: "role-admin", department: "Design", status: "active", joinedAt: "2024-08-21", lastActive: "2026-08-11", phone: "+44 7911 123456", location: "London, UK" },
  { id: "m-6004", name: "Priya Nair", email: "priya@creativetreasury.com", roleId: "role-manager", department: "Marketing", status: "active", joinedAt: "2025-01-15", lastActive: "2026-08-12", phone: "+91 98100 12345", location: "Bengaluru, IN" },
  { id: "m-6005", name: "Lucas Meyer", email: "lucas@creativetreasury.com", roleId: "role-manager", department: "Sales", status: "active", joinedAt: "2025-03-09", lastActive: "2026-08-10", phone: "+49 151 2345678", location: "Berlin, DE" },
  { id: "m-6006", name: "Sofia Rossi", email: "sofia@creativetreasury.com", roleId: "role-editor", department: "Design", status: "active", joinedAt: "2025-05-27", lastActive: "2026-08-12", phone: "+39 320 1234567", location: "Milan, IT" },
  { id: "m-6007", name: "Ethan Brooks", email: "ethan@creativetreasury.com", roleId: "role-editor", department: "Engineering", status: "active", joinedAt: "2025-07-14", lastActive: "2026-08-09", phone: "+1 (555) 010-1107", location: "Austin, US" },
  { id: "m-6008", name: "Nina Kowalski", email: "nina@creativetreasury.com", roleId: "role-analyst", department: "Marketing", status: "active", joinedAt: "2025-09-02", lastActive: "2026-08-12", phone: "+48 600 123456", location: "Warsaw, PL" },
  { id: "m-6009", name: "Diego Fernández", email: "diego@creativetreasury.com", roleId: "role-analyst", department: "Finance", status: "active", joinedAt: "2025-11-18", lastActive: "2026-08-08", phone: "+34 600 123456", location: "Madrid, ES" },
  { id: "m-6010", name: "Hannah Lindqvist", email: "hannah@creativetreasury.com", roleId: "role-support", department: "Support", status: "active", joinedAt: "2026-01-22", lastActive: "2026-08-11", phone: "+46 70 123 45 67", location: "Stockholm, SE" },
  { id: "m-6011", name: "Ravi Patel", email: "ravi@creativetreasury.com", roleId: "role-support", department: "Support", status: "active", joinedAt: "2026-02-10", lastActive: "2026-08-10", phone: "+44 7700 900123", location: "Manchester, UK" },
  { id: "m-6012", name: "Tessa Okafor", email: "tessa@creativetreasury.com", roleId: "role-editor", department: "Design", status: "invited", joinedAt: "2026-08-05", lastActive: "2026-08-05", phone: "+234 801 234 5678", location: "Lagos, NG" },
  { id: "m-6013", name: "Jonas Weber", email: "jonas@creativetreasury.com", roleId: "role-analyst", department: "Marketing", status: "suspended", joinedAt: "2025-06-30", lastActive: "2026-07-01", phone: "+41 79 123 45 67", location: "Zurich, CH" },
  { id: "m-6014", name: "Yuki Tanaka", email: "yuki@creativetreasury.com", roleId: "role-analyst", department: "Sales", status: "suspended", joinedAt: "2025-04-12", lastActive: "2026-05-20", phone: "+81 90 1234 5678", location: "Tokyo, JP" },
];

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------

export interface Invitation {
  id: string;
  name: string;
  email: string;
  roleId: string;
  invitedById: string;
  memberId?: string;
  sentAt: string;
  expiresAt: string;
  status: InvitationStatus;
}

export const invitations: Invitation[] = [
  { id: "inv-6100", name: "Tessa Okafor", email: "tessa@creativetreasury.com", roleId: "role-editor", invitedById: "m-6001", memberId: "m-6012", sentAt: "2026-08-05", expiresAt: "2026-08-19", status: "pending" },
  { id: "inv-6101", name: "Grace Liu", email: "grace@creativetreasury.com", roleId: "role-editor", invitedById: "m-6001", sentAt: "2026-08-06", expiresAt: "2026-08-20", status: "pending" },
  { id: "inv-6102", name: "Mateo Alvarez", email: "mateo@creativetreasury.com", roleId: "role-support", invitedById: "m-6001", sentAt: "2026-08-09", expiresAt: "2026-08-23", status: "pending" },
  { id: "inv-6103", name: "Amara Diallo", email: "amara@creativetreasury.com", roleId: "role-analyst", invitedById: "m-6004", sentAt: "2026-08-11", expiresAt: "2026-08-25", status: "pending" },
  { id: "inv-6104", name: "Felix Novak", email: "felix@creativetreasury.com", roleId: "role-manager", invitedById: "m-6001", sentAt: "2026-07-20", expiresAt: "2026-08-03", status: "expired" },
  { id: "inv-6105", name: "Isla Campbell", email: "isla@creativetreasury.com", roleId: "role-editor", invitedById: "m-6006", sentAt: "2026-07-15", expiresAt: "2026-07-29", status: "cancelled" },
];

// ---------------------------------------------------------------------------
// Activity
// ---------------------------------------------------------------------------

export interface TeamActivity {
  id: string;
  memberId: string;
  type: TeamActivityType;
  action: string;
  resource: string;
  date: string;
  result: TeamActivityResult;
}

const ACTIVITY_SEED: TeamActivity[] = [
  { id: "ta-01", memberId: "m-6001", type: "login", action: "Signed in", resource: "Admin dashboard", date: "2026-08-12T08:04:00", result: "success" },
  { id: "ta-02", memberId: "m-6002", type: "product", action: "Updated product", resource: "Modern UI Kit", date: "2026-08-12T07:41:00", result: "success" },
  { id: "ta-03", memberId: "m-6004", type: "campaign", action: "Launched campaign", resource: "August Drops Campaign", date: "2026-08-12T07:20:00", result: "success" },
  { id: "ta-04", memberId: "m-6008", type: "order", action: "Exported orders", resource: "2026-08 export", date: "2026-08-12T06:55:00", result: "success" },
  { id: "ta-05", memberId: "m-6010", type: "order", action: "Refunded order", resource: "#CT-2463", date: "2026-08-12T06:10:00", result: "success" },
  { id: "ta-06", memberId: "m-6003", type: "settings", action: "Changed accent color", resource: "Workspace settings", date: "2026-08-11T16:30:00", result: "neutral" },
  { id: "ta-07", memberId: "m-6006", type: "product", action: "Created product", resource: "Icon Pack Vol. 3", date: "2026-08-11T15:12:00", result: "success" },
  { id: "ta-08", memberId: "m-6002", type: "login", action: "Signed in", resource: "Admin dashboard", date: "2026-08-11T14:48:00", result: "success" },
  { id: "ta-09", memberId: "m-6007", type: "product", action: "Bulk edited prices", resource: "20 products", date: "2026-08-11T13:05:00", result: "success" },
  { id: "ta-10", memberId: "m-6011", type: "customer", action: "Updated customer note", resource: "c-1012", date: "2026-08-11T11:22:00", result: "neutral" },
  { id: "ta-11", memberId: "m-6004", type: "member", action: "Invited team member", resource: "Amara Diallo", date: "2026-08-11T10:03:00", result: "success" },
  { id: "ta-12", memberId: "m-6009", type: "finance", action: "Viewed payout report", resource: "July payouts", date: "2026-08-11T09:40:00", result: "neutral" },
  { id: "ta-13", memberId: "m-6005", type: "order", action: "Changed order status", resource: "#CT-2459", date: "2026-08-10T17:25:00", result: "success" },
  { id: "ta-14", memberId: "m-6001", type: "role", action: "Edited role", resource: "Manager", date: "2026-08-10T16:02:00", result: "success" },
  { id: "ta-15", memberId: "m-6008", type: "login", action: "Failed sign-in", resource: "Admin dashboard", date: "2026-08-10T15:55:00", result: "error" },
  { id: "ta-16", memberId: "m-6002", type: "settings", action: "Updated payout details", resource: "Payout settings", date: "2026-08-09T14:18:00", result: "success" },
  { id: "ta-17", memberId: "m-6003", type: "campaign", action: "Paused campaign", resource: "Spring Icon Pack Drop", date: "2026-08-09T12:33:00", result: "warning" },
  { id: "ta-18", memberId: "m-6010", type: "customer", action: "Edited customer", resource: "c-1008", date: "2026-08-08T18:05:00", result: "success" },
  { id: "ta-19", memberId: "m-6006", type: "product", action: "Archived product", resource: "Retro Sticker Set", date: "2026-08-08T10:47:00", result: "warning" },
  { id: "ta-20", memberId: "m-6007", type: "login", action: "Signed in", resource: "Admin dashboard", date: "2026-08-08T09:15:00", result: "success" },
  { id: "ta-21", memberId: "m-6005", type: "campaign", action: "Duplicated campaign", resource: "Logo Bundle Blast", date: "2026-08-07T16:40:00", result: "success" },
  { id: "ta-22", memberId: "m-6009", type: "login", action: "Signed in", resource: "Finance portal", date: "2026-08-08T08:58:00", result: "success" },
];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GENERATED_DATES = [
  "2026-08-12T05:20:00",
  "2026-08-11T08:35:00",
  "2026-08-10T07:12:00",
  "2026-08-09T19:45:00",
  "2026-08-08T13:28:00",
  "2026-08-07T10:52:00",
  "2026-08-06T16:08:00",
  "2026-08-05T09:41:00",
  "2026-08-04T14:57:00",
  "2026-08-03T11:26:00",
];

const GENERATED_POOL: Array<Pick<TeamActivity, "type" | "action" | "resource" | "result">> = [
  { type: "login", action: "Signed in", resource: "Admin dashboard", result: "success" },
  { type: "product", action: "Reviewed product", resource: "Product catalog", result: "neutral" },
  { type: "order", action: "Viewed orders", resource: "Recent orders", result: "neutral" },
  { type: "settings", action: "Updated profile", resource: "Profile settings", result: "success" },
  { type: "campaign", action: "Reviewed campaign", resource: "Marketing campaigns", result: "neutral" },
  { type: "finance", action: "Viewed revenue", resource: "Revenue report", result: "neutral" },
  { type: "customer", action: "Viewed customer", resource: "Customer profile", result: "neutral" },
  { type: "role", action: "Reviewed roles", resource: "Roles & permissions", result: "neutral" },
  { type: "member", action: "Viewed team", resource: "Team directory", result: "neutral" },
];

export function getTeamActivity(memberList: TeamMember[] = members): TeamActivity[] {
  const ids = new Set(memberList.map((m) => m.id));
  return ACTIVITY_SEED.filter((e) => ids.has(e.memberId)).sort((a, b) => b.date.localeCompare(a.date));
}

export function getMemberActivity(member: TeamMember): TeamActivity[] {
  const seeded = ACTIVITY_SEED.filter((e) => e.memberId === member.id);
  const rnd = mulberry32(hashString(`member-activity-${member.id}`));
  const count = 3 + Math.floor(rnd() * 3);
  const generated: TeamActivity[] = [];
  const usedIndices = new Set<number>();
  for (let i = 0; i < count; i++) {
    let idx = Math.floor(rnd() * GENERATED_POOL.length);
    let guard = 0;
    while (usedIndices.has(idx) && guard < 8) {
      idx = Math.floor(rnd() * GENERATED_POOL.length);
      guard++;
    }
    usedIndices.add(idx);
    const spec = GENERATED_POOL[idx];
    generated.push({
      id: `${member.id}-g${i}`,
      memberId: member.id,
      ...spec,
      date: GENERATED_DATES[Math.floor(rnd() * GENERATED_DATES.length)],
    });
  }
  return [...seeded, ...generated].sort((a, b) => b.date.localeCompare(a.date));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function findMember(id: string): TeamMember | undefined {
  return members.find((m) => m.id === id);
}

export function findRole(id: string): Role | undefined {
  return roles.find((r) => r.id === id);
}

export function findInvitation(id: string): Invitation | undefined {
  return invitations.find((i) => i.id === id);
}

export function getRoleMembers(roleId: string, memberList: TeamMember[] = members): TeamMember[] {
  return memberList.filter((m) => m.roleId === roleId);
}

export function getMemberRoles(member: TeamMember, roleList: Role[] = roles): string[] {
  const role = roleList.find((r) => r.id === member.roleId);
  return role ? role.permissions : [];
}

export function getMemberRole(member: TeamMember, roleList: Role[] = roles): Role | undefined {
  return roleList.find((r) => r.id === member.roleId);
}

export function getDepartmentOptions(memberList: TeamMember[] = members): string[] {
  return Array.from(new Set(memberList.map((m) => m.department))).sort((a, b) => a.localeCompare(b));
}

export function roleMemberCount(roleId: string, memberList: TeamMember[] = members): number {
  return memberList.filter((m) => m.roleId === roleId).length;
}

export interface TeamSummary {
  totalMembers: number;
  activeMembers: number;
  invitedMembers: number;
  suspendedMembers: number;
  pendingInvitations: number;
  totalRoles: number;
}

export function getTeamSummary(
  memberList: TeamMember[] = members,
  invitationList: Invitation[] = invitations,
  roleList: Role[] = roles
): TeamSummary {
  return {
    totalMembers: memberList.length,
    activeMembers: memberList.filter((m) => m.status === "active").length,
    invitedMembers: memberList.filter((m) => m.status === "invited").length,
    suspendedMembers: memberList.filter((m) => m.status === "suspended").length,
    pendingInvitations: invitationList.filter((i) => i.status === "pending").length,
    totalRoles: roleList.length,
  };
}

export function getMemberName(id: string, memberList: TeamMember[] = members): string {
  return memberList.find((m) => m.id === id)?.name ?? "Unknown";
}

export function canRemoveRole(role: Role, memberList: TeamMember[] = members): boolean {
  if (role.protected) return false;
  return roleMemberCount(role.id, memberList) === 0;
}

export function getPermissionCount(role: Role): number {
  return role.permissions.length;
}
