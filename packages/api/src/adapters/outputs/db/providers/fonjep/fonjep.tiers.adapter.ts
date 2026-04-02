import FonjepTiersEntity from "../../../../../modules/providers/fonjep/entities/FonjepTiersEntity";
import { FonjepCoreAdapter } from "./fonjep.core.adapter";
import { FonjepTiersPort } from "./fonjep-tiers.port";

// if dbo is equal to WithId<entity> then we just use the Entity as FonjepTypedDocument
export class FonjepTiersAdapter extends FonjepCoreAdapter<FonjepTiersEntity> implements FonjepTiersPort {
    readonly collectionName = "fonjepTiers";

    async createIndexes() {
        await this.collection.createIndex({ SiretOuRidet: 1 });
    }

    public async insertMany(entities: FonjepTiersEntity[]): Promise<void> {
        await this.collection.insertMany(entities);
    }

    public findBySiretOuRidet(siretOuRidet: string): Promise<FonjepTiersEntity[]> {
        return this.collection.find({ SiretOuRidet: siretOuRidet }).toArray();
    }

    public async findAll(): Promise<FonjepTiersEntity[]> {
        return this.collection.find({}).toArray();
    }

    public async drop(): Promise<void> {
        await this.collection.drop();
    }

    public async rename(name: string): Promise<void> {
        await this.collection.rename(name);
    }
}

const fonjepTiersAdapter = new FonjepTiersAdapter();
export default fonjepTiersAdapter;
