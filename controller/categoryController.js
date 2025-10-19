//controller/categoryController.js
import { CategoryService } from '../service/categoryService.js'

export const CategoryController = {
  async getAll(req, res, next) {
    try {
      const categories = await CategoryService.getAllCategories()
      res.json(categories)
    } catch (err) {
      next(err)
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const category = await CategoryService.getCategoryById(id)
      if (!category)
        return res.status(404).json({ error: 'Category not found' })
      res.json(category)
    } catch (err) {
      next(err)
    }
  },
  async create(req, res, next) {
    try {
      const { name } = req.body
      if (!name) return res.status(400).json({ error: 'Name is required' })
      const category = await CategoryService.createCategory(name)
      res.status(201).json(category)
    } catch (err) {
      next(err)
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params
      const { name } = req.body
      if (!name) return res.status(400).json({ error: 'Name is required' })
      const category = await CategoryService.updateCategory(id, name)
      res.json(category)
    } catch (err) {
      next(err)
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params
      await CategoryService.deleteCategory(id)
      res.status(204).send() // No content
    } catch (err) {
      next(err)
    }
  },
}
