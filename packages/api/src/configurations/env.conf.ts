import dotenv from "dotenv";

dotenv.config();

// do not override jest env var setup
if (process.env.ENV !== "test") dotenv.config({ path: `.env.local`, override: true }); //https://stackoverflow.com/a/74622497

export const ENV = process.env.ENV || "dev";
export const DEV = process.env.NODE_ENV !== "production";
export const DOMAIN = process.env.DOMAIN || undefined;
export const FRONT_OFFICE_URL = process.env.FRONT_OFFICE_URL || "http://dev.local:5173";
export const STALL_RGPD_CRON_6_MONTHS_DELETION = new Date(process.env.STALL_RGPD_CRON_6_MONTHS_DELETION || Date.now());
