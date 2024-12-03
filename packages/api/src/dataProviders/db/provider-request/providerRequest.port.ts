import MigrationPort from "../../../shared/MongoPort";
import ProviderRequestLog from "../../../modules/provider-request/entities/ProviderRequestLog";
import ProviderRequestLogDbo from "./ProviderRequestLogDbo";
import ProviderRequestLogAdapter from "./ProviderRequestLog.adapter";

class ProviderRequestPort extends MigrationPort<ProviderRequestLogDbo> {
    public collectionName = "provider-request-log";

    async createIndexes() {
        // index is created for read table
    }

    async create(entity: ProviderRequestLog) {
        const dbo = ProviderRequestLogAdapter.fromEntity(entity);

        await this.collection.insertOne(dbo);
    }
}

const providerRequestPort = new ProviderRequestPort();

export default providerRequestPort;
