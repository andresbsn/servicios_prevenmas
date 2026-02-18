import { invoiceSchema } from "../validations/invoiceValidation.js";
import { invoiceService } from "../services/invoiceService.js";

export const invoiceController = {
  async list(req, res, next) {
    try {
      const { estado, from, to, clienteId } = req.query;
      const normalizedEstado = estado ? String(estado).toUpperCase() : undefined;
      const rows = await invoiceService.list({ estado: normalizedEstado, from, to, clienteId });
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      const payload = invoiceSchema.parse(req.body);
      if (payload.estado === "COBRADA" && !payload.fecha_cancelacion) {
        payload.fecha_cancelacion = new Date().toISOString().slice(0, 10);
      }
      const record = await invoiceService.create(payload);
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const payload = invoiceSchema.parse(req.body);
      if (payload.estado === "COBRADA" && !payload.fecha_cancelacion) {
        payload.fecha_cancelacion = new Date().toISOString().slice(0, 10);
      }
      const record = await invoiceService.update(Number(req.params.id), payload);
      res.json(record);
    } catch (error) {
      next(error);
    }
  },
  async remove(req, res, next) {
    try {
      await invoiceService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
