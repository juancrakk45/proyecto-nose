import express from "express";
import {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea,
} from "../controllers/tareaController.js";
import { verificarToken } from "../middleware/authMiddleware.js"; // 👈 Importa esto

const router = express.Router();

// ✅ Proteger las rutas
router.post("/", verificarToken, crearTarea);
router.get("/", verificarToken, obtenerTareas);
router.put("/:id", verificarToken, actualizarTarea);
router.delete("/:id", verificarToken, eliminarTarea);

export default router;
