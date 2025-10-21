import { useState, useEffect } from "react";

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  // 🔹 Cargar tareas desde el backend
  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMensaje("⚠️ Debes iniciar sesión para ver tus tareas.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/tareas", {
          headers: {
            "Authorization": `Bearer ${token}`, // ✅ enviamos token
          },
        });

        if (!res.ok) throw new Error("Error en la solicitud");
        const data = await res.json();
        setTareas(data);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
        setMensaje("❌ No se pudieron cargar las tareas 😔");
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
      const res = await fetch("http://localhost:5000/api/tareas", {
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
      const res = await fetch(`http://localhost:5000/api/tareas/${id}`, {
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
              <div>
                <h3>{t.titulo}</h3>
                <p>{t.descripcion}</p>
              </div>
              <button onClick={() => eliminarTarea(t._id)}>Eliminar</button>
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

        input,
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
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
          align-items: center;
          background: white;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
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
