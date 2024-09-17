# Build the Docker image
build:
	docker build -t service-sentinel -f services/sentinel/Dockerfile services/sentinel
	docker build -t service-prefect-server -f services/prefect-server/Dockerfile services/prefect-server
	docker build -t service-api-js -f services/api-js/Dockerfile services/api-js
	docker build -t workflow-test-sentinel -f workflows/test-sentinel/Dockerfile workflows/test-sentinel
	docker build -t service-llm-executor -f services/llm-executor/Dockerfile services/llm-executor

# Run the Docker container
run:
	docker network create posterior-platform || true
	docker run -d --name service-sentinel -p 50051:50051 --env-file .env --network posterior-platform service-sentinel
	docker run -d --name service-prefect-server -p 4200:4200 --env-file .env --network posterior-platform service-prefect-server
	docker run -d --name service-api-js -p 50052:3000 --env-file .env --network posterior-platform service-api-js
	docker run -d --name workflow-test-sentinel -p 4300:4300 --env-file .env --network posterior-platform workflow-test-sentinel
	docker run -d --name service-llm-executor -p 50053:50053 -p 50054:3001 --env-file .env --network posterior-platform service-llm-executor

# Clean up Docker images and containers
clean:
	docker rm -f service-sentinel || true
	docker rmi -f service-sentinel || true
	docker rm -f service-prefect-server || true
	docker rmi -f service-prefect-server || true
	docker rm -f service-api-js || true
	docker rmi -f service-api-js || true
	docker rm -f workflow-test-sentinel || true
	docker rmi -f workflow-test-sentinel || true
	docker network rm posterior-platform || true
	docker rm -f service-llm-executor || true
	docker rmi -f service-llm-executor || true

stop:
	docker stop $(shell docker ps -q)

# Build and run the Docker container
all: build run