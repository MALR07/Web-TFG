import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Reserva {
  id_reserva: number;
  id_plato: number;
  cantidad: number;
  fecha_reserva: string;
  estado: string;
}

interface Plato {
  id_plato: number;
  nombre: string;
  descripcion: string;
  imagen?: string;
}

interface Comentario {
  id: number;
  texto: string;
  id_user: number;
  id_plato: number;
  createdAt: string;
  id_reserva?: number;
  rating?: number; // ⭐️ NUEVO
}

const HistorialReservas: React.FC = () => {
  const { isAuthenticated, token, user } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState<string>("");
  const [comentarioAbiertoPara, setComentarioAbiertoPara] = useState<number | null>(null);
  const [expandedReserva, setExpandedReserva] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0); // ⭐️ nuevo

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchReservas();
      fetchPlatos();
      fetchComentarios();
    }
  }, [isAuthenticated, token]);

  const fetchReservas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/reservas/reservas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservas(res.data.reservas || res.data);
    } catch {
      toast.error("Error al cargar reservas");
    }
  };

  const fetchPlatos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/platos/available", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlatos(res.data);
    } catch {
      toast.error("Error al cargar platos");
    }
  };

  const fetchComentarios = async () => {
    try {
      const res = await axios.get("http://localhost:3001/comentarios/");
      setComentarios(res.data);
    } catch {
      toast.error("Error al cargar comentarios");
    }
  };

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
    try {
      await axios.post(
        "http://localhost:3001/comentarios/crear",
        { texto: nuevoComentario, id_plato: idPlato, id_reserva: idReserva, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Comentario enviado");
      setNuevoComentario("");
      setComentarioAbiertoPara(null);
      setRating(0);
      fetchComentarios();
    } catch {
      toast.error("Error al enviar comentario");
    }
  };

  const eliminarComentario = async (comentarioId: number) => {
    try {
      await axios.delete(`http://localhost:3001/comentarios/${comentarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Comentario eliminado");
      fetchComentarios();
    } catch {
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
            className={`text-2xl cursor-pointer ${
              star <= currentRating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Historial de Reservas</h1>
      {reservas.length === 0 ? (
        <p className="text-center">No tienes reservas aún.</p>
      ) : (
        <ul className="space-y-6">
          {reservas.map((reserva) => {
            const plato = platos.find((p) => p.id_plato === reserva.id_plato);
            const comentarioExistente = comentarios.find(
              (c) =>
                c.id_user === user?.id_user &&
                c.id_plato === reserva.id_plato &&
                c.id_reserva === reserva.id_reserva
            );

            return (
              <li
                key={reserva.id_reserva}
                className="border rounded-md p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{plato?.nombre || "Plato no disponible"}</h2>
                    <p>Fecha reserva: {new Date(reserva.fecha_reserva).toLocaleString()}</p>
                    <p>Estado: <span className={`font-semibold ${reserva.estado === "presentado" ? "text-green-600" : "text-gray-600"}`}>{reserva.estado}</span></p>
                  </div>
                  <button
                    className="text-blue-600 underline"
                    onClick={() => toggleReservaDetails(reserva.id_reserva)}
                  >
                    {expandedReserva === reserva.id_reserva ? "Ver menos" : "Ver más"}
                  </button>
                </div>

                {expandedReserva === reserva.id_reserva && plato && (
                  <div className="mt-4">
                    {plato.imagen && (
                      <img
                        src={plato.imagen}
                        alt={plato.nombre}
                        className="w-48 h-48 object-cover rounded-md mb-3"
                      />
                    )}
                    <p>{plato.descripcion}</p>
                    <p className="mt-2">Cantidad reservada: {reserva.cantidad}</p>

                    <hr className="my-4" />

                    {comentarioExistente ? (
                      <div className="bg-gray-50 p-4 rounded shadow-sm mt-4">
                        <h3 className="font-semibold mb-2">Tu comentario</h3>
                        <p className="mb-2">{comentarioExistente.texto}</p>
                        {comentarioExistente.rating !== undefined && (
                          <div className="mb-2">
                            {renderStars(comentarioExistente.rating)}
                          </div>
                        )}
                        {puedeEliminar(comentarioExistente) && (
                          <button
                            onClick={() => eliminarComentario(comentarioExistente.id)}
                            className="text-red-600 underline"
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
                            className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                          >
                            Enviar Comentario
                          </button>
                          <button
                            onClick={() => setComentarioAbiertoPara(null)}
                            className="ml-2 text-gray-500 underline"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        reserva.estado === "presentado" && (
                          <button
                            onClick={() => setComentarioAbiertoPara(reserva.id_reserva)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Dejar Comentario
                          </button>
                        )
                      )
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default HistorialReservas;
