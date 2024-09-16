var PROTO_PATH = __dirname + "/sentinel.proto";
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');

// Load the protobuf
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
let _packageDefinition = grpc.loadPackageDefinition(packageDefinition);
var sentinelProto = _packageDefinition.sentinel.v1;

// Implement the service methods
function createCase(call, callback) {
  const caseId = call.request.case_id;
  const description = call.request.description;
  // Here you can add logic to handle the case creation
  callback(null, { status: 'SUCCESS', message: `Case ${caseId} created with description: ${description}` });
}

// Define the server
function main() {
  var server = new grpc.Server();
  server.addService(sentinelProto.SentinelService.service, { createCase: createCase });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server running at http://0.0.0.0:50051');
  });
}

main();