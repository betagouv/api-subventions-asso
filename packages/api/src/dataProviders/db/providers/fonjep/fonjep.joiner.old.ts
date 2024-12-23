import db from "../../../../shared/MongoConnection";
import { FullGrantData } from "../../../../modules/grant/@types/rawGrant";
import FonjepSubventionEntity from "../../../../modules/providers/fonjep/entities/FonjepSubventionEntity.old";
import FonjepPaymentEntity from "../../../../modules/providers/fonjep/entities/FonjepPaymentEntity.old";
import Siret from "../../../../valueObjects/Siret";
import Siren from "../../../../valueObjects/Siren";
import fonjepPaymentPort from "./fonjep.payment.port.old";
import fonjepSubventionPort from "./fonjep.subvention.port.old";

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
