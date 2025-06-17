import db from "../../../../shared/MongoConnection";
import Rna from "../../../../identifierObjects/Rna";
import Siren from "../../../../identifierObjects/Siren";
import Siret from "../../../../identifierObjects/Siret";
import MiscScdlGrantProducerEntity from "../../../../modules/providers/scdl/entities/MiscScdlGrantProducerEntity";
import miscScdlProducersPort from "./miscScdlProducers.port";
import miscScdlGrantPort from "./miscScdlGrant.port";

export class MiscScdlJoiner {
    applicationCollection = db.collection(miscScdlGrantPort.collectionName);

    private get joinPipeline() {
        return [
            {
                $lookup: {
                    from: miscScdlProducersPort.collectionName,
                    localField: miscScdlGrantPort.joinIndexes.miscScdlProducer,
                    foreignField: miscScdlProducersPort.joinIndexes.miscScdlGrant,
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
