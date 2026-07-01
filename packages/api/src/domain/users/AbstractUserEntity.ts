import { MissingEntityFieldError } from "../errors/MissingFieldError";
import { UserRoles } from "./@types/UserRoles";

export default abstract class AbstractUserEntity {
    public id?: string | null;

    protected throwUndefinedError(field) {
        return new MissingEntityFieldError(field, this.constructor.name);
    }

    protected checkUserRoles(roles: string[]) {
        roles.forEach(role => {
            if (!(Object.values(UserRoles) as string[]).includes(role)) throw new Error(`Role ${role} is not valid`);
        });
    }

    protected isNew() {
        return !this.id;
    }
}
