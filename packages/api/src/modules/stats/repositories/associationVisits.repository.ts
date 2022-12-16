import db from "../../../shared/MongoConnection";
import { AssociationTop } from "packages/dto";

export class AssociationVisitsRepository {
    private readonly collection = db.collection<AssociationTop>("association-visits");

    public async selectMostRequestedAssos(limit: number): Promise<AssociationTop[]> {
        return await this.collection.find({}, { limit, sort: { nbRequests: -1 }, projection: { _id: 0 } }).toArray();
    }

    public updateAssoVisitCountByIncrement(name: string) {
        return this.collection.findOneAndUpdate({ name }, { $inc: { nbRequests: 1 } }, { upsert: true });
    }
}

const assoVisitsRepository = new AssociationVisitsRepository();
export default assoVisitsRepository;
