import db from "../../../../shared/MongoConnection";
import Rna from "../../../../valueObjects/Rna";
import Siren from "../../../../valueObjects/Siren";
import Siret from "../../../../valueObjects/Siret";
import MiscScdlGrantProducerEntity from "../../../../modules/providers/scdl/entities/MiscScdlGrantProducerEntity";
import miscScdlProducerPort from "./miscScdlProducer.port";
import miscScdlGrantPort from "./miscScdlGrant.port";

export class MiscScdlJoiner {
    applicationCollection = db.collection(miscScdlGrantPort.collectionName);

    private get joinPipeline() {
        return [
            {
                $lookup: {
                    from: miscScdlProducerPort.collectionName,
                    localField: miscScdlGrantPort.joinIndexes.miscScdlProducer,
                    foreignField: miscScdlProducerPort.joinIndexes.miscScdlGrant,
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
