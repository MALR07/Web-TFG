import React, { useState } from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Por favor, complete todos los campos.");
    } else {
      setError("");
      // Lógica para registrar al usuario
    }
  };

  return (
    <section id="register" className="py-16 px-4 bg-gray-100 text-center">
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">Registrarse</h2>

      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm">{error}</p>}

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
