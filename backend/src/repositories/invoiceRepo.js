import { pool } from "../db/pool.js";

export const invoiceRepo = {
  async list({ estado, from, to, clienteId }) {
    const values = [];
    const where = [];

    if (estado) {
      values.push(estado);
      where.push(`f.estado = $${values.length}`);
    }
    if (from) {
      values.push(from);
      where.push(`fecha_emision >= $${values.length}`);
    }
    if (to) {
      values.push(to);
      where.push(`fecha_emision <= $${values.length}`);
    }
    if (clienteId) {
      values.push(clienteId);
      where.push(`cliente_id = $${values.length}`);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows } = await pool.query(
      `SELECT f.*, c.razon_social
      FROM facturas f
      JOIN clientes c ON c.id = f.cliente_id
      ${whereClause}
      ORDER BY f.fecha_emision DESC`,
      values
    );
    return rows;
  },
  async create(payload) {
    const { rows } = await pool.query(
      `INSERT INTO facturas
      (cliente_id, descripcion, importe, fecha_emision, estado, fecha_cancelacion, observacion)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        payload.cliente_id,
        payload.descripcion,
        payload.importe,
        payload.fecha_emision,
        payload.estado,
        payload.fecha_cancelacion,
        payload.observacion
      ]
    );
    return rows[0];
  },
  async update(id, payload) {
    const { rows } = await pool.query(
      `UPDATE facturas SET
        descripcion = $1,
        importe = $2,
        fecha_emision = $3,
        estado = $4,
        fecha_cancelacion = $5,
        observacion = $6
      WHERE id = $7
      RETURNING *`,
      [
        payload.descripcion,
        payload.importe,
        payload.fecha_emision,
        payload.estado,
        payload.fecha_cancelacion,
        payload.observacion,
        id
      ]
    );
    return rows[0];
  },
  async remove(id) {
    await pool.query("DELETE FROM facturas WHERE id = $1", [id]);
  }
};
