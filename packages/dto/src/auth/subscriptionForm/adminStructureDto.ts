import { AgentTypeEnum } from "./agentType";
import { AdminTerritorialLevel } from "./adminTerritorialLevel";

export type AdminStructureDto = {
    agentType: AgentTypeEnum;
    territorialLevel?: AdminTerritorialLevel;
    structure: string;
};
