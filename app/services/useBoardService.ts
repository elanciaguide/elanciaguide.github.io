import { createPostRepository } from '~/repositories/postRepository'
import { createCommentRepository } from '~/repositories/commentRepository'
import { createLikeRepository } from '~/repositories/likeRepository'
import { createCategoryRepository } from '~/repositories/categoryRepository'

/**
 * 게시판 도메인 서비스. 페이지/컴포저블은 이 서비스만 호출하고
 * Supabase·repository 세부는 알지 못한다.
 */
export const useBoardService = () => {
  const supabase = useSupabaseClient()
  const postRepository = createPostRepository(supabase)
  const commentRepository = createCommentRepository(supabase)
  const likeRepository = createLikeRepository(supabase)
  const categoryRepository = createCategoryRepository(supabase)

  return {
    listCategories: categoryRepository.listAll,

    listPosts: postRepository.listByCategories,
    listPostsByCategory: postRepository.listByCategoryId,
    getPost: postRepository.findById,
    createPost: postRepository.insert,
    deletePost: postRepository.remove,

    listComments: commentRepository.listByPost,
    createComment: commentRepository.insert,
    deleteComment: commentRepository.remove,

    countLikes: likeRepository.countByPost,
    hasLiked: likeRepository.hasLiked,
    addLike: likeRepository.add,
    removeLike: likeRepository.remove,
  }
}
