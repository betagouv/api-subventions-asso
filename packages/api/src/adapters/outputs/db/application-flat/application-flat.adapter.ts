import MongoAdapter from "../MongoAdapter";
import Siren from "../../../../identifier-objects/Siren";
import Siret from "../../../../identifier-objects/Siret";
import { DefaultObject } from "../../../../@types";
import ApplicationFlatMapper from "../../../../modules/applicationFlat/application-flat.mapper";
import { ApplicationFlatDbo } from "./@types/ApplicationFlatDbo";
import { ApplicationFlatEntity } from "../../../../entities//flats/ApplicationFlatEntity";
import { insertStreamByBatch } from "../../../../shared/helpers/MongoHelper";
import { Readable } from "stream";
import { ApplicationFlatPort } from "./application-flat.port";

export class ApplicationFlatAdapter
    extends MongoAdapter<Omit<ApplicationFlatDbo, "_id">>
    implements ApplicationFlatPort
{
    readonly collectionName = "applications-flat";
    readonly backupCollectionName = this.collectionName + "-backup";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ fournisseur: 1 });
        await this.collection.createIndex({ idEtablissementBeneficiaire: 1 });
        await this.collection.createIndex({ exerciceBudgetaire: 1 });
        await this.collection.createIndex({ idUnique: 1 }, { unique: true });
    }

    public async hasBeenInitialized(): Promise<boolean> {
        const dbo = await this.collection.findOne({});
        return !!dbo;
    }

    public async insertOne(entity: ApplicationFlatEntity): Promise<void> {
        await this.collection.insertOne(ApplicationFlatMapper.entityToDbo(entity));
    }

    public async upsertOne(entity: ApplicationFlatEntity): Promise<void> {
        const dbo = ApplicationFlatMapper.entityToDbo(entity);
        await this.collection.updateOne({ idUnique: dbo.idUnique }, { $set: dbo }, { upsert: true });
    }

    public async upsertMany(entities: ApplicationFlatEntity[]): Promise<void> {
        if (!entities.length) return Promise.resolve();
        const bulk = entities.map(entity => {
            const dbo = ApplicationFlatMapper.entityToDbo(entity);
            return {
                updateOne: {
                    filter: { idUnique: dbo.idUnique },
                    update: { $set: dbo },
                    upsert: true,
                },
            };
        });
        await this.collection.bulkWrite(bulk, { ordered: false });
    }

    public async insertMany(entities: ApplicationFlatEntity[]): Promise<void> {
        await this.collection.insertMany(
            entities.map(e => ApplicationFlatMapper.entityToDbo(e)),
            { ordered: false },
        );
    }

    public cursorFind(
        query: DefaultObject<unknown> = {},
        projection: DefaultObject<unknown> = {},
    ): AsyncIterable<ApplicationFlatEntity> {
        return this.collection.find(query, projection).map(dbo => ApplicationFlatMapper.dboToEntity(dbo));
    }

    public async deleteAll(): Promise<void> {
        await this.collection.deleteMany({});
    }

    public async findBySiret(siret: Siret): Promise<ApplicationFlatEntity[]> {
        return this.collection
            .find({
                typeIdEtablissementBeneficiaire: siret.name,
                idEtablissementBeneficiaire: siret.value,
            })
            .map(dbo => ApplicationFlatMapper.dboToEntity(dbo))
            .toArray();
    }

    public async findBySiren(siren: Siren): Promise<ApplicationFlatEntity[]> {
        return this.collection
            .find({
                typeIdEtablissementBeneficiaire: Siret.getName(),
                idEtablissementBeneficiaire: new RegExp(`^${siren.value}\\d{5}`),
                // TODO maybe we want an explicit property so that we can have an index
            })
            .map(dbo => ApplicationFlatMapper.dboToEntity(dbo))
            .toArray();
    }

    public async findByEJ(ej: string): Promise<ApplicationFlatEntity[]> {
        return this.collection
            .find({ ej })
            .map(dbo => ApplicationFlatMapper.dboToEntity(dbo))
            .toArray();
    }

    // we use bulk instead of deleteMany as $in might cause performance issues with large arrays
    public async bulkFindDeleteByExercises(provider: string, exercises: number[]): Promise<void> {
        const bulk = this.collection.initializeUnorderedBulkOp();
        exercises.forEach(exercise => {
            const query: Partial<ApplicationFlatDbo> = { fournisseur: provider, exerciceBudgetaire: exercise };
            bulk.find(query).delete();
        });
        await bulk.execute().catch(error => {
            throw error;
        });
    }

    /**
     * Save all given provider data in a backup collection
     * @param provider provider
     */
    public async createBackupByProvider(provider: string): Promise<void> {
        console.log(
            `creating partial backup for provider '${provider}' for applicationFlat collection ${this.backupCollectionName}`,
        );
        await this.collection.aggregate([{ $match: { provider } }, { $out: this.backupCollectionName }]).toArray();
    }

    /**
     * Drop the backup collection
     */
    public async dropBackupCollection(): Promise<void> {
        console.log(`Dropping backup collection ${this.backupCollectionName}`);
        await this.db.collection(this.backupCollectionName).drop();
    }

    /**
     * Apply backup collection created in createBackupCollection
     * @param providerId
     */
    public async applyBackupCollection(providerId: string): Promise<void> {
        await this.collection.deleteMany({ provider: providerId });
        await insertStreamByBatch(
            Readable.toWeb(this.db.collection(this.backupCollectionName).find().stream()),
            this.upsertMany,
            10000,
        );
        await this.dropBackupCollection();
    }

    async findAll(): Promise<ApplicationFlatEntity[]> {
        return this.collection
            .find({})
            .map(dbo => ApplicationFlatMapper.dboToEntity(dbo))
            .toArray();
    }
}

const applicationFlatAdapter = new ApplicationFlatAdapter();
export default applicationFlatAdapter;
