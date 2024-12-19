import FonjepDispositifEntity from "../../../../modules/providers/fonjep/entities/FonjepDispositifEntity";
import FonjepDispositifDbo from "./dbo/fonjepDispositifDbo";
import { FonjepCorePort } from "./fonjep.core.port";
import FonjepDboAdapter from "./fonjepDboAdapter";

export class FonjepDispositif extends FonjepCorePort<FonjepDispositifDbo> {
    readonly collectionName = "fonjepDispositif";

    async createIndexes() {
        await this.collection.createIndex({ ID: 1 });
    }

    public insertMany(entities: FonjepDispositifEntity[]) {
        return this.collection.insertMany(entities.map(entity => FonjepDboAdapter.toDispositifDbo(entity)));
    }

    public findByID(id: number) {
        return this.collection.find({ ID: id }).toArray();
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

const fonjepDispositifPort = new FonjepDispositif();
export default fonjepDispositifPort;
