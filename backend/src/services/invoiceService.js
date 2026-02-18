import { invoiceRepo } from "../repositories/invoiceRepo.js";

export const invoiceService = {
  list: (filters) => invoiceRepo.list(filters),
  create: (payload) => invoiceRepo.create(payload),
  update: (id, payload) => invoiceRepo.update(id, payload),
  remove: (id) => invoiceRepo.remove(id)
};
