import { DemandeSubvention, Rna, Siren, Siret } from "dto";
import * as Sentry from "@sentry/node";
import { RawApplication, RawGrant } from "../../grant/@types/rawGrant";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import MiscScdlGrantEntity from "./entities/MiscScdlGrantEntity";
import miscScdlJoiner from "./repositories/miscScdl.joiner";
import MiscScdlAdapter from "./adapters/MiscScdl.adapter";
import MiscScdlGrantProducerEntity from "./entities/MiscScdlGrantProducerEntity";

export class ScdlGrantService implements DemandesSubventionsProvider<MiscScdlGrantProducerEntity> {
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

    getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        return this.getEntityByPromiseAndAdapt(miscScdlJoiner.findBySiren(siren), MiscScdlAdapter.toDemandeSubvention);
    }

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        return this.getEntityByPromiseAndAdapt(miscScdlJoiner.findBySiret(siret), MiscScdlAdapter.toDemandeSubvention);
    }

    private getRawGrantSubventionByPromise(dbRequestPromise: Promise<MiscScdlGrantProducerEntity[]>) {
        return this.getEntityByPromiseAndAdapt(dbRequestPromise, MiscScdlAdapter.toRawApplication);
    }

    getRawGrantsByRna(rna: Rna): Promise<RawApplication<MiscScdlGrantProducerEntity>[] | null> {
        return this.getRawGrantSubventionByPromise(miscScdlJoiner.findByRna(rna));
    }

    getRawGrantsBySiren(siren: Siren): Promise<RawGrant[] | null> {
        return this.getRawGrantSubventionByPromise(miscScdlJoiner.findBySiren(siren));
    }

    getRawGrantsBySiret(siret: Siret): Promise<RawGrant[] | null> {
        return this.getRawGrantSubventionByPromise(miscScdlJoiner.findBySiret(siret));
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
