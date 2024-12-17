import FonjepVersementEntity from "../../../../modules/providers/fonjep/entities/FonjepVersementEntity";
import FonjepVersementDbo from "./dbo/FonjepVersementDbo";
import { FonjepCorePort } from "./fonjep.core.port.old";
import FonjepDboAdapter from "./fonjepDboAdapter";

export class FonjepVersementPort extends FonjepCorePort<FonjepVersementDbo> {
    readonly collectionName = "fonjepVersement";

    async createIndexes() {
        await this.collection.createIndex({ PosteCode: 1 });
    }

    public insertMany(entities: FonjepVersementEntity[]) {
        return this.collection.insertMany(entities.map(entity => FonjepDboAdapter.toVersementDbo(entity)));
    }

    public findByPosteCode(PosteCode: string) {
        return this.collection
            .find({
                PosteCode: PosteCode,
            })
            .toArray();
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
