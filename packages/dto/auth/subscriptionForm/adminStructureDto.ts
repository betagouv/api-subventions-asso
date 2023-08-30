import { AgentTypeEnum } from "./agentType";

export type AdminStructureDto = {
    agentType: AgentTypeEnum;
    territoryScope: string;
    structure: string;
};
