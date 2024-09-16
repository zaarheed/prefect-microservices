# Use the official Python image as the base image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PREFECT_API_URL="http://service-prefect-server:4200/api"

# Set work directory
WORKDIR /usr/src/app

# Copy the requirements file into the container
COPY requirements.txt /usr/src/app/

# Install dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy the application code into the container
COPY . /usr/src/app/

# Expose the relevant port (if needed)
EXPOSE 4300

# Define the command to run Prefect client
CMD ["python", "main.py"]