import FonjepTypePosteEntity from "../../../../modules/providers/fonjep/entities/FonjepTypePosteEntity";
import FonjepTypePosteDbo from "./dbo/fonjepTypePosteDbo";
import { FonjepCorePort } from "./fonjep.core.port.old";
import FonjepDboAdapter from "./fonjepDboAdapter";

export class FonjepTypePostePort extends FonjepCorePort<FonjepTypePosteDbo> {
    readonly collectionName = "fonjepTypePoste";

    async createIndexes() {
        await this.collection.createIndex({ Code: 1 });
    }

    public insertMany(entities: FonjepTypePosteEntity[]) {
        return this.collection.insertMany(entities.map(entity => FonjepDboAdapter.toTypePosteDbo(entity)));
    }

    public findByCode(code: string) {
        return this.collection
            .find({
                Code: code,
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

const fonjepTypePostePort = new FonjepTypePostePort();
export default fonjepTypePostePort;
