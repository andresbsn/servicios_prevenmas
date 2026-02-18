import { pool } from "../db/pool.js";

export const catalogRepo = {
  async list() {
    const { rows } = await pool.query(
      "SELECT * FROM servicios_catalogo ORDER BY descripcion ASC"
    );
    return rows;
  },
  async findById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM servicios_catalogo WHERE id = $1",
      [id]
    );
    return rows[0];
  },
  async create(payload) {
    const { rows } = await pool.query(
      `INSERT INTO servicios_catalogo
      (codigo, descripcion, importe_sugerido, observacion, estado)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        payload.codigo,
        payload.descripcion,
        payload.importe_sugerido,
        payload.observacion,
        payload.estado
      ]
    );
    return rows[0];
  },
  async update(id, payload) {
    const { rows } = await pool.query(
      `UPDATE servicios_catalogo SET
        codigo = $1,
        descripcion = $2,
        importe_sugerido = $3,
        observacion = $4,
        estado = $5
      WHERE id = $6
      RETURNING *`,
      [
        payload.codigo,
        payload.descripcion,
        payload.importe_sugerido,
        payload.observacion,
        payload.estado,
        id
      ]
    );
    return rows[0];
  },
  async remove(id) {
    await pool.query("DELETE FROM servicios_catalogo WHERE id = $1", [id]);
  }
};
