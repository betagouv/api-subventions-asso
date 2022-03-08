import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

export const DATASUB_URL = process.env["DATASUB_URL"] || "http://localhost:8080";
export const MONGO_URL = process.env["MONGO_URL"] || `mongodb://localhost:27017/api-subventions-asso`;
export const SESSION_SECRET = process.env["SESSION_SECRET"];