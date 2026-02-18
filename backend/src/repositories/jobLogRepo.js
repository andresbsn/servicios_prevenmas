import { pool } from "../db/pool.js";

export const jobLogRepo = {
  async create({ runAt, count, status, error }) {
    const { rows } = await pool.query(
      `INSERT INTO job_logs (run_at, expiries_count, status, error)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [runAt, count, status, error]
    );
    return rows[0];
  },
  async list() {
    const { rows } = await pool.query(
      "SELECT * FROM job_logs ORDER BY run_at DESC LIMIT 50"
    );
    return rows;
  }
};
