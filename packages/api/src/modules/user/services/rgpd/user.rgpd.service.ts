import { UserDataDto } from "dto";
import userService from "../../user.service";
import { NotFoundError } from "../../../../shared/errors/httpErrors";
import userResetRepository from "../../repositories/user-reset.repository";
import consumerTokenRepository from "../../repositories/consumer-token.repository";
import { uniformizeId } from "../../../../shared/helpers/RepositoryHelper";
import statsService from "../../../stats/stats.service";

export class UserRgpdService {
    public async getAllData(userId: string): Promise<UserDataDto> {
        const user = await userService.getUserById(userId);

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
}

const userRgpdService = new UserRgpdService();
export default userRgpdService;
