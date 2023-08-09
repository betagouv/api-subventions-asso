import { AgentTypeEnum } from "@api-subventions-asso/dto";

export default class AdminStructureEntity {
    constructor(public agentType: AgentTypeEnum, public territoryScope: string, public structure: string) {}
}
