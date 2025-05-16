import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../components/componetns/AuthContext.tsx';

const Usuarios: React.FC = () => {
  const { token } = useAuth(); // Obtener el token de autenticación
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('cliente');
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Función para obtener la lista de usuarios
  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3001/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data.usuarios);
    } catch (err) {
      setError('Error al obtener los usuarios.');
    }
  };

  // Función para crear o editar un usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const userData = { nombre, email, contrasena, rol };
      if (editUserId) {
        // Si estamos editando un usuario
        await axios.put(`http://localhost:3001/usuarios/${editUserId}`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage('Usuario actualizado exitosamente.');
      } else {
        // Si estamos creando un nuevo usuario
        await axios.post('http://localhost:3001/usuarios', userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage('Usuario creado exitosamente.');
      }
      setLoading(false);
      setNombre('');
      setEmail('');
      setContrasena('');
      setRol('cliente');
      setEditUserId(null);
      fetchUsuarios(); // Refrescamos la lista de usuarios
    } catch (err) {
      setError('Error al crear o actualizar el usuario.');
      setLoading(false);
    }
  };

  // Función para manejar la edición de un usuario
  const handleEdit = (usuario: any) => {
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setContrasena('');
    setRol(usuario.rol);
    setEditUserId(usuario.id_user);
  };

  // Función para eliminar un usuario
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await axios.delete(`http://localhost:3001/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsuarios(); // Refrescamos la lista después de eliminar
      } catch (err) {
        setError('Error al eliminar el usuario.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100"> {/* Fondo gris claro para la página */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen">
        <h1 className="text-2xl font-semibold mb-6 text-center">Gestión de Usuarios</h1>
        
        {/* Formulario para crear/actualizar un usuario */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <h2 className="text-xl font-medium">{editUserId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>

          {/* Cuadrícula para el formulario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="nombre" className="block">Nombre</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contrasena" className="block">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rol" className="block">Rol</label>
              <select
                id="rol"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="cliente">Cliente</option>
                <option value="camarero">Camarero</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>

        {/* Tabla de usuarios */}
        <div className="overflow-x-auto">
          <h2 className="text-xl font-medium mb-4">Lista de Usuarios</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Rol</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id_user} className="border-t">
                  <td className="px-4 py-2">{usuario.nombre}</td>
                  <td className="px-4 py-2">{usuario.email}</td>
                  <td className="px-4 py-2">{usuario.rol}</td>
                  <td className="px-4 py-2 flex space-x-4">
                    <button
                      onClick={() => handleEdit(usuario)}
                      className="text-blue-500 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(usuario.id_user)}
                      className="text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
