<script setup lang="ts">
/** 관리자 페이지: 회원 등급 관리. role.manage 권한 보유자만 사용. */
definePageMeta({ layout: 'default' })

import type { MemberRow } from '~/domain/rbac'
import { PERMISSION } from '~/domain/rbac'

const currentUser = useSupabaseUser()
const { hasPermission, isLoaded, loadPermissions } = usePermissions()
const profileService = useProfileService()

const members = ref<MemberRow[]>([])
const roleOptions = ref<Awaited<ReturnType<typeof profileService.listRoles>>>([])
const isLoading = ref(true)
const actionError = ref('')

const canManageRoles = computed(() => hasPermission(PERMISSION.roleManage))

const formatDate = (isoDate: string) => new Date(isoDate).toLocaleDateString('ko-KR')

const loadMembers = async () => {
  isLoading.value = true
  roleOptions.value = await profileService.listRoles()
  members.value = await profileService.listMembers()
  isLoading.value = false
}

const changeRole = async (member: MemberRow, newRoleKey: string) => {
  actionError.value = ''
  try {
    await profileService.assignRole(member.id, newRoleKey)
    member.roleKey = newRoleKey
  } catch (caughtError) {
    actionError.value = caughtError instanceof Error ? caughtError.message : '변경 실패'
    await loadMembers()
  }
}

onMounted(async () => {
  if (!isLoaded.value) await loadPermissions()
  if (canManageRoles.value) await loadMembers()
  else isLoading.value = false
})
</script>

<template>
  <div class="content-prose">
    <h1>관리자 · 회원 등급</h1>

    <p v-if="!currentUser">로그인이 필요합니다.</p>
    <p v-else-if="!canManageRoles">이 페이지에 접근할 권한이 없습니다.</p>

    <template v-else>
      <p v-if="isLoading">불러오는 중...</p>
      <p v-if="actionError" class="admin-error">{{ actionError }}</p>

      <table v-if="!isLoading" class="admin-table">
        <thead>
          <tr>
            <th>닉네임</th>
            <th>가입일</th>
            <th>등급</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.id">
            <td>{{ member.nickname }}</td>
            <td>{{ formatDate(member.createdAt) }}</td>
            <td>
              <select
                :value="member.roleKey"
                class="admin-select"
                @change="changeRole(member, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="role in roleOptions" :key="role.key" :value="role.key">
                  {{ role.label }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<style scoped>
.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.admin-table th,
.admin-table td {
  border: 1px solid var(--color-border);
  padding: 0.55rem 0.7rem;
  text-align: left;
}

.admin-table th {
  font-family: var(--font-pixel);
  font-size: 0.82rem;
  background-color: var(--color-accent);
  color: #fff8e6;
}

.admin-select {
  font-family: var(--font-body);
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius);
  background-color: var(--color-surface);
  color: var(--color-text);
}

.admin-error {
  color: #c0392b;
}
</style>
