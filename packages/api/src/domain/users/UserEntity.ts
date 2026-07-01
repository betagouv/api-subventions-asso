import { AdminTerritorialLevel } from "./@types/AdminTerritorialLevel";
import { AgentJobType } from "./@types/AgentJobType";
import { AgentType } from "./@types/AgentType";
import RequiredUserProps from "./@types/RequiredUserFields";
import OptionalUserProps from "./@types/OptionalUserFields";
import { RegistrationSrcType } from "./@types/RegistrationSrcType";
import { TerritorialScope } from "./@types/TerritorialScope";
import { UserRoles } from "./@types/UserRoles";
import AbstractUserEntity from "./AbstractUserEntity";
import { JWT } from "./@types/UserJwt";

export default class UserEntity extends AbstractUserEntity {
    declare id: string;
    public email!: string;
    public roles!: UserRoles[];
    public active!: boolean;
    public profileToComplete!: boolean;
    public nbVisits!: number;
    public signupAt!: Date;
    public lastActivityDate!: Date;
    public jwt?: JWT;
    public hashPassword?: string;
    public proConnectId?: string;
    public jobType?: AgentJobType[];
    public disable?: boolean;
    public agentType?: AgentType;
    public firstName?: string;
    public lastName?: string;
    public service?: string;
    public phoneNumber?: string;
    public structure?: string;
    public region?: string;
    public decentralizedLevel?: AdminTerritorialLevel;
    public decentralizedTerritory?: string;
    public territorialScope?: TerritorialScope;
    public registrationSrc?: RegistrationSrcType[];
    public registrationSrcEmail?: string;
    public registrationSrcDetails?: string;

    constructor(props: RequiredUserProps & OptionalUserProps) {
        super();

        if (!props.id) this.throwUndefinedError("id");
        if (!props.email) this.throwUndefinedError("email");
        if (!props.roles) this.throwUndefinedError("roles");
        if (!props.signupAt) this.throwUndefinedError("signupAt");
        if (!props.active) this.throwUndefinedError("active");
        if (!props.nbVisits) this.throwUndefinedError("nbVisits");
        if (!props.lastActivityDate) this.throwUndefinedError("lastActivityDate");
        this.checkUserRoles(props.roles);

        Object.assign(this, { ...props, roles: [...new Set(props.roles)] });
    }
}
