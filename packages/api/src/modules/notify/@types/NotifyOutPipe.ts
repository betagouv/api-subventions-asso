import { NotificationDataTypes } from "./NotificationDataTypes";
import { NotificationType } from "./NotificationType";

export interface NotifierMethodType {
    (type: NotificationType.TEST_EMAIL, data: NotificationDataTypes[NotificationType.TEST_EMAIL]): Promise<boolean>;
    (type: NotificationType.USER_DELETED, data: NotificationDataTypes[NotificationType.USER_DELETED]): Promise<boolean>;
    (type: NotificationType.USER_CREATED, data: NotificationDataTypes[NotificationType.USER_CREATED]): Promise<boolean>;
    (
        type: NotificationType.USER_ACTIVATED,
        data: NotificationDataTypes[NotificationType.USER_ACTIVATED],
    ): Promise<boolean>;
    (
        type: NotificationType.USER_FORGET_PASSWORD,
        data: NotificationDataTypes[NotificationType.USER_FORGET_PASSWORD],
    ): Promise<boolean>;
}

export interface NotifyOutPipe {
    accepts: NotificationType[];
    notify: NotifierMethodType;
}
