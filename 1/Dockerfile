# Usa la imagen oficial de Node.js (puedes usar la versión más reciente o estable)
FROM node:20

# Crear directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar los archivos package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el código fuente del proyecto al contenedor
COPY . .

# Expone el puerto 3000 para Vite
EXPOSE 5173

# Ejecutar el servidor de desarrollo de Vite
CMD ["npm", "run", "dev"]
