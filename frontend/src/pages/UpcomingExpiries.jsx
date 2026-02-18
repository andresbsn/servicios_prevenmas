import React, { useEffect, useMemo, useState } from "react";
import api from "../api.js";

const UpcomingExpiries = () => {
  const [days, setDays] = useState(20);
  const [rows, setRows] = useState([]);
  const [range, setRange] = useState({ startDate: "", endDate: "" });

  const load = async () => {
    const { data } = await api.get("/servicios/upcoming", { params: { days } });
    setRows(data.rows || []);
    setRange({ startDate: data.startDate, endDate: data.endDate });
  };

  useEffect(() => {
    load();
  }, [days]);

  const grouped = useMemo(() => {
    return rows.reduce((acc, row) => {
      const key = row.cliente_id;
      if (!acc[key]) {
        acc[key] = {
          cliente_id: row.cliente_id,
          razon_social: row.razon_social,
          email: row.email,
          telefono: row.telefono,
          items: []
        };
      }
      acc[key].items.push(row);
      return acc;
    }, {});
  }, [rows]);

  const groups = Object.values(grouped);
  const formatDate = (value) => (value ? value.split("T")[0] : "-");

  return (
    <div>
      <div className="header">
        <h2>Próximos vencimientos</h2>
      </div>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="table-toolbar">
          <div className="filters">
            <label>
              Días
              <input
                type="number"
                min="1"
                value={days}
                onChange={(event) => setDays(Number(event.target.value) || 1)}
              />
            </label>
            <span className="table-total">
              Rango: {range.startDate} → {range.endDate}
            </span>
          </div>
          <span className="table-total">Total: {rows.length}</span>
        </div>
      </div>

      <div className="group-list">
        {groups.map((group) => (
          <div className="group-card" key={group.cliente_id}>
            <div className="group-header">
              <div>
                <strong>{group.razon_social}</strong>
                <div className="group-meta">
                  {group.email || "Sin email"} · {group.telefono || "Sin teléfono"}
                </div>
              </div>
              <span className="table-total">{group.items.length} vencimientos</span>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Próximo vencimiento</th>
                  <th>Importe</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((row) => (
                  <tr key={row.id}>
                    <td data-label="Servicio">{row.servicio_descripcion}</td>
                    <td data-label="Próximo vencimiento">{formatDate(row.proximo_vencimiento)}</td>
                    <td data-label="Importe">{row.importe || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingExpiries;
