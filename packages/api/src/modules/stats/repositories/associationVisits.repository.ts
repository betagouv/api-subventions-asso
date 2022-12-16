import db from "../../../shared/MongoConnection";
import { AssociationTop } from "@api-subventions-asso/dto";

export class AssociationVisitsRepository {
    private readonly collection = db.collection("association-visits");

    public async selectMostRequestedAssosByPeriod(limit: number, start: Date, end: Date): Promise<AssociationTop[]> {
        return await this.collection
            .aggregate<AssociationTop>([
                { $match: { monthYear: { $gte: start, $lte: end } } },
                { $group: { _id: "$name", nbRequests: { $sum: "$nbRequests" } } },
                { $sort: { nbRequests: -1 } },
                { $limit: limit },
                { $project: { name: "$_id", nbRequests: 1, _id: 0 } }
            ])
            .toArray();
    }

    public updateAssoVisitCountByIncrement(name: string, monthYear: Date) {
        return this.collection.findOneAndUpdate({ name, monthYear }, { $inc: { nbRequests: 1 } }, { upsert: true });
    }
}

const assoVisitsRepository = new AssociationVisitsRepository();
export default assoVisitsRepository;
