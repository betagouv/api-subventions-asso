import { Rna, Siren, Siret } from "dto";
import db from "../../../../shared/MongoConnection";
import MiscScdlGrantProducerEntity from "../entities/MiscScdlGrantProducerEntity";
import miscScdlGrantRepository from "./miscScdlGrant.repository";
import miscScdlProducerRepository from "./miscScdlProducer.repository";

export class MiscScdlJoiner {
    applicationCollection = db.collection(miscScdlGrantRepository.collectionName);

    private get joinPipeline() {
        return [
            { $match: { conventionDate: { $type: 9 } } },
            {
                $lookup: {
                    from: miscScdlProducerRepository.collectionName,
                    localField: miscScdlGrantRepository.joinIndexes.miscScdlProducer,
                    foreignField: miscScdlProducerRepository.joinIndexes.miscScdlGrant,
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
            .aggregate([{ $match: { associationSiret: { $regex: `^${siren}` } } }, ...this.joinPipeline], {
                hint: { associationSiret: 1 },
            })
            .toArray() as Promise<MiscScdlGrantProducerEntity[]>;
    }

    findBySiret(siret: Siret) {
        return this.applicationCollection
            .aggregate([{ $match: { associationSiret: siret } }, ...this.joinPipeline])
            .toArray() as Promise<MiscScdlGrantProducerEntity[]>;
    }

    findByRna(rna: Rna) {
        return this.applicationCollection
            .aggregate([{ $match: { associationRna: rna } }, ...this.joinPipeline])
            .toArray() as Promise<MiscScdlGrantProducerEntity[]>;
    }
}
const miscScdlJoiner = new MiscScdlJoiner();
export default miscScdlJoiner;
