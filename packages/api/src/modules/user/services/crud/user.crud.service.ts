import { UserDto, UserWithResetTokenDto } from "dto";
import { DefaultObject } from "../../../../@types";
import userRepository from "../../repositories/user.repository";
import userCheckService from "../check/user.check.service";
import userResetRepository from "../../repositories/user-reset.repository";
import consumerTokenRepository from "../../repositories/consumer-token.repository";
import notifyService from "../../../notify/notify.service";
import { NotificationType } from "../../../notify/@types/NotificationType";
import userStatsService from "../stats/user.stats.service";

export class UserCrudService {
    find(query: DefaultObject = {}) {
        return userRepository.find(query);
    }

    findByEmail(email: string) {
        return userRepository.findByEmail(email);
    }

    public getUserById(userId) {
        return userRepository.findById(userId);
    }

    public async update(user: Partial<UserDto> & Pick<UserDto, "email">): Promise<UserDto> {
        await userCheckService.validateEmail(user.email);
        return await userRepository.update(user);
    }

    public async delete(userId: string): Promise<boolean> {
        const user = await this.getUserById(userId);

        if (!user) return false;

        if (!(await userRepository.delete(user))) return false;

        const deletePromises = [
            userResetRepository.removeAllByUserId(user._id),
            consumerTokenRepository.deleteAllByUserId(user._id),
        ];

        notifyService.notify(NotificationType.USER_DELETED, {
            email: user.email,
            firstname: user.firstName,
            lastname: user.lastName,
        });

        return (await Promise.all(deletePromises)).every(success => success);
    }

    public async listUsers(): Promise<UserWithResetTokenDto[]> {
        const users = await userStatsService.getUsersWithStats(true);
        return await Promise.all(
            users.map(async user => {
                const reset = await userResetRepository.findOneByUserId(user._id);
                return {
                    ...user,
                    resetToken: reset?.token,
                    resetTokenDate: reset?.createdAt,
                };
            }),
        );
    }
}

const userCrudService = new UserCrudService();
export default userCrudService;
