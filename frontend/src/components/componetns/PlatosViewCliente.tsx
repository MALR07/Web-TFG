import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Interfaz para Reserva
interface Reserva {
  id_reserva: number;
  id_plato: number;
  cantidad: number;
  fecha_reserva: string;
  estado: string;
}

// Interfaz para Plato
interface Plato {
  id_plato: number;
  nombre: string;
  descripcion: string;
  imagen?: string;
}

// Interfaz para Comentario
interface Comentario {
  id_comentario: number;
  comentario: string;
  id_user: number;
  id_plato: number;
  createdAt: string;
  id_reserva?: number;
  puntuacion?: number;
  User?: {
    nombre: string;
  };
  Plato?: {
    nombre: string;
  };
}

const HistorialReservas: React.FC = () => {
  const { isAuthenticated, token, user } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState<string>("");
  const [comentarioAbiertoPara, setComentarioAbiertoPara] = useState<number | null>(null);
  const [expandedReserva, setExpandedReserva] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [orden, setOrden] = useState<string>("reciente");
  const [errorMensaje, setErrorMensaje] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Obtener el id_user del localStorage
  const idUser = localStorage.getItem("id_user");

  // Función general para obtener datos de las reservas, platos y comentarios
  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    
    setLoading(true);
    try {
      const reservasResponse = await axios.get("http://localhost:3001/reservas/reservas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const platosResponse = await axios.get("http://localhost:3001/platos/available", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const comentariosResponse = await axios.get("http://localhost:3001/comentarios");

      setReservas(reservasResponse.data.reservas || reservasResponse.data);
      setPlatos(platosResponse.data);
      setComentarios(comentariosResponse.data);
    } catch (error) {
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleReservaDetails = (id: number) => {
    setExpandedReserva(expandedReserva === id ? null : id);
    if (expandedReserva !== id) {
      setComentarioAbiertoPara(null);
      setNuevoComentario("");
      setRating(0);
    }
  };

  const enviarComentario = async (idPlato: number, idReserva: number) => {
    if (!nuevoComentario.trim()) {
      toast.error("Escribe un comentario antes de enviar");
      return;
    }
    if (rating === 0) {
      toast.error("Selecciona una calificación");
      return;
    }

    const comentarioExistente = comentarios.find(
      (c) => c.id_user === Number(idUser) && c.id_plato === idPlato && c.id_reserva === idReserva
    );

    if (comentarioExistente) {
      setErrorMensaje("Ya has comentado este plato.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/comentarios/crear",
        {
          comentario: nuevoComentario,
          puntuacion: rating,
          id_plato: idPlato,
          id_reserva: idReserva,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Comentario enviado");
      setNuevoComentario("");
      setComentarioAbiertoPara(null);
      setRating(0);
      setErrorMensaje("");
      fetchData(); // Volver a obtener los datos actualizados
    } catch (error) {
      toast.error("Error al enviar comentario");
    }
  };

  const eliminarComentario = async (comentarioId: number) => {
    try {
      await axios.delete(`http://localhost:3001/comentarios/${comentarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Comentario eliminado");
      fetchData(); // Volver a obtener los datos actualizados
    } catch (error) {
      toast.error("Error al eliminar comentario");
    }
  };

  const puedeEliminar = (comentario: Comentario): boolean => {
    const creado = new Date(comentario.createdAt).getTime();
    const ahora = new Date().getTime();
    return ahora - creado < 20 * 60 * 1000;
  };

  const renderStars = (currentRating: number, onClick?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={onClick ? () => onClick(star) : undefined}
            className={`text-2xl cursor-pointer ${star <= currentRating ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "text-blue-500";
      case "presentado":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const restarDosHoras = (fecha: string) => {
    const date = new Date(fecha);
    date.setHours(date.getHours() - 2);
    return date.toLocaleString();
  };

  const reservasFiltradas = useMemo(() => {
    return reservas
      .filter((reserva) => {
        if (filtroEstado !== "todos") {
          return reserva.estado === filtroEstado;
        }
        return true;
      })
      .sort((a, b) => {
        if (orden === "reciente") {
          return new Date(b.fecha_reserva).getTime() - new Date(a.fecha_reserva).getTime();
        }
        return new Date(a.fecha_reserva).getTime() - new Date(b.fecha_reserva).getTime();
      });
  }, [reservas, filtroEstado, orden]);

  return (
    <div className="min-h-screen bg-cover bg-fixed bg-center relative" style={{ backgroundImage: "url('fondoreserva.jpeg')" }}>
      <div className="bg-white text-yellow-400 p-4 rounded-md shadow-md mb-6 w-full text-center">
        <h1 className="text-3xl font-bold">Historial de Reservas</h1>
      </div>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setFiltroEstado("todos")} className={`${filtroEstado === "todos" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-800"} px-4 py-2 rounded-md`}>Todos</button>
        <button onClick={() => setFiltroEstado("confirmada")} className={`${filtroEstado === "confirmada" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-800"} px-4 py-2 rounded-md`}>Confirmadas</button>
        <button onClick={() => setFiltroEstado("presentado")} className={`${filtroEstado === "presentado" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-800"} px-4 py-2 rounded-md`}>Presentadas</button>

        <button onClick={() => setOrden("reciente")} className={`${orden === "reciente" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-800"} px-4 py-2 rounded-md`}>Más Reciente</button>
        <button onClick={() => setOrden("antigua")} className={`${orden === "antigua" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-800"} px-4 py-2 rounded-md`}>Más Antigua</button>
      </div>

      {loading ? (
        <p className="text-center text-yellow-500">Cargando...</p>
      ) : reservasFiltradas.length === 0 ? (
        <p className="text-center text-red-600">No tienes reservas aún.</p>
      ) : (
        <div className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-lg mb-8">
          <ul className="space-y-6">
            {reservasFiltradas.map((reserva) => {
              const plato = platos.find((p) => p.id_plato === reserva.id_plato);
              const comentarioExistente = comentarios.find(
                (c) => c.id_user === Number(idUser) && c.id_plato === reserva.id_plato && c.id_reserva === reserva.id_reserva
              );

              return (
                <li key={reserva.id_reserva} className="border rounded-md p-4 shadow-sm bg-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold">{plato?.nombre || "Plato no disponible"}</h2>
                      <p>Fecha reserva: {restarDosHoras(reserva.fecha_reserva)}</p>
                      <p>
                        Estado: <span className={`font-semibold ${getEstadoColor(reserva.estado)}`}>{reserva.estado}</span>
                      </p>
                    </div>
                    <button
                      className="text-blue-600 transition-all duration-300 transform hover:scale-105 hover:text-blue-800"
                      onClick={() => toggleReservaDetails(reserva.id_reserva)}
                    >
                      {expandedReserva === reserva.id_reserva ? "Ver menos" : "Ver más"}
                    </button>
                  </div>

                  <div className={`mt-4 overflow-hidden max-h-0 transition-all duration-500 ease-in-out ${expandedReserva === reserva.id_reserva ? "max-h-screen" : ""}`}>
                    {plato && (
                      <div className="mt-4">
                        {plato.imagen && (
                          <img
                            src={plato.imagen}
                            alt={plato.nombre}
                            className="w-full sm:w-48 sm:h-48 object-cover rounded-md mb-3"
                          />
                        )}
                        <p>{plato.descripcion}</p>
                        <p className="mt-2">Cantidad reservada: {reserva.cantidad}</p>

                        <hr className="my-4" />

                        {comentarioExistente ? (
                          <div className="bg-gray-50 p-4 rounded shadow-sm mt-4">
                            <h3 className="font-semibold mb-2">Tu comentario</h3>
                            <p className="mb-2">{comentarioExistente.comentario}</p>
                            {comentarioExistente.puntuacion !== undefined && (
                              <div className="mb-2">{renderStars(comentarioExistente.puntuacion)}</div>
                            )}
                            {puedeEliminar(comentarioExistente) && (
                              <button
                                onClick={() => eliminarComentario(comentarioExistente.id_comentario)}
                                className="text-red-600 underline transition-all duration-300 hover:scale-105"
                              >
                                Eliminar comentario
                              </button>
                            )}
                          </div>
                        ) : (
                          comentarioAbiertoPara === reserva.id_reserva ? (
                            <div className="mt-4">
                              <h4 className="font-semibold mb-1">Tu calificación</h4>
                              {renderStars(rating, setRating)}

                              <textarea
                                rows={3}
                                className="w-full border rounded-md p-2"
                                placeholder="Escribe tu comentario"
                                value={nuevoComentario}
                                onChange={(e) => setNuevoComentario(e.target.value)}
                              />
                              <button
                                onClick={() => enviarComentario(reserva.id_plato, reserva.id_reserva)}
                                className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-yellow-700 hover:scale-105"
                              >
                                Enviar Comentario
                              </button>
                              <button
                                onClick={() => setComentarioAbiertoPara(null)}
                                className="ml-2 text-gray-500 underline transition-all duration-300 hover:scale-105"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            reserva.estado === "presentado" && (
                              <button
                                onClick={() => setComentarioAbiertoPara(reserva.id_reserva)}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-blue-600 hover:scale-105"
                              >
                                Dejar Comentario
                              </button>
                            )
                          )
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {errorMensaje && (
        <div className="mt-4 text-red-600 text-center">{errorMensaje}</div>
      )}
      <ToastContainer />
    </div>
  );
};

export default HistorialReservas;
