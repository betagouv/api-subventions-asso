import { DemandeSubvention } from "dto";
import * as Sentry from "@sentry/node";
import EstablishmentIdentifier from "../../../valueObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";
import { ProviderEnum } from "../../../@enums/ProviderEnum";

import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import ProviderCore from "../ProviderCore";
import { RawApplication, RawGrant } from "../../grant/@types/rawGrant";
import { StructureIdentifier } from "../../../@types";
import GrantProvider from "../../grant/@types/GrantProvider";
import CaisseDepotsDtoAdapter from "./adapters/caisseDepotsDtoAdapter";
import { CaisseDepotsSubventionDto } from "./dto/CaisseDepotsDto";

export class CaisseDepotsService
    extends ProviderCore
    implements DemandesSubventionsProvider<CaisseDepotsSubventionDto>, GrantProvider
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

    async getDemandeSubvention(id: StructureIdentifier) {
        if (id instanceof EstablishmentIdentifier && id.siret) {
            return this.getCaisseDepotsSubventions(id.siret.value);
        } else if (id instanceof AssociationIdentifier && id.siren) {
            return this.getCaisseDepotsSubventions(`${id.siren.value}*`);
        }

        return [];
    }

    /**
     * |-------------------------|
     * |   Grant Part            |
     * |-------------------------|
     */

    async getRawGrants(identifier: StructureIdentifier): Promise<RawGrant[]> {
        let entities: CaisseDepotsSubventionDto[] = [];
        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            entities = await this.getRawCaisseDepotsSubventions(identifier.siret.value);
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            entities = await this.getRawCaisseDepotsSubventions(`${identifier.siren.value}*`);
        }

        return entities.map(grant => ({
            provider: this.provider.id,
            type: "application",
            data: grant,
        }));
    }

    rawToCommon(rawGrant: RawGrant) {
        return CaisseDepotsDtoAdapter.toCommon(rawGrant.data as CaisseDepotsSubventionDto);
    }
}

const caisseDepotsService = new CaisseDepotsService();

export default caisseDepotsService;
