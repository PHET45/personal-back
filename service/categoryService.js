//service/categoryService.js
import { CategoryRepository } from '../repository/categoryRepository.js'

export const CategoryService = {
  getAllCategories: () => CategoryRepository.getAll(),

  createCategory: (name) => CategoryRepository.create(name),

  getCategoryById: (id) => CategoryRepository.getById(id),

  updateCategory: (id, name) => CategoryRepository.update(id, name),

  deleteCategory: (id) => CategoryRepository.remove(id),
}
