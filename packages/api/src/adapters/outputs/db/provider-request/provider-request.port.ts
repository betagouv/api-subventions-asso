import ProviderRequestLog from "../../../../modules/provider-request/entities/ProviderRequestLog";

export interface ProviderRequestPort {
    createIndexes(): Promise<void>;

    create(entity: ProviderRequestLog): Promise<void>;
}
