import MongoPort from "../../../shared/MongoPort";
import Siren from "../../../identifierObjects/Siren";
import Siret from "../../../identifierObjects/Siret";
import { DefaultObject } from "../../../@types";
import ApplicationFlatAdapter from "../../../modules/applicationFlat/ApplicationFlatAdapter";
import { ApplicationFlatDbo } from "./ApplicationFlatDbo";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";

export class ApplicationFlatPort extends MongoPort<Omit<ApplicationFlatDbo, "_id">> {
    readonly collectionName = "applications-flat";
    readonly backupCollectionName = this.collectionName + "-backup";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ idEtablissementBeneficiaire: 1 });
        await this.collection.createIndex({ exerciceBudgetaire: 1 });
        await this.collection.createIndex({ idUnique: 1 }, { unique: true });
    }

    public async hasBeenInitialized() {
        const dbo = await this.collection.findOne({});
        return !!dbo;
    }

    public insertOne(entity: ApplicationFlatEntity) {
        return this.collection.insertOne(ApplicationFlatAdapter.entityToDbo(entity));
    }

    public upsertOne(entity: ApplicationFlatEntity) {
        const dbo = ApplicationFlatAdapter.entityToDbo(entity);
        return this.collection.updateOne({ idUnique: dbo.idUnique }, { $set: dbo }, { upsert: true });
    }

    public upsertMany(entities: ApplicationFlatEntity[]) {
        if (!entities.length) return Promise.resolve();
        const bulk = entities.map(entity => {
            const dbo = ApplicationFlatAdapter.entityToDbo(entity);
            return {
                updateOne: {
                    filter: { idUnique: dbo.idUnique },
                    update: { $set: dbo },
                    upsert: true,
                },
            };
        });
        return this.collection.bulkWrite(bulk, { ordered: false });
    }

    public insertMany(entities: ApplicationFlatEntity[]) {
        return this.collection.insertMany(
            entities.map(e => ApplicationFlatAdapter.entityToDbo(e)),
            { ordered: false },
        );
    }

    public cursorFind(query: DefaultObject<unknown> = {}, projection: DefaultObject<unknown> = {}) {
        return this.collection.find(query, projection).map(dbo => ApplicationFlatAdapter.dboToEntity(dbo));
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
            .map(dbo => ApplicationFlatAdapter.dboToEntity(dbo))
            .toArray();
    }

    public async findBySiren(siren: Siren) {
        return this.collection
            .find({
                typeidEtablissementBeneficiaire: "siret",
                idEtablissementBeneficiaire: new RegExp(`^${siren.value}\\d{5}`),
                // TODO maybe we want an explicit property so that we can have an index
            })
            .map(dbo => ApplicationFlatAdapter.dboToEntity(dbo))
            .toArray();
    }

    public async findByEJ(ej: string) {
        return this.collection
            .find({ ej })
            .map(dbo => ApplicationFlatAdapter.dboToEntity(dbo))
            .toArray();
    }

    // we use bulk instead of deleteMany as $in might cause performance issues with large arrays
    public async bulkFindDeleteByExercises(provider: string, exercises: number[]) {
        const bulk = this.collection.initializeUnorderedBulkOp();
        exercises.forEach(exercise => {
            bulk.find({ provider, exercise }).delete();
        });
        return bulk.execute().catch(error => {
            throw error;
        });
    }

    /**
     * Save all given provider data in a backup collection
     * @param provider provider
     */
    public async createBackupByProvider(provider: string) {
        console.log(
            `creating partial backup for provider '${provider}' for applicationFlat collection ${this.backupCollectionName}`,
        );
        return this.collection.aggregate([{ $match: { provider } }, { $out: this.backupCollectionName }]).toArray();
    }

    /**
     * Drop the backup collection
     */
    public async dropBackupCollection() {
        console.log(`Dropping backup collection ${this.backupCollectionName}`);
        return this.db.collection(this.backupCollectionName).drop();
    }

    /**
     * Apply backup collection created in createBackupCollection
     * @param provider Producer slug
     */
    public async applyBackupCollection(provider: string) {
        await this.collection.deleteMany({ provider });
        await this.db
            .collection(this.backupCollectionName)
            .aggregate([{ $merge: { into: this.collection } }])
            .toArray();
        await this.createIndexes(); // backup seems to only copy the data, not the indexes
        await this.dropBackupCollection();
    }

    async findAll() {
        return this.collection
            .find({})
            .map(dbo => ApplicationFlatAdapter.dboToEntity(dbo))
            .toArray();
    }
}

const applicationFlatPort = new ApplicationFlatPort();
export default applicationFlatPort;
