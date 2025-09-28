import { StatusRepository } from "../repository/statusRepository.js";

export const StatusService = {
  getAllStatuses: () => StatusRepository.getAll(),
};