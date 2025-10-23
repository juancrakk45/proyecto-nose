import { useState, useEffect } from "react";

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  // --- Nuevos estados para edición ---
  const [editingId, setEditingId] = useState(null);
  const [editarTitulo, setEditarTitulo] = useState("");
  const [editarDescripcion, setEditarDescripcion] = useState("");

  // 🔹 Cargar tareas desde el backend
  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMensaje("⚠️ Debes iniciar sesión para ver tus tareas.");
          return;
        }

        const res = await fetch("https://proyecto-nose-backend.onrender.com/api/tareas", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // Intenta obtener el mensaje del backend si existe
          let msg = "Error en la solicitud";
          try {
            const errorData = await res.json();
            if (errorData && errorData.mensaje) msg = errorData.mensaje;
          } catch {}
          // Si el error es de autenticación, borra el token y muestra mensaje especial
          if (res.status === 401) {
            localStorage.removeItem("token");
            setMensaje("⚠️ Tu sesión expiró. Por favor inicia sesión nuevamente.");
            return;
          }
          throw new Error(msg + ` (status: ${res.status})`);
        }
        const data = await res.json();
        setTareas(data);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
        setMensaje(`❌ ${error.message}`);
      }
    };
    fetchTareas();
  }, []);

  // 🔹 Crear nueva tarea
  const agregarTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("⚠️ Debes iniciar sesión para crear tareas.");
      return;
    }

    const tarea = { titulo: nuevaTarea, descripcion };

    try {
      const res = await fetch("https://proyecto-nose-backend.onrender.com/api/tareas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ enviamos token
        },
        body: JSON.stringify(tarea),
      });

      if (res.ok) {
        const nueva = await res.json();
        setTareas([...tareas, nueva]);
        setNuevaTarea("");
        setDescripcion("");
        setMensaje("✅ Tarea agregada correctamente");
      } else {
        setMensaje("❌ Error al crear la tarea");
      }
    } catch (error) {
      console.error("Error al agregar tarea:", error);
      setMensaje("⚠️ Error al conectar con el servidor 😵");
    }
  };

  // 🔹 Eliminar tarea
  const eliminarTarea = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("⚠️ Debes iniciar sesión para eliminar tareas.");
      return;
    }

    try {
      const res = await fetch(`https://proyecto-nose-backend.onrender.com/api/tareas/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // ✅ enviamos token
        },
      });

      if (res.ok) {
        setTareas(tareas.filter((t) => t._id !== id));
        setMensaje("🗑️ Tarea eliminada correctamente");
      } else {
        setMensaje("❌ No se pudo eliminar la tarea");
      }
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      setMensaje("⚠️ Error al conectar con el servidor");
    }
  };

  // Iniciar edición para una tarea
  const iniciarEdicion = (t) => {
    setEditingId(t._id);
    setEditarTitulo(t.titulo || "");
    setEditarDescripcion(t.descripcion || "");
    setMensaje("");
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setEditarTitulo("");
    setEditarDescripcion("");
  };

  // Guardar edición (PUT)
  const guardarEdicion = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("⚠️ Debes iniciar sesión para editar tareas.");
      return;
    }
    try {
      const res = await fetch(`https://proyecto-nose-backend.onrender.com/api/tareas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo: editarTitulo, descripcion: editarDescripcion }),
      });

      if (!res.ok) {
        setMensaje("❌ Error al actualizar la tarea");
        return;
      }

      const actualizada = await res.json();
      setTareas(tareas.map((t) => (t._id === id ? actualizada : t)));
      setMensaje("✏️ Tarea actualizada correctamente");
      cancelarEdicion();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      setMensaje("⚠️ Error al conectar con el servidor");
    }
  };

  return (
    <div className="contenedor">
      <h1>📝 Gestor de Tareas</h1>

      <form onSubmit={agregarTarea} className="formulario">
        <input
          type="text"
          placeholder="Título de la tarea"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button type="submit">Agregar Tarea</button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <ul className="lista">
        {tareas.length > 0 ? (
          tareas.map((t) => (
            <li key={t._id} className="tarea">
              <div className="contenido">
                {editingId === t._id ? (
                  <>
                    <input
                      type="text"
                      value={editarTitulo}
                      onChange={(e) => setEditarTitulo(e.target.value)}
                    />
                    <textarea
                      value={editarDescripcion}
                      onChange={(e) => setEditarDescripcion(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <h3>{t.titulo}</h3>
                    <p>{t.descripcion}</p>
                  </>
                )}
              </div>

              <div className="acciones">
                {editingId === t._id ? (
                  <>
                    <button className="guardar" onClick={() => guardarEdicion(t._id)}>
                      Guardar
                    </button>
                    <button className="cancelar" onClick={cancelarEdicion}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button className="editar" onClick={() => iniciarEdicion(t)}>
                      Editar
                    </button>
                    <button onClick={() => eliminarTarea(t._id)}>Eliminar</button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="vacio">No hay tareas aún 😴</p>
        )}
      </ul>

      <style jsx>{`
        .contenedor {
          max-width: 700px;
          margin: 40px auto;
          padding: 20px;
          background: #f7f7f7;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
          color: #222;
        }

        .formulario {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 25px;
        }

        /* Ajustes: aplicar box-sizing y un estilo consistente a input y textarea */
        input,
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
          box-sizing: border-box; /* evita desalineos causados por padding/borde */
        }

        /* Específico para textarea: quitar la manija de redimensión y mejorar el comportamiento */
        textarea {
          resize: none;            /* quita las "rallitas" de redimensionamiento */
          min-height: 100px;      /* altura inicial agradable */
          line-height: 1.4;
          overflow: auto;         /* muestra scroll interno si se sobrepasa el contenido */
          -webkit-appearance: none;
        }

        button {
          background-color: #007bff;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s;
        }

        button:hover {
          background-color: #0056b3;
        }

        .lista {
          list-style: none;
          padding: 0;
        }

        .tarea {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: white;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
        }

        .contenido {
          flex: 1;
          margin-right: 10px;
        }

        .tarea h3 {
          margin: 0;
          color: #333;
        }

        .tarea p {
          margin: 5px 0 0;
          color: #666;
          font-size: 14px;
        }

        .acciones {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .acciones button {
          padding: 6px 10px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }

        .acciones .editar {
          background: #ffc107;
          color: #1a1a1a;
        }

        .acciones .guardar {
          background: #28a745;
          color: white;
        }

        .acciones .cancelar {
          background: #6c757d;
          color: white;
        }

        .acciones button:hover {
          opacity: 0.9;
        }

        .mensaje {
          text-align: center;
          color: #007bff;
          margin-bottom: 10px;
        }

        .vacio {
          text-align: center;
          color: #999;
        }
      `}</style>
    </div>
  );
}
