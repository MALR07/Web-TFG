import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../componetns/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AU = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const isEmailValid = /^\S+@\S+\.\S+$/.test(email);
    if (!isEmailValid) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setError('');
    setLoading(true);

    // VALIDACIÓN: verificar que el email exista antes de intentar login
    try {
      const emailsResponse = await axios.get('http://localhost:3001/auth/emails');
      const emails = emailsResponse.data.usuarios.map((u: any) => u.email.toLowerCase());

      if (!emails.includes(email.toLowerCase())) {
        setLoading(false);
        setError('No existe un usuario con ese correo electrónico.');
        return;
      }
    } catch (err) {
      // Si falla esta validación, se permite continuar igual para no bloquear login
      console.error('Error validando email:', err);
    }

    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        login(token);

        const decoded: any = jwtDecode(token);
        const role = decoded.rol || 'cliente';

        if (role === 'camarero') {
          navigate('/manage-reservations');
        } else {
          navigate('/');
        }
      } else {
        setError('Email o contraseña incorrectos.');
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError('Email o contraseña incorrectos.');
        } else if (error.response) {
          setError('Error en el servidor.');
        } else if (error.request) {
          setError('No se pudo conectar al servidor.');
        }
      } else {
        setError('Hubo un problema con el inicio de sesión.');
      }
      console.error('Error en el login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="login"
      className="min-h-screen flex justify-center items-center bg-gray-100 py-16 px-4 relative"
    >
      {/* Fondo con imagen y desenfoque */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 backdrop-blur-md"
        style={{
          backgroundImage: "url('/fondoreserva.jpeg')",
        }}
      ></div>

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg relative z-10">
        {/* Logo arriba */}
        <div className="flex justify-center mb-6">
          <img
            src="/logoBP.jpg"
            alt="Logo Bar Pepin"
            className="w-20 h-20 object-contain"
          />
        </div>

        <h2 className="text-4xl font-semibold text-gray-800 mb-6 text-center">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tu correo"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-left text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Regístrate aquí
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ¿Olvidaste tu contraseña?{' '}
            <a href="/forgot-password" className="text-blue-500 hover:underline">
              Recupérala aquí
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AU;
