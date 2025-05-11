import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Interfaces para los datos
interface User {
  nombre: string;
}

interface Comment {
  comentario: string;
  User?: User;
  puntuacion: number;
}

const Comment: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]); // Estado para almacenar los comentarios
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Función para obtener los comentarios desde la API
  const fetchComments = () => {
    axios
      .get<Comment[]>('http://localhost:3001/comentarios') // Tipamos la respuesta como un array de Comment
      .then((response) => {
        // Mezcla de los comentarios utilizando el algoritmo de Fisher-Yates
        const shuffled = [...response.data]; // Copia del array original para evitar modificar el original
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Intercambia elementos
        }
        setComments(shuffled); // Actualizamos el estado con los comentarios aleatorios
      })
      .catch((error) => {
        console.error('Error al obtener los comentarios:', error);
        setError('Error al obtener los comentarios');
      });
  };

  useEffect(() => {
    fetchComments(); // Cargar los comentarios cuando el componente se monta
  }, []); // Este efecto solo se ejecuta una vez cuando el componente se monta

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold">Comentarios:</h4>
      {/* Si hay un error al cargar los comentarios, lo mostramos */}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="text-sm text-gray-600 mb-4">
        {comments.length === 0 ? (
          <p>No hay comentarios aún.</p> // Mensaje si no hay comentarios
        ) : (
          comments.map((comment, idx) => (
            <li key={idx} className="mb-2">
              "{comment.comentario}" - <em>{comment.User?.nombre || 'Anónimo'}</em>
              <div className="text-yellow-400">
                {typeof comment.puntuacion === 'number' && comment.puntuacion > 0
                  ? '⭐'.repeat(comment.puntuacion) // Solo muestra estrellas si la puntuación es un número positivo
                  : 'Sin puntuación'}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Comment;
