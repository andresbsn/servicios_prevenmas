import { pool } from "../db/pool.js";

export const userRepo = {
  async findByEmail(email) {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 AND activo = true",
      [email]
    );
    return rows[0];
  },
  async create({ nombre, email, passwordHash, rol }) {
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol)
      VALUES ($1,$2,$3,$4)
      RETURNING id, nombre, email, rol`,
      [nombre, email, passwordHash, rol]
    );
    return rows[0];
  }
};
