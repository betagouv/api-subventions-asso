// needs to be js because it is imported before ts build
import "dotenv/config";

export const DATASUB_URL = process.env["DATASUB_URL"] || "http://localhost:8080";
export const MONGO_URL = process.env["MONGO_URL"] || `mongodb://localhost:27017/api-subventions-asso`;
export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const ENV = process.env["ENV"];
export const STATS_URL = process.env["STATS_URL"];
export const PRIVACY_POLICY_URL = process.env["PRIVACY_POLICY_URL"];
