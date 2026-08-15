"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  members as seedMembers,
  roles as seedRoles,
  invitations as seedInvitations,
  getTeamSummary,
  TEAM_TODAY,
  type Invitation,
  type InvitationStatus,
  type MemberStatus,
  type Role,
  type TeamMember,
  type TeamSummary,
} from "@/lib/data/team";

export interface InviteInput {
  name: string;
  email: string;
  roleId: string;
  department: string;
}

export interface NewRoleInput {
  name: string;
  description: string;
  permissions: string[];
}

interface TeamContextValue {
  members: TeamMember[];
  roles: Role[];
  invitations: Invitation[];
  summary: TeamSummary;
  getMember: (id: string) => TeamMember | undefined;
  getRole: (id: string) => Role | undefined;
  getInvitation: (id: string) => Invitation | undefined;
  inviteMember: (input: InviteInput) => { member: TeamMember; invitation: Invitation };
  updateMember: (id: string, patch: Partial<TeamMember>) => void;
  changeMemberRole: (id: string, roleId: string) => void;
  suspendMember: (id: string) => void;
  reactivateMember: (id: string) => void;
  removeMember: (id: string) => void;
  cancelInvitation: (id: string) => void;
  resendInvitation: (id: string) => Invitation | null;
  createRole: (input: NewRoleInput) => Role;
  updateRole: (id: string, patch: Partial<Role>) => void;
  deleteRole: (id: string) => boolean;
  duplicateRole: (id: string) => Role | null;
}

const TeamContext = createContext<TeamContextValue | null>(null);

function nextMemberId(list: TeamMember[]): string {
  const nums = list.map((m) => Number(m.id.replace("m-", "")) || 6000);
  return `m-${Math.max(...nums) + 1}`;
}

function nextInvitationId(list: Invitation[]): string {
  const nums = list.map((i) => Number(i.id.replace("inv-", "")) || 6100);
  return `inv-${Math.max(...nums) + 1}`;
}

function nextRoleId(list: Role[]): string {
  const nums = list.map((r) => Number(r.id.replace("role-", "")) || 7000);
  return `role-${Math.max(...nums) + 1}`;
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function TeamProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<TeamMember[]>(seedMembers);
  const [roles, setRoles] = useState<Role[]>(seedRoles);
  const [invitations, setInvitations] = useState<Invitation[]>(seedInvitations);

  const summary = useMemo(() => getTeamSummary(members, invitations, roles), [members, invitations, roles]);

  function getMember(id: string) {
    return members.find((m) => m.id === id);
  }

  function getRole(id: string) {
    return roles.find((r) => r.id === id);
  }

  function getInvitation(id: string) {
    return invitations.find((i) => i.id === id);
  }

  function inviteMember(input: InviteInput): { member: TeamMember; invitation: Invitation } {
    const member: TeamMember = {
      id: nextMemberId(members),
      name: input.name,
      email: input.email,
      roleId: input.roleId,
      department: input.department || "Unassigned",
      status: "invited",
      joinedAt: TEAM_TODAY,
      lastActive: TEAM_TODAY,
    };
    const invitation: Invitation = {
      id: nextInvitationId(invitations),
      name: input.name,
      email: input.email,
      roleId: input.roleId,
      invitedById: "m-6001",
      memberId: member.id,
      sentAt: TEAM_TODAY,
      expiresAt: addDays(TEAM_TODAY, 14),
      status: "pending",
    };
    setMembers((prev) => [...prev, member]);
    setInvitations((prev) => [...prev, invitation]);
    return { member, invitation };
  }

  function updateMember(id: string, patch: Partial<TeamMember>) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function changeMemberRole(id: string, roleId: string) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, roleId } : m)));
  }

  function setMemberStatus(id: string, status: MemberStatus) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }

  function suspendMember(id: string) {
    setMemberStatus(id, "suspended");
  }

  function reactivateMember(id: string) {
    setMemberStatus(id, "active");
  }

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setInvitations((prev) =>
      prev.map((i) => (i.memberId === id ? { ...i, memberId: undefined, status: "cancelled" as InvitationStatus } : i))
    );
  }

  function cancelInvitation(id: string) {
    const invitation = invitations.find((i) => i.id === id);
    if (invitation?.memberId) {
      setMembers((prev) => prev.filter((m) => m.id !== invitation.memberId));
    }
    setInvitations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "cancelled" as InvitationStatus } : i))
    );
  }

  function resendInvitation(id: string): Invitation | null {
    let updated: Invitation | null = null;
    setInvitations((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        updated = {
          ...i,
          status: "pending",
          sentAt: TEAM_TODAY,
          expiresAt: addDays(TEAM_TODAY, 14),
        };
        return updated;
      })
    );
    return updated;
  }

  function createRole(input: NewRoleInput): Role {
    const role: Role = {
      id: nextRoleId(roles),
      name: input.name,
      description: input.description,
      permissions: input.permissions,
      createdAt: TEAM_TODAY,
    };
    setRoles((prev) => [...prev, role]);
    return role;
  }

  function updateRole(id: string, patch: Partial<Role>) {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function deleteRole(id: string): boolean {
    const role = roles.find((r) => r.id === id);
    if (!role || role.protected) return false;
    if (members.some((m) => m.roleId === id)) return false;
    setRoles((prev) => prev.filter((r) => r.id !== id));
    return true;
  }

  function duplicateRole(id: string): Role | null {
    const source = roles.find((r) => r.id === id);
    if (!source) return null;
    const copy: Role = {
      id: nextRoleId(roles),
      name: `${source.name} (Copy)`,
      description: source.description,
      permissions: [...source.permissions],
      createdAt: TEAM_TODAY,
    };
    setRoles((prev) => [...prev, copy]);
    return copy;
  }

  return (
    <TeamContext.Provider
      value={{
        members,
        roles,
        invitations,
        summary,
        getMember,
        getRole,
        getInvitation,
        inviteMember,
        updateMember,
        changeMemberRole,
        suspendMember,
        reactivateMember,
        removeMember,
        cancelInvitation,
        resendInvitation,
        createRole,
        updateRole,
        deleteRole,
        duplicateRole,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
}
