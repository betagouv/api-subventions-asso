import { AdminTerritorialLevel } from "./AdminTerritorialLevel";
import { AgentJobType } from "./AgentJobType";
import { AgentType } from "./AgentType";
import { RegistrationSrcType } from "./RegistrationSrcType";
import { TerritorialScope } from "./TerritorialScope";

export default interface UpdatableUserFields {
    firstName?: string;
    lastName?: string;
    agentType: AgentType;
    jobType: AgentJobType[];
    service?: string;
    phoneNumber?: string;
    structure?: string;
    region?: string;
    decentralizedLevel?: AdminTerritorialLevel;
    decentralizedTerritory?: string;
    territorialScope?: TerritorialScope;
    registrationSrc?: RegistrationSrcType[];
    registrationSrcEmail?: string;
    registrationSrcDetails?: string;
    profileToComplete?: boolean;
}
