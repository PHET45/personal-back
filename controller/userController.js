import { UserService } from "../service/userService.js";

export const UserController = {
   
    async getById(req, res, next) {
      try {
        const post = await UserService.getPost(req.params.id)
        res.json(post)
      } catch (err) {
        next(err)
      }
    },
  
  }