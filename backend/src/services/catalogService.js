import { catalogRepo } from "../repositories/catalogRepo.js";

export const catalogService = {
  list: () => catalogRepo.list(),
  get: (id) => catalogRepo.findById(id),
  create: (payload) => catalogRepo.create(payload),
  update: (id, payload) => catalogRepo.update(id, payload),
  remove: (id) => catalogRepo.remove(id)
};
