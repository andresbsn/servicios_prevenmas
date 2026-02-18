import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-brand">
          <div>
            <h2>Seguridad Prevenmas</h2>
            <p>Panel operativo para clientes, vencimientos y facturación.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <h3>Ingreso</h3>
          <label>
            Email
            <input name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Contraseña
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          {error && <span className="login-error">{error}</span>}
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
