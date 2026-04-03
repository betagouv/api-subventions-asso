import { AggregationCursor } from "mongodb";
import db from "../../../../../shared/MongoConnection";
import osirisActionAdapter from "./osiris.action.adapter";
import osirisRequestAdapter from "./osiris.request.adapter";
import OsirisRequestEntity from "../../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import OsirisActionEntity from "../../../../../modules/providers/osiris/entities/OsirisActionEntity";

export type OsirisRequestWithActions = OsirisRequestEntity & { actions: OsirisActionEntity[] };

export class OsirisJoiner {
    applicationCollection = db.collection(osirisRequestAdapter.collectionName);

    private get joinPipeline() {
        return [
            {
                $lookup: {
                    from: osirisActionAdapter.collectionName,
                    localField: osirisRequestAdapter.joinIndexes.osirisActionPort,
                    foreignField: osirisActionAdapter.joinIndexes.osirisRequestPort,
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
