import { AdminTerritorialLevel, AgentTypeEnum } from "dto";

export default class AdminStructureEntity {
    constructor(
        public agentType: AgentTypeEnum,
        public territorialLevel: AdminTerritorialLevel | undefined,
        public structure: string,
    ) {}
}
