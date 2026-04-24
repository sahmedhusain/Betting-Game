# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Define build arguments for Vite (these will be embedded in the JS bundle)
ARG VITE_API_BASE_URL
ARG VITE_APP_NAME
ARG VITE_LEADERBOARD_INTERVAL
ARG VITE_SOUND_DISABLED

# Set environment variables for the build process
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_LEADERBOARD_INTERVAL=$VITE_LEADERBOARD_INTERVAL
ENV VITE_SOUND_DISABLED=$VITE_SOUND_DISABLED

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
