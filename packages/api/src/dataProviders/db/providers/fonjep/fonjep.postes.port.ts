import FonjepPosteEntity from "../../../../modules/providers/fonjep/entities/FonjepPosteEntity";
import { FonjepCorePort } from "./fonjep.core.port";

// if dbo is equal to WithId<entity> then we just use the Entity as FonjepTypedDocument
export class FonjepPostesPort extends FonjepCorePort<FonjepPosteEntity> {
    readonly collectionName = "fonjepPoste";

    async createIndexes() {
        await this.collection.createIndex({ Code: 1 });
    }

    public insertMany(entities: FonjepPosteEntity[]) {
        return this.collection.insertMany(entities);
    }

    public findByCode(code: string) {
        return this.collection.find({ Code: code }).toArray();
    }

    public async findAll() {
        return this.collection.find({}).toArray();
    }

    public async drop() {
        return this.collection.drop();
    }

    public async rename(name: string) {
        return this.collection.rename(name);
    }
}

const fonjepPostesPort = new FonjepPostesPort();
export default fonjepPostesPort;
