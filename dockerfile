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

# Build the Next.js app
RUN npm run build

# Expose the Next.js port
EXPOSE 3000

# Command to start Next.js production server
CMD ["npm", "start"]
