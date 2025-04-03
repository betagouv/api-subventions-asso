import FonjepVersementEntity from "../../../../modules/providers/fonjep/entities/FonjepVersementEntity";
import { FonjepCorePort } from "./fonjep.core.port";

// if dbo is equal to WithId<entity> then we just use the Entity as FonjepTypedDocument
export class FonjepVersementPort extends FonjepCorePort<FonjepVersementEntity> {
    readonly collectionName = "fonjepVersement";

    async createIndexes() {
        await this.collection.createIndex({ PosteCode: 1 });
    }

    public insertMany(entities: FonjepVersementEntity[]) {
        return this.collection.insertMany(entities);
    }

    public findByPosteCode(PosteCode: string) {
        return this.collection.find({ PosteCode: PosteCode }).toArray();
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

const fonjepVersementsPort = new FonjepVersementPort();
export default fonjepVersementsPort;
