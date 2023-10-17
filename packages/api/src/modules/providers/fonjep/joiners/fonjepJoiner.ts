import { Siren, Siret } from "dto";
import fonjepVersementRepository from "../repositories/fonjep.versement.repository";
import fonjepSubventionRepository from "../repositories/fonjep.subvention.repository";
import db from "../../../../shared/MongoConnection";

export class FonjepJoiner {
    applicationCollection = db.collection(fonjepSubventionRepository.collectionName);

    private get joinPipeline() {
        return [
            {
                $lookup: {
                    from: fonjepVersementRepository.collectionName,
                    let: { joinId: fonjepSubventionRepository.joinIndexes[fonjepVersementRepository.collectionName] },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        fonjepVersementRepository.joinIndexes[
                                            fonjepSubventionRepository.collectionName
                                        ],
                                        "$$joinId",
                                    ],
                                },
                            },
                        },
                    ],
                    as: "payments",
                },
            },
        ];
    }

    public getAllFullGrants() {
        return this.applicationCollection.aggregate([{ $match: {} }, ...this.joinPipeline]).toArray();
    }

    public getFullFonjepGrantsBySiret(siret: Siret) {
        return this.applicationCollection
            .aggregate([{ $match: { "legalInformations.siret": siret } }, ...this.joinPipeline])
            .toArray();
    }

    public getFullFonjepGrantsBySiren(siren: Siren) {
        return this.applicationCollection
            .aggregate([{ $match: { "legalInformations.siret": { $regex: `^${siren}\\d{5}` } } }, ...this.joinPipeline])
            .toArray();
    }
}

const fonjepJoiner = new FonjepJoiner();

export default fonjepJoiner;
