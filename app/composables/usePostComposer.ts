import type { NewPostInput } from '~/domain/board'

/** 작성자 표시명: 닉네임 → 이메일 → '익명' 순. */
export const resolveNickname = (user: { user_metadata?: Record<string, unknown>; email?: string } | null) =>
  (user?.user_metadata?.nickname as string) || user?.email || '익명'

/** ISO 문자열을 한국어 로캘 일시로 표기. */
export const formatDateTime = (isoDate: string) => new Date(isoDate).toLocaleString('ko-KR')

/**
 * 게시판 글쓰기 폼 로직(상태·미디어 삽입·유튜브·제출)을 캡슐화.
 * 게시판/카테고리 페이지가 동일하게 사용한다.
 * @param resolveCategoryId 제출 시점에 대상 카테고리 id 를 반환(없으면 null → 제출 무시).
 * @param onSubmitted 등록 성공 후 콜백(목록 새로고침 등).
 */
export const usePostComposer = (
  resolveCategoryId: () => number | null,
  onSubmitted: () => Promise<void> | void,
) => {
  const currentUser = useSupabaseUser()
  const boardService = useBoardService()
  const { isUploading, uploadError, uploadMedia } = useMediaUpload()

  const isWriting = ref(false)
  const newTitle = ref('')
  const newBody = ref('')
  const isSubmitting = ref(false)
  const submitError = ref('')

  const insertUploadedMedia = async (event: Event, kind: 'image' | 'video') => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    const url = await uploadMedia(file, kind)
    input.value = ''
    if (!url) return
    newBody.value += kind === 'image' ? `\n![이미지](${url})\n` : `\n@[video](${url})\n`
  }

  const onSelectImage = (event: Event) => insertUploadedMedia(event, 'image')
  const onSelectVideo = (event: Event) => insertUploadedMedia(event, 'video')

  const insertYoutube = () => {
    const url = window.prompt('유튜브 URL을 입력하세요')
    if (url) newBody.value += `\n${url.trim()}\n`
  }

  const submitPost = async () => {
    const categoryId = resolveCategoryId()
    if (!currentUser.value || categoryId === null) return
    submitError.value = ''
    isSubmitting.value = true
    try {
      const input: NewPostInput = {
        authorId: currentUser.value.id,
        authorName: resolveNickname(currentUser.value),
        title: newTitle.value,
        body: newBody.value,
        categoryId,
      }
      await boardService.createPost(input)
      newTitle.value = ''
      newBody.value = ''
      isWriting.value = false
      await onSubmitted()
    } catch (caughtError) {
      submitError.value = caughtError instanceof Error ? caughtError.message : '등록 실패'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isWriting,
    newTitle,
    newBody,
    isSubmitting,
    submitError,
    isUploading,
    uploadError,
    onSelectImage,
    onSelectVideo,
    insertYoutube,
    submitPost,
  }
}
