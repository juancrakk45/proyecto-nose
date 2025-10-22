import Tarea from "../models/Tarea.js";

// 📌 Crear tarea
export const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ mensaje: "El título es obligatorio" });
    }
    const nuevaTarea = new Tarea({
      titulo,
      descripcion: descripcion || "",
      usuario: req.usuario.id,
    });
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear tarea" });
  }
};

// 📋 Obtener tareas del usuario autenticado
export const obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({ usuario: req.usuario.id });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener tareas" });
  }
};

// ✏️ Editar tarea
export const actualizarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });

    if (tarea.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: "No autorizado" });
    }

    tarea.titulo = req.body.titulo || tarea.titulo;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.completada =
      req.body.completada !== undefined ? req.body.completada : tarea.completada;

    const tareaActualizada = await tarea.save();
    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar tarea" });
  }
};

// 🗑️ Eliminar tarea
export const eliminarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });

    if (tarea.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: "No autorizado" });
    }

    await tarea.deleteOne();
    res.json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar tarea" });
  }
};
