import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: `.env.local`, override: true }); //https://stackoverflow.com/a/74622497

export const ENV = process.env.ENV || "dev";
export const DEV = process.env.NODE_ENV !== "production";
