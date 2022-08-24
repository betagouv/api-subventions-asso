import { FindOneAndUpdateOptions } from "mongodb";
import LeCompteAssoRequestEntity from "../entities/LeCompteAssoRequestEntity";
import { Rna, Siret, Siren } from "@api-subventions-asso/dto";
import MigrationRepository from "../../../../shared/MigrationRepository";

export class LeCompteAssoRepository extends MigrationRepository<LeCompteAssoRequestEntity> {
    readonly collectionName = "lecompteasso-requests";

    public async addRequest(request: LeCompteAssoRequestEntity) {
        return this.collection.insertOne(request);
    }

    public async update(request: LeCompteAssoRequestEntity) {
        const options = { returnNewDocument: true } as FindOneAndUpdateOptions;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...requestWithoutId } = request;
        return (await this.collection.findOneAndUpdate(
            { "providerInformations.compteAssoId": request.providerInformations.compteAssoId },
            { $set: requestWithoutId },
            options
        )).value as LeCompteAssoRequestEntity;
    }

    public findByCompteAssoId(compteAssoId: string) {
        return this.collection.findOne({ "providerInformations.compteAssoId": compteAssoId }) as unknown as (LeCompteAssoRequestEntity | null);
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

    public findsByRna(rna: Rna) {
        return this.collection.find({
            "legalInformations.rna": rna
        }).toArray();
    }
}

const leCompteAssoRepository: LeCompteAssoRepository = new LeCompteAssoRepository();

export default leCompteAssoRepository;