import { DemandeSubvention } from "dto";
import * as Sentry from "@sentry/node";
import { AnyRawGrant, RawApplication, RawGrant } from "../../grant/@types/rawGrant";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import EstablishmentIdentifier from "../../../identifierObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import GrantProvider from "../../grant/@types/GrantProvider";
import miscScdlJoiner from "../../../dataProviders/db/providers/scdl/miscScdl.joiner";
import MiscScdlGrantEntity from "./entities/MiscScdlGrantEntity";
import MiscScdlGrantProducerEntity from "./entities/MiscScdlGrantProducerEntity";
import MiscScdlAdapter from "./adapters/MiscScdl.adapter";
import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";
import ApplicationFlatProvider from "../../applicationFlat/@types/applicationFlatProvider";
import * as console from "node:console";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";
import { ReadableStream, TransformStream } from "node:stream/web";
import miscScdlGrantPort from "../../../dataProviders/db/providers/scdl/miscScdlGrant.port";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";

export class ScdlGrantService
    implements DemandesSubventionsProvider<MiscScdlGrantProducerEntity>, GrantProvider, ApplicationFlatProvider
{
    isGrantProvider = true;
    isDemandesSubventionsProvider = true;
    isApplicationFlatProvider = true;

    provider = {
        name: "Open Data SCDL",
        type: ProviderEnum.raw,
        id: "miscScdl",
        description: "Données au format SCDL de divers producteurs en Open Data",
    };

    private async getEntityByPromiseAndAdapt<T>(
        dbRequestPromise: Promise<MiscScdlGrantProducerEntity[]>,
        adapterFunction: (g: MiscScdlGrantProducerEntity) => T,
    ) {
        try {
            return (await dbRequestPromise).map(grant => adapterFunction(grant));
        } catch (e) {
            Sentry.captureException(e);
            console.error(e);
            return [];
        }
    }

    async getDemandeSubvention(id: StructureIdentifier): Promise<DemandeSubvention[]> {
        let entites: Promise<MiscScdlGrantProducerEntity[]> = Promise.resolve([]);

        if (id instanceof EstablishmentIdentifier && id.siret) {
            entites = miscScdlJoiner.findBySiret(id.siret);
        } else if (id instanceof AssociationIdentifier) {
            if (id.siren) {
                entites = miscScdlJoiner.findBySiren(id.siren);
            } else if (id.rna) {
                entites = miscScdlJoiner.findByRna(id.rna);
            }
        }

        const demandeSubventions = await this.getEntityByPromiseAndAdapt(entites, MiscScdlAdapter.toDemandeSubvention);

        if (!demandeSubventions) {
            return [];
        }

        return demandeSubventions;
    }

    private getRawGrantSubventionByPromise(dbRequestPromise: Promise<MiscScdlGrantProducerEntity[]>) {
        return this.getEntityByPromiseAndAdapt(dbRequestPromise, MiscScdlAdapter.toRawApplication);
    }

    getRawGrants(identifier: StructureIdentifier): Promise<AnyRawGrant[]> {
        let entites: Promise<MiscScdlGrantProducerEntity[]> = Promise.resolve([]);

        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            entites = miscScdlJoiner.findBySiret(identifier.siret);
        } else if (identifier instanceof AssociationIdentifier) {
            if (identifier.siren) {
                entites = miscScdlJoiner.findBySiren(identifier.siren);
            } else if (identifier.rna) {
                entites = miscScdlJoiner.findByRna(identifier.rna);
            }
        }

        // @ts-expect-error: something is broken in Raw Types since #3360 => #3375
        return this.getRawGrantSubventionByPromise(entites);
    }

    rawToApplication(rawApplication: RawApplication<MiscScdlGrantProducerEntity>) {
        return MiscScdlAdapter.rawToApplication(rawApplication);
    }

    rawToCommon(rawGrant: RawGrant<MiscScdlGrantEntity>) {
        return MiscScdlAdapter.toCommon(rawGrant.data);
    }

    saveDbosToApplicationFlat(dbos: ScdlGrantDbo[]) {
        const readStream = this.dbosToApplicationFlatStream(dbos);
        return this.saveFlatFromStream(readStream);
    }

    dbosToApplicationFlatStream(dbos: ScdlGrantDbo[]) {
        const stream: ReadableStream = ReadableStream.from(dbos);
        return stream.pipeThrough(
            new TransformStream<ScdlGrantDbo, ApplicationFlatEntity>({
                start() {},
                transform: (dbo, controller) => controller.enqueue(MiscScdlAdapter.dboToApplicationFlat(dbo)),
            }),
        );
    }

    async saveFlatFromStream(stream: ReadableStream<ApplicationFlatEntity>): Promise<void> {
        await applicationFlatService.saveFromStream(stream);
    }

    async initApplicationFlat() {
        const cursor = miscScdlGrantPort.findAllCursor();
        const stream: ReadableStream<ApplicationFlatEntity> = cursorToStream(cursor, dbo =>
            MiscScdlAdapter.dboToApplicationFlat(dbo),
        );
        return this.saveFlatFromStream(stream);
    }
}

const scdlGrantService = new ScdlGrantService();
export default scdlGrantService;
