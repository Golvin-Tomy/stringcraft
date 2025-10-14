# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the app
COPY . .

# Expose backend port
EXPOSE 5000

# Use environment variable for Node environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
