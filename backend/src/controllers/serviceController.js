import { serviceSchema } from "../validations/serviceValidation.js";
import { serviceService } from "../services/serviceService.js";

export const serviceController = {
  async list(req, res, next) {
    try {
      const { from, to, clienteId } = req.query;
      const rows = await serviceService.list({ from, to, clienteId });
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },
  async listByClient(req, res, next) {
    try {
      const rows = await serviceService.listByClient(Number(req.params.clienteId));
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },
  async listUpcoming(req, res, next) {
    try {
      const days = Number(req.query.days || 20);
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + (Number.isFinite(days) ? days : 20));
      const startDate = start.toISOString().slice(0, 10);
      const endDate = end.toISOString().slice(0, 10);
      const rows = await serviceService.listUpcoming({ startDate, endDate });
      res.json({ startDate, endDate, rows });
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      const payload = serviceSchema.parse(req.body);
      const record = await serviceService.create(payload);
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const payload = serviceSchema.parse(req.body);
      const record = await serviceService.update(Number(req.params.id), payload);
      res.json(record);
    } catch (error) {
      next(error);
    }
  },
  async remove(req, res, next) {
    try {
      await serviceService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
