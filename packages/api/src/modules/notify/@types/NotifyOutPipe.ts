import { NotificationDataTypes } from "./NotificationDataTypes";
import { NotificationType } from "./NotificationType";

export interface NotifierMethodType {
    (type: NotificationType.TEST_EMAIL, data: NotificationDataTypes[NotificationType.TEST_EMAIL]): Promise<boolean>;
    (type: NotificationType.USER_DELETED, data: NotificationDataTypes[NotificationType.USER_DELETED]): Promise<boolean>;
    (
        type: NotificationType.BATCH_USERS_DELETED,
        data: NotificationDataTypes[NotificationType.BATCH_USERS_DELETED],
    ): Promise<boolean>;
    (type: NotificationType.USER_CREATED, data: NotificationDataTypes[NotificationType.USER_CREATED]): Promise<boolean>;
    (
        type: NotificationType.USER_ACTIVATED,
        data: NotificationDataTypes[NotificationType.USER_ACTIVATED],
    ): Promise<boolean>;
    (
        type: NotificationType.USER_FORGET_PASSWORD,
        data: NotificationDataTypes[NotificationType.USER_FORGET_PASSWORD],
    ): Promise<boolean>;
    (type: NotificationType.USER_LOGGED, data: NotificationDataTypes[NotificationType.USER_LOGGED]): Promise<boolean>;
    (
        type: NotificationType.USER_ALREADY_EXIST,
        data: NotificationDataTypes[NotificationType.USER_ALREADY_EXIST],
    ): Promise<boolean>;
    (type: NotificationType.USER_UPDATED, data: NotificationDataTypes[NotificationType.USER_UPDATED]);
    (type: NotificationType.USER_CONFLICT, data: NotificationDataTypes[NotificationType.USER_CONFLICT]);
    (type: NotificationType.SIGNUP_BAD_DOMAIN, data: NotificationDataTypes[NotificationType.SIGNUP_BAD_DOMAIN]);
    (type: NotificationType.FAILED_CRON, data: NotificationDataTypes[NotificationType.FAILED_CRON]);
    (
        type: NotificationType.WARN_NEW_USER_TO_BE_DELETED,
        data: NotificationDataTypes[NotificationType.WARN_NEW_USER_TO_BE_DELETED],
    );
}

export interface NotifyOutPipe {
    notify: NotifierMethodType;
}
