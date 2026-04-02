import FonjepPosteEntity from "../../../../../modules/providers/fonjep/entities/FonjepPosteEntity";
import { FonjepCoreAdapter } from "./fonjep.core.adapter";
import { FonjepPostesPort } from "./fonjep-postes.port";

// if dbo is equal to WithId<entity> then we just use the Entity as FonjepTypedDocument
export class FonjepPostesAdapter extends FonjepCoreAdapter<FonjepPosteEntity> implements FonjepPostesPort {
    readonly collectionName = "fonjepPoste";

    async createIndexes() {
        await this.collection.createIndex({ Code: 1 });
    }

    public async insertMany(entities: FonjepPosteEntity[]): Promise<void> {
        await this.collection.insertMany(entities);
    }

    public findByCode(code: string): Promise<FonjepPosteEntity[]> {
        return this.collection.find({ Code: code }).toArray();
    }

    public async findAll(): Promise<FonjepPosteEntity[]> {
        return this.collection.find({}).toArray();
    }

    public async drop(): Promise<void> {
        await this.collection.drop();
    }

    public async rename(name: string) {
        await this.collection.rename(name);
    }
}

const fonjepPostesAdapter = new FonjepPostesAdapter();
export default fonjepPostesAdapter;
