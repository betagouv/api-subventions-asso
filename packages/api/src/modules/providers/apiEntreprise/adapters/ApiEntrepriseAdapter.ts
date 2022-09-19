import { Association, Etablissement } from "@api-subventions-asso/dto";
import { getMonthFromFrenchStr } from "../../../../shared/helpers/DateHelper";
import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import IApiEntrepriseExtraitRcs from "../@types/IApiEntrepriseExtraitRcs";
import IApiEntrepriseHeadcount from "../@types/IApiEntrepriseHeadcount";

export default class ApiEntrepriseAdapter {
    static PROVIDER_NAME = "API Entreprise"
    static toEtablissement(data: IApiEntrepriseHeadcount): Etablissement {
        const toProviderValue = ProviderValueFactory.buildProviderValuesAdapter(this.PROVIDER_NAME, new Date(parseInt(data.annee, 10), parseInt(data.mois, 10)));
        return {
            siret: toProviderValue(data.siret),
            nic: toProviderValue(siretToNIC(data.siret)),
            headcount: toProviderValue(data.effectifs_mensuels)
        }
    }

    static toAssociation(data: IApiEntrepriseExtraitRcs): Association {
        const toProviderValue = ProviderValueFactory.buildProviderValuesAdapter(this.PROVIDER_NAME, this.toValidDate(data.date_extrait));
        return {
            siren: toProviderValue(data.siren),
            extrait_rcs: toProviderValue(data)
        }
    }

    static toValidDate(date: string) {
        const dateArray = date.split(" ")
        const month = getMonthFromFrenchStr(dateArray[1]);
        return new Date(`${dateArray[0]} ${month} ${dateArray[2]}`);
    }
}