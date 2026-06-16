/** 게시판 도메인 타입 */

export interface BoardCategory {
  id: number
  key: string
  label: string
  slug: string
  groupKey: string
  sortOrder: number
  isStaffOnly: boolean
}

/** 목록용 게시글(본문 제외, 좋아요 수 포함) */
export interface PostSummary {
  id: number
  authorName: string
  title: string
  categoryId: number
  createdAt: string
  likeCount: number
}

/** 상세용 게시글 */
export interface PostDetail {
  id: number
  authorId: string
  authorName: string
  title: string
  body: string
  categoryId: number
  createdAt: string
}

export interface Comment {
  id: number
  authorId: string
  authorName: string
  body: string
  createdAt: string
}

/** 새 게시글 작성 입력 */
export interface NewPostInput {
  authorId: string
  authorName: string
  title: string
  body: string
  categoryId: number
}

/** 새 댓글 작성 입력 */
export interface NewCommentInput {
  postId: number
  authorId: string
  authorName: string
  body: string
}
