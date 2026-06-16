import { createProfileRepository } from '~/repositories/profileRepository'

/** 프로필·등급·권한 서비스 */
export const useProfileService = () => {
  const supabase = useSupabaseClient()
  const profileRepository = createProfileRepository(supabase)

  return {
    getRoleKey: profileRepository.getRoleKey,
    listMyPermissions: profileRepository.listMyPermissions,
    listRoles: profileRepository.listRoles,
    listMembers: profileRepository.listMembers,
    assignRole: profileRepository.assignRole,
  }
}
