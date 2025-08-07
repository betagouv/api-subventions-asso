import db from "../../../../shared/MongoConnection";
import osirisActionPort from "./osiris.action.port";
import osirisRequestPort from "./osiris.request.port";

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

    getCursor() {
        return this.applicationCollection.aggregate(this.joinPipeline);
    }
}
