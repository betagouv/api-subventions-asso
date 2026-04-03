import type { ApplicationFlatDto, DemandeSubvention } from "dto";
import applicationFlatAdapter from "../../adapters/outputs/db/application-flat/application-flat.adapter";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import EstablishmentIdentifier from "../../identifier-objects/EstablishmentIdentifier";
import { RawApplication } from "../grant/@types/RawGrant";
import { ProviderEnum } from "../../@enums/ProviderEnum";
import ProviderCore from "../providers/provider.core";
import ApplicationProvider from "../subventions/@types/ApplicationProvider";
import Siret from "../../identifier-objects/Siret";
import ApplicationFlatMapper from "./application-flat.mapper";
import { StructureIdentifier } from "../../identifier-objects/@types/StructureIdentifier";
import { ReadableStream } from "node:stream/web";
import { insertStreamByBatch } from "../../shared/helpers/MongoHelper";
import GrantProvider from "../grant/@types/GrantProvider";
import { StructureProvider } from "../StructureProvider";
import { ApplicationFlatEntity } from "../../entities/flats/ApplicationFlatEntity";

export class ApplicationFlatService
    extends ProviderCore
    implements GrantProvider, ApplicationProvider, StructureProvider
{
    constructor() {
        super({
            name: "Application Flat",
            type: ProviderEnum.technical,
            description: "ApplicationFlat",
            id: "application-flat",
        });
    }

    async getEntitiesByIdentifier(identifier: StructureIdentifier) {
        const requests: ApplicationFlatEntity[] = [];

        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            requests.push(...(await applicationFlatAdapter.findBySiret(identifier.siret)));
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            requests.push(...(await applicationFlatAdapter.findBySiren(identifier.siren)));
        }
        return requests;
    }

    /**
     * |-------------------------|
     * |    Application Part     |
     * |-------------------------|
     */

    isApplicationProvider = true;

    public rawToApplication(rawGrant: RawApplication) {
        return ApplicationFlatMapper.rawToApplication(rawGrant);
    }

    async getApplication(identifier: StructureIdentifier): Promise<DemandeSubvention[]> {
        const requests = await this.getEntitiesByIdentifier(identifier);
        return requests
            .map(document => ApplicationFlatMapper.toDemandeSubvention(document))
            .filter(demande => !!demande) as DemandeSubvention[];
    }

    /**
     * |-------------------------|
     * |   Grant Part            |
     * |-------------------------|
     */

    isGrantProvider = true;

    async getRawGrants(identifier: StructureIdentifier): Promise<RawApplication[]> {
        const entities = await this.getEntitiesByIdentifier(identifier);
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
        const applications = await this.getEntitiesByIdentifier(identifier);
        return applications.map(entity => ApplicationFlatMapper.toDto(entity));
    }
}

const applicationFlatService = new ApplicationFlatService();

export default applicationFlatService;
