import { PostRepository } from "../repository/postRepository.js"

export const PostService = {
  getAllPosts: () => PostRepository.getAll(),
  getPost: (id) => PostRepository.getById(id),
  createPost: (post) => PostRepository.create(post),
  updatePost: (id, post) => PostRepository.update(id, post),
  deletePost: (id) => PostRepository.delete(id),
}


