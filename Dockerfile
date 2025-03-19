# Use the official Node.js image.
FROM node:18-alpine AS development

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY  prod.env package*.json ./

#COPY .npmrc ./

# Install dependencies.
RUN npm install

# Copy the local code to the container image.
COPY . .

# Build the React app.
RUN npm run build

# Copy the local code to the container image.
RUN mv ./dist ./admin
#RUN mkdir -p ./app/admin && mv ./dist/* ./app/admin

# Install `serve` to serve the build directory.
RUN npm install -g serve

# Set the environment variable
ENV APP_SBUI=http://192.168.1.66:6061/sbui

# Set the command to run the application.
CMD ["serve","-l", "4001"]

# Use port to serve the app.
EXPOSE 4001
