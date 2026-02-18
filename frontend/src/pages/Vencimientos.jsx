import React, { useEffect, useState } from "react";
import api from "../api.js";
import Modal from "../components/Modal.jsx";

const Vencimientos = () => {
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [rows, setRows] = useState([]);
  const [clients, setClients] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    cliente_id: "",
    servicio_id: "",
    fecha_servicio: "",
    proximo_vencimiento: "",
    importe: "",
    observacion: ""
  });

  const load = async () => {
    const [serviciosRes, clientesRes, catalogoRes] = await Promise.all([
      api.get("/servicios", { params: filters }),
      api.get("/clientes"),
      api.get("/catalogo")
    ]);
    setRows(serviciosRes.data);
    setClients(clientesRes.data);
    setCatalog(catalogoRes.data);
  };

  useEffect(() => {
    load();
  }, [filters.from, filters.to]);

  const openNew = () => {
    setEditingId(null);
    setForm({
      cliente_id: "",
      servicio_id: "",
      fecha_servicio: "",
      proximo_vencimiento: "",
      importe: "",
      observacion: ""
    });
    setIsModalOpen(true);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setForm({
      cliente_id: String(row.cliente_id),
      servicio_id: String(row.servicio_id),
      fecha_servicio: row.fecha_servicio,
      proximo_vencimiento: row.proximo_vencimiento,
      importe: String(row.importe),
      observacion: row.observacion || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      cliente_id: Number(form.cliente_id),
      servicio_id: Number(form.servicio_id),
      fecha_servicio: form.fecha_servicio,
      proximo_vencimiento: form.proximo_vencimiento,
      importe: Number(form.importe),
      observacion: form.observacion,
      estado: "vigente"
    };
    if (editingId) {
      await api.put(`/servicios/${editingId}`, payload);
    } else {
      await api.post("/servicios", payload);
    }
    setIsModalOpen(false);
    setEditingId(null);
    load();
  };

  return (
    <div>
      <div className="header">
        <h2>Vencimientos</h2>
      </div>
      <div className="panel">
        <div className="table-toolbar">
          <div className="filters">
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
            <button onClick={openNew}>Nuevo vencimiento</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Fecha servicio</th>
              <th>Próximo vencimiento</th>
              <th>Importe</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.razon_social}</td>
                <td>{row.servicio_descripcion}</td>
                <td>{row.fecha_servicio}</td>
                <td>{row.proximo_vencimiento}</td>
                <td>{row.importe}</td>
                <td>
                  <button className="secondary" onClick={() => startEdit(row)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title={editingId ? "Editar vencimiento" : "Nuevo vencimiento"} onClose={() => setIsModalOpen(false)}>
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
            <select
              value={form.servicio_id}
              onChange={(event) => setForm((prev) => ({ ...prev, servicio_id: event.target.value }))}
              required
            >
              <option value="">Servicio</option>
              {catalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.descripcion}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.fecha_servicio}
              onChange={(event) => setForm((prev) => ({ ...prev, fecha_servicio: event.target.value }))}
              required
            />
            <input
              type="date"
              value={form.proximo_vencimiento}
              onChange={(event) => setForm((prev) => ({ ...prev, proximo_vencimiento: event.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Importe"
              value={form.importe}
              onChange={(event) => setForm((prev) => ({ ...prev, importe: event.target.value }))}
              required
            />
            <textarea
              placeholder="Observación"
              value={form.observacion}
              onChange={(event) => setForm((prev) => ({ ...prev, observacion: event.target.value }))}
            />
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

export default Vencimientos;
