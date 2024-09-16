# Use an official Node.js runtime as a base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the required packages
RUN npm install

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Expose the port the app runs on
EXPOSE 50051

# Command to run the application
CMD ["node", "index.js"]