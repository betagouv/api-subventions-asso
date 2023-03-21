import { DemandeSubvention, Rna, Siren, Siret } from "@api-subventions-asso/dto";
import axios from "axios";
import { ProviderEnum } from "../../../@enums/ProviderEnum";

import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import CaisseDepotsDtoAdapter from "./adapters/caisseDepotsDtoAdapter";

export class CaisseDepotsService implements DemandesSubventionsProvider {
    provider = {
        name: "API Caisse des dépôts",
        type: ProviderEnum.api,
        description:
            "Ce jeu de données présente les subventions octroyées par la Caisse des dépôts, d'un montant supérieur à 23k€/an, à des organismes privés depuis le 01/01/2018, présenté selon le format proposé par l'arrêté du 17 novembre 2017 relatif aux conditions de mises à disposition des données essentielles des conventions de subvention."
    };
    isDemandesSubventionsProvider = true;
    apiUrl = "https://opendata.caissedesdepots.fr/api/v2/";

    public test() {
        return this.getCaisseDepotsSubventions("33760730300068");
    }

    private async getCaisseDepotsSubventions(identifier: string): Promise<DemandeSubvention[]> {
        try {
            const result = await axios.get(
                `${this.apiUrl}catalog/datasets/subventions-attribuees-par-la-caisse-des-depots-depuis-01012018/records?where=search(idbeneficiaire, "${identifier}")`
            );

            return result.data.records.map(({ record }) => CaisseDepotsDtoAdapter.toDemandeSubvention(record));
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getDemandeSubventionByRna(rna: Rna): Promise<DemandeSubvention[] | null> {
        return null;
    }

    getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        return this.getCaisseDepotsSubventions(`${siren}*`);
    }

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        return this.getCaisseDepotsSubventions(siret);
    }
}

const caisseDepotsService = new CaisseDepotsService();

export default caisseDepotsService;
