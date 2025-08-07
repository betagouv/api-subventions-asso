import { AggregationCursor } from "mongodb";
import db from "../../../../shared/MongoConnection";
import osirisActionPort from "./osiris.action.port";
import osirisRequestPort from "./osiris.request.port";
import OsirisRequestEntity from "../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";

export type OsirisRequestWithActions = OsirisRequestEntity & { actions: OsirisActionEntity[] };

export class OsirisJoiner {
    applicationCollection = db.collection(osirisRequestPort.collectionName);

    private get joinPipeline() {
        return [
            {
                $lookup: {
                    from: osirisActionPort.collectionName,
                    localField: osirisRequestPort.joinIndexes.osirisActionPort,
                    foreignField: osirisActionPort.joinIndexes.osirisRequestPort,
                    as: "actions",
                },
            },
        ];
    }

    findAllCursor(): AggregationCursor<OsirisRequestWithActions> {
        return this.applicationCollection.aggregate(this.joinPipeline);
    }

    findByExerciseCursor(exercise: number): AggregationCursor<OsirisRequestWithActions> {
        return this.applicationCollection.aggregate([
            { $match: { "providerInformations.exercise": exercise } },
            ...this.joinPipeline,
        ]);
    }
}

const osirisJoiner = new OsirisJoiner();
export default osirisJoiner;
