var PROTO_PATH = __dirname + "/llm-executor.proto";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const { run } = require("./logic");
const { bullBoardApp } = require("./bull-board");
const express = require("express");
const cors = require("cors");
const { HTTP_PORT, GRPC_PORT, BULL_BOARD_PORT } = require("./constants");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
});
let _packageDefinition = grpc.loadPackageDefinition(packageDefinition);
var llmExecutorProto = _packageDefinition.llm_executor.v1;

// Implement the service methods
async function callModel(call, callback) {
	const { request } = call;
	const { prompt, model_id } = request;

	const response = await run({ prompt, model_id });

	callback(null, response);
}


function main() {
	var server = new grpc.Server();
	server.addService(llmExecutorProto.LLMExecutorService.service, { callModel: callModel });
	server.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), () => {
		console.info(`Server running at http://0.0.0.0:${GRPC_PORT}`);
	});

	bullBoardApp.listen(BULL_BOARD_PORT, () => {
		console.log(`Running on ${BULL_BOARD_PORT}...`);
		console.log(`For the UI, open http://localhost:${BULL_BOARD_PORT}/admin/queues`);
	});

	const app = express();

	app.use(cors());
	app.use(express.json());

	app.get("/call-model", async (request, response) => {
		// handle request
		const { body } = request;
		const { prompt, model_id } = body;
		const result = await run({ prompt, model_id });
		response.json(result);
	});

	app.listen(HTTP_PORT, () => {
		console.log(`Express server running on http://localhost:${HTTP_PORT}`);
	});
}

main();