import { useState } from "react";
import { useRouter } from "next/router"; // 👈 Importar el router

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter(); // 👈 Inicializar

  const API_URL = "https://proyecto-nose-backend.onrender.com/api/usuarios/login";


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Error en el login");

      // Guardar token
      localStorage.setItem("token", data.token);
      setMensaje("✅ Login exitoso!");

      // Redirigir después de un pequeño retraso
      setTimeout(() => router.push("/tareas"), 1000);
    } catch (error) {
      setMensaje("❌ " + error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #131313ff, #131313ff)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          width: "320px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem", color: "#333" }}>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              marginBottom: "1rem",
              padding: "0.6rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              fontSize: "1rem",
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              marginBottom: "1rem",
              padding: "0.6rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "0.7rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            Ingresar
          </button>
        </form>
        {mensaje && (
          <p
            style={{
              marginTop: "1rem",
              fontWeight: "500",
              color: mensaje.includes("✅") ? "#16a34a" : "#dc2626",
            }}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
