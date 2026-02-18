import { jobService } from "../services/jobService.js";

export const jobController = {
  async run(req, res, next) {
    try {
      const result = await jobService.runExpiryNotification();
      res.json({ message: "Job ejecutado", ...result });
    } catch (error) {
      next(error);
    }
  },
  async logs(req, res, next) {
    try {
      const rows = await jobService.listLogs();
      res.json(rows);
    } catch (error) {
      next(error);
    }
  }
};
