import { useState } from "react";
import { useRouter } from "next/router"; // 👈 Importar router

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter(); // 👈 Inicializar

  const API_URL = "https://proyecto-nose-backend.onrender.com/api/usuarios/registro";


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al registrarse");

      setMensaje("✅ Registro exitoso!");

      // Redirigir al login o directamente a tareas
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
        <h1 style={{ marginBottom: "1.5rem", color: "#333" }}>Registro</h1>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
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
            placeholder="Correo electrónico"
            type="email"
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
            placeholder="Contraseña"
            type="password"
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
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              padding: "0.7rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#15803d")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#16a34a")}
          >
            Registrarse
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
