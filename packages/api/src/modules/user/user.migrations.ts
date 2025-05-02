import { UserDto } from "dto";
import { ObjectId } from "mongodb";
import { DefaultObject } from "../../@types";
import { asyncForEach } from "../../shared/helpers/ArrayHelper";
import UserReset from "./entities/UserReset";
import userAuthService from "./services/auth/user.auth.service";
import userActivationService from "./services/activation/user.activation.service";
import userCrudService from "./services/crud/user.crud.service";

export enum EmailToLowerCaseAction {
    // TODO: find a way to make enum no unused vars ok

    UPDATE = 1,

    DELETE = 2,
}

export default class UserMigrations {
    public async migrationUserEmailToLowerCase() {
        const users = await userCrudService.find();
        const lowerCaseUsers = this.toLowerCaseUsers(users.filter(u => u) as UserDto[]);
        const groupedUser = this.groupUsersByEmail(lowerCaseUsers);
        const usersAction = (
            await Promise.all(Object.values(groupedUser).map(users => this.findUsersAction(users)))
        ).flat();

        await asyncForEach(usersAction, async userAction => {
            if (userAction.action === EmailToLowerCaseAction.UPDATE) await userCrudService.update(userAction.user);
            else if (userAction.action === EmailToLowerCaseAction.DELETE)
                await userCrudService.delete(userAction.user._id.toString());
        });
    }

    private groupUsersByEmail(users: UserDto[]): DefaultObject<UserDto[]> {
        return users.reduce(
            (usersBase, user) => {
                if (!usersBase[user.email]) usersBase[user.email] = [];
                usersBase[user.email].push(user);

                return usersBase;
            },
            {} as DefaultObject<UserDto[]>,
        );
    }

    private groupUsersByStatus(users: UserDto[]) {
        return users.reduce(
            (acc, user: UserDto) => {
                acc[user.active ? "actived" : "unactived"].push(user);

                return acc;
            },
            { actived: [] as UserDto[], unactived: [] as UserDto[] },
        );
    }

    private toLowerCaseUsers(users: UserDto[]) {
        return users.map((user: UserDto) => ({
            ...user,
            email: user.email.toLowerCase(),
        }));
    }

    private async findUsersAction(users: UserDto[]) {
        if (users.length === 1)
            return [
                {
                    action: EmailToLowerCaseAction.UPDATE,
                    user: users[0],
                },
            ];

        const usersToRemove: UserDto[] = [];
        const { actived, unactived } = this.groupUsersByStatus(users);

        if (actived.length > 0) usersToRemove.push(...unactived);
        else {
            // No users actived so we search last created user
            const lastCreated = await this.findLastCreatedUser(unactived);
            return [
                {
                    action: EmailToLowerCaseAction.UPDATE,
                    user: lastCreated,
                },
                ...unactived
                    .filter(user => user != lastCreated)
                    .map(user => ({ action: EmailToLowerCaseAction.DELETE, user })),
            ];
        }

        // We search last connected user
        const lastConnectedUser = await this.findLastConnectedUser(actived);

        usersToRemove.push(...actived.filter(user => user != lastConnectedUser));

        return [
            {
                action: EmailToLowerCaseAction.UPDATE,
                user: lastConnectedUser,
            },
            ...usersToRemove.map(user => ({
                action: EmailToLowerCaseAction.DELETE,
                user,
            })),
        ];
    }

    private async findLastCreatedUser(users: UserDto[]) {
        const resetUsers = await Promise.all(
            users.map(user => userActivationService.findUserResetByUserId(user._id as ObjectId)),
        );
        const ordered = (resetUsers.filter(reset => reset) as UserReset[]).sort(
            (resetA, resetB) => resetB.createdAt.getTime() - resetA.createdAt.getTime(),
        );

        return users.find(user => user._id === ordered[0].userId) as UserDto;
    }

    private async findLastConnectedUser(users: UserDto[]) {
        const jwtUsers = await Promise.all(
            users.map(async user => ({
                user,
                jwt: (await userAuthService.findJwtByUser(user)) as {
                    token: string;
                    expirateDate: Date;
                },
            })),
        );

        const sortedJwt = jwtUsers.sort((a, b) => b.jwt.expirateDate.getTime() - a.jwt.expirateDate.getTime());

        return sortedJwt[0].user;
    }
}
