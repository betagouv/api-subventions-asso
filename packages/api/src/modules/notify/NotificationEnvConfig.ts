import { NotificationType } from "./@types/NotificationType";
import { EnvironmentEnum } from "../../configurations/env.conf";

export const NOTIFICATION_ENV_CONFIG = {
    [NotificationType.TEST_EMAIL]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.USER_CREATED]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.USER_DELETED]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.BATCH_USERS_DELETED]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.USER_UPDATED]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.USER_ACTIVATED]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.USER_FORGET_PASSWORD]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.USER_LOGGED]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.USER_ALREADY_EXIST]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.USER_CONFLICT]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.SIGNUP_BAD_DOMAIN]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.FAILED_CRON]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.WARN_NEW_USER_TO_BE_DELETED]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.STATS_NB_REQUESTS]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.BATCH_DEPOSIT_RESUME]: [EnvironmentEnum.PROD],
    [NotificationType.DEPOSIT_UNFINISHED]: [EnvironmentEnum.PROD],
    [NotificationType.DATA_IMPORT_SUCCESS]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.DEPOSIT_SCDL_SUCCESS]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.EXTERNAL_API_ERROR]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
    [NotificationType.MONGO_CONNECTION_LOST]: [EnvironmentEnum.PROD, EnvironmentEnum.PREPROD],
};
