export const MAIL_HOST = process.env.MAIL_HOST || "";

export const MAIL_PORT = process.env.MAIL_PORT || "";

export const MAIL_USER = process.env.MAIL_USER || "";

export const MAIL_PASSWORD = process.env.MAIL_PASSWORD || "";

export const LOG_MAIL = "log@datasubvention.beta.gouv.fr";

export const STALL_RGPD_CRON_6_MONTHS_DELETION = new Date(process.env.STALL_RGPD_CRON_6_MONTHS_DELETION || Date.now());
