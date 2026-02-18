import { clientRepo } from "../repositories/clientRepo.js";
import { serviceRepo } from "../repositories/serviceRepo.js";
import { invoiceRepo } from "../repositories/invoiceRepo.js";

export const clientService = {
  list: (filters) => clientRepo.list(filters),
  get: async (id) => {
    const client = await clientRepo.findById(id);
    if (!client) {
      const error = new Error("Cliente no encontrado");
      error.status = 404;
      throw error;
    }

    const servicios = await serviceRepo.listByClient(id);
    const historial = await serviceRepo.historyByClient(id);
    const facturas = await invoiceRepo.list({ clienteId: id });

    return { ...client, servicios, historial, facturas };
  },
  create: (payload) => clientRepo.create(payload),
  update: (id, payload) => clientRepo.update(id, payload),
  remove: (id) => clientRepo.remove(id)
};
