import FonjepTiersEntity from "../../../../modules/providers/fonjep/entities/FonjepTiersEntity";
import { FonjepCoreAdapter } from "./fonjep.core.adapter";

// if dbo is equal to WithId<entity> then we just use the Entity as FonjepTypedDocument
export class FonjepTiersAdapter extends FonjepCoreAdapter<FonjepTiersEntity> {
    readonly collectionName = "fonjepTiers";

    async createIndexes() {
        await this.collection.createIndex({ SiretOuRidet: 1 });
    }

    public insertMany(entities: FonjepTiersEntity[]) {
        return this.collection.insertMany(entities);
    }

    public findBySiretOuRidet(siretOuRidet: string) {
        return this.collection.find({ SiretOuRidet: siretOuRidet }).toArray();
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

const fonjepTiersAdapter = new FonjepTiersAdapter();
export default fonjepTiersAdapter;
