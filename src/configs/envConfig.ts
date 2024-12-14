import dotenv from "dotenv";
import { hostname } from "os";

dotenv.config({
	path: process.env.NODE_ENV === "production" ? ".env" : ".env.local"
});

// eslint-disable-next-line no-unused-vars
const parseBool = (str, valueIfEmpty = false) => {
	if (typeof str === "string" && str.length) {
		return str.toLowerCase() === "true";
	}
	return valueIfEmpty;
};

const {
  NODE_ENV,

  CONFIG_APP_PORT,
	SUBDOMAIN,

	CONFIG_DB_HOST,
	CONFIG_DB_PORT,
	CONFIG_DB_USER,
	CONFIG_DB_PASSWORD,
	CONFIG_DB_NAME,
	CONFIG_DB_MAX_CONNECTIONS,

  CONFIG_REDIS_URL,
	CONFIG_REDIS_HOST,
	CONFIG_REDIS_PORT,
	CONFIG_REDIS_USERNAME,
	CONFIG_REDIS_PASSWORD,
	CONFIG_REDIS_EC_CLUSTER,
	CONFIG_REDIS_DISABLE_TLS,
	CONFIG_REDIS_DISABLE_TLS_REJECT_UNAUTHORIZED,
	CONFIG_REDIS_RECONNECT_MAX_WAIT,

	CONFIG_KAFKA_GROUP_ID,
	CONFIG_KAFKA_BROKERS,
	CONFIG_KAFKA_SSL_ENABLED,
	CONFIG_KAFKA_CLIENT_ID,
	CONFIG_KAFKA_SASL_USERNAME,
	CONFIG_KAFKA_SASL_PASSWORD,
	CONFIG_KAFKA_DISABLE_CONSUMER,
} = process.env;

export const envConfig = {
  ENV: NODE_ENV,
  HOSTNAME: hostname(),

  APP_PORT: parseFloat(CONFIG_APP_PORT || "3000"),
	SUBDOMAIN,

  DB_HOST: CONFIG_DB_HOST,
	DB_PORT: CONFIG_DB_PORT,
	DB_USER: CONFIG_DB_USER,
	DB_PASSWORD: CONFIG_DB_PASSWORD,
	DB_NAME: CONFIG_DB_NAME,
	DB_MAX_CONNECTIONS: CONFIG_DB_MAX_CONNECTIONS,

  REDIS_URL: CONFIG_REDIS_URL,
	REDIS_HOST: CONFIG_REDIS_HOST,
	REDIS_PORT: CONFIG_REDIS_PORT,
	REDIS_USERNAME: CONFIG_REDIS_USERNAME,
	REDIS_PASSWORD: CONFIG_REDIS_PASSWORD,
	REDIS_EC_CLUSTER: parseBool(CONFIG_REDIS_EC_CLUSTER, true),
	REDIS_DISABLE_TLS: parseBool(CONFIG_REDIS_DISABLE_TLS, true),
	REDIS_DISABLE_TLS_REJECT_UNAUTHORIZED: parseBool(CONFIG_REDIS_DISABLE_TLS_REJECT_UNAUTHORIZED, true),
	REDIS_RECONNECT_MAX_WAIT: parseInt(CONFIG_REDIS_RECONNECT_MAX_WAIT || "5000"),

	KAFKA_GROUP_ID: CONFIG_KAFKA_GROUP_ID,
	KAFKA_BROKERS: CONFIG_KAFKA_BROKERS,
	KAFKA_SSL_ENABLED: parseBool(CONFIG_KAFKA_SSL_ENABLED, true),
	KAFKA_CLIENT_ID: CONFIG_KAFKA_CLIENT_ID,
	KAFKA_SASL_USERNAME: CONFIG_KAFKA_SASL_USERNAME,
	KAFKA_SASL_PASSWORD: CONFIG_KAFKA_SASL_PASSWORD,
	KAFKA_DISABLE_CONSUMER: parseBool(CONFIG_KAFKA_DISABLE_CONSUMER, false),
}