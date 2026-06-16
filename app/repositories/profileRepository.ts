import type { SupabaseClient } from '@supabase/supabase-js'
import type { MemberRow, RoleOption } from '~/domain/rbac'
import { ROLE } from '~/domain/rbac'

/** 프로필·등급·권한 접근 */
export const createProfileRepository = (supabase: SupabaseClient) => ({
  /** 현재 사용자의 등급 key */
  getRoleKey: async (userId: string) => {
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('roles(key)')
      .eq('id', userId)
      .maybeSingle()
    return (profileRow?.roles?.key as string) ?? ROLE.user
  },

  /** 현재 사용자의 권한 key 목록 (my_permissions 뷰) */
  listMyPermissions: async () => {
    const { data: rows } = await supabase.from('my_permissions').select('permission_key')
    return (rows ?? []).map((row) => row.permission_key as string)
  },

  listRoles: async (): Promise<RoleOption[]> => {
    const { data: rows, error } = await supabase.from('roles').select('key, label').order('level')
    if (error) throw new Error(error.message)
    return (rows ?? []) as RoleOption[]
  },

  listMembers: async (): Promise<MemberRow[]> => {
    const { data: rows, error } = await supabase
      .from('profiles')
      .select('id, nickname, created_at, roles(key)')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (rows ?? []).map((row): MemberRow => ({
      id: row.id,
      nickname: row.nickname,
      roleKey: (row.roles?.key as string) ?? ROLE.user,
      createdAt: row.created_at,
    }))
  },

  assignRole: async (targetUserId: string, newRoleKey: string) => {
    const { error } = await supabase.rpc('assign_role', {
      target_user: targetUserId,
      new_role_key: newRoleKey,
    })
    if (error) throw new Error(error.message)
  },
})
