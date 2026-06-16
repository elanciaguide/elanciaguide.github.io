import type { SupabaseClient } from '@supabase/supabase-js'

export const createLikeRepository = (supabase: SupabaseClient) => ({
  countByPost: async (postId: number) => {
    const { count } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
    return count ?? 0
  },

  hasLiked: async (postId: number, userId: string) => {
    const { data: myLike } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle()
    return Boolean(myLike)
  },

  add: async (postId: number, userId: string) => {
    const { error } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId })
    if (error) throw new Error(error.message)
  },

  remove: async (postId: number, userId: string) => {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
  },
})
