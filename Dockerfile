# Dockerfile for Railway deployment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN cd backend && npm install

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 3041

# Start the backend server (which serves both API and static files)
CMD ["node", "backend/server.js"]