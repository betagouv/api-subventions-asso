export const MONGO_HOST = process.env.MONGO_HOST || "localhost";
export const MONGO_PORT = process.env.MONGO_PORT || "27017";
export const MONGO_USER = process.env.MONGO_USER || "";
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
export const MONGO_DBNAME = process.env.MONGO_DBNAME || 'api-subventions-asso';
export const MONGO_URL = process.env.MONGO_URL || `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}` // MONGO_URL is set by JEST OR SCALINGO if necessary