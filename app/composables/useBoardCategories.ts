import type { BoardCategory } from '~/domain/board'

/** 게시판 카테고리를 서비스에서 한 번 로드해 앱 전역에서 공유한다. */
export const useBoardCategories = () => {
  const boardService = useBoardService()
  const categories = useState<BoardCategory[]>('board-categories', () => [])
  const isLoaded = useState<boolean>('board-categories-loaded', () => false)

  const loadCategories = async () => {
    if (isLoaded.value) return
    categories.value = await boardService.listCategories()
    isLoaded.value = true
  }

  const categoriesByGroup = (groupKey: string) =>
    categories.value.filter((category) => category.groupKey === groupKey)

  const categoryBySlug = (slug: string) =>
    categories.value.find((category) => category.slug === slug)

  const categoryById = (id: number) =>
    categories.value.find((category) => category.id === id)

  return {
    categories,
    isLoaded,
    loadCategories,
    categoriesByGroup,
    categoryBySlug,
    categoryById,
  }
}
