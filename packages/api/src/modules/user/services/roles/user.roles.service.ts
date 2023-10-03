import { UserDto } from "dto";
import { RoleEnum } from "../../../../@enums/Roles";

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
}

const userRolesService = new UserRolesService();
export default userRolesService;
