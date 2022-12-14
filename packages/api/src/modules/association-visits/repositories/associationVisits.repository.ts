import db from "../../../shared/MongoConnection";
import { AssociationTop } from "@api-subventions-asso/dto";

export class AssociationVisitsRepository {
    private readonly collection = db.collection<AssociationTop>("association-visits");

    public async selectMostRequestsAssos(limit: number): Promise<AssociationTop[]> {
        /* TODO
         *   - define repo controller tests
         *   - define service test
         *   - fix field names
         *   - add tracking in association GET routes
         * */
        const res = await this.collection
            .find({}, { limit, sort: { nbRequests: -1 }, projection: { _id: 0 } })
            .toArray();
        return res as unknown as Promise<TopAssociations>;
    }

    public updateAssoVisitCountByIncrement(name: string) {
        return this.collection.findOneAndUpdate({ name }, { $inc: { nbRequests: 1 } }, { upsert: true });
    }
}

const assoVisitsRepository = new AssociationVisitsRepository();
export default assoVisitsRepository;
