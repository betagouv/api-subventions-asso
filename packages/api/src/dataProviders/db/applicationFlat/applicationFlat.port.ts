import MongoPort from "../../../shared/MongoPort";
import Siren from "../../../valueObjects/Siren";
import Siret from "../../../valueObjects/Siret";
import { DefaultObject } from "../../../@types";
import ApplicationFlatEntity from "../../../entities/ApplicationFlatEntity";

export class ApplicationFlatPort extends MongoPort<ApplicationFlatEntity> {
    collectionName = "applications-flat";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ idBeneficiaire: 1 });
        await this.collection.createIndex({ exerciceBudgetaire: 1 });
        await this.collection.createIndex({ idUnique: 1 }, { unique: true });
    }

    public async hasBeenInitialized() {
        const dbo = await this.collection.findOne({});
        return !!dbo;
    }

    public insertOne(entity: ApplicationFlatEntity) {
        return this.collection.insertOne(entity);
    }

    public upsertOne(entity: ApplicationFlatEntity) {
        return this.collection.updateOne({ idUnique: entity.idUnique }, { $set: entity }, { upsert: true });
    }

    public upsertMany(entities: ApplicationFlatEntity[]) {
        const bulk = entities.map(e => ({
            updateOne: {
                filter: { idUnique: e.idUnique },
                update: { $set: entities },
                upsert: true,
            },
        }));
        return this.collection.bulkWrite(bulk, { ordered: false });
    }

    public insertMany(entities: ApplicationFlatEntity[]) {
        return this.collection.insertMany(entities, { ordered: false });
    }

    public cursorFind(query: DefaultObject<unknown> = {}, projection: DefaultObject<unknown> = {}) {
        return this.collection.find(query, projection).map(dbo => new ApplicationFlatEntity(dbo));
    }

    public async deleteAll() {
        await this.collection.deleteMany({});
    }

    public async findBySiret(siret: Siret) {
        return this.collection
            .find({
                typeIdEtablissementBeneficiaire: "siret",
                idEtablissementBeneficiaire: siret.value,
            })
            .map(dbo => new ApplicationFlatEntity(dbo))
            .toArray();
    }

    public async findBySiren(siren: Siren) {
        return this.collection
            .find({
                typeIdBeneficiaire: { $in: ["siren", "siret"] },
                idBeneficiaire: new RegExp(`^${siren.value}\\d{0,5}`),
                // TODO maybe we want an explicit property so that we can have an index
            })
            .map(dbo => new ApplicationFlatEntity(dbo))
            .toArray();
    }

    public async findByEJ(ej: string) {
        return this.collection
            .find({ ej })
            .map(dbo => new ApplicationFlatEntity(dbo))
            .toArray();
    }
}

const applicationFlatPort = new ApplicationFlatPort();
export default applicationFlatPort;
