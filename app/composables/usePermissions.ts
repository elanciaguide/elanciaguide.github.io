import { ROLE } from '~/domain/rbac'

/**
 * 현재 로그인 사용자의 등급/권한을 로드하고 권한 검사를 제공한다.
 * 데이터 접근은 profileService 에 위임.
 */
export const usePermissions = () => {
  const currentUser = useSupabaseUser()
  const profileService = useProfileService()

  const permissionKeys = useState<string[]>('permission-keys', () => [])
  const roleKey = useState<string>('role-key', () => ROLE.user)
  const isLoaded = useState<boolean>('permissions-loaded', () => false)

  const loadPermissions = async () => {
    if (!currentUser.value) {
      permissionKeys.value = []
      roleKey.value = ROLE.user
      isLoaded.value = true
      return
    }
    roleKey.value = await profileService.getRoleKey(currentUser.value.id)
    permissionKeys.value = await profileService.listMyPermissions()
    isLoaded.value = true
  }

  const hasPermission = (key: string) => permissionKeys.value.includes(key)

  const isAdmin = computed(() => roleKey.value === ROLE.admin)
  const isStaff = computed(() => roleKey.value === ROLE.admin || roleKey.value === ROLE.manager)

  /** 로그인 상태가 바뀌면 권한을 다시 로드한다. */
  watch(currentUser, loadPermissions, { immediate: true })

  return { permissionKeys, roleKey, isLoaded, hasPermission, isAdmin, isStaff, loadPermissions }
}
