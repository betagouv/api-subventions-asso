import FonjepVersementEntity from "../../../../../modules/providers/fonjep/entities/FonjepVersementEntity";
import { FonjepCoreAdapter } from "./fonjep.core.adapter";
import { FonjepVersementsPort } from "./fonjep-versements.port";

// if dbo is equal to WithId<entity> then we just use the Entity as FonjepTypedDocument
export class FonjepVersementAdapter extends FonjepCoreAdapter<FonjepVersementEntity> implements FonjepVersementsPort {
    readonly collectionName = "fonjepVersement";

    async createIndexes() {
        await this.collection.createIndex({ PosteCode: 1 });
    }

    public async insertMany(entities: FonjepVersementEntity[]): Promise<void> {
        await this.collection.insertMany(entities);
    }

    public findByPosteCode(PosteCode: string): Promise<FonjepVersementEntity[]> {
        return this.collection.find({ PosteCode: PosteCode }).toArray();
    }

    public async findAll(): Promise<FonjepVersementEntity[]> {
        return this.collection.find({}).toArray();
    }

    public async drop() {
        await this.collection.drop();
    }

    public async rename(name: string) {
        await this.collection.rename(name);
    }
}

const fonjepVersementsAdapter = new FonjepVersementAdapter();
export default fonjepVersementsAdapter;
