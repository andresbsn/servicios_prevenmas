import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="mobile-header">
        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span className="mobile-brand">Seguridad Prevenmas</span>
      </div>

      <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <h1>
            Seguridad Prevenmas
            <span>Gestión operativa</span>
          </h1>
          <button 
            className="menu-close" 
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav>
          <NavLink to="/" end onClick={() => setIsMenuOpen(false)}>
            Resumen
          </NavLink>
          <NavLink to="/clientes" onClick={() => setIsMenuOpen(false)}>Clientes</NavLink>
          <NavLink to="/catalogo" onClick={() => setIsMenuOpen(false)}>Catálogo</NavLink>
          <NavLink to="/proximos-vencimientos" onClick={() => setIsMenuOpen(false)}>Próximos vencimientos</NavLink>
          <NavLink to="/facturacion" onClick={() => setIsMenuOpen(false)}>Facturación</NavLink>
          <NavLink to="/reportes" onClick={() => setIsMenuOpen(false)}>Reportes</NavLink>
          <NavLink to="/configuracion" onClick={() => setIsMenuOpen(false)}>Config</NavLink>
        </nav>
        <button
          className="secondary"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      {isMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>
      )}

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
