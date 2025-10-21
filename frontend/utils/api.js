// frontend/utils/api.js
import axios from "axios";

// Crear instancia de Axios apuntando a tu backend
const api = axios.create({
  baseURL: "http://localhost:5000/api", // <- asegúrate de que coincide con tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token JWT automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
