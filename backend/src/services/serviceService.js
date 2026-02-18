import { serviceRepo } from "../repositories/serviceRepo.js";

export const serviceService = {
  list: (filters) => serviceRepo.list(filters),
  listByClient: (clienteId) => serviceRepo.listByClient(clienteId),
  listUpcoming: (range) => serviceRepo.listUpcoming(range),
  create: async (payload) => {
    const record = await serviceRepo.create(payload);
    await serviceRepo.insertHistory(payload, record.id);
    return record;
  },
  update: (id, payload) => serviceRepo.update(id, payload),
  remove: (id) => serviceRepo.remove(id)
};
