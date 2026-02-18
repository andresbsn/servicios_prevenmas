import React, { useEffect, useState } from "react";
import api from "../api.js";
import Modal from "../components/Modal.jsx";

const emptyForm = {
  codigo: "",
  descripcion: "",
  importe_sugerido: "",
  observacion: "",
  estado: "activo"
};

const Catalogo = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = async () => {
    const { data } = await api.get("/catalogo");
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      importe_sugerido: form.importe_sugerido ? Number(form.importe_sugerido) : null
    };
    if (editingId) {
      await api.put(`/catalogo/${editingId}`, payload);
    } else {
      await api.post("/catalogo", payload);
    }
    setForm(emptyForm);
    setEditingId(null);
    setIsModalOpen(false);
    load();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      codigo: item.codigo,
      descripcion: item.descripcion,
      importe_sugerido: item.importe_sugerido || "",
      observacion: item.observacion || "",
      estado: item.estado
    });
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="header">
        <h2>Catálogo de servicios</h2>
      </div>

      <div className="panel">
        <div className="table-toolbar">
          <div className="filters">
            <span className="table-total">Total: {items.length}</span>
          </div>
          <button onClick={openNew}>Nuevo servicio</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Importe</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.codigo}</td>
                <td>{item.descripcion}</td>
                <td>{item.importe_sugerido || "-"}</td>
                <td>
                  <span className="badge">{item.estado}</span>
                </td>
                <td>
                  <button className="secondary" onClick={() => startEdit(item)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title={editingId ? "Editar servicio" : "Nuevo servicio"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Código"
              value={form.codigo}
              onChange={(event) => setForm((prev) => ({ ...prev, codigo: event.target.value }))}
              required
            />
            <input
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Importe sugerido"
              value={form.importe_sugerido}
              onChange={(event) => setForm((prev) => ({ ...prev, importe_sugerido: event.target.value }))}
            />
            <textarea
              placeholder="Observación"
              value={form.observacion}
              onChange={(event) => setForm((prev) => ({ ...prev, observacion: event.target.value }))}
            />
            <select
              value={form.estado}
              onChange={(event) => setForm((prev) => ({ ...prev, estado: event.target.value }))}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <div className="card-row">
              <button type="submit">Guardar</button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                  setIsModalOpen(false);
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

export default Catalogo;
