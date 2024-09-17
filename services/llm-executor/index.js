var grpc = require("@grpc/grpc-js");
const { bullBoardApp } = require("./bull-board");
const { HTTP_PORT, GRPC_PORT, BULL_BOARD_PORT } = require("./constants");
const http = require("./http");
const grpcApp = require("./grpc");

/**
 * The main() function sets up the GRPC server on GRPC_PORT,
 * the BullBoard GUI on BULL_BOARD_PORT, and the HTTP server on HTTP_PORT.
 */
function main() {	
	http.listen(HTTP_PORT, () => {
		console.log(`Express server running on http://localhost:${HTTP_PORT}`);
	});

	grpcApp.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), () => {
		console.info(`Server running at http://0.0.0.0:${GRPC_PORT}`);
	});

	bullBoardApp.listen(BULL_BOARD_PORT, () => {
		console.log(`Running on ${BULL_BOARD_PORT}...`);
		console.log(`For the UI, open http://localhost:${BULL_BOARD_PORT}/admin/queues`);
	});
}

main();