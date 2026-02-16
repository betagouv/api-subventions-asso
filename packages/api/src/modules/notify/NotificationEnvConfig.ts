import { NotificationType } from "./@types/NotificationType";
import { Environment } from "../../configurations/env.conf";

export const NOTIFICATION_ENV_CONFIG = {
    [NotificationType.TEST_EMAIL]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.USER_CREATED]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.USER_DELETED]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.BATCH_USERS_DELETED]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.USER_UPDATED]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.USER_ACTIVATED]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.USER_FORGET_PASSWORD]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.USER_LOGGED]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.USER_ALREADY_EXIST]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.USER_CONFLICT]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.SIGNUP_BAD_DOMAIN]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.FAILED_CRON]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.WARN_NEW_USER_TO_BE_DELETED]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.STATS_NB_REQUESTS]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.BATCH_DEPOSIT_RESUME]: [Environment.PROD],
    [NotificationType.DEPOSIT_UNFINISHED]: [Environment.PROD],
    [NotificationType.DATA_IMPORT_SUCCESS]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.DEPOSIT_SCDL_SUCCESS]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.EXTERNAL_API_ERROR]: [Environment.PROD, Environment.PREPROD],
    [NotificationType.MONGO_CONNECTION_LOST]: [Environment.PROD, Environment.PREPROD],
};
