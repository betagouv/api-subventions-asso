import { DemandeSubvention, Rna, Siren, Siret } from "dto";
import * as Sentry from "@sentry/node";
import { ProviderEnum } from "../../../@enums/ProviderEnum";

import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import ProviderCore from "../ProviderCore";
import { RawApplication, RawGrant } from "../../grant/@types/rawGrant";
import CaisseDepotsDtoAdapter from "./adapters/caisseDepotsDtoAdapter";
import { CaisseDepotsSubventionDto } from "./dto/CaisseDepotsDto";

export class CaisseDepotsService
    extends ProviderCore
    implements DemandesSubventionsProvider<CaisseDepotsSubventionDto>
{
    isDemandesSubventionsProvider = true;
    isGrantProvider = true;

    apiUrl = "https://opendata.caissedesdepots.fr/api/v2/";

    public test() {
        return this.getCaisseDepotsSubventions("33760730300068");
    }

    constructor() {
        super({
            name: "API Caisse des dépôts",
            type: ProviderEnum.api,
            description:
                "Ce jeu de données présente les subventions octroyées par la Caisse des dépôts, d'un montant supérieur à 23k€/an, à des organismes privés depuis le 01/01/2018, présenté selon le format proposé par l'arrêté du 17 novembre 2017 relatif aux conditions de mises à disposition des données essentielles des conventions de subvention.",
            id: "caisseDepots",
        });
    }

    rawToApplication(rawApplication: RawApplication<CaisseDepotsSubventionDto>) {
        return CaisseDepotsDtoAdapter.rawToApplication(rawApplication);
    }

    private async getRawCaisseDepotsSubventions(identifier: string): Promise<CaisseDepotsSubventionDto[]> {
        try {
            const result = await this.http.get(
                `${this.apiUrl}catalog/datasets/subventions-attribuees-par-la-caisse-des-depots-depuis-01012018/records?where=search(idbeneficiaire, "${identifier}")`,
            );

            if (!result?.data?.records) return [];

            return result.data.records.map(({ record }) => record);
        } catch (e) {
            Sentry.captureException(e);
            console.error(e);
            return [];
        }
    }

    private async getCaisseDepotsSubventions(identifier: string): Promise<DemandeSubvention[]> {
        return (await this.getRawCaisseDepotsSubventions(identifier)).map(record =>
            CaisseDepotsDtoAdapter.toDemandeSubvention(record),
        );
    }

    getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        return this.getCaisseDepotsSubventions(`${siren}*`);
    }

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        return this.getCaisseDepotsSubventions(siret);
    }

    /**
     * |-------------------------|
     * |   Grant Part            |
     * |-------------------------|
     */

    async getRawGrantsBySiret(siret: string): Promise<RawGrant[] | null> {
        return (await this.getRawCaisseDepotsSubventions(siret)).map(grant => ({
            provider: this.provider.id,
            type: "fullGrant",
            data: grant,
        }));
    }
    async getRawGrantsBySiren(siren: string): Promise<RawGrant[] | null> {
        return (await this.getRawCaisseDepotsSubventions(`${siren}*`)).map(grant => ({
            provider: this.provider.id,
            type: "fullGrant",
            data: grant,
        }));
    }
    getRawGrantsByRna(_rna: string): Promise<RawGrant[] | null> {
        return Promise.resolve(null);
    }

    rawToCommon(rawGrant: RawGrant) {
        return CaisseDepotsDtoAdapter.toCommon(rawGrant.data as CaisseDepotsSubventionDto);
    }
}

const caisseDepotsService = new CaisseDepotsService();

export default caisseDepotsService;
