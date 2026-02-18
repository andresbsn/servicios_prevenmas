import React, { useEffect, useMemo, useState } from "react";
import api from "../api.js";

const Reportes = () => {
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [rows, setRows] = useState([]);

  const load = async () => {
    const { data } = await api.get("/facturas", {
      params: { estado: "COBRADA", from: filters.from, to: filters.to }
    });
    setRows(data);
  };

  useEffect(() => {
    load();
  }, [filters.from, filters.to]);

  const total = useMemo(
    () => rows.reduce((sum, row) => sum + Number(row.importe || 0), 0),
    [rows]
  );

  const formatDate = (value) => (value ? value.split("T")[0] : "-");

  const handleExport = () => {
    const reportWindow = window.open("", "_blank");
    if (!reportWindow) return;
    const tableRows = rows
      .map(
        (row) => `
        <tr>
          <td>${row.razon_social}</td>
          <td>${row.descripcion}</td>
          <td>${row.importe}</td>
          <td>${formatDate(row.fecha_emision)}</td>
          <td>${formatDate(row.fecha_cancelacion)}</td>
        </tr>`
      )
      .join("");

    reportWindow.document.write(`
      <html>
        <head>
          <title>Reporte de facturas cobradas</title>
          <style>
            body { font-family: 'DM Sans', sans-serif; padding: 24px; color: #0f172a; }
            h1 { font-size: 20px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th, td { border-bottom: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            .meta { color: #64748b; margin-bottom: 16px; }
            .total { font-weight: 600; margin-top: 12px; }
          </style>
        </head>
        <body>
          <h1>Reporte de facturas cobradas</h1>
          <div class="meta">Rango: ${filters.from || "-"} → ${filters.to || "-"}</div>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Descripción</th>
                <th>Importe</th>
                <th>Emisión</th>
                <th>Cobro</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="total">Total cobrado: ${total}</div>
        </body>
      </html>
    `);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  };

  return (
    <div>
      <div className="header">
        <h2>Reportes</h2>
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
            <button onClick={handleExport}>Exportar PDF</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Descripción</th>
              <th>Importe</th>
              <th>Emisión</th>
              <th>Cobro</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td data-label="Cliente">{row.razon_social}</td>
                <td data-label="Descripción">{row.descripcion}</td>
                <td data-label="Importe">{row.importe}</td>
                <td data-label="Emisión">{formatDate(row.fecha_emision)}</td>
                <td data-label="Cobro">{formatDate(row.fecha_cancelacion)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-total" style={{ marginTop: 12 }}>
          Total cobrado: {total}
        </div>
      </div>
    </div>
  );
};

export default Reportes;
