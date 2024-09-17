const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const REDIS_QUEUE_URL = "redis://127.0.0.1:6379";
const client = redis.createClient({ url: REDIS_QUEUE_URL });

client.on("error", (err) => {
    console.error("Redis client not connected to the server:", err);
});

client.on("connect", () => {
    console.info("Redis client connected to the server");
});

client.connect();

module.exports.addTokens = async (queueName, tokens) => {
    const key = `queueName:${queueName}`;
    const timestamp = new Date().getTime();

    await client.hSet(key, {
        queueName: queueName,
        createdAt: timestamp,
        tokens: tokens
    });

    await client.zAdd("queueTimestamps", { score: timestamp, value: key });
}

module.exports.getTokens = async (queueName) => {
    const oneMinuteAgo = new Date().getTime() - 60000;

    const keys = await client.zRangeByScore("queueTimestamps", oneMinuteAgo, Date.now());

    let totalTokens = 0;

    for (const key of keys) {
        const queue = await client.hGetAll(key);
        // Assuming you want to sum the tokens here
        totalTokens += parseInt(queue.tokens, 10);
    }

    return totalTokens;
}