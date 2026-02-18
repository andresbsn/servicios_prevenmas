import { pool } from "../db/pool.js";

export const clientRepo = {
  async list({ search, estado }) {
    const values = [];
    const where = [];

    if (search) {
      values.push(`%${search}%`);
      where.push(`(razon_social ILIKE $${values.length} OR cuit ILIKE $${values.length})`);
    }

    if (estado) {
      values.push(estado);
      where.push(`estado = $${values.length}`);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows } = await pool.query(
      `SELECT * FROM clientes ${whereClause} ORDER BY razon_social ASC`,
      values
    );
    return rows;
  },
  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM clientes WHERE id = $1", [id]);
    return rows[0];
  },
  async create(payload) {
    const { rows } = await pool.query(
      `INSERT INTO clientes
      (razon_social, cuit, email, telefono, direccion, observaciones, estado, fecha_alta)
      VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8, CURRENT_DATE))
      RETURNING *`,
      [
        payload.razon_social,
        payload.cuit,
        payload.email,
        payload.telefono,
        payload.direccion,
        payload.observaciones,
        payload.estado,
        payload.fecha_alta
      ]
    );
    return rows[0];
  },
  async update(id, payload) {
    const { rows } = await pool.query(
      `UPDATE clientes SET
        razon_social = $1,
        cuit = $2,
        email = $3,
        telefono = $4,
        direccion = $5,
        observaciones = $6,
        estado = $7
      WHERE id = $8
      RETURNING *`,
      [
        payload.razon_social,
        payload.cuit,
        payload.email,
        payload.telefono,
        payload.direccion,
        payload.observaciones,
        payload.estado,
        id
      ]
    );
    return rows[0];
  },
  async remove(id) {
    await pool.query("DELETE FROM clientes WHERE id = $1", [id]);
  }
};
