import { FindOneAndUpdateOptions } from 'mongodb';
import { Rna, Siren, Siret } from '../../../../@types';
import db from "../../../../shared/MongoConnection";
import GisproRequestEntity from "../entities/GisproRequestEntity";

export class GisproRepository {
    private readonly requestCollection = db.collection<GisproRequestEntity>("gispro-requests");

    public async upsertMany(gisproRequests: GisproRequestEntity[]) {
        // TODO implement upsertMany
        console.log(gisproRequests);
    }

    // Request Part
    public async addRequest(gisproRequest: GisproRequestEntity) {
        await this.requestCollection.insertOne(gisproRequest);
        return this.findRequestByGisproId(gisproRequest.providerInformations.gisproId) as GisproRequestEntity;
    }

    public findRequestByGisproId(gisproId: string) {
        return this.requestCollection.findOne({ "providerInformations.gisproId": gisproId }) as unknown as (GisproRequestEntity | null);
    }

    public async updateRequest(gisproRequest: GisproRequestEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...requestWithoutId } = gisproRequest;
        return (await this.requestCollection.findOneAndUpdate({ 
            "providerInformations.gisproId": gisproRequest.providerInformations.gisproId 
        },
        { $set: requestWithoutId }, options)).value as GisproRequestEntity;
    }

    // TODO: extract this and share with other repositories
    public findRequestsBySiret(siret: Siret) {
        return this.requestCollection.find({
            "legalInformations.siret": siret
        }).toArray();
    }

    public findRequestsByRna(rna: Rna) {
        return this.requestCollection.find({
            "legalInformations.rna": rna
        }).toArray();
    }

    public async findRequestsBySiren(siren: Siren) {
        return this.requestCollection.find({
            "legalInformations.siret":  new RegExp(`^${siren}\\d{5}`)
        }).toArray();
    }
}

const gisproRepository: GisproRepository = new GisproRepository();

export default gisproRepository;