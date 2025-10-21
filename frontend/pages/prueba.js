import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Prueba() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Esto hace una petición GET al backend
        const res = await api.get("/");
        setMensaje(res.data.message);
      } catch (error) {
        setMensaje("Error al conectar con backend");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Prueba de conexión</h1>
      <p>{mensaje}</p>
    </div>
  );
}
