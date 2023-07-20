import { env } from '$env/dynamic/public';

export const DATASUB_URL = env["DATASUB_URL"] || "http://localhost:8080";
export const MONGO_URL = env["MONGO_URL"] || `mongodb://localhost:27017/api-subventions-asso`;
export const SESSION_SECRET = env["SESSION_SECRET"];
export const ENV = env["ENV"];
export const STATS_URL = env["STATS_URL"];
export const PRIVACY_POLICY_URL = env["PRIVACY_POLICY_URL"];
