# Use the official Python image as a base image
FROM python:3.10-slim

ENV PREFECT_API_URL="http://service-prefect-server:4200/api"

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy requirements.txt if you have other dependencies
# Uncomment the lines below if you have a requirements file
# COPY requirements.txt ./
# RUN pip install --no-cache-dir -r requirements.txt

# Install Prefect
RUN pip install -U prefect

# Copy the current directory contents into the container at /usr/src/app
COPY . .

EXPOSE 4200

# Command to run your Python application (replace app.py with your script)
CMD ["prefect", "server", "start", "--host", "0.0.0.0", "--port", "4200"]