import db from "../../../../shared/MongoConnection";
import Rna from "../../../../identifierObjects/Rna";
import Siren from "../../../../identifierObjects/Siren";
import Siret from "../../../../identifierObjects/Siret";
import MiscScdlGrantProducerEntity from "../../../../modules/providers/scdl/entities/MiscScdlGrantProducerEntity";
import miscScdlProducersAdapter from "./miscScdlProducers.adapter";
import miscScdlGrantAdapter from "./miscScdlGrant.adapter";

export class MiscScdlJoiner {
    applicationCollection = db.collection(miscScdlGrantAdapter.collectionName);

    private get joinPipeline() {
        return [
            {
                $lookup: {
                    from: miscScdlProducersAdapter.collectionName,
                    localField: miscScdlGrantAdapter.joinIndexes.miscScdlProducer,
                    foreignField: miscScdlProducersAdapter.joinIndexes.miscScdlGrant,
                    as: "producer",
                },
            },
            {
                $unwind: {
                    path: "$producer",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];
    }

    findBySiren(siren: Siren) {
        return this.applicationCollection
            .aggregate([{ $match: { associationSiret: { $regex: `^${siren.value}` } } }, ...this.joinPipeline], {
                hint: { associationSiret: 1 },
            })
            .toArray() as Promise<MiscScdlGrantProducerEntity[]>;
    }

    findBySiret(siret: Siret) {
        return this.applicationCollection
            .aggregate([{ $match: { associationSiret: siret.value } }, ...this.joinPipeline])
            .toArray() as Promise<MiscScdlGrantProducerEntity[]>;
    }

    findByRna(rna: Rna) {
        return this.applicationCollection
            .aggregate([{ $match: { associationRna: rna.value } }, ...this.joinPipeline])
            .toArray() as Promise<MiscScdlGrantProducerEntity[]>;
    }
}
const miscScdlJoiner = new MiscScdlJoiner();
export default miscScdlJoiner;
