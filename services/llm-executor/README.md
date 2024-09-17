# LLM Executor Service

## How to run locally

1. From the root directory run `make build && make run`

2. Open Postman and run a RPC command against the URL `http://0.0.0.0:50053/LLMExecutorService/CallModel` (use the `.proto` from `/services/llm-executor/llm-executor.proto` if needed). The payload can be `{ model_id: 'openai', prompt: 'YOUR_PROMPT_HERE' }`

3. Watch the queue execute at `http://localhost:50054/admin/queues`

4. Spam the invoke button on Postman to observe request smoothing

## LLM Executor feature list

- isolated service to handle LLM calls with token throttling
- isolated service to handle LLM calls with rate-limit throttling (todo)
- eager retries to achieve request smoothing
- support multiple models (currently OAI and Anthropic)
- gRPC interface
- isolated deployment via Docker
- persist requests between redployments (todo) -- currently requires an external service (Prefect, maybe?) to re-invoke LLM calls after a redeployment