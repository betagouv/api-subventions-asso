import { UserRoles } from "./@types/UserRoles";
import { FutureUser } from "./@types/FutureUser";
import AbstractUserEntity from "./AbstractUserEntity";
import { JWT } from "./@types/UserJwt";

export default class NewUserEntity extends AbstractUserEntity {
    declare id: undefined;
    public email!: string;
    public roles!: UserRoles[];
    public signupAt!: Date;
    public lastActivityDate!: Date;
    public active!: boolean;
    public profileToComplete: true;
    public nbVisits!: 0;
    public jwt?: JWT; // we authenticate users signed up by ProConnect
    public firstName?: string;
    public lastName?: string;
    public proConnectId?: string;

    constructor(props: FutureUser & { jwt?: JWT }) {
        super();

        if (!props.email) this.throwUndefinedError("email");

        const now = new Date();
        this.signupAt = now;
        this.lastActivityDate = now;
        this.active = props.proConnectId ? true : false;
        this.nbVisits = 0;
        this.profileToComplete = true;

        if (!props.roles) props.roles = [UserRoles.USER];
        else if (Array.isArray(props.roles) && !props.roles.includes(UserRoles.USER)) props.roles.push(UserRoles.USER);

        this.checkUserRoles(props.roles);

        Object.assign(this, { ...props, roles: [...new Set(props.roles)] });
    }
}
