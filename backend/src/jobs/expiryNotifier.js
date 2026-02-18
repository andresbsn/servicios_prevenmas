import cron from "node-cron";
import { jobService } from "../services/jobService.js";

export const initScheduler = () => {
  const schedule = process.env.CRON_SCHEDULE || "0 8 * * *";
  const timezone = process.env.TIMEZONE || "America/Argentina/Cordoba";

  cron.schedule(
    schedule,
    async () => {
      try {
        await jobService.runExpiryNotification();
      } catch (error) {
        console.error("Error job expiries", error);
      }
    },
    { timezone }
  );
};
