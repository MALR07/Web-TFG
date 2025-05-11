import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Definir la interfaz de los datos del plato
interface Dish {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

const DishList = () => {
  const [dishes, setDishes] = useState<Dish[]>([]); // Tipamos dishes como un array de Dish
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Dish[]>('http://localhost:3001/platos/available') // Tipamos la respuesta de Axios
      .then(response => setDishes(response.data))
      .catch(error => {
        console.error("Error al obtener los platos:", error);
        setError('Error al obtener los platos');
      });
  }, []);

  return (
    <div className="py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-8">Platos Disponibles</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src={dish.imagen || 'default-image.jpg'} // Fallback si no hay imagen
              alt={dish.nombre}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-center">{dish.nombre}</h3>
            <p className="text-sm text-gray-500 text-center mb-4">{dish.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishList;

