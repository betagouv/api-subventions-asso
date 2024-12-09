import { ObjectId } from "mongodb";

import ProviderRequestLog from "../../../modules/provider-request/entities/ProviderRequestLog";
import ProviderRequestLogDbo from "./ProviderRequestLogDbo";

export default class ProviderRequestLogAdapter {
    static toEntity(dbo: ProviderRequestLogDbo): ProviderRequestLog {
        return new ProviderRequestLog(
            dbo.providerId,
            dbo.route,
            dbo.date,
            dbo.responseCode,
            dbo.type,
            dbo._id.toString(),
        );
    }

    static fromEntity(entity: ProviderRequestLog): ProviderRequestLogDbo {
        return {
            _id: entity.id ? new ObjectId(entity.id) : new ObjectId(),
            providerId: entity.providerId,
            date: entity.date,
            route: entity.route,
            responseCode: entity.responseCode,
            type: entity.type,
        };
    }
}
