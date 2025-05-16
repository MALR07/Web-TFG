import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/auth/register", {
        nombre: name,
        email,             // ✅ Usa "email"
        contrasena: password,  // ✅ Usa "contrasena" (sin ñ)
      });

      setSuccess("Registro exitoso. ¡Ahora puedes iniciar sesión!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al registrar. Intenta nuevamente.");
      }
    }
  };

  return (
    <section
      id="register"
      className="min-h-screen flex justify-center items-center bg-gray-100 py-16 px-4 relative"
    >
      {/* Fondo con imagen y desenfoque */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 backdrop-blur-md"
        style={{
          backgroundImage: "url('/fondoreserva.jpeg')", // Cambia esta URL por la imagen que quieras usar
        }}
      ></div>

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg relative z-10">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6 text-center">Registrarse</h2>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

          <div className="mb-4">
            <label htmlFor="name" className="block text-left text-gray-700">Nombre Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tu nombre"
              required
            />
          </div>

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
          >
            Registrarse
          </button>
        </form>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            ¿Ya tienes cuenta? <a href="/login" className="text-blue-500 hover:underline">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
