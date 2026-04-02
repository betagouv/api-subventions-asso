import { AgentTypeEnum } from "dto";
import { BadRequestError } from "core";
import adminStructureAdapter from "../../adapters/outputs/db/admin-structure/admin-structure.adapter";
import AdminStructureEntity from "./entities/AdminStructureEntity";

export class AdminStructureService {
    getAdminStructureByAgentType(agentType: AgentTypeEnum) {
        return adminStructureAdapter.findAllByAgentType(agentType);
    }

    async getAdminStructureByStringAgentType(agentType: string) {
        if (!AgentTypeEnum[agentType]) throw new BadRequestError("Invalid AgentType");
        return this.getAdminStructureByAgentType(agentType as AgentTypeEnum);
    }

    async replaceAll(entries: AdminStructureEntity[]) {
        const oldEntries = await adminStructureAdapter.findAll();
        await adminStructureAdapter.deleteAll();
        try {
            return await adminStructureAdapter.insertMany(entries);
        } catch (e) {
            console.error("Error while inserting new data. Revert to previous state");
            await adminStructureAdapter.insertMany(oldEntries);
            throw e;
        }
    }
}

const adminStructureService = new AdminStructureService();

export default adminStructureService;
