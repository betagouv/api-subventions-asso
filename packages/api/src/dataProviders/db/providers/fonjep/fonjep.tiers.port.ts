import FonjepTiersEntity from "../../../../modules/providers/fonjep/entities/FonjepTiersEntity";
import FonjepTiersDbo from "./dbo/fonjepTiersDbo";
import { FonjepCorePort } from "./fonjep.core.port";
import fonjepDboAdapter from "./fonjepDboAdapter";

export class FonjepTiersPort extends FonjepCorePort<FonjepTiersDbo> {
    readonly collectionName = "fonjepTiers";

    async createIndexes() {
        await this.collection.createIndex({ SiretOuRidet: 1 });
    }

    public insertMany(entities: FonjepTiersEntity[]) {
        return this.collection.insertMany(entities.map(entity => fonjepDboAdapter.toTierDbo(entity)));
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

const fonjepTiersPort = new FonjepTiersPort();
export default fonjepTiersPort;
