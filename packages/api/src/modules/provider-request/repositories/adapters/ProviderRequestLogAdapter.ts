import { ObjectId } from "mongodb";

import ProviderRequestLog from "../../entities/ProviderRequestLog";
import ProviderRequestLogDbo from "../dbo/ProviderRequestLogDbo";

export default class ProviderRequestLogAdapter {
    static toDomain(dbo: ProviderRequestLogDbo): ProviderRequestLog {
        return new ProviderRequestLog(
            dbo.providerName,
            dbo.route,
            dbo.date,
            dbo.responseCode,
            dbo.type,
            dbo._id.toString(),
        );
    }

    static formDomain(entity: ProviderRequestLog): ProviderRequestLogDbo {
        return {
            _id: entity.id ? new ObjectId(entity.id) : new ObjectId(),
            providerName: entity.providerName,
            date: entity.date,
            route: entity.route,
            responseCode: entity.responseCode,
            type: entity.type,
        };
    }
}
