import { UserDataDto } from "dto";
import { NotFoundError } from "../../../../shared/errors/httpErrors";
import userResetRepository from "../../repositories/user-reset.repository";
import consumerTokenRepository from "../../repositories/consumer-token.repository";
import { uniformizeId } from "../../../../shared/helpers/RepositoryHelper";
import statsService from "../../../stats/stats.service";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userRepository from "../../repositories/user.repository";
import userCrudService from "../crud/user.crud.service";
import { DefaultObject } from "../../../../@types";

export class UserRgpdService {
    public async getAllData(userId: string): Promise<UserDataDto> {
        const user = await userCrudService.getUserById(userId);

        if (!user) throw new NotFoundError("User is not found");

        const userIdToString = document => ({ ...document, userId: document.userId.toString() });

        const tokens = [
            ...(await userResetRepository.findByUserId(userId)),
            ...(await consumerTokenRepository.find(userId)),
        ]
            .map(uniformizeId)
            .map(userIdToString);

        const associationVisits = await statsService.getAllVisitsUser(userId);
        const userLogs = await statsService.getAllLogUser(user.email);

        return {
            user,
            tokens,
            logs: userLogs,
            statistics: {
                associationVisit: associationVisits.map(userIdToString),
            },
        };
    }

    public async disable(userId: string) {
        const user = await userCrudService.getUserById(userId);
        if (!user) return false;
        // Anonymize the user when it is being deleted to keep use stats consistent
        // It keeps roles and signupAt in place to avoid breaking any stats
        const disabledUser = {
            ...user,
            active: false,
            email: `${user._id}@deleted.datasubvention.beta.gouv.fr`,
            jwt: null,
            hashPassword: "",
            disable: true,
            firstName: "",
            lastName: "",
        };

        notifyService.notify(NotificationType.USER_DELETED, { email: user.email });

        return !!(await userRepository.update(disabledUser));
    }

    async findAnonymizedUsers(query: DefaultObject = {}) {
        const users = await userCrudService.find(query);

        return users.map(user => {
            return {
                ...user,
                email: undefined,
                firstName: undefined,
                lastName: undefined,
                phoneNumber: undefined,
            };
        });
    }
}

const userRgpdService = new UserRgpdService();
export default userRgpdService;
