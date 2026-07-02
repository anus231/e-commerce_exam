# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy package manifests and install all dependencies
COPY package.json ./
COPY frontend/package*.json ./frontend/
RUN npm install --prefix frontend

# Copy frontend source files and compile
COPY frontend/ ./frontend/
RUN npm run build --prefix frontend

# Stage 2: Create the production Express runtime
FROM node:20-alpine
WORKDIR /app

# Copy package manifests for backend and install production-only dependencies
COPY backend/package*.json ./backend/
RUN npm install --prefix backend --only=production

# Copy backend source files
COPY backend/ ./backend/

# Copy the compiled React assets from Stage 1 into the backend public folder
COPY --from=frontend-builder /app/backend/public ./backend/public

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start Express server
CMD ["node", "backend/server.js"]
