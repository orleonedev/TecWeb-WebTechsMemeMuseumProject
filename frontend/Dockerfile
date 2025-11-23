# Stage 1: Build the React application
FROM node:24-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and any lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output from the build stage to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 5173 to the outside world
EXPOSE 5173

# Nginx will be started automatically by the base image
