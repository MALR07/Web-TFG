import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/componetns/AuthContext.tsx';
import 'react-toastify/dist/ReactToastify.css';

const PlatosManagement: React.FC = () => {
  const [platos, setPlatos] = useState<any[]>([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidadDisponible: 0,
    imagen: null as File | null,
    imagenUrl: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editPlatoId, setEditPlatoId] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [platoToDelete, setPlatoToDelete] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const baseURL = 'http://localhost:3001/platos';
  const navigate = useNavigate();
  const { token, role } = useAuth();

  useEffect(() => {
    if (!token || !role) {
      toast.error('No estás autenticado');
      navigate('/login');
      return;
    }

    if (role !== 'camarero') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/');
      return;
    }

    fetchPlatos();
  }, [token, role, navigate]);

  const fetchPlatos = async () => {
    try {
      const response = await axios.get(`${baseURL}/available`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlatos(response.data);
    } catch (error) {
      setErrorMessage('Error al obtener los platos');
      console.error(error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombreFiltro(e.target.value);
  };

  const handleDelete = async () => {
    console.log('Plato a eliminar con ID:', platoToDelete); // Verifica que platoToDelete es el id_plato

    if (platoToDelete != null) {
      try {
        const response = await axios.delete(`${baseURL}/delete/${platoToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setPlatos((prevPlatos) => prevPlatos.filter((plato) => plato.id_plato !== platoToDelete)); // Filtramos por id_plato
          setShowConfirmDelete(false);
          setSuccessMessage('Plato eliminado exitosamente');
        } else {
          setErrorMessage('No se pudo eliminar el plato');
        }
      } catch (error) {
        setErrorMessage('Error al eliminar el plato');
        console.error(error);
      }
    } else {
      setErrorMessage('ID del plato no encontrado');
    }
  };

  const handleEditClick = (plato: any) => {
    setFormData({
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      cantidadDisponible: plato.cantidad_disponible,
      imagen: null,
      imagenUrl: plato.imagen || '',
    });
    setEditPlatoId(plato.id_plato);  // Cambiado a plato.id_plato
    setEditMode(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        imagen: files[0],
        imagenUrl: '',
      }));
    }
  };

  const handleImagenUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      imagenUrl: e.target.value,
      imagen: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, descripcion, cantidadDisponible, imagen, imagenUrl } = formData;

    const form = new FormData();
    form.append('nombre', nombre);
    form.append('descripcion', descripcion);
    form.append('cantidad_disponible', cantidadDisponible.toString());

    if (imagenUrl) {
      form.append('imagen_url', imagenUrl);
    } else if (imagen) {
      form.append('imagen', imagen);
    }

    try {
      let response;
      if (editMode && editPlatoId) {
        response = await axios.put(`${baseURL}/update/${editPlatoId}`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage('Plato actualizado exitosamente');
        setPlatos((prevPlatos) =>
          prevPlatos.map((plato) => (plato.id_plato === editPlatoId ? response.data.plato : plato))  // Cambiado a id_plato
        );
      } else {
        response = await axios.post(`${baseURL}/add`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage('Plato añadido exitosamente');
        setPlatos((prevPlatos) => [...prevPlatos, response.data.plato]);
      }

      setFormData({
        nombre: '',
        descripcion: '',
        cantidadDisponible: 0,
        imagen: null,
        imagenUrl: '',
      });
      setEditMode(false);
      setEditPlatoId(null);
      fetchPlatos();

    } catch (error) {
      setErrorMessage('Error al guardar el plato');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h2 className="text-center text-3xl mb-6">Gestión de Platos</h2>

      <input
        type="text"
        placeholder="Filtrar por nombre"
        value={nombreFiltro}
        onChange={handleFilterChange}
        className="w-full p-3 mb-6 rounded-md border border-gray-300"
      />

      {errorMessage && <div className="bg-red-500 text-white p-3 rounded mb-4">{errorMessage}</div>}
      {successMessage && <div className="bg-green-500 text-white p-3 rounded mb-4">{successMessage}</div>}

      <table className="w-full table-auto mb-6">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-2 px-4">Nombre</th>
            <th className="py-2 px-4">Descripción</th>
            <th className="py-2 px-4">Cantidad</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {platos
            .filter((plato) =>
              plato.nombre.toLowerCase().includes(nombreFiltro.toLowerCase())
            )
            .map((plato) => (
              <tr key={plato.id_plato} className="border-b">  {/* Cambiado de plato.id a plato.id_plato */}
                <td className="py-2 px-4">{plato.nombre}</td>
                <td className="py-2 px-4">{plato.descripcion}</td>
                <td className="py-2 px-4">{plato.cantidad_disponible}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button onClick={() => handleEditClick(plato)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Editar
                  </button>
                  <button onClick={() => {
                    console.log('Plato seleccionado para eliminar:', plato.id_plato);  // Log adicional para verificar el plato
                    setPlatoToDelete(plato.id_plato);  // Cambiado a plato.id_plato
                    setShowConfirmDelete(true);
                  }} className="bg-red-500 text-white px-3 py-1 rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showConfirmDelete && (
        <div className="bg-yellow-200 p-4 rounded mb-4 text-center">
          <p>¿Seguro que quieres eliminar este plato?</p>
          <div className="flex justify-center gap-4 mt-2">
            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Confirmar</button>
            <button onClick={() => setShowConfirmDelete(false)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4 bg-gray-100 p-6 rounded shadow">
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          placeholder="Descripción"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="cantidadDisponible"
          value={formData.cantidadDisponible}
          onChange={handleInputChange}
          placeholder="Cantidad Disponible"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="URL de imagen (opcional)"
          value={formData.imagenUrl}
          onChange={handleImagenUrlChange}
          className="p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editMode ? 'Actualizar Plato' : 'Agregar Plato'}
        </button>
      </form>
    </div>
  );
};

export default PlatosManagement;
