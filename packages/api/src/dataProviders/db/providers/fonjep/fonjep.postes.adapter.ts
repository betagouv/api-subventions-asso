import FonjepPosteEntity from "../../../../modules/providers/fonjep/entities/FonjepPosteEntity";
import { FonjepCoreAdapter } from "./fonjep.core.adapter";

// if dbo is equal to WithId<entity> then we just use the Entity as FonjepTypedDocument
export class FonjepPostesAdapter extends FonjepCoreAdapter<FonjepPosteEntity> {
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

const fonjepPostesAdapter = new FonjepPostesAdapter();
export default fonjepPostesAdapter;
