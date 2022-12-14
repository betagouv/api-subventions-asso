import db from "../../../shared/MongoConnection";
import { TopAssociations } from "@api-subventions-asso/dto";

export class AssoVisitsRepository {
    private readonly collection = db.collection("association-visits");

    public async selectMostRequestsAssos(limit: number): Promise<TopAssociations> {
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
}

const assoVisitsRepository = new AssoVisitsRepository();
export default assoVisitsRepository;
