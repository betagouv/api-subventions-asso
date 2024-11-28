import { AgentTypeEnum } from "dto";
import { WithId } from "mongodb";
import db from "../../../shared/MongoConnection";
import AdminStructureEntity from "../../../modules/admin-structure/entities/AdminStructureEntity";

export class AdminStructureRepository {
    private readonly collection = db.collection<AdminStructureEntity>("admin-structures");

    private toEntity(document: WithId<AdminStructureEntity>) {
        return new AdminStructureEntity(document.agentType, document.territorialLevel, document.structure);
    }

    async findAllByAgentType(agentType: AgentTypeEnum) {
        return (await this.collection.find({ agentType }).toArray()).map(document => this.toEntity(document));
    }

    insertMany(entities: AdminStructureEntity[]) {
        return this.collection.insertMany(entities, { ordered: false });
    }

    deleteAll() {
        return this.collection.deleteMany({});
    }

    async findAll() {
        return (await this.collection.find().toArray()).map(document => this.toEntity(document));
    }
}

const associationNameRepository = new AdminStructureRepository();

export default associationNameRepository;
