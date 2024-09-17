var PROTO_PATH = __dirname + "/llm-executor.proto";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const { runExample } = require("./logic");
const { bullBoardApp } = require("./bull-board");

// Load the protobuf
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
	runExample();
	callback(null, { status: "QUEUED" });
}


function main() {
	var server = new grpc.Server();
	server.addService(llmExecutorProto.LLMExecutorService.service, { callModel: callModel });
	server.bindAsync("0.0.0.0:50053", grpc.ServerCredentials.createInsecure(), () => {
		console.info("Server running at http://0.0.0.0:50053");
	});

	bullBoardApp.listen(3001, () => {
		console.log("Running on 3001...");
		console.log("For the UI, open http://localhost:3001/admin/queues");
	});
}

main();