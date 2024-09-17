const express = require("express");
const Queue = require("bull");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const REDIS_QUEUE_URL = process.env.LLM_EXTRACTOR_REDIS_QUEUE_URL;

const openaiQueue = new Queue("openai-requests", REDIS_QUEUE_URL);
const anthropicQueue = new Queue("anthropic-requests", REDIS_QUEUE_URL);

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(openaiQueue), new BullAdapter(anthropicQueue)],
  serverAdapter: serverAdapter,
});

const app = express();


app.use("/admin/queues", serverAdapter.getRouter());

module.exports.bullBoardApp = app;