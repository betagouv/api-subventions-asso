import { FindOneAndUpdateOptions } from 'mongodb';
import { Siren, Siret } from '@api-subventions-asso/dto';
import MigrationRepository from '../../../../shared/MigrationRepository';
import GisproActionEntity from "../entities/GisproActionEntity";

export class GisproRepository extends MigrationRepository<GisproActionEntity>{
    public collectionName = "gispro-actions";

    public async upsertMany(entities: GisproActionEntity[]) {
        const result = await this.collection.bulkWrite(entities.map(entity => {
        
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {_id, ...entityWithoutId } = entity;
            return {
                updateOne: {
                    filter: { "providerInformations.codeAction": entity.providerInformations.codeAction },
                    update: {$set: entityWithoutId },
                    upsert: true,
                }
            }
        }))

        return {
            insertedCount: result.insertedCount,
            modifiedCount: result.modifiedCount,
        }
    }

    public async insertMany(entities: GisproActionEntity[]) {
        const result = await this.collection.insertMany(entities);
        return {
            insertedCount: result.insertedCount,
        }
    }

    public async add(entity: GisproActionEntity) {
        await this.collection.insertOne(entity);
        return this.findByActionCode(entity.providerInformations.codeAction) as GisproActionEntity;
    }

    public findByActionCode(codeAction: string) {
        return this.collection.findOne({ "providerInformations.codeAction": codeAction }) as unknown as (GisproActionEntity | null);
    }

    public async update(entity: GisproActionEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...entityWithoutId } = entity;
        return (await this.collection.findOneAndUpdate({ 
            "providerInformations.codeAction": entity.providerInformations.codeAction 
        },
        { $set: entityWithoutId }, options)).value as GisproActionEntity;
    }

    // TODO: extract this and share with other repositories
    public findBySiret(siret: Siret) {
        return this.collection.find({
            "providerInformations.siret": siret
        }).toArray();
    }

    public async findBySiren(siren: Siren) {
        return this.collection.find({
            "providerInformations.siret":  new RegExp(`^${siren}\\d{5}`)
        }).toArray();
    }

    // TODO: Comment retourner une demande de subvention par ID unique ?
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async findById(id: string) {
        return null;
        // return this.collection.findOne({ "_id": new ObjectId(string) });
    }
}

const gisproRepository: GisproRepository = new GisproRepository();

export default gisproRepository;