import type { SupabaseClient } from '@supabase/supabase-js'
import type { NewPostInput, PostDetail, PostSummary } from '~/domain/board'

/** posts 테이블 접근 캡슐화. 상위(service)는 Supabase 세부를 모른다. */
export const createPostRepository = (supabase: SupabaseClient) => ({
  /** 카테고리 id 목록으로 목록 조회(좋아요 수 포함). categoryId 지정 시 단일 필터. */
  listByCategories: async (categoryIds: number[], categoryId: number | null) => {
    let query = supabase
      .from('posts')
      .select('id, author_name, title, category_id, created_at, post_likes(count)')
      .in('category_id', categoryIds.length > 0 ? categoryIds : [-1])
      .order('created_at', { ascending: false })
    if (categoryId !== null) query = query.eq('category_id', categoryId)
    const { data: rows, error } = await query
    if (error) throw new Error(error.message)
    return (rows ?? []).map((row): PostSummary => ({
      id: row.id,
      authorName: row.author_name,
      title: row.title,
      categoryId: row.category_id,
      createdAt: row.created_at,
      likeCount: row.post_likes?.[0]?.count ?? 0,
    }))
  },

  listByCategoryId: async (categoryId: number) => {
    const { data: rows, error } = await supabase
      .from('posts')
      .select('id, author_name, title, created_at')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return rows ?? []
  },

  findById: async (postId: number): Promise<PostDetail> => {
    const { data: postRow, error } = await supabase
      .from('posts')
      .select('id, author_id, author_name, title, body, category_id, created_at')
      .eq('id', postId)
      .single()
    if (error) throw new Error(error.message)
    return {
      id: postRow.id,
      authorId: postRow.author_id,
      authorName: postRow.author_name,
      title: postRow.title,
      body: postRow.body,
      categoryId: postRow.category_id,
      createdAt: postRow.created_at,
    }
  },

  insert: async (input: NewPostInput) => {
    const { error } = await supabase.from('posts').insert({
      author_id: input.authorId,
      author_name: input.authorName,
      title: input.title,
      body: input.body,
      category_id: input.categoryId,
    })
    if (error) throw new Error(error.message)
  },

  remove: async (postId: number) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId)
    if (error) throw new Error(error.message)
  },
})
