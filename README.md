# A Barebones Microservice Approach to Prefect Using Docker

## How to Run

1. Navigate to the root directory and run: `make build`
2. Start the service: `make run`
3. Stop the service: `make stop`
4. Clean up: `make clean`

## Principles

### 1. Separate Dockerfile for Each Service and Workflow

Each service and workflow has its own directory and Dockerfile, encapsulating all dependencies. The Dockerfile can be executed locally (from within its directory) or at the repository level using the Makefile in the root directory.

Services and workflows are not limited to specific languages or frameworks. Dependencies at both the OS and kernel levels are explicitly stated in each Dockerfile, ensuring nothing is abstracted.

### 2. Expose Debug Ports for Each Service (To Do)

Each service and workflow can be run in debug mode, either on bare metal or through remote debugging via Docker.

### 3. Zero Dependencies Between Services and Workflows

The Makefile is designed to work from the root directory to manage the entire monorepo. Similarly, the `docker` command should work against each individual Dockerfile.

### 4. Use Python Virtual Environments

This setup suggests using Python virtual environments to manage Python subprojects on bare metal. Although tools like Poetry can handle complex dependency management, simplifying dependencies is often a better solution. The Dockerfile for Python projects copies `requirements.txt` and runs `pip install`, which may negate the need for more complex tools. *(Note: This approach is still under testing.)*

### 5. Inject Environment Variables

Environment variables can be set at build-time, start-time, or run-time. A single `.env` file should be declared at the root of the monorepo and injected (preferably at run-time) into each service. This keeps Docker images as portable snapshots of the code, with Docker as the only dependency.

Having a single `.env` file also promotes variable hygiene, e.g., using `SENTINEL_DB_STRING` instead of multiple variables named `DB_STRING`.

### 6. Exclude Generated Code from the Repository

Generated code, including schemas and `node_modules`, should be excluded using `.gitignore` and `.dockerignore`.
