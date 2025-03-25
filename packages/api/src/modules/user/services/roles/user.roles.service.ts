import { UserDto } from "dto";
import { BadRequestError, InternalServerError } from "core";
import { RoleEnum } from "../../../../@enums/Roles";
import userPort from "../../../../dataProviders/db/user/user.port";
import { UserServiceErrors } from "../../user.enum";

export class UserRolesService {
    public getRoles(user: UserDto) {
        return user.roles;
    }

    public isRoleValid(role: string) {
        return Object.values(RoleEnum).includes(role as RoleEnum);
    }

    public validRoles(roles: string[]) {
        return roles.every(role => this.isRoleValid(role));
    }

    async addRolesToUser(user: UserDto | string, roles: RoleEnum[]): Promise<{ user: UserDto }> {
        if (typeof user === "string") {
            const foundUser = await userPort.findByEmail(user);
            if (!foundUser) {
                throw new InternalServerError("An error has occurred");
            }
            user = foundUser;
        }

        const roleEnumValues = Object.values(RoleEnum);
        const invalidRole = roles.find(role => !roleEnumValues.includes(role));
        if (invalidRole) {
            throw new BadRequestError(`Role ${invalidRole} is not valid`, UserServiceErrors.ROLE_NOT_FOUND);
        }

        return { user: await userPort.update({ ...user, roles: [...new Set([...user.roles, ...roles])] }) };
    }
}

const userRolesService = new UserRolesService();
export default userRolesService;
