import FonjepDispositifEntity from "../../../../../modules/providers/fonjep/entities/FonjepDispositifEntity";
import { FonjepCoreAdapter } from "./fonjep.core.adapter";
import { FonjepDispositifPort } from "./fonjep-dispositif.port";

// if dbo is equal to WithId<entity> then we just use the Entity as FonjepTypedDocument
export class FonjepDispositif extends FonjepCoreAdapter<FonjepDispositifEntity> implements FonjepDispositifPort {
    readonly collectionName = "fonjepDispositif";

    async createIndexes() {
        await this.collection.createIndex({ ID: 1 });
    }

    public async insertMany(entities: FonjepDispositifEntity[]): Promise<void> {
        await this.collection.insertMany(entities);
    }

    public findByID(id: number): Promise<FonjepDispositifEntity[]> {
        return this.collection.find({ ID: id }).toArray();
    }

    public async findAll(): Promise<FonjepDispositifEntity[]> {
        return this.collection.find({}).toArray();
    }

    public async drop(): Promise<void> {
        await this.collection.drop();
    }

    public async rename(name: string): Promise<void> {
        await this.collection.rename(name);
    }
}

const fonjepDispositifAdapter = new FonjepDispositif();
export default fonjepDispositifAdapter;
