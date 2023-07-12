import { NotificationType } from "./NotificationType";

export interface NotificationDataTypes {
    [NotificationType.USER_CREATED]: {
        email: string;
        firstname?: string;
        lastname?: string;
        url: string;
        signupAt: Date;
        active: boolean;
    };
    [NotificationType.USER_DELETED]: {
        email: string;
    };
    [NotificationType.USER_ACTIVATED]: {
        email: string;
    };
    [NotificationType.USER_FORGET_PASSWORD]: {
        email: string;
        url: string;
    };
    [NotificationType.USER_LOGGED]: {
        email: string;
        date: Date;
    };
    [NotificationType.TEST_EMAIL]: {
        email: string;
        templateId: number;
    };
}
