const express = require("express");
const cors = require("cors");
const { run } = require("./logic");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/call-model", async (request, response) => {
    const { body } = request;
    const { prompt, model_id } = body;
    const result = await run({ prompt, model_id });
    response.json(result);
});

module.exports = app;