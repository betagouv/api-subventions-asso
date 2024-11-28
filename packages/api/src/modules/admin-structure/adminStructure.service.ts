import { AgentTypeEnum } from "dto";
import { BadRequestError } from "../../shared/errors/httpErrors";
import adminStructureRepository from "../../dataProviders/db/admin-structure/adminStructure.port";
import AdminStructureEntity from "./entities/AdminStructureEntity";

export class AdminStructureService {
    getAdminStructureByAgentType(agentType: AgentTypeEnum) {
        return adminStructureRepository.findAllByAgentType(agentType);
    }

    async getAdminStructureByStringAgentType(agentType: string) {
        if (!AgentTypeEnum[agentType]) throw new BadRequestError("Invalid AgentType");
        return this.getAdminStructureByAgentType(agentType as AgentTypeEnum);
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
