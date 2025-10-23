# Imagen base de Node.js
FROM node:18

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir el proyecto Next.js
RUN npm run build

# Exponer el puerto donde se servirá el frontend
EXPOSE 3000

# Iniciar el frontend
CMD ["npm", "start"]
