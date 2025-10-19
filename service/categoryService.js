//service/categoryService.js
import { CategoryRepository } from '../repository/categoryRepository.js'

export const CategoryService = {
  getAllCategories: () => CategoryRepository.getAll(),

  createCategory: (name) => CategoryRepository.create(name),

  updateCategory: (id, name) => CategoryRepository.update(id, name),

  deleteCategory: (id) => CategoryRepository.remove(id),
}
