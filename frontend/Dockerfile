# Etapa 1: Instalar las dependencias
FROM node:20-alpine AS development-dependencies-env

# Copiar el código de la aplicación
WORKDIR /app
COPY . .

# Instalar las dependencias necesarias
RUN npm ci

# Etapa 2: Construir la aplicación
FROM node:20-alpine AS build-env
WORKDIR /app
COPY --from=development-dependencies-env /app /app

# Ejecutar el build para producción
RUN npm run build

# Etapa 3: Servir la aplicación
FROM node:20-alpine

# Copiar los archivos y dependencias necesarias
WORKDIR /app
COPY --from=build-env /app /app

# Exponer el puerto
EXPOSE 5173

# Comando para iniciar la aplicación en producción
CMD ["npm", "run", "dev", "--", "--host"]
