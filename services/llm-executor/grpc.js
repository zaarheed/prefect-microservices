var PROTO_PATH = __dirname + "/llm-executor.proto";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const { run } = require("./logic");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
});
const _packageDefinition = grpc.loadPackageDefinition(packageDefinition);
const llmExecutorProto = _packageDefinition.llm_executor.v1;

// Implement the service methods
async function callModel(call, callback) {
	const { request } = call;
	const { prompt, model_id } = request;

	const response = await run({ prompt, model_id });

	callback(null, response);
}

const server = new grpc.Server();
server.addService(llmExecutorProto.LLMExecutorService.service, { callModel: callModel });

module.exports = server;