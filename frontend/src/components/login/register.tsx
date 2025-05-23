import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setname] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailExistsError, setEmailExistsError] = useState(""); 
  const [passwordStrength, setPasswordStrength] = useState(0); 
  const [formError, setFormError] = useState(""); 
  const [allEmails, setAllEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Nueva variable para saber si los correos están cargados
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar la confirmación de contraseña

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/emails");
        const emails = response.data.usuarios.map((u: any) => u.email.toLowerCase());
        setAllEmails(emails);
        setLoading(false); // Se actualiza el estado cuando los emails están cargados
      } catch (error) {
        console.error("Error al cargar los emails:", error);
        setLoading(false); // Aseguramos que se complete el proceso de carga
      }
    };
    fetchEmails();
  }, []);

  const checkEmailExists = (email: string) => {
    return allEmails.includes(email.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setEmailExistsError("");
    setFormError("");

    if (!name || !email || !password || !confirmPassword) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (loading) {
      setError("Cargando lista de correos. Por favor espera...");
      return;
    }

    if (checkEmailExists(email)) {
      setEmailExistsError("Este correo electrónico ya está registrado.");
      return;
    }

    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/auth/register", {
        nombre: name,
        email,
        contrasena: password,
      });

      setSuccess("Registro exitoso. ¡Ahora puedes iniciar sesión!");
      setname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAllEmails((prev) => [...prev, email.toLowerCase()]);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al registrar. Intenta nuevamente.");
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // Llamar a la función para verificar la fuerza de la contraseña
  };

  return (
    <section id="register" className="min-h-screen flex justify-center items-center bg-gray-100 py-16 px-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 backdrop-blur-md"
        style={{ backgroundImage: "url('/fondoreserva.jpeg')" }}
      ></div>

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg relative z-10">
        <div className="mb-6 text-center">
          <img src="/logoBP.jpg" alt="Logo BAR Pepin" className="mx-auto" style={{ width: "150px", height: "auto" }} />
        </div>

        <h2 className="text-4xl font-semibold text-gray-800 mb-6 text-center">Registrarse</h2>

        <form onSubmit={handleSubmit}>
          {formError && <p className="text-red-500 text-sm mb-2">{formError}</p>}
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
          {emailExistsError && <p className="text-red-500 text-sm mb-2">{emailExistsError}</p>}

          <div className="mb-4">
            <label htmlFor="name" className="block text-left text-gray-700">Nombre Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tu nombre completo"
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
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-left text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Alterna entre texto y contraseña
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Cambia el estado de visibilidad
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-left text-gray-700">Confirmar Contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"} // Alterna entre texto y contraseña
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirma tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Cambia el estado de visibilidad
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Registrarse
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
