import { NotificationDataType } from "./NotificationDataType";
import { NotificationType } from "./NotificationType";

export interface NotificationValidationType {
    (type: NotificationType.TEST_EMAIL, data: NotificationDataType[NotificationType.TEST_EMAIL]): Promise<boolean>;
    (type: NotificationType.USER_DELETED, data: NotificationDataType[NotificationType.USER_DELETED]): Promise<boolean>;
    (type: NotificationType.USER_CREATED, data: NotificationDataType[NotificationType.USER_CREATED]): Promise<boolean>;
    (type: NotificationType.USER_UPDATED, data: NotificationDataType[NotificationType.USER_UPDATED]): Promise<boolean>;
    (
        type: NotificationType.USER_FORGET_PASSWORD,
        data: NotificationDataType[NotificationType.USER_FORGET_PASSWORD],
    ): Promise<boolean>;
}

export interface NotifyOutPipe {
    accepts: NotificationType[];
    notify: NotificationValidationType;
}
