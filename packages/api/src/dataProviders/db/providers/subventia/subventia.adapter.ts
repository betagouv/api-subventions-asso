import MongoAdapter from "../../MongoAdapter";
import Siren from "../../../../identifierObjects/Siren";
import Siret from "../../../../identifierObjects/Siret";
import { SubventiaDbo } from "../../../../modules/providers/subventia/@types/subventia.entity";
import { SubventiaPort } from "./subventia.port";

export class SubventiaAdapter extends MongoAdapter<Omit<SubventiaDbo, "_id">> implements SubventiaPort {
    readonly collectionName = "subventia";

    public async findBySiren(siren: Siren): Promise<SubventiaDbo[]> {
        return this.collection
            .find({
                siret: { $regex: new RegExp(`^${siren.value}\\d{5}`) },
            })
            .toArray();
    }

    public async findBySiret(siret: Siret): Promise<SubventiaDbo[]> {
        return this.collection.find({ siret: siret.value }).toArray();
    }

    public createIndexes(): void {
        this.collection.createIndex({ siret: 1 });
        return;
    }

    public async findAll(): Promise<SubventiaDbo[]> {
        return await this.collection.find({}).toArray();
    }

    public async create(entity: Omit<SubventiaDbo, "_id">): Promise<void> {
        await this.collection.insertOne(entity);
    }
}

const subventiaAdapter = new SubventiaAdapter();

export default subventiaAdapter;
