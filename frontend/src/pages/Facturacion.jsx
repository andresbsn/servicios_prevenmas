import React, { useEffect, useState } from "react";
import api from "../api.js";
import Modal from "../components/Modal.jsx";

const Facturacion = () => {
  const formatDate = (value) => (value ? value.split("T")[0] : "-");
  const [filters, setFilters] = useState({ estado: "", from: "", to: "" });
  const [rows, setRows] = useState([]);
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    cliente_id: "",
    descripcion: "",
    importe: "",
    fecha_emision: "",
    estado: "PENDIENTE",
    fecha_cancelacion: ""
  });

  const load = async () => {
    const [facturasRes, clientesRes] = await Promise.all([
      api.get("/facturas", { params: filters }),
      api.get("/clientes")
    ]);
    setRows(facturasRes.data);
    setClients(clientesRes.data);
  };

  useEffect(() => {
    load();
  }, [filters.estado, filters.from, filters.to]);

  const openNew = () => {
    setEditingId(null);
    const today = new Date().toISOString().slice(0, 10);
    setForm({
      cliente_id: "",
      descripcion: "",
      importe: "",
      fecha_emision: today,
      estado: "PENDIENTE",
      fecha_cancelacion: ""
    });
    setIsModalOpen(true);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setForm({
      cliente_id: String(row.cliente_id),
      descripcion: row.descripcion,
      importe: String(row.importe),
      fecha_emision: row.fecha_emision,
      estado: row.estado,
      fecha_cancelacion: row.fecha_cancelacion || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      cliente_id: Number(form.cliente_id),
      descripcion: form.descripcion,
      importe: Number(form.importe),
      fecha_emision: form.fecha_emision || new Date().toISOString().slice(0, 10),
      estado: form.estado,
      fecha_cancelacion: form.fecha_cancelacion || null
    };
    if (editingId) {
      await api.put(`/facturas/${editingId}`, payload);
    } else {
      await api.post("/facturas", payload);
    }
    setIsModalOpen(false);
    setEditingId(null);
    load();
  };

  return (
    <div>
      <div className="header">
        <h2>Facturación</h2>
      </div>
      <div className="panel">
        <div className="table-toolbar">
          <div className="filters">
            <select
              value={filters.estado}
              onChange={(event) => setFilters((prev) => ({ ...prev, estado: event.target.value }))}
            >
              <option value="">Estado</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="COBRADA">Cobrada</option>
            </select>
            <input
              type="date"
              value={filters.from}
              onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
            />
            <input
              type="date"
              value={filters.to}
              onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
            />
          </div>
          <div className="card-row">
            <span className="table-total">Total: {rows.length}</span>
            <button onClick={openNew}>Nueva factura</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Descripción</th>
              <th>Importe</th>
              <th>Estado</th>
              <th>Emisión</th>
              <th>Cancelación</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.razon_social}</td>
                <td>{row.descripcion}</td>
                <td>{row.importe}</td>
                <td>
                  <span className="badge">{row.estado}</span>
                </td>
                <td>{formatDate(row.fecha_emision)}</td>
                <td>{formatDate(row.fecha_cancelacion)}</td>
                <td>
                  {row.estado === "COBRADA" ? (
                    <span className="table-total">Solo lectura</span>
                  ) : (
                    <button className="secondary" onClick={() => startEdit(row)}>
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title={editingId ? "Editar factura" : "Nueva factura"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <select
              value={form.cliente_id}
              onChange={(event) => setForm((prev) => ({ ...prev, cliente_id: event.target.value }))}
              required
            >
              <option value="">Cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.razon_social}
                </option>
              ))}
            </select>
            <input
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Importe"
              value={form.importe}
              onChange={(event) => setForm((prev) => ({ ...prev, importe: event.target.value }))}
              required
            />
            <select
              value={form.estado}
              onChange={(event) => setForm((prev) => ({ ...prev, estado: event.target.value }))}
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="COBRADA">Cobrada</option>
            </select>
            <input
              type="date"
              value={form.fecha_cancelacion}
              onChange={(event) => setForm((prev) => ({ ...prev, fecha_cancelacion: event.target.value }))}
              placeholder="Fecha de cobro"
            />
            <span className="help-text">Fecha en la que se cobró la factura (opcional).</span>
            <div className="card-row">
              <button type="submit">Guardar</button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Facturacion;
