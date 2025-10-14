//service/postService.js
import { PostRepository } from "../repository/postRepository.js"

export const PostService = {

  getAllPublishedPosts: (page, limit) => PostRepository.getAll({ publishedOnly: true, page, limit }),
  getPublishedPost: (id) => PostRepository.getById(id, { publishedOnly: true }),

  getAllPosts: () => PostRepository.getAll(),
  getPost: (id) => PostRepository.getById(id),
  createPost: (post) => PostRepository.create(post),
  updatePost: (id, post) => PostRepository.update(id, post),
  deletePost: (id) => PostRepository.delete(id),
}


