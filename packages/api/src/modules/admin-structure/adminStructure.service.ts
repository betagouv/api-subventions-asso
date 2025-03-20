import { AgentTypeEnum } from "dto";
import { BadRequestError } from "core";
import adminStructurePort from "../../dataProviders/db/admin-structure/adminStructure.port";
import AdminStructureEntity from "./entities/AdminStructureEntity";

export class AdminStructureService {
    getAdminStructureByAgentType(agentType: AgentTypeEnum) {
        return adminStructurePort.findAllByAgentType(agentType);
    }

    async getAdminStructureByStringAgentType(agentType: string) {
        if (!AgentTypeEnum[agentType]) throw new BadRequestError("Invalid AgentType");
        return this.getAdminStructureByAgentType(agentType as AgentTypeEnum);
    }

    async replaceAll(entries: AdminStructureEntity[]) {
        const oldEntries = await adminStructurePort.findAll();
        await adminStructurePort.deleteAll();
        try {
            return await adminStructurePort.insertMany(entries);
        } catch (e) {
            console.error("Error while inserting new data. Revert to previous state");
            await adminStructurePort.insertMany(oldEntries);
            throw e;
        }
    }
}

const adminStructureService = new AdminStructureService();

export default adminStructureService;
