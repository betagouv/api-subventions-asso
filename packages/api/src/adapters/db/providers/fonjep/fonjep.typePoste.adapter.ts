import FonjepTypePosteEntity from "../../../../modules/providers/fonjep/entities/FonjepTypePosteEntity";
import { FonjepCoreAdapter } from "./fonjep.core.adapter";
import { FonjepTypePostePort } from "./fonjep-type-poste.port";

// if dbo is equal to WithId<entity> then we just use the Entity as FonjepTypedDocument
export class FonjepTypePosteAdapter extends FonjepCoreAdapter<FonjepTypePosteEntity> implements FonjepTypePostePort {
    readonly collectionName = "fonjepTypePoste";

    async createIndexes() {
        await this.collection.createIndex({ Code: 1 });
    }

    public async insertMany(entities: FonjepTypePosteEntity[]): Promise<void> {
        await this.collection.insertMany(entities);
    }

    public findByCode(code: string): Promise<FonjepTypePosteEntity[]> {
        return this.collection.find({ Code: code }).toArray();
    }

    public async findAll(): Promise<FonjepTypePosteEntity[]> {
        return this.collection.find({}).toArray();
    }

    public async drop() {
        await this.collection.drop();
    }

    public async rename(name: string) {
        await this.collection.rename(name);
    }
}

const fonjepTypePosteAdapter = new FonjepTypePosteAdapter();
export default fonjepTypePosteAdapter;
