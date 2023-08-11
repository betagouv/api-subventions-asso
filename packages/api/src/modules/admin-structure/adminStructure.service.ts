import { AgentTypeEnum } from "@api-subventions-asso/dto";
import { BadRequestError } from "../../shared/errors/httpErrors";
import adminStructureRepository from "./repositories/adminStructure.repository";
import AdminStructureEntity from "./entities/AdminStructureEntity";

export class AdminStructureService {
    getAdminStructureByAgentType(agentType: AgentTypeEnum) {
        return adminStructureRepository.findAllByAgentType(agentType);
    }

    async getAdminStructureByStringAgentType(agentType: string) {
        if (!(Object.values(AgentTypeEnum) as string[]).includes(agentType))
            throw new BadRequestError("Invalid AgentType");
        return await this.getAdminStructureByAgentType(agentType as AgentTypeEnum);
    }

    async replaceAll(entries: AdminStructureEntity[]) {
        const oldEntries = await adminStructureRepository.findAll();
        await adminStructureRepository.deleteAll();
        try {
            return await adminStructureRepository.insertMany(entries);
        } catch (e) {
            console.error("Error while inserting new data. Revert to previous state");
            await adminStructureRepository.insertMany(oldEntries);
            throw e;
        }
    }
}

const adminStructureService = new AdminStructureService();

export default adminStructureService;
