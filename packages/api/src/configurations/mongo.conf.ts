export const MONGO_HOST = process.env.MONGO_HOST || "localhost";
export const MONGO_PORT = process.env.MONGO_PORT || "27017";
export const MONGO_USER = process.env.MONGO_USER || "";
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
export const MONGO_DBNAME = process.env.MONGO_DBNAME || "datasubvention";
export const MONGO_URL =
    process.env.MONGO_URL || `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}?replicaSet=rs0`; // MONGO_URL is set by JEST OR SCALINGO if necessary

export const MONGO_METABASE_HOST = process.env.MONGO_METABASE_HOST || "localhost";
export const MONGO_METABASE_PORT = process.env.MONGO_METABASE_PORT || "27017";
export const MONGO_METABASE_USER = process.env.MONGO_METABASE_USER || "";
export const MONGO_METABASE_PASSWORD = process.env.MONGO_METABASE_PASSWORD || "";
export const MONGO_METABASE_AUTH_DBNAME = process.env.MONGO_METABASE_AUTH_DBNAME || "admin";
export const MONGO_METABASE_DBNAME = process.env.MONGO_METABASE_DBNAME || "datasubvention";
export const MONGO_METABASE_URL =
    process.env.MONGO_METABASE_URL ||
    `mongodb://${MONGO_METABASE_HOST}:${MONGO_METABASE_PORT}/${MONGO_METABASE_AUTH_DBNAME}`; // MONGO_URL is set by JEST OR SCALINGO if necessary
