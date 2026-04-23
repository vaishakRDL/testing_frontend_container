# Stage 1: Build the React application
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
# install dependencies while ignoring peer dependency conflicts
# (necessary because the project mixes MUI v4 and v5 packages)
RUN npm install --legacy-peer-deps
COPY . .
# increase node heap size during build to avoid out-of-memory errors
ENV NODE_OPTIONS=--max-old-space-size=4096
# Set API URL for the build
ARG REACT_APP_API_URL=/api/
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN echo "Building with REACT_APP_API_URL=${REACT_APP_API_URL}"
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*
# Copy build artifacts from build-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
