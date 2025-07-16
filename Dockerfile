# Use official Node.js LTS image
FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Run the app
CMD ["node", "dist/main.js"]