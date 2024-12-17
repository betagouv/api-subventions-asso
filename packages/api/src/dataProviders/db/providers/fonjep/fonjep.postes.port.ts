import FonjepPosteEntity from "../../../../modules/providers/fonjep/entities/FonjepPosteEntity";
import FonjepPosteDbo from "./dbo/fonjepPosteDbo";
import { FonjepCorePort } from "./fonjep.core.port.old";
import FonjepDboAdapter from "./fonjepDboAdapter";

export class FonjepPostesPort extends FonjepCorePort<FonjepPosteDbo> {
    readonly collectionName = "fonjepPoste";

    async createIndexes() {
        await this.collection.createIndex({ Code: 1 });
    }

    public insertMany(entities: FonjepPosteEntity[]) {
        return this.collection.insertMany(entities.map(entity => FonjepDboAdapter.toPosteDbo(entity)));
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

const fonjepPostesPort = new FonjepPostesPort();
export default fonjepPostesPort;
