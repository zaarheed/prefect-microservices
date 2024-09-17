const Queue = require("bull");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const Anthropic = require("@anthropic-ai/sdk");
const { addTokens, getTokens } = require("./redis");

dotenv.config();

const REDIS_QUEUE_URL = process.env.LLM_EXTRACTOR_REDIS_QUEUE_URL;

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY
})

// Create separate queues for OpenAI and Anthropic
const openaiQueue = new Queue("openai-requests", REDIS_QUEUE_URL);
const anthropicQueue = new Queue("anthropic-requests", REDIS_QUEUE_URL);


const OPENAI_TOKEN_LIMIT_PER_MINUTE = 40000;
const ANTHROPIC_TOKEN_LIMIT_PER_MINUTE = 40000;


// Process jobs from the OpenAI queue
openaiQueue.process(async (job) => {
	const { prompt, maxTokens } = job.data;
	const tokens = await getTokens("openai-requests");

	if (tokens + maxTokens > OPENAI_TOKEN_LIMIT_PER_MINUTE) {
		console.info(`OpenAI token limit reached. Delaying job for 60 seconds`);
		throw new Error('OpenAI rate limit exceeded');
	}

	try {
		console.info(`Prompt: ${prompt}`);

		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [{ role: 'user', content: prompt }]
		});
		
		console.info(`Response: ${response.choices[0].message.content}`);

		await addTokens("openai-requests", response.usage.total_tokens);

		return response.data;
	} catch (error) {
		console.error('Error processing OpenAI request:', error);
		throw error;
	}
});

// Process jobs from the Anthropic queue
anthropicQueue.process(async (job) => {
	const { prompt, maxTokens } = job.data;

	const tokens = await getTokens("anthropic-requests");

	if (tokens + maxTokens > ANTHROPIC_TOKEN_LIMIT_PER_MINUTE) {
		console.info(`Anthropic token limit reached. Delaying job for 60 seconds`);
		throw new Error('Anthropic rate limit exceeded');
	}

	try {
		console.info(`Prompt: ${prompt}`);
		
		const response = await anthropic.messages.create({
			max_tokens: maxTokens,
			messages: [{ role: 'user', content: prompt }],
			model: "claude-3-sonnet-20240229"
		});

		console.info(`Response: ${response.content[0].text}`);
		
		const estimatedTokens = response.usage.input_tokens + response.usage.output_tokens;
		
		await addTokens("anthropic-requests", estimatedTokens);

		return response.data;
	} catch (error) {
		console.error('Error processing Anthropic request:', error);
		throw error;
	}
});

// Handle failed jobs for both queues
[openaiQueue, anthropicQueue].forEach(queue => {
	queue.on('failed', (job, err) => {
		if (err.message.includes('rate limit exceeded')) {
			job.retry({
				delay: 60000 // Retry after 60 seconds
			});
		}
	});
});

// Function to add a job to the OpenAI queue
async function queueOpenAIRequest(prompt, maxTokens) {
	try {
		const job = await openaiQueue.add({ prompt, maxTokens });
		console.info(`OpenAI job ${job.id} added to queue`);
		return job;
	} catch (error) {
		console.error('Error adding job to OpenAI queue:', error);
	}
}

// Function to add a job to the Anthropic queue
async function queueAnthropicRequest(prompt, maxTokens) {
	try {
		const job = await anthropicQueue.add({ prompt, maxTokens });
		console.info(`Anthropic job ${job.id} added to queue`);
		return job;
	} catch (error) {
		console.error('Error adding job to Anthropic queue:', error);
	}
}

// Example usage
module.exports.run = async (props) => {
	const { prompt, model_id } = props;

	if (model_id === "openai") {
		await queueOpenAIRequest(prompt, 50);
		return { status: "QUEUED" };
	}

	if (model_id === "anthropic") {
		await queueAnthropicRequest(prompt, 50);
		return { status: "QUEUED" };
	}

	const errorMessage = `Model ${model_id} not found`;
	console.warn(errorMessage);
	return { status: "ERROR", message: errorMessage };
}