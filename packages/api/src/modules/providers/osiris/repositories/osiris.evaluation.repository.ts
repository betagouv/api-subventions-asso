
import OsirisEvaluationEntity from '../entities/OsirisEvaluationEntity';
import { Siret, Siren } from "@api-subventions-asso/dto";
import MigrationRepository from "../../../../shared/MigrationRepository";
import { FindOneAndUpdateOptions } from 'mongodb';

export class OsirisEvaluationRepository extends MigrationRepository<OsirisEvaluationEntity> {
    readonly collectionName = "osiris-evaluation";

    public async findByActionId(actionId: string) {
        return this.collection.findOne({ 'indexedInformations.osirisActionId': actionId})
    }

    public async add(request: OsirisEvaluationEntity) {
        await this.collection.insertOne(request);
        return await this.findByActionId(request.indexedInformations.osirisActionId) as OsirisEvaluationEntity;
    }

    public async update(request: OsirisEvaluationEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...requestWithoutId } = request;
        return (await this.collection.findOneAndUpdate({ 
            "indexedInformations.osirisActionId": request.indexedInformations.osirisActionId
        },
        { $set: requestWithoutId }, options)).value as OsirisEvaluationEntity;
    }

    public findsBySiret(siret: Siret) {
        return this.collection.find({
            "legalInformations.siret": siret
        }).toArray();
    }

    public findBySiren(siren: Siren) {
        return this.collection.find({
            "legalInformations.siret": new RegExp(`^${siren}\\d{5}`)
        }).toArray();
    }

    public cursorFind(query = {}){
        return this.collection.find(query);
    }
}

const osirisEvaluationRepository = new OsirisEvaluationRepository();

export default osirisEvaluationRepository;