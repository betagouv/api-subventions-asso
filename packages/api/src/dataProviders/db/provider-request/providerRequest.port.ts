import MigrationRepository from "../../../shared/MongoRepository";
import ProviderRequestLog from "../../../modules/provider-request/entities/ProviderRequestLog";
import ProviderRequestLogDbo from "./ProviderRequestLogDbo";
import ProviderRequestLogAdapter from "./ProviderRequestLog.adapter";

class ProviderRequestRepository extends MigrationRepository<ProviderRequestLogDbo> {
    public collectionName = "provider-request-log";

    async createIndexes() {
        // index is created for read table
    }

    async create(entity: ProviderRequestLog) {
        const dbo = ProviderRequestLogAdapter.fromEntity(entity);

        await this.collection.insertOne(dbo);
    }
}

const providerRequestRepository = new ProviderRequestRepository();

export default providerRequestRepository;
