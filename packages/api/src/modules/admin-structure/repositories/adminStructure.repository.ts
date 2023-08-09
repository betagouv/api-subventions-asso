import { AgentTypeEnum } from "@api-subventions-asso/dto";
import { WithId } from "mongodb";
import db from "../../../shared/MongoConnection";
import AdminStructureEntity from "../entities/AdminStructureEntity";

export class AdminStructureRepository {
    private readonly collection = db.collection<AdminStructureEntity>("admin-structures");

    private toEntity(document: WithId<AdminStructureEntity>) {
        return new AdminStructureEntity(document.agentType, document.territoryScope, document.structure);
    }

    async findAllByAgentType(agentType: AgentTypeEnum) {
        return (await this.collection.find({ agentType }).toArray()).map(document => this.toEntity(document));
    }

    async insertMany(entities: AdminStructureEntity[]) {
        return this.collection.insertMany(entities, { ordered: false });
    }
}

const associationNameRepository = new AdminStructureRepository();

export default associationNameRepository;
