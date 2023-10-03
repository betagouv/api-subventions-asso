import { UserDto } from "dto";

export class UserRolesService {
    public getRoles(user: UserDto) {
        return user.roles;
    }
}

const userRolesService = new UserRolesService();
export default userRolesService;
