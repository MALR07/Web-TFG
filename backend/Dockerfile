# Usar la imagen oficial de Node.js
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar el archivo de dependencias (package.json)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Exponer el puerto en el que corre la API (3001)
EXPOSE 3001

# Ejecutar migraciones antes de iniciar el servidor
CMD ["sh", "-c","npx sequelize db:migrate && npx nodemon server.js"]