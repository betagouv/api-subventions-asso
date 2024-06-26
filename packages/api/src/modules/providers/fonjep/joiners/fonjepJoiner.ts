import { Siren, Siret } from "dto";
import fonjepPaymentRepository from "../repositories/fonjep.payment.repository";
import fonjepSubventionRepository from "../repositories/fonjep.subvention.repository";
import db from "../../../../shared/MongoConnection";
import { FullGrantData } from "../../../grant/@types/rawGrant";
import FonjepSubventionEntity from "../entities/FonjepSubventionEntity";
import FonjepPaymentEntity from "../entities/FonjepPaymentEntity";

export class FonjepJoiner {
    applicationCollection = db.collection(fonjepSubventionRepository.collectionName);

    private get joinPipeline() {
        return [
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $project: {
                    application: "$$ROOT",
                },
            },
            {
                $lookup: {
                    from: fonjepPaymentRepository.collectionName,
                    let: { joinId: fonjepSubventionRepository.joinIndexes[fonjepPaymentRepository.collectionName] },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        fonjepPaymentRepository.joinIndexes[fonjepSubventionRepository.collectionName],
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

    public getFullFonjepGrantsBySiret(siret: Siret) {
        return this.applicationCollection
            .aggregate([{ $match: { "legalInformations.siret": siret } }, ...this.joinPipeline])
            .toArray();
    }

    public getFullFonjepGrantsBySiren(siren: Siren) {
        return this.applicationCollection
            .aggregate([{ $match: { "legalInformations.siret": { $regex: `^${siren}\\d{5}` } } }, ...this.joinPipeline])
            .toArray() as unknown as FullGrantData<FonjepSubventionEntity, FonjepPaymentEntity>[];
    }
}

const fonjepJoiner = new FonjepJoiner();

export default fonjepJoiner;
