import ProviderRequestLog from "../../../modules/provider-request/entities/ProviderRequestLog";
import ProviderRequestLogDbo from "./ProviderRequestLogDbo";
import ProviderRequestLogMapper from "./provider-request-log.mapper";
import { ProviderRequestPort } from "./provider-request.port";
import MongoAdapter from "../MongoAdapter";

class ProviderRequestAdapter extends MongoAdapter<ProviderRequestLogDbo> implements ProviderRequestPort {
    public collectionName = "provider-request-log";

    async createIndexes() {
        // index is created for read table
    }

    async create(entity: ProviderRequestLog): Promise<void> {
        const dbo = ProviderRequestLogMapper.fromEntity(entity);

        await this.collection.insertOne(dbo);
    }
}

const providerRequestPort = new ProviderRequestAdapter();

export default providerRequestPort;
