# Dockerfile para Desarrollo (con Vite y Node.js)
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia solo los archivos de dependencias para instalar primero
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente del frontend
COPY . .

# Expone el puerto que Vite utiliza (3000 por defecto)
EXPOSE 3000

# Comando que arranca el servidor de desarrollo de Vite
CMD ["npm", "run", "dev"]
