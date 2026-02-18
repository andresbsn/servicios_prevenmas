import { DateTime } from "luxon";
import { serviceRepo } from "../repositories/serviceRepo.js";
import { jobLogRepo } from "../repositories/jobLogRepo.js";
import { sendExpiryEmail } from "../utils/mailer.js";

const getZone = () => process.env.TIMEZONE || "America/Argentina/Cordoba";

const groupByClient = (rows) => {
  return rows.reduce((acc, row) => {
    if (!acc[row.cliente_id]) {
      acc[row.cliente_id] = {
        cliente: {
          id: row.cliente_id,
          razon_social: row.razon_social,
          email: row.email,
          telefono: row.telefono
        },
        items: []
      };
    }
    acc[row.cliente_id].items.push(row);
    return acc;
  }, {});
};

export const jobService = {
  async runExpiryNotification() {
    const zone = getZone();
    const today = DateTime.now().setZone(zone).startOf("day");
    const endDate = today.plus({ days: 20 });
    const tomorrow = today.plus({ days: 1 });

    const rows = await serviceRepo.listUpcoming({
      startDate: today.toISODate(),
      endDate: endDate.toISODate()
    });

    const grouped = groupByClient(rows);
    const total = rows.length;

    try {
      if (total > 0) {
        await sendExpiryEmail({
          grouped,
          today: today.toISODate(),
          tomorrow: tomorrow.toISODate()
        });
      }

      await jobLogRepo.create({
        runAt: DateTime.now().setZone(zone).toISO(),
        count: total,
        status: "OK",
        error: null
      });

      return { count: total };
    } catch (error) {
      await jobLogRepo.create({
        runAt: DateTime.now().setZone(zone).toISO(),
        count: total,
        status: "ERROR",
        error: error.message
      });

      throw error;
    }
  },
  listLogs: () => jobLogRepo.list()
};
