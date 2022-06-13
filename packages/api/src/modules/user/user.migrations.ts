import { ObjectId } from "mongodb";
import { DefaultObject } from "../../@types";
import { asyncForEach } from "../../shared/helpers/ArrayHelper";
import { UserWithoutSecret } from "./entities/User";
import UserReset from "./entities/UserReset";
import userService from "./user.service";

export enum EmailToLowerCaseAction {
    UPDATE = 1,
    DELETE = 2
}

export default class UserMigrations {
    public async migrationUserEmailToLowerCase() {       
        const users = await userService.find();
        const lowerCaseUsers = this.toLowerCaseUsers(users.filter(u => u) as UserWithoutSecret[])
        const groupedUser = this.groupUsersByEmail(lowerCaseUsers)
        const usersAction = (await Promise.all(Object.values(groupedUser).map((users => this.findUsersAction(users))))).flat();

        await asyncForEach(usersAction, async userAction => {
            if (userAction.action === EmailToLowerCaseAction.UPDATE) await userService.update(userAction.user);
            else if (userAction.action === EmailToLowerCaseAction.DELETE) await userService.delete(userAction.user);
        });
    }

    private groupUsersByEmail(users: UserWithoutSecret[]): DefaultObject<UserWithoutSecret[]> {
        return users.reduce((usersBase, user) => {
            if (!usersBase[user.email]) usersBase[user.email] = [];
            usersBase[user.email].push(user);
            
            return usersBase;
        }, {} as DefaultObject<UserWithoutSecret[]>)
    }

    private groupUsersByStatus(users: UserWithoutSecret[]) {
        return users.reduce( (acc, user: UserWithoutSecret) => {
            acc[user.active ? "actived" : "unactived"].push(user);
            
            return acc;
        },  { actived: [] as UserWithoutSecret[], unactived: [] as UserWithoutSecret[] })
    }

    private toLowerCaseUsers(users: UserWithoutSecret[]) {
        return users.map((user: UserWithoutSecret) => ({...user, email: user.email.toLowerCase()}));
    }

    private async findUsersAction(users: UserWithoutSecret[]) {
        if (users.length === 1) return [{
            action: EmailToLowerCaseAction.UPDATE,
            user: users[0]
        }];

        const usersToRemove: UserWithoutSecret[] = [];
        const { actived, unactived } = this.groupUsersByStatus(users);

        if (actived.length > 0) usersToRemove.push(...unactived);
        else { // No users actived so we search last created user
            const lastCreated = await this.findLastCreatedUser(unactived);
            return [
                {
                    action: EmailToLowerCaseAction.UPDATE,
                    user: lastCreated
                },
                ...unactived.filter(user => user != lastCreated).map(user => ({ action: EmailToLowerCaseAction.DELETE, user }))
            ]
        }

        // We search last connected user
        const lastConnectedUser = await this.findLastConnectedUser(actived);

        usersToRemove.push(...actived.filter(user => user != lastConnectedUser))

        return [
            {
                action: EmailToLowerCaseAction.UPDATE,
                user: lastConnectedUser
            },
            ... usersToRemove.map(user => ({ action: EmailToLowerCaseAction.DELETE, user}))
        ]
    }

    private async findLastCreatedUser(users: UserWithoutSecret[]) {
        const resetUsers = await Promise.all(users.map(user => userService.findUserResetByUserId(user._id as ObjectId)));
        const ordered = (resetUsers.filter(reset => reset) as UserReset[])
            .sort((resetA, resetB) => resetB.createdAt.getTime() - resetA.createdAt.getTime() );

        return users.find(user => user._id === ordered[0].userId) as UserWithoutSecret;
    }

    private async findLastConnectedUser(users: UserWithoutSecret[]) {
        const jwtUsers = await Promise.all(users.map(async user => ({ user, jwt: await userService.findJwtByUser(user) as { token: string, expirateDate: Date}})));

        const sortedJwt = jwtUsers.sort((a,b) => b.jwt.expirateDate.getTime() - a.jwt.expirateDate.getTime());

        return sortedJwt[0].user;
    }
}