import { DemandeSubvention } from "dto";
import * as Sentry from "@sentry/node";
import { RawApplication, RawGrant } from "../../grant/@types/rawGrant";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import { StructureIdentifier } from "../../../@types";
import EstablishmentIdentifier from "../../../valueObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";
import GrantProvider from "../../grant/@types/GrantProvider";
import MiscScdlGrantEntity from "./entities/MiscScdlGrantEntity";
import MiscScdlGrantProducerEntity from "./entities/MiscScdlGrantProducerEntity";
import miscScdlJoiner from "./repositories/miscScdl.joiner";
import MiscScdlAdapter from "./adapters/MiscScdl.adapter";

export class ScdlGrantService implements DemandesSubventionsProvider<MiscScdlGrantProducerEntity>, GrantProvider {
    isGrantProvider = true;
    isDemandesSubventionsProvider = true;
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

    getRawGrants(identifier: StructureIdentifier): Promise<RawGrant[]> {
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

        return this.getRawGrantSubventionByPromise(entites);
    }

    rawToApplication(rawApplication: RawApplication<MiscScdlGrantProducerEntity>) {
        return MiscScdlAdapter.rawToApplication(rawApplication);
    }

    rawToCommon(rawGrant: RawGrant) {
        return MiscScdlAdapter.toCommon(rawGrant.data as MiscScdlGrantEntity);
    }
}

const scdlGrantService = new ScdlGrantService();
export default scdlGrantService;
