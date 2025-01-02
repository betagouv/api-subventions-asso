import dedent from "dedent";
import { FutureUserDto } from "dto";
import { BadRequestError } from "../../../../shared/errors/httpErrors";
import { REGEX_MAIL, REGEX_PASSWORD } from "../../user.constant";
import configurationsService from "../../../configurations/configurations.service";
import { sanitizeToPlainText } from "../../../../shared/helpers/StringHelper";
import userRolesService from "../roles/user.roles.service";
import { UserServiceErrors } from "../../user.enum";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";

export class UserCheckService {
    public static PASSWORD_VALIDATOR_MESSAGE = dedent`Password is too weak, please use this rules:
    At least one digit [0-9]
    At least one lowercase character [a-z]
    At least one uppercase character [A-Z]
    At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\\]
    At least 8 characters in length, but no more than 32.`;

    passwordValidator(password: string): boolean {
        return REGEX_PASSWORD.test(password);
    }

    async validateEmail(email: string, isAgentConnect = true): Promise<void> {
        if (!REGEX_MAIL.test(email)) {
            throw new BadRequestError("Email is not valid", UserServiceErrors.CREATE_INVALID_EMAIL);
        }

        if (!(isAgentConnect || (await configurationsService.isDomainAccepted(email)))) {
            throw new BadRequestError("Email domain is not accepted", UserServiceErrors.CREATE_EMAIL_GOUV);
        }
    }

    /**
     * validates and sanitizes in-place user.
     * @param user
     */
    async validateSanitizeUser(user: FutureUserDto) {
        try {
            await userCheckService.validateEmail(user.email);
        } catch (e) {
            if (e instanceof BadRequestError && e.code === UserServiceErrors.CREATE_EMAIL_GOUV) {
                notifyService.notify(NotificationType.SIGNUP_BAD_DOMAIN, user);
            }
            throw e;
        }

        if (!userRolesService.validRoles(user.roles || []))
            throw new BadRequestError("Given user role does not exist", UserServiceErrors.ROLE_NOT_FOUND);

        const sanitizedUser = { ...user };
        if (sanitizedUser.firstName) sanitizedUser.firstName = sanitizeToPlainText(sanitizedUser.firstName?.toString());
        if (sanitizedUser.lastName) sanitizedUser.lastName = sanitizeToPlainText(sanitizedUser.lastName?.toString());
        return sanitizedUser;
    }
}

const userCheckService = new UserCheckService();
export default userCheckService;
