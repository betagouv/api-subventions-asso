import { NotificationType } from "./NotificationType";

export interface NotificationDataType {
    [NotificationType.USER_CREATED]: {
        email: string;
        token: string;
        signupAt: Date;
        active: boolean;
    };
    [NotificationType.USER_DELETED]: {
        email: string;
    };
    [NotificationType.USER_UPDATED]: {
        email: string;
        active: boolean;
    };
    [NotificationType.USER_FORGET_PASSWORD]: {
        email: string;
        token: string;
    };
    [NotificationType.TEST_EMAIL]: {
        email: string;
        templateId: number;
    };
}
