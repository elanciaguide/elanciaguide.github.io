import type { SupabaseClient } from '@supabase/supabase-js'
import type { Comment, NewCommentInput } from '~/domain/board'

export const createCommentRepository = (supabase: SupabaseClient) => ({
  listByPost: async (postId: number): Promise<Comment[]> => {
    const { data: rows, error } = await supabase
      .from('comments')
      .select('id, author_id, author_name, body, created_at')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (error) throw new Error(error.message)
    return (rows ?? []).map((row): Comment => ({
      id: row.id,
      authorId: row.author_id,
      authorName: row.author_name,
      body: row.body,
      createdAt: row.created_at,
    }))
  },

  insert: async (input: NewCommentInput) => {
    const { error } = await supabase.from('comments').insert({
      post_id: input.postId,
      author_id: input.authorId,
      author_name: input.authorName,
      body: input.body,
    })
    if (error) throw new Error(error.message)
  },

  remove: async (commentId: number) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    if (error) throw new Error(error.message)
  },
})
