import { FutureUserDto, UserActivationInfoDto } from "dto";
import { NotificationType } from "./NotificationType";

export interface NotificationDataTypes {
    [NotificationType.USER_ALREADY_EXIST]: {
        email: string;
        firstname?: string;
        lastname?: string;
        url?: string;
        signupAt: Date;
        active: boolean;
    };
    [NotificationType.USER_CREATED]: {
        email: string;
        firstname?: string;
        lastname?: string;
        url: string | null;
        signupAt: Date;
        active: boolean;
        isAgentConnect: boolean;
    };
    [NotificationType.USER_DELETED]: {
        email: string;
        firstname?: string;
        lastname?: string;
        selfDeleted: boolean;
    };
    [NotificationType.BATCH_USERS_DELETED]: {
        users: {
            email: string;
            firstname?: string;
            lastname?: string;
        }[];
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
    [NotificationType.USER_UPDATED]: Omit<UserActivationInfoDto, "password"> &
        FutureUserDto & { lastActivityDate?: Date | null };
    [NotificationType.USER_CONFLICT]: FutureUserDto;
    [NotificationType.SIGNUP_BAD_DOMAIN]: FutureUserDto;
    [NotificationType.TEST_EMAIL]: {
        email: string;
        templateId: number;
    };
    [NotificationType.FAILED_CRON]: {
        cronName: string;
        error: Error;
    };
    [NotificationType.WARN_NEW_USER_TO_BE_DELETED]: {
        email: string;
        activationLink: string;
    };
    [NotificationType.BATCH_DEPOSIT_RESUME]: {
        emails: string[];
    };
    [NotificationType.STATS_NB_REQUESTS]: {
        email: string;
        nbVisits: number;
    }[];
    [NotificationType.DEPOSIT_UNFINISHED]: {
        users: {
            email: string;
            firstname?: string;
            lastname?: string;
        }[];
    };
}
