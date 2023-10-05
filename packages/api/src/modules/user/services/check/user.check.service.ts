import dedent from "dedent";
import { FutureUserDto } from "dto";
import { BadRequestError, InternalServerError } from "../../../../shared/errors/httpErrors";
import { REGEX_MAIL, REGEX_PASSWORD } from "../../user.constant";
import configurationsService from "../../../configurations/configurations.service";
import userRepository from "../../repositories/user.repository";
import { sanitizeToPlainText } from "../../../../shared/helpers/StringHelper";
import userRolesService from "../roles/user.roles.service";
import { UserServiceErrors } from "../../user.enum";

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

    async validateEmail(email: string): Promise<void> {
        if (!REGEX_MAIL.test(email)) {
            throw new BadRequestError("Email is not valid", UserServiceErrors.CREATE_INVALID_EMAIL);
        }

        if (!(await configurationsService.isDomainAccepted(email))) {
            throw new BadRequestError("Email domain is not accepted", UserServiceErrors.CREATE_EMAIL_GOUV);
        }
    }

    /**
     * validates and sanitizes in-place user. if newUser: check if no email duplicate
     * @param user
     * @param newUser
     */
    async validateSanitizeUser(user: FutureUserDto, newUser = true) {
        await userCheckService.validateEmail(user.email);

        if (newUser && (await userRepository.findByEmail(user.email)))
            throw new InternalServerError("An error has occurred");

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
