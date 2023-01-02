import db from "../../../shared/MongoConnection";
import { Rna, Siren } from "@api-subventions-asso/dto";

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

    public updateAssoVisitCountByIncrement(
        identifiers: { rna: Rna | undefined; siren: Siren | undefined },
        monthYear: Date
    ) {
        return this.collection.findOneAndUpdate(
            {
                monthYear,
                $or: [{ rna: identifiers.rna }, { siren: identifiers.rna }]
            },
            {
                $inc: { nbRequests: 1 },
                $set: { rna: identifiers.rna, siren: identifiers.siren }
            },
            { upsert: true }
        );
    }
}

const assoVisitsRepository = new AssociationVisitsRepository();
export default assoVisitsRepository;
