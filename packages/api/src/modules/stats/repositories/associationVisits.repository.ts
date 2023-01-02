import db from "../../../shared/MongoConnection";

export class AssociationVisitsRepository {
    private readonly collection = db.collection("association-visits");

    public async selectMostRequestedAssosByPeriod(limit: number, start: Date, end: Date) {
        return await this.collection
            .aggregate([
                { $match: { monthYear: { $gte: start, $lt: end } } },
                { $group: { _id: { rna: "$rna", siren: "$siren" }, nbRequests: { $sum: "$nbRequests" } } },
                { $sort: { nbRequests: -1 } },
                { $limit: limit }
            ])
            .toArray();
    }

    public updateAssoVisitCountByIncrement(name: string, monthYear: Date) {
        // TODO get by identifier and update if more data is known, set to new identifier values
        //  (tested: it does not remove data to $set with undefined but it does with null)
        return this.collection.findOneAndUpdate({ name, monthYear }, { $inc: { nbRequests: 1 } }, { upsert: true });
    }
}

const assoVisitsRepository = new AssociationVisitsRepository();
export default assoVisitsRepository;
