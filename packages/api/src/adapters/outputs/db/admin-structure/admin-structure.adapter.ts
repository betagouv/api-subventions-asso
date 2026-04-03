import { AgentTypeEnum } from "dto";
import db from "../../../../shared/MongoConnection";
import AdminStructureEntity from "../../../../modules/admin-structure/entities/AdminStructureEntity";
import { removeMongoIds } from "../mongo-document.mapper";
import { AdminStructurePort } from "./admin-structure.port";

export class AdminStructureAdapter implements AdminStructurePort {
    private readonly collection = db.collection<AdminStructureEntity>("admin-structures");

    async findAllByAgentType(agentType: AgentTypeEnum): Promise<AdminStructureEntity[]> {
        const result = await this.collection.find({ agentType }).toArray();
        return removeMongoIds(result);
    }

    async insertMany(entities: AdminStructureEntity[]): Promise<void> {
        await this.collection.insertMany(entities, { ordered: false });
    }

    async deleteAll(): Promise<void> {
        await this.collection.deleteMany({});
    }

    async findAll(): Promise<AdminStructureEntity[]> {
        const result = await this.collection.find().toArray();
        return removeMongoIds(result);
    }
}

const associationNameAdapter = new AdminStructureAdapter();

export default associationNameAdapter;
