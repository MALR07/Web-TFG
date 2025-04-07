# Usar la imagen oficial de Node.js
FROM node:16

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo de dependencias (package.json)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Exponer el puerto en el que corre la API (3001)
EXPOSE 3001

# Comando para iniciar el servidor
CMD ["npx","nodemon","server.js"]