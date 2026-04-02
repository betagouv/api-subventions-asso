import { AgentTypeEnum } from "dto";
import AdminStructureEntity from "../../../../modules/admin-structure/entities/AdminStructureEntity";

export interface AdminStructurePort {
    findAllByAgentType(agentType: AgentTypeEnum): Promise<AdminStructureEntity[]>;
    insertMany(entities: AdminStructureEntity[]): Promise<void>;
    deleteAll(): Promise<void>;
    findAll(): Promise<AdminStructureEntity[]>;
}
