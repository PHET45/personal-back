import { PostService } from "../service/postService.js"


export const PostController = {
  async getAll(req, res, next) {
    try {
      const posts = await PostService.getAllPosts()
      res.json(posts)
    } catch (err) {
      next(err)
    }
  },

  async getById(req, res, next) {
    try {
      const post = await PostService.getPost(req.params.id)
      res.json(post)
    } catch (err) {
      next(err)
    }
  },

  async create(req, res, next) {
    try {
      const post = await PostService.createPost(req.body)
      res.status(201).json(post)
    } catch (err) {
      next(err)
    }
  },

  async update(req, res, next) {
    try {
      const post = await PostService.updatePost(req.params.id, req.body)
      res.json(post)
    } catch (err) {
      next(err)
    }
  },

  async remove(req, res, next) {
    try {
      await PostService.deletePost(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
}
