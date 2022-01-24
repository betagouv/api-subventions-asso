import db from "../../../shared/MongoConnection";
import { FindOneAndUpdateOptions } from "mongodb";
import LeCompteAssoRequestEntity from "../entities/LeCompteAssoRequestEntity";
import { Rna } from "../../../@types/Rna";
import { Siret } from "../../../@types/Siret";

export class LeCompteAssoRepository {
    private readonly requestCollection = db.collection<LeCompteAssoRequestEntity>("lecompteasso-requests");

    public async addRequest(request: LeCompteAssoRequestEntity) {
        await this.requestCollection.insertOne(request);
        return this.findByCompteAssoId(request.providerInformations.compteAssoId) as LeCompteAssoRequestEntity;
    }

    public async updateRequest(request: LeCompteAssoRequestEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {_id, ...requestWithoutId } = request;
        return (await this.requestCollection.findOneAndUpdate({ 
            "providerInformations.compteAssoId": request.providerInformations.compteAssoId
        },
        { $set: requestWithoutId }, options)).value as LeCompteAssoRequestEntity;
    }

    public findByCompteAssoId(compteAssoId: string) {
        return this.requestCollection.findOne({ "providerInformations.compteAssoId": compteAssoId }) as unknown as (LeCompteAssoRequestEntity | null);
    }

    public findsBySiret(siret: Siret) {
        return this.requestCollection.find({
            "legalInformations.siret": siret
        }).toArray();
    }

    public findsByRna(rna: Rna) {
        return this.requestCollection.find({
            "legalInformations.rna": rna
        }).toArray();
    }
}

const leCompteAssoRepository: LeCompteAssoRepository = new LeCompteAssoRepository();

export default leCompteAssoRepository;