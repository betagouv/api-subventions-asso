import fonjepPaymentRepository from "../repositories/fonjep.payment.repository";
import fonjepSubventionRepository from "../repositories/fonjep.subvention.repository";
import db from "../../../../shared/MongoConnection";
import { FullGrantData } from "../../../grant/@types/rawGrant";
import FonjepSubventionEntity from "../entities/FonjepSubventionEntity";
import FonjepPaymentEntity from "../entities/FonjepPaymentEntity";
import Siret from "../../../../valueObjects/Siret";
import Siren from "../../../../valueObjects/Siren";

export class FonjepJoiner {
    applicationCollection = db.collection(fonjepSubventionRepository.collectionName);

    private get joinPipeline() {
        return [
            { $project: { _id: 0 } },
            { $project: { application: "$$ROOT" } },
            {
                $lookup: {
                    from: fonjepPaymentRepository.collectionName,
                    localField:
                        "application." + fonjepSubventionRepository.joinIndexes[fonjepPaymentRepository.collectionName],
                    foreignField: fonjepPaymentRepository.joinIndexes[fonjepSubventionRepository.collectionName],
                    as: "payments",
                },
            },
        ];
    }

    public getFullFonjepGrantsBySiret(siret: Siret) {
        return this.applicationCollection
            .aggregate([{ $match: { "legalInformations.siret": siret.value } }, ...this.joinPipeline])
            .toArray() as Promise<FullGrantData<FonjepSubventionEntity, FonjepPaymentEntity>[]>;
    }

    public getFullFonjepGrantsBySiren(siren: Siren) {
        return this.applicationCollection
            .aggregate([
                { $match: { "legalInformations.siret": { $regex: `^${siren.value}\\d{5}` } } },
                ...this.joinPipeline,
            ])
            .toArray() as Promise<FullGrantData<FonjepSubventionEntity, FonjepPaymentEntity>[]>;
    }
}

const fonjepJoiner = new FonjepJoiner();

export default fonjepJoiner;
