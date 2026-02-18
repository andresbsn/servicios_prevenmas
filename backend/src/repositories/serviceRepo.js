import { pool } from "../db/pool.js";

export const serviceRepo = {
  async list({ from, to, clienteId }) {
    const values = [];
    const where = [];

    if (from) {
      values.push(from);
      where.push(`proximo_vencimiento >= $${values.length}`);
    }
    if (to) {
      values.push(to);
      where.push(`proximo_vencimiento <= $${values.length}`);
    }
    if (clienteId) {
      values.push(clienteId);
      where.push(`cliente_id = $${values.length}`);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows } = await pool.query(
      `SELECT sc.*, c.razon_social, s.descripcion AS servicio_descripcion
      FROM servicios_cliente sc
      JOIN clientes c ON c.id = sc.cliente_id
      JOIN servicios_catalogo s ON s.id = sc.servicio_id
      ${whereClause}
      ORDER BY sc.proximo_vencimiento ASC`,
      values
    );
    return rows;
  },
  async listByClient(clienteId) {
    const { rows } = await pool.query(
      `SELECT sc.*, s.descripcion AS servicio_descripcion
      FROM servicios_cliente sc
      JOIN servicios_catalogo s ON s.id = sc.servicio_id
      WHERE sc.cliente_id = $1
      ORDER BY sc.proximo_vencimiento ASC`,
      [clienteId]
    );
    return rows;
  },
  async create(payload) {
    const { rows } = await pool.query(
      `INSERT INTO servicios_cliente
      (cliente_id, servicio_id, fecha_servicio, proximo_vencimiento, importe, observacion, estado)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        payload.cliente_id,
        payload.servicio_id,
        payload.fecha_servicio,
        payload.proximo_vencimiento,
        payload.importe,
        payload.observacion,
        payload.estado
      ]
    );
    return rows[0];
  },
  async update(id, payload) {
    const { rows } = await pool.query(
      `UPDATE servicios_cliente SET
        servicio_id = $1,
        fecha_servicio = $2,
        proximo_vencimiento = $3,
        importe = $4,
        observacion = $5,
        estado = $6
      WHERE id = $7
      RETURNING *`,
      [
        payload.servicio_id,
        payload.fecha_servicio,
        payload.proximo_vencimiento,
        payload.importe,
        payload.observacion,
        payload.estado,
        id
      ]
    );
    return rows[0];
  },
  async remove(id) {
    await pool.query("DELETE FROM servicios_cliente WHERE id = $1", [id]);
  },
  async insertHistory(payload, sourceId = null) {
    await pool.query(
      `INSERT INTO servicios_cliente_historial
      (cliente_id, servicio_id, fecha_servicio, proximo_vencimiento, importe, observacion, source_servicio_cliente_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        payload.cliente_id,
        payload.servicio_id,
        payload.fecha_servicio,
        payload.proximo_vencimiento,
        payload.importe,
        payload.observacion,
        sourceId
      ]
    );
  },
  async historyByClient(clienteId) {
    const { rows } = await pool.query(
      `SELECT h.*, s.descripcion AS servicio_descripcion
      FROM servicios_cliente_historial h
      JOIN servicios_catalogo s ON s.id = h.servicio_id
      WHERE h.cliente_id = $1
      ORDER BY h.created_at DESC`,
      [clienteId]
    );
    return rows;
  },
  async listUpcoming({ startDate, endDate }) {
    const { rows } = await pool.query(
      `SELECT sc.*, c.razon_social, c.email, c.telefono, s.descripcion AS servicio_descripcion
      FROM servicios_cliente sc
      JOIN clientes c ON c.id = sc.cliente_id
      JOIN servicios_catalogo s ON s.id = sc.servicio_id
      WHERE sc.proximo_vencimiento BETWEEN $1 AND $2
      ORDER BY c.razon_social ASC, sc.proximo_vencimiento ASC`,
      [startDate, endDate]
    );
    return rows;
  }
};
