import { catalogSchema } from "../validations/catalogValidation.js";
import { catalogService } from "../services/catalogService.js";

export const catalogController = {
  async list(_req, res, next) {
    try {
      const items = await catalogService.list();
      res.json(items);
    } catch (error) {
      next(error);
    }
  },
  async get(req, res, next) {
    try {
      const item = await catalogService.get(Number(req.params.id));
      res.json(item);
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      const payload = catalogSchema.parse(req.body);
      const item = await catalogService.create(payload);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const payload = catalogSchema.parse(req.body);
      const item = await catalogService.update(Number(req.params.id), payload);
      res.json(item);
    } catch (error) {
      next(error);
    }
  },
  async remove(req, res, next) {
    try {
      await catalogService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
