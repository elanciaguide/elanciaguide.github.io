/** 권한·등급 도메인 */

export interface RoleOption {
  key: string
  label: string
}

export interface MemberRow {
  id: string
  nickname: string
  roleKey: string
  createdAt: string
}

/** 권한 키 (Supabase permissions.key 와 일치) */
export const PERMISSION = {
  postDeleteAny: 'post.delete.any',
  commentDeleteAny: 'comment.delete.any',
  noticeWrite: 'notice.write',
  contentEdit: 'content.edit',
  roleManage: 'role.manage',
} as const

/** 등급 키 */
export const ROLE = {
  user: 'user',
  manager: 'manager',
  admin: 'admin',
} as const
