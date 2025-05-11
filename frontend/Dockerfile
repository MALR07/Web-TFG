# Etapa 1: Construcción
FROM node:18 AS build

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos package.json y package-lock.json (o npm-shrinkwrap.json)
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar todo el código fuente al contenedor
COPY . .

# Construir el proyecto
RUN npm run build

# Etapa 2: Producción
FROM node:18-slim

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios para la ejecución
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Exponer el puerto en el que la app escuchará
EXPOSE 5173

# Iniciar el servidor de producción
CMD ["npm", "run", "start"]
