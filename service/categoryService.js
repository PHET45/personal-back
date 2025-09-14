import { CategoryRepository } from "../repository/categoryRepository.js"

export const CategoryService = {
    getAllCategories: () => CategoryRepository.getAll()
  }