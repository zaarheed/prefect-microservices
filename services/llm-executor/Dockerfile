# Use an official Node.js runtime as the base image
FROM node:20

# Install Redis
RUN apt-get update && apt-get install -y redis-server

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 50053
EXPOSE 50054

# Create a startup script
RUN echo "#!/bin/bash\nservice redis-server start\nnode index.js" > start.sh && \
    chmod +x start.sh

# Command to run the startup script
CMD ["./start.sh"]