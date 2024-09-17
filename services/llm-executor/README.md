# LLM Executor feature list

- isolated service to handle LLM calls with token throttling
- isolated service to handle LLM calls with rate-limit throttling (todo)
- eager retries to achieve request smoothing
- support multiple models (currently OAI and Anthropic)
- gRPC interface
- isolated deployment via Docker
- persist requests between redployments (todo) -- currently requires an external service (Prefect, maybe?) to re-invoke LLM calls after a redeployment