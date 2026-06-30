import { RoleEnum } from "../../../../domain/users/@types/UserRoles";
import userAdapter from "../../../../adapters/outputs/db/user/user.adapter";
import UserEntity from "../../../../domain/users/UserEntity";

export class UserRolesService {
    public getRoles(user: UserEntity) {
        return user.roles;
    }

    public isRoleValid(role: string) {
        return Object.values(RoleEnum).includes(role as RoleEnum);
    }

    public validRoles(roles: string[]) {
        return roles.every(role => this.isRoleValid(role));
    }

    async addRolesToUser(email: string, roles: RoleEnum[]) {
        const user = await userAdapter.findByEmail(email);
        const entity = new UserEntity({ ...user, roles: [...new Set([...user.roles, ...roles])] });
        return {
            user: await userAdapter.update(entity),
        };
    }
}

const userRolesService = new UserRolesService();
export default userRolesService;
