# Use a Node.js base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Expose the Vite development server port
EXPOSE 5173

# Command to start Vite dev server
CMD ["npm", "run", "dev"]