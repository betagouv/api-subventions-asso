import { DemandeSubvention, Rna, Siren, Siret } from "dto";
import * as Sentry from "@sentry/node";
import { RawGrant } from "../../grant/@types/rawGrant";
import GrantProvider from "../../grant/@types/GrantProvider";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import MiscScdlGrantProducerEntity from "./entities/MiscScdlGrantProducerEntity";
import miscScdlJoiner from "./repositories/miscScdl.joiner";
import MiscScdlAdapter from "./MiscScdl.adapter";

export class ScdlGrantService implements GrantProvider, DemandesSubventionsProvider {
    isGrantProvider = true;
    isDemandesSubventionsProvider = true;
    provider = {
        name: "Data.gouv",
        type: ProviderEnum.raw,
        id: "miscScdl",
        description: "Données au format SCDL de divers producteurs sur data.gouv",
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
            return null;
        }
    }

    getDemandeSubventionByRna(rna: Rna): Promise<DemandeSubvention[] | null> {
        return this.getEntityByPromiseAndAdapt(miscScdlJoiner.findByRna(rna), MiscScdlAdapter.toDemandeSubvention);
    }

    getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        return this.getEntityByPromiseAndAdapt(miscScdlJoiner.findBySiren(siren), MiscScdlAdapter.toDemandeSubvention);
    }

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        return this.getEntityByPromiseAndAdapt(miscScdlJoiner.findBySiret(siret), MiscScdlAdapter.toDemandeSubvention);
    }

    private getRawGrantSubventionByPromise(dbRequestPromise: Promise<MiscScdlGrantProducerEntity[]>) {
        return this.getEntityByPromiseAndAdapt(
            dbRequestPromise,
            (grant: MiscScdlGrantProducerEntity) =>
                ({
                    provider: this.provider.id,
                    type: "application",
                    data: grant,
                } as RawGrant),
        );
    }

    getRawGrantsByRna(rna: Rna): Promise<RawGrant[] | null> {
        return this.getRawGrantSubventionByPromise(miscScdlJoiner.findByRna(rna));
    }

    getRawGrantsBySiren(siren: Siren): Promise<RawGrant[] | null> {
        return this.getRawGrantSubventionByPromise(miscScdlJoiner.findBySiren(siren));
    }

    getRawGrantsBySiret(siret: Siret): Promise<RawGrant[] | null> {
        return this.getRawGrantSubventionByPromise(miscScdlJoiner.findBySiret(siret));
    }

    rawToCommon(rawGrant: RawGrant) {
        return MiscScdlAdapter.toCommon(rawGrant.data as MiscScdlGrantProducerEntity);
    }
}

const scdlGrantService = new ScdlGrantService();
export default scdlGrantService;
