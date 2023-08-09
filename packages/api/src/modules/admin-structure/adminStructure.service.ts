import { AgentTypeEnum } from "@api-subventions-asso/dto";
import { BadRequestError } from "../../shared/errors/httpErrors";
import adminStructureRepository from "./repositories/adminStructure.repository";

export class AdminStructureService {
    getAdminStructureByAgentType(agentType: AgentTypeEnum) {
        return adminStructureRepository.findAllByAgentType(agentType);
    }

    async getAdminStructureByStringAgentType(agentType: string) {
        if (!(Object.values(AgentTypeEnum) as string[]).includes(agentType))
            throw new BadRequestError("Invalid AgentType");
        return await this.getAdminStructureByAgentType(agentType as AgentTypeEnum);
    }
}

const adminStructureService = new AdminStructureService();

export default adminStructureService;
