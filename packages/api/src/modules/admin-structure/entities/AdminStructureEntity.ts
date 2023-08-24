import { AgentTypeEnum } from "dto";

export default class AdminStructureEntity {
    constructor(public agentType: AgentTypeEnum, public territoryScope: string, public structure: string) {}
}
