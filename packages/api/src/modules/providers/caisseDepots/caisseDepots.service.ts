import { DemandeSubvention, Rna, Siren, Siret } from "@api-subventions-asso/dto";
import axios from "axios";
import { ProviderEnum } from "../../../@enums/ProviderEnum";

import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import CaisseDepotsSubventionDto from "./dto/CaisseDepotsSubventionDto";
import CaisseDepotsDtoAdapter from "./adapters/caisseDepotsDtoAdapter";

export class CaisseDepotsService implements DemandesSubventionsProvider {
    provider = {
        name: "Caisse des dépôts",
        type: ProviderEnum.api,
        description:
            "Ce jeu de données présente les subventions octroyées par la Caisse des Dépôts et Consignation, d'un montant supérieur à 23k€/an, à des organismes privés depuis le 01/01/2018. Ce jeu de données est présenté selon le format proposé par l'arrêté du 17 novembre 2017 relatif aux conditions de mises à disposition des données essentielles des conventions de subvention. Sont présentes les informations concernant la date de la convention de subvention, l'identification du bénéficiaire (Siret et raison sociale), l'objet de la subvention, son montant en euros, sa nature et la période prévisionnelle de versement." // TODO check
    };
    isDemandesSubventionsProvider = true;
    apiUrl = "https://opendata.caissedesdepots.fr/api/v2/";

    public test() {
        return this.getCaisseDepotsSubventions("33760730300068");
    }

    private async getCaisseDepotsSubventions(identifier: string): Promise<CaisseDepotsSubventionDto[]> {
        try {
            const result = await axios.get(
                `${this.apiUrl}catalog/datasets/subventions-attribuees-par-la-caisse-des-depots-depuis-01012018/records?where=search(idbeneficiare,"${identifier}")`
            );

            return result.data.records.map(({ record }) => record);
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getDemandeSubventionByRna(rna: Rna): Promise<DemandeSubvention[] | null> {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        return (await this.getCaisseDepotsSubventions(`${siren}*`)).map(dto =>
            CaisseDepotsDtoAdapter.toDemandeSubvention(dto)
        );
    }

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        return (await this.getCaisseDepotsSubventions(siret)).map(dto =>
            CaisseDepotsDtoAdapter.toDemandeSubvention(dto)
        );
    }
}

const caisseDepotsService = new CaisseDepotsService();

export default caisseDepotsService;
