import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MisReservas = () => {
  const { token, user } = useAuth(); // user.id_user
  const [reservas, setReservas] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [puntuaciones, setPuntuaciones] = useState({});

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("nueva");

  useEffect(() => {
    fetchReservas();
    fetchComentarios();
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/reservas/reservas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservas(response.data.reservas);
    } catch (err) {
      toast.error("Error al cargar reservas");
    }
  };

  const fetchComentarios = async () => {
    try {
      const res = await axios.get("http://localhost:3001/comentarios", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filtrar solo comentarios hechos por el usuario actual
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

  const handleComentario = async (platoId) => {
    const comentario = prompt("Escribe tu comentario:");
    if (!comentario) return;

    try {
      await axios.post(
        "http://localhost:3001/comentarios/crear",
        {
          comentario,
          puntuacion: puntuaciones[platoId] || 5,
          id_plato: platoId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Comentario enviado");
      fetchComentarios();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al enviar comentario");
    }
  };

  const handleEliminarComentario = async (idComentario) => {
    if (!window.confirm("¿Eliminar comentario?")) return;

    try {
      await axios.delete(`http://localhost:3001/comentarios/${idComentario}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Comentario eliminado");
      fetchComentarios();
    } catch (err) {
      toast.error("Error al eliminar comentario");
    }
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
        ? new Date(b.fecha_reserva) - new Date(a.fecha_reserva)
        : new Date(a.fecha_reserva) - new Date(b.fecha_reserva)
    );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">Mis Reservas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por plato"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-2 border rounded"
        />

        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="presentado">Presentado</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <select
          value={ordenFecha}
          onChange={(e) => setOrdenFecha(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="nueva">Más reciente</option>
          <option value="vieja">Más antigua</option>
        </select>
      </div>

      {reservasFiltradas.length === 0 ? (
        <p className="text-center">No hay reservas que coincidan.</p>
      ) : (
        reservasFiltradas.map((reserva) => {
          const comentario = comentarios[reserva.id_plato];
          const yaComentado = Boolean(comentario);
          const puedeComentar = reserva.estado === "presentado";

          return (
            <div
              key={reserva.id_reserva}
              className="border p-4 rounded shadow mb-4 bg-white"
            >
              <div className="flex justify-between items-center flex-wrap">
                <div>
                  <h3 className="text-lg font-semibold">
                    {reserva.Plato?.nombre}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Fecha: {new Date(reserva.fecha_reserva).toLocaleString()}
                  </p>
                  <p>Cantidad: {reserva.cantidad}</p>
                  <p>Estado: {reserva.estado}</p>
                </div>
              </div>

              <div className="mt-3">
                {yaComentado ? (
                  <div>
                    <p className="text-green-600 font-medium">Tu comentario:</p>
                    <p className="italic text-gray-700">"{comentario.comentario}"</p>
                    {renderEstrellas(reserva.id_plato, comentario.puntuacion, true)}
                    <button
                      onClick={() => handleEliminarComentario(comentario.id_comentario)}
                      className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar comentario
                    </button>
                  </div>
                ) : puedeComentar ? (
                  <div>
                    <label className="block mb-1 font-medium">Puntuación:</label>
                    {renderEstrellas(reserva.id_plato)}
                    <button
                      onClick={() => handleComentario(reserva.id_plato)}
                      className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      Comentar
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Podrás comentar cuando el plato esté presentado.
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MisReservas;
