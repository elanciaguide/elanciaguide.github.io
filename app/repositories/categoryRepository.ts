import type { SupabaseClient } from '@supabase/supabase-js'
import type { BoardCategory } from '~/domain/board'

export const createCategoryRepository = (supabase: SupabaseClient) => ({
  listAll: async (): Promise<BoardCategory[]> => {
    const { data: rows, error } = await supabase
      .from('board_categories')
      .select('id, key, label, slug, group_key, sort_order, is_staff_only')
      .order('sort_order')
    if (error) throw new Error(error.message)
    return (rows ?? []).map((row): BoardCategory => ({
      id: row.id,
      key: row.key,
      label: row.label,
      slug: row.slug,
      groupKey: row.group_key,
      sortOrder: row.sort_order,
      isStaffOnly: row.is_staff_only,
    }))
  },
})
