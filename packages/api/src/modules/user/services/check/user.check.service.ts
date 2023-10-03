import { BadRequestError } from "../../../../shared/errors/httpErrors";
import { REGEX_MAIL, REGEX_PASSWORD } from "../../user.constant";
import configurationsService from "../../../configurations/configurations.service";
import { UserServiceErrors } from "../../user.service";

export class UserCheckService {
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
}

const userCheckService = new UserCheckService();
export default userCheckService;
