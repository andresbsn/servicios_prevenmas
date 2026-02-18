import { clientSchema } from "../validations/clientValidation.js";
import { clientService } from "../services/clientService.js";

export const clientController = {
  async list(req, res, next) {
    try {
      const { search, estado } = req.query;
      const clients = await clientService.list({ search, estado });
      res.json(clients);
    } catch (error) {
      next(error);
    }
  },
  async get(req, res, next) {
    try {
      const client = await clientService.get(Number(req.params.id));
      res.json(client);
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      const payload = clientSchema.parse(req.body);
      const client = await clientService.create(payload);
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const payload = clientSchema.parse(req.body);
      const client = await clientService.update(Number(req.params.id), payload);
      res.json(client);
    } catch (error) {
      next(error);
    }
  },
  async remove(req, res, next) {
    try {
      await clientService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
