import { DemandeSubvention } from "dto";
import applicationFlatPort from "../../dataProviders/db/applicationFlat/applicationFlat.port";
import { ApplicationFlatEntity } from "../../entities/ApplicationFlatEntity";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import { RawGrant, RawApplication } from "../grant/@types/rawGrant";
import { ProviderEnum } from "../../@enums/ProviderEnum";
import ProviderCore from "../providers/ProviderCore";
import DemandesSubventionsProvider from "../subventions/@types/DemandesSubventionsProvider";
import GrantProvider from "../grant/@types/GrantProvider";
import Siret from "../../identifierObjects/Siret";
import ApplicationFlatAdapter from "./ApplicationFlatAdapter";
import { StructureIdentifier } from "../../identifierObjects/@types/StructureIdentifier";
import { ReadableStream } from "node:stream/web";
import { insertStreamByBatch } from "../../shared/helpers/MongoHelper";

export class ApplicationFlatService
    extends ProviderCore
    implements DemandesSubventionsProvider<ApplicationFlatEntity>, GrantProvider
{
    constructor() {
        super({
            name: "Application Flat",
            type: ProviderEnum.raw,
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

    isDemandesSubventionsProvider = true;

    public rawToApplication(rawGrant: RawApplication<ApplicationFlatEntity>) {
        return ApplicationFlatAdapter.rawToApplication(rawGrant);
    }

    async getDemandeSubvention(identifier: StructureIdentifier): Promise<DemandeSubvention[]> {
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

    async getRawGrants(identifier: StructureIdentifier): Promise<RawGrant[]> {
        const dbos = await this.getEntitiesByIdentifier(identifier);

        /* Pour l'instant on garde ej pour tous les providers sauf Fonjep qui prend idVersement 
        Il faudra convertir tous les versementKey en idVersement quand tout est connecté  */
        return dbos.map(grant => ({
            provider: grant.provider,
            type: "application",
            data: grant,
            joinKey: (grant.provider === "fonjep" ? grant.paymentId : grant.ej) ?? undefined,
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
        if (entity.beneficiaryEstablishmentIdType === "siret" && Siret.isSiret(entity.beneficiaryEstablishmentId))
            return new Siret(entity.beneficiaryEstablishmentId);
        return undefined;
    }
}

const applicationFlatService = new ApplicationFlatService();

export default applicationFlatService;
