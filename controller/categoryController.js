import { CategoryService } from "../service/categoryService.js";

export const CategoryController= {
    async getAll(req, res, next) {
        try {
          const categories = await CategoryService.getAllCategories()
          res.json(categories)
        } catch (err) {
          next(err)
        }
      },
}