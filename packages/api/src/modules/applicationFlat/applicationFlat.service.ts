import { DemandeSubvention } from "dto";
import applicationFlatPort from "../../dataProviders/db/applicationFlat/applicationFlat.port";
import ApplicationFlatEntity from "../../entities/ApplicationFlatEntity";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../valueObjects/EstablishmentIdentifier";
import { StructureIdentifier } from "../../@types";
import { RawGrant, RawApplication } from "../grant/@types/rawGrant";
import { ProviderEnum } from "../../@enums/ProviderEnum";
import ProviderCore from "../providers/ProviderCore";
import DemandesSubventionsProvider from "../subventions/@types/DemandesSubventionsProvider";
import GrantProvider from "../grant/@types/GrantProvider";
import { applicationFlatProviders } from "../providers";
import ApplicationFlatAdapter from "./ApplicationFlatAdapter";
import ApplicationFlatProvider from "./@types/applicationFlatProvider";

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
            joinKey: grant.provider === "fonjep" ? grant.idVersement : grant.ej,
        }));
    }

    /**
     * |-------------------------|
     * |  Application Flat Part  |
     * |-------------------------|
     */

    async updateApplicationsFlatCollection(exerciceBudgetaire?: number) {
        const START_YEAR = exerciceBudgetaire ?? 2017;
        const END_YEAR = exerciceBudgetaire ?? new Date().getFullYear() + 2;
        // 3 is the most pluriannuality that we expect, so current year + 2

        for (const provider of applicationFlatProviders) {
            console.log(`---- saving application flat entities from provider '${provider.provider.name}' ----`);
            await this._updateApplicationsFlatCollectionByProvider(provider, START_YEAR, END_YEAR)
                .then(() => console.log(`update from provider '${provider.provider.name}' ended successfully`))
                .catch((e: Error) =>
                    console.log(`update from provider '${provider.provider.name}' failed with error '${e.message}'`),
                );
        }
    }

    async _updateApplicationsFlatCollectionByProvider(
        provider: ApplicationFlatProvider,
        START_YEAR: number,
        END_YEAR: number,
    ) {
        const CHUNK_SIZE = 1000;
        const readStream = provider.getApplicationFlatStream(START_YEAR, END_YEAR);
        let buffer: ApplicationFlatEntity[] = [];
        let counter = 0;
        const writeStream = new WritableStream({
            async write(applicationFlatEntity: ApplicationFlatEntity | null) {
                if (!applicationFlatEntity) return;
                if (buffer.length === CHUNK_SIZE) {
                    await applicationFlatPort.upsertMany(buffer);
                    counter += buffer.length;
                    buffer = [];
                }
                buffer.push(applicationFlatEntity);
                counter += buffer.length;
            },
            async close() {
                await applicationFlatPort.upsertMany(buffer);
                console.log(`operations ended successfully, ${counter} application flat entities saved`);
                // TODO differentiate counts inserts and updates?
            },
            async abort(err: Error) {
                console.trace();
                console.error(err);
            },
        });
        await readStream.pipeTo(writeStream);
    }

    isCollectionInitialized() {
        return applicationFlatPort.hasBeenInitialized();
    }
}

const applicationFlatService = new ApplicationFlatService();

export default applicationFlatService;
