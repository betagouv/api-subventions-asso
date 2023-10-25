import MigrationRepository from "../../../shared/MigrationRepository";
import ProviderRequestLog from "../entities/ProviderRequestLog";
import ProviderRequestLogAdapter from "./adapters/ProviderRequestLogAdapter";
import ProviderRequestLogDbo from "./dbo/ProviderRequestLogDbo";

class ProviderRequestRepository extends MigrationRepository<ProviderRequestLogDbo> {
    public collectionName = "provider-request-log";

    async create(entity: ProviderRequestLog) {
        const dbo = ProviderRequestLogAdapter.fromEntity(entity);

        await this.collection.insertOne(dbo);
    }
}

const providerRequestRepository = new ProviderRequestRepository();

export default providerRequestRepository;
