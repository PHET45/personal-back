import { UserRepository } from '../repository/userReposotory.js'

export const UserService = {
  getPost: (id) => UserRepository.getByid(id),
}
