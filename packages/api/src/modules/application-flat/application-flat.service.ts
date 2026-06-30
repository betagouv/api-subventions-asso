import type { ApplicationFlatDto } from "dto";
import applicationFlatAdapter from "../../adapters/outputs/db/application-flat/application-flat.adapter";
import { RawApplication } from "../grant/@types/RawGrant";
import { ProviderEnum } from "../../@enums/ProviderEnum";
import ProviderCore from "../providers/provider.core";
import Siret from "../../identifier-objects/Siret";
import ApplicationFlatMapper from "./application-flat.mapper";
import { StructureIdentifier } from "../../identifier-objects/@types/StructureIdentifier";
import { ReadableStream } from "node:stream/web";
import { insertStreamByBatch } from "../../shared/helpers/MongoHelper";
import { ApplicationFlatEntity } from "../../entities/flats/ApplicationFlatEntity";
import getApplications, { GetApplications } from "./use-cases/get-applications";

export class ApplicationFlatService extends ProviderCore {
    constructor(private getApplications: GetApplications) {
        super({
            name: "Application Flat",
            type: ProviderEnum.technical,
            description: "ApplicationFlat",
            id: "application-flat",
        });
    }

    async getRawGrants(identifier: StructureIdentifier): Promise<RawApplication[]> {
        const entities = await this.getApplications.execute(identifier);
        return entities.map(grant => ({
            provider: "application-flat",
            type: "application",
            data: grant,
            joinKey: grant.paymentId ?? undefined,
        }));
    }

    /**
     * |-------------------------|
     * |  Application Flat Part  |
     * |-------------------------|
     */

    async saveFromStream(readStream: ReadableStream<ApplicationFlatEntity>) {
        return insertStreamByBatch(readStream, batch => applicationFlatAdapter.upsertMany(batch), 10000);
    }

    isCollectionInitialized() {
        return applicationFlatAdapter.hasBeenInitialized();
    }

    async containsDataFromProvider(provider: string | RegExp): Promise<boolean> {
        const cursor = applicationFlatAdapter.cursorFind({ fournisseur: provider });

        for await (const _appFlat of cursor) {
            return true;
        }
        return false;
    }

    /**
     * Used to transform ApplicationFlat into old and soon to be depreciated DemandeSubvention which only works with siret
     *
     * @param entity ApplicationFlatEntity
     * @returns Siret or undefined if establishment type is ridet or tahitiet
     */
    getSiret(entity: ApplicationFlatEntity) {
        if (entity.beneficiaryEstablishmentId instanceof Siret) return entity.beneficiaryEstablishmentId;
        return undefined;
    }

    async getApplicationsDto(identifier: StructureIdentifier): Promise<ApplicationFlatDto[]> {
        const applications = await this.getApplications.execute(identifier);
        return applications.map(entity => ApplicationFlatMapper.toDto(entity));
    }
}

const applicationFlatService = new ApplicationFlatService(getApplications);

export default applicationFlatService;
