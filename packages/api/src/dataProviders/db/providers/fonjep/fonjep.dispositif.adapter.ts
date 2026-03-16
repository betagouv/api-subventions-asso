import FonjepDispositifEntity from "../../../../modules/providers/fonjep/entities/FonjepDispositifEntity";
import { FonjepCoreAdapter } from "./fonjep.core.adapter";

// if dbo is equal to WithId<entity> then we just use the Entity as FonjepTypedDocument
export class FonjepDispositif extends FonjepCoreAdapter<FonjepDispositifEntity> {
    readonly collectionName = "fonjepDispositif";

    async createIndexes() {
        await this.collection.createIndex({ ID: 1 });
    }

    public insertMany(entities: FonjepDispositifEntity[]) {
        return this.collection.insertMany(entities);
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

const fonjepDispositifAdapter = new FonjepDispositif();
export default fonjepDispositifAdapter;
