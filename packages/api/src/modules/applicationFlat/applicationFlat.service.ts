import { ApplicationFlatDto, DemandeSubvention } from "dto";
import applicationFlatPort from "../../dataProviders/db/applicationFlat/applicationFlat.port";
import { ApplicationFlatEntity } from "../../entities/ApplicationFlatEntity";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import { RawApplication } from "../grant/@types/rawGrant";
import { ProviderEnum } from "../../@enums/ProviderEnum";
import ProviderCore from "../providers/ProviderCore";
import ApplicationProvider from "../subventions/@types/ApplicationProvider";
import Siret from "../../identifierObjects/Siret";
import ApplicationFlatAdapter from "./ApplicationFlatAdapter";
import { StructureIdentifier } from "../../identifierObjects/@types/StructureIdentifier";
import { ReadableStream } from "node:stream/web";
import { insertStreamByBatch } from "../../shared/helpers/MongoHelper";
import GrantProvider from "../grant/@types/GrantProvider";
import { StructureProvider } from "../StructureProvider";

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
            requests.push(...(await applicationFlatPort.findBySiret(identifier.siret)));
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            requests.push(...(await applicationFlatPort.findBySiren(identifier.siren)));
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
        return ApplicationFlatAdapter.rawToApplication(rawGrant);
    }

    async getApplication(identifier: StructureIdentifier): Promise<DemandeSubvention[]> {
        const requests = await this.getEntitiesByIdentifier(identifier);
        return requests
            .map(document => ApplicationFlatAdapter.toDemandeSubvention(document))
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
        return insertStreamByBatch(readStream, batch => applicationFlatPort.upsertMany(batch), 10000);
    }

    isCollectionInitialized() {
        return applicationFlatPort.hasBeenInitialized();
    }

    async containsDataFromProvider(provider: string | RegExp) {
        const cursor = applicationFlatPort.cursorFind({ provider });
        return cursor.hasNext();
    }

    /**
     * Used to transform ApplicationFlat into old and soon to be depreciated DemandeSubvention which only works with siret
     *
     * @param entity ApplicationFlatEntity
     * @returns Siret or undefined if establishment type is ridet or tahitiet
     */
    getSiret(entity: ApplicationFlatEntity) {
        if (
            entity.beneficiaryEstablishmentIdType === Siret.getName() &&
            Siret.isSiret(entity.beneficiaryEstablishmentId)
        )
            return new Siret(entity.beneficiaryEstablishmentId);
        return undefined;
    }

    async getApplicationsDto(identifier: StructureIdentifier): Promise<ApplicationFlatDto[]> {
        const applications = await this.getEntitiesByIdentifier(identifier);
        return applications.map(entity => ApplicationFlatAdapter.toDto(entity));
    }
}

const applicationFlatService = new ApplicationFlatService();

export default applicationFlatService;
