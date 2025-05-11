import React, { useState } from "react";
import axios from "axios";

const AU = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar si los campos están vacíos
    if (!email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    setError("");  // Limpiar cualquier error previo
    setLoading(true);  // Indicamos que la solicitud está en proceso

    try {
      // Hacemos la solicitud POST con las credenciales
      const response = await axios.post("http://localhost:3001/login", {
        email: email,
        password: password,
      });

      // Si la respuesta es exitosa, recibimos el token
      if (response.data.success && response.data.token) {
        // Guardamos el token en localStorage para futuras solicitudes
        localStorage.setItem("authToken", response.data.token);

        // Redirigimos a la página principal
        window.location.href = "/";  // O puedes redirigir a una ruta diferente
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      setError("Hubo un problema con el inicio de sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);  // Finaliza el proceso de carga
    }
  };

  return (
    <section id="login" className="py-16 px-4 bg-gray-100 text-center">
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">Iniciar Sesión</h2>
      
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-gray-700">Correo Electrónico</label>
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
            <label htmlFor="password" className="block text-left text-gray-700">Contraseña</label>
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
            disabled={loading}  // Deshabilitar el botón mientras se hace la solicitud
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta? <a href="/register" className="text-blue-500 hover:underline">Regístrate aquí</a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ¿Olvidaste tu contraseña? <a href="/forgot-password" className="text-blue-500 hover:underline">Recupérala aquí</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AU;
