import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MisReservas = () => {
  const { token, user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [puntuaciones, setPuntuaciones] = useState({});
  const [platos, setPlatos] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [comentarioValido, setComentarioValido] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("nueva");

  const [mostrarComentario, setMostrarComentario] = useState(false);

  useEffect(() => {
    fetchReservas();
    fetchComentarios();
    fetchPlatos();
  }, []);

  useEffect(() => {
    if (nuevoComentario.length > 10) {
      setComentarioValido(true);
    } else {
      setComentarioValido(false);
    }
  }, [nuevoComentario]);

  const fetchReservas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/reservas/reservas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservas(res.data.reservas);
    } catch (err) {
      // Elimina el mensaje de error si no se tienen reservas, ya no mostramos un error.
      console.error("Error al cargar reservas", err);
    }
  };

  const fetchComentarios = async () => {
    try {
      const res = await axios.get("http://localhost:3001/comentarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const comentariosPorPlato = {};
      res.data.forEach((c) => {
        if (c.User.id_user === user.id_user) {
          comentariosPorPlato[c.Plato.id_plato] = {
            id_comentario: c.id_comentario,
            comentario: c.comentario,
            puntuacion: c.puntuacion,
          };
        }
      });
      setComentarios(comentariosPorPlato);
    } catch (err) {
      toast.error("Error al cargar comentarios");
    }
  };

  const fetchPlatos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/platos/available", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlatos(res.data);
    } catch (err) {
      toast.error("Error al cargar platos");
    }
  };

  const handleComentario = async (platoId) => {
    if (!comentarioValido) {
      toast.error("El comentario debe tener más de 10 caracteres");
      return;
    }
    try {
      await axios.post(
        "http://localhost:3001/comentarios/crear",
        {
          comentario: nuevoComentario,
          puntuacion: puntuaciones[platoId] || 5,
          id_plato: platoId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Comentario enviado");
      fetchComentarios();
      setNuevoComentario(""); // Limpiar campo de comentario después de enviar
    } catch (err) {
      toast.error("Error al enviar comentario");
    }
  };

  const handleEliminarComentario = async (idComentario) => {
    toast
      .promise(
        axios.delete(`http://localhost:3001/comentarios/${idComentario}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        {
          pending: "Eliminando comentario...",
          success: "Comentario eliminado",
          error: "Error al eliminar comentario",
        }
      )
      .then(() => fetchComentarios()); // Volver a cargar los comentarios después de eliminar
  };

  const renderEstrellas = (platoId, puntuacion = 0, readOnly = false) => (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={
            !readOnly
              ? () => setPuntuaciones({ ...puntuaciones, [platoId]: n })
              : undefined
          }
          style={{
            cursor: readOnly ? "default" : "pointer",
            color: n <= (readOnly ? puntuacion : puntuaciones[platoId] || 0)
              ? "gold"
              : "gray",
            fontSize: "20px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );

  const reservasFiltradas = reservas
    .filter((r) =>
      r.Plato?.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((r) => (estadoFiltro ? r.estado === estadoFiltro : true))
    .sort((a, b) =>
      ordenFecha === "nueva"
        ? new Date(b.fecha_reserva).getTime() - new Date(a.fecha_reserva).getTime()
        : new Date(a.fecha_reserva).getTime() - new Date(b.fecha_reserva).getTime()
    );

  const obtenerImagenPlato = (id_plato) => {
    const plato = platos.find((p) => p.id_plato === id_plato);
    return plato?.imagen || "";
  };

  // Función para restar 2 horas de la fecha
  const restarHoras = (fecha) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(nuevaFecha.getHours() - 2);
    return nuevaFecha.toLocaleString();
  };

  // Colores por estado
  const getColorPorEstado = (estado) => {
    switch (estado) {
      case "confirmada":
        return "bg-blue-500"; // Color para "Confirmada"
      case "presentado":
        return "bg-green-500"; // Color para "Presentado"
      case "expirada":
        return "bg-red-500"; // Color para "Expirada"
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/fondoreserva.jpeg')" }}
    >
      <ToastContainer />
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">Mis Reservas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por plato"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">Todos los estados</option>
            <option value="confirmada">Confirmada</option>
            <option value="presentado">Presentado</option>
            <option value="expirada">Expirada</option>
          </select>
          <select
            value={ordenFecha}
            onChange={(e) => setOrdenFecha(e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="nueva">Más reciente</option>
            <option value="vieja">Más antigua</option>
          </select>
        </div>

        {reservasFiltradas.length === 0 ? (
          <p className="text-center text-gray-700">No tienes reservas actuales.</p>
        ) : (
          reservasFiltradas.map((reserva) => {
            const comentario = comentarios[reserva.id_plato];
            const yaComentado = Boolean(comentario);
            const puedeComentar = reserva.estado === "presentado";
            const imagen = obtenerImagenPlato(reserva.id_plato);

            return (
              <div
                key={reserva.id_reserva}
                className={`border p-4 rounded-lg shadow-md mb-4 bg-white ${getColorPorEstado(
                  reserva.estado
                )}`}
              >
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {imagen && (
                    <img
                      src={imagen}
                      alt="Imagen del plato"
                      className="w-full md:w-40 h-40 object-cover rounded-lg transition-all"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{reserva.Plato?.nombre}</h3>
                    <p className="text-sm text-gray-600">
                      Fecha: {restarHoras(reserva.fecha_reserva)}
                    </p>
                    <p>Cantidad: {reserva.cantidad}</p>
                    <p>Estado: {reserva.estado}</p>

                    <div className="mt-3">
                      {yaComentado ? (
                        <div>
                          <p className="text-green-600 font-medium">Tu comentario:</p>
                          <p className="italic text-gray-700">"{comentario.comentario}"</p>
                          {renderEstrellas(reserva.id_plato, comentario.puntuacion, true)}
                          <button
                            onClick={() => handleEliminarComentario(comentario.id_comentario)}
                            className="mt-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all"
                          >
                            Eliminar comentario
                          </button>
                        </div>
                      ) : puedeComentar ? (
                        <div>
                          <button
                            onClick={() => setMostrarComentario(!mostrarComentario)}
                            className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition-all"
                          >
                            {mostrarComentario ? "Cancelar" : "Comentar"}
                          </button>
                          <div
                            className={`transition-all duration-1000 ease-in-out mt-4 ${mostrarComentario ? "max-h-screen" : "max-h-0 overflow-hidden"}`}
                          >
                            {mostrarComentario && (
                              <div>
                                <label className="block mb-1 font-medium text-gray-700">Comentario:</label>
                                <textarea
                                  value={nuevoComentario}
                                  onChange={(e) => setNuevoComentario(e.target.value)}
                                  className="p-2 border rounded w-full mb-2 transition-all"
                                  placeholder="Escribe tu comentario..."
                                />
                                {nuevoComentario.length > 0 && nuevoComentario.length <= 10 && (
                                  <p className="text-red-600">
                                    El comentario debe tener más de 10 caracteres
                                  </p>
                                )}
                                <label className="block mb-1 font-medium text-gray-700">Puntuación:</label>
                                {renderEstrellas(reserva.id_plato)}
                                <button
                                  onClick={() => handleComentario(reserva.id_plato)}
                                  className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition-all"
                                  disabled={!comentarioValido}
                                >
                                  Comentar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          Podrás comentar cuando el plato esté presentado.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MisReservas;
