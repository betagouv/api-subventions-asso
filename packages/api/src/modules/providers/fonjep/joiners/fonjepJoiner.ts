import fonjepPaymentPort from "../../../../dataProviders/db/providers/fonjep/fonjep.payment.port";
import fonjepSubventionPort from "../../../../dataProviders/db/providers/fonjep/fonjep.subvention.port";
import db from "../../../../shared/MongoConnection";
import { FullGrantData } from "../../../grant/@types/rawGrant";
import FonjepSubventionEntity from "../entities/FonjepSubventionEntity";
import FonjepPaymentEntity from "../entities/FonjepPaymentEntity";
import Siret from "../../../../valueObjects/Siret";
import Siren from "../../../../valueObjects/Siren";

export class FonjepJoiner {
    applicationCollection = db.collection(fonjepSubventionPort.collectionName);

    private get joinPipeline() {
        return [
            { $project: { _id: 0 } },
            { $project: { application: "$$ROOT" } },
            {
                $lookup: {
                    from: fonjepPaymentPort.collectionName,
                    localField: "application." + fonjepSubventionPort.joinIndexes[fonjepPaymentPort.collectionName],
                    foreignField: fonjepPaymentPort.joinIndexes[fonjepSubventionPort.collectionName],
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
