import { Etablissement } from "dto";
import { getMonthFromFrenchStr } from "../../../../shared/helpers/DateHelper";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import type ApiEntrepriseHeadcount from "../@types/ApiEntrepriseHeadcount";
import Siret from "../../../../identifierObjects/Siret";

export default class ApiEntrepriseAdapter {
    static PROVIDER_NAME = "API Entreprise";
    static toEtablissement(data: ApiEntrepriseHeadcount): Etablissement {
        const toProviderValue = ProviderValueFactory.buildProviderValuesAdapter(
            this.PROVIDER_NAME,
            new Date(parseInt(data.annee, 10), parseInt(data.mois, 10)),
        );
        return {
            siret: toProviderValue(data.siret),
            nic: toProviderValue(Siret.getNic(data.siret)),
            headcount: toProviderValue(data.effectifs_mensuels),
        };
    }

    static toValidDate(date: string) {
        const dateArray = date.split(" ");
        const month = getMonthFromFrenchStr(dateArray[1]);
        return new Date(`${dateArray[0]} ${month} ${dateArray[2]}`);
    }
}
