import { envConfig } from '#configs';
import { connectDb, db, logger, redisConfig, redisConnect } from '#helpers';
import { minioClient } from '#helpers/minio.js';
import { initWorkers } from '#workers/';
import { app } from './app.js';
import { IncomingMessage, Server, ServerResponse } from 'http';

let server: null | Server<typeof IncomingMessage, typeof ServerResponse> = null;

const init = async () => {
	await connectDb();

	await redisConnect(redisConfig, logger);

	await minioClient.init();

	await db.init();

	initWorkers();
	
	server = app.listen(envConfig.APP_PORT, () => {
		logger.info(`Listening on ${envConfig.HOSTNAME} http://localhost:${envConfig.APP_PORT}`);
	}) as Server<typeof IncomingMessage, typeof ServerResponse>;
}

const exitHandler = () => {
	if (server !== null) {
		server.close(() => {
			logger.error("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error: Error) => {
	logger.error(`unexpectedErrorHandler ${String(error)}`);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	console.log("SIGTERM received");
	if (server !== null) {
		server.close();
	}
});

init();