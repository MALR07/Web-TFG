import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = useState(""); // Campo para nombre completo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailExistsError, setEmailExistsError] = useState("");  // Error para correo ya existente
  const [passwordStrength, setPasswordStrength] = useState(0); // Para almacenar el nivel de seguridad de la contraseña
  const [formError, setFormError] = useState(""); // Error si algún campo está vacío
  const navigate = useNavigate(); // Hook para redirigir

  // Función para comprobar si el correo ya existe
  const checkEmailExists = async (email: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/auth/check-email?email=${email}`);
      return response.data.exists; // Suponiendo que el servidor devuelve { exists: true/false }
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      return false;
    }
  };

  // Función para calcular la seguridad de la contraseña
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    const lengthRegex = /.{8,}/; // Al menos 8 caracteres
    const numberRegex = /\d/; // Contiene números
    const lowerCaseRegex = /[a-z]/; // Contiene letras minúsculas
    const upperCaseRegex = /[A-Z]/; // Contiene letras mayúsculas
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // Contiene caracteres especiales

    if (lengthRegex.test(password)) strength++;
    if (numberRegex.test(password)) strength++;
    if (lowerCaseRegex.test(password)) strength++;
    if (upperCaseRegex.test(password)) strength++;
    if (specialCharRegex.test(password)) strength++;

    setPasswordStrength(strength);
  };

  // Función para obtener el color y el texto de la seguridad de la contraseña
  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { color: "bg-red-500", text: "Contraseña débil" }; // Débil
      case 2:
        return { color: "bg-yellow-500", text: "Contraseña media" }; // Media
      case 3:
      case 4:
        return { color: "bg-green-500", text: "Contraseña fuerte" }; // Fuerte
      default:
        return { color: "bg-gray-500", text: "" }; // Neutral si no hay fuerza
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setEmailExistsError("");  // Limpiar el error de email al intentar enviar
    setFormError(""); // Limpiar error de campos vacíos

    // Validaciones
    if (!fullName || !email || !password || !confirmPassword) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }

    // Validar formato del email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    // Verificar si el correo ya está registrado
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setEmailExistsError("Este correo electrónico ya está registrado.");
      return;
    }

    // Validar longitud de la contraseña
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/auth/register", {
        nombreCompleto: fullName, // Enviar el nombre completo
        email,
        contrasena: password,
      });

      setSuccess("Registro exitoso. ¡Ahora puedes iniciar sesión!");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirigir al login después de un registro exitoso
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirigir después de 2 segundos
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al registrar. Intenta nuevamente.");
      }
    }
  };

  // Llamar a checkPasswordStrength cada vez que se actualiza la contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
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
          {formError && <p className="text-red-500 text-sm mb-2">{formError}</p>}
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
          {emailExistsError && <p className="text-red-500 text-sm mb-2">{emailExistsError}</p>} {/* Mensaje de error por email ya registrado */}

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-left text-gray-700">Nombre Completo</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tu contraseña"
              required
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            
            {/* Bolitas de colores según la seguridad de la contraseña */}
            <div className="flex justify-between mt-2">
              <div className={`w-3 h-3 rounded-full ${getStrengthColor(passwordStrength).color}`}></div>
              <div className={`w-3 h-3 rounded-full ${getStrengthColor(passwordStrength >= 2 ? 2 : 0).color}`}></div>
              <div className={`w-3 h-3 rounded-full ${getStrengthColor(passwordStrength >= 3 ? 3 : 0).color}`}></div>
            </div>
            <p className="text-sm mt-1">{getStrengthColor(passwordStrength).text}</p>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-left text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirma tu contraseña"
              required
            />
            {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Registrarse
          </button>
        </form>

        {/* Mostrar el logo debajo del formulario */}
        {success && (
          <div className="mt-6 text-center">
            <img
              src="/logo.png"  // Asegúrate de tener el logo en esta ruta
              alt="Logo"
              className="mx-auto"
              style={{ width: "150px", height: "auto" }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Register;
