import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

interface Plato {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

interface Comentario {
  id: number;
  usuario: string;
  texto: string;
}

const PlatosConComentarios = () => {
  const { user, isAuthenticated } = useAuth();
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [comentarioTexto, setComentarioTexto] = useState<string>("");

  // Cargar los platos disponibles al cargar la página
  useEffect(() => {
    axios
      .get("http://localhost:3001/platos/available")
      .then((response) => setPlatos(response.data))
      .catch((error) => {
        console.error("Error al obtener los platos:", error);
      });
  }, []);

  // Obtener los comentarios de un plato específico
  const obtenerComentarios = (platoId: number) => {
    axios
      .get(`http://localhost:3001/comments/${platoId}`)
      .then((response) => setComentarios(response.data))
      .catch((error) => {
        console.error("Error al obtener los comentarios:", error);
      });
  };

  // Enviar un comentario para un plato
  const enviarComentario = (platoId: number) => {
    if (!isAuthenticated) {
      toast.error("Necesitas estar logueado para comentar.");
      return;
    }

    axios
      .post(
        `http://localhost:3001/comments/${platoId}`,
        { texto: comentarioTexto },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("Comentario enviado con éxito");
        obtenerComentarios(platoId); // Actualiza los comentarios
      })
      .catch((error) => {
        console.error("Error al enviar el comentario:", error);
      });
  };

  // Eliminar un comentario
  const eliminarComentario = (commentId: number, platoId: number) => {
    if (user?.id !== comentarios.find((comment) => comment.id === commentId)?.usuarioId) {
      toast.error("No puedes eliminar un comentario que no creaste.");
      return;
    }

    axios
      .delete(`http://localhost:3001/comments/delete/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        toast.success("Comentario eliminado");
        obtenerComentarios(platoId); // Actualiza los comentarios
      })
      .catch((error) => {
        console.error("Error al eliminar el comentario:", error);
      });
  };

  return (
    <section>
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">Platos Disponibles</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {platos.map((plato) => (
          <div key={plato.id} className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src={plato.imagen || "default-image.jpg"}
              alt={plato.nombre}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-center">{plato.nombre}</h3>
            <p className="text-sm text-gray-500 text-center mb-4">{plato.descripcion}</p>

            {/* Mostrar comentarios */}
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Comentarios</h4>
              <ul>
                {comentarios.map((comentario) => (
                  <li key={comentario.id} className="mb-4">
                    <p>{comentario.texto}</p>
                    <small>{comentario.usuario}</small>
                    {user?.id === comentario.usuarioId && (
                      <button
                        onClick={() => eliminarComentario(comentario.id, plato.id)}
                        className="text-red-500"
                      >
                        Eliminar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {isAuthenticated && (
                <div className="mt-4">
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    placeholder="Escribe tu comentario"
                    value={comentarioTexto}
                    onChange={(e) => setComentarioTexto(e.target.value)}
                  ></textarea>
                  <button
                    onClick={() => enviarComentario(plato.id)}
                    className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-md"
                  >
                    Enviar Comentario
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlatosConComentarios;
