import { StatusService } from "../service/statusService.js";

export const StatusController = {
 async getAll(req, res, next) {
     try {
       const statuses = await StatusService.getAllStatuses()
       res.json(statuses)
     } catch (err) {
       next(err)
     }
   }
}