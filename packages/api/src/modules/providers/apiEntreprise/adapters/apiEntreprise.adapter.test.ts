import { siretToNIC } from "../../../../shared/helpers/SirenHelper";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import ApiEntrepriseAdapter from "./apiEntreprise.adapter";

describe("API ENTREPRISE Adapter", () => {
    const SIRET = "10000000951236";
    it("should return Etablissement with headcount", () => {
        const PROVIDER_NAME = ApiEntrepriseAdapter.PROVIDER_NAME
        const toProviderValues = ProviderValueFactory.buildProviderValuesAdapter(PROVIDER_NAME, new Date());
        const HEADCOUNT = "32"
        const etablissement = {
            siret: SIRET,
            nic: siretToNIC(SIRET),
            headcount: HEADCOUNT
        }

        const expected = {
            siret: toProviderValues(etablissement.siret),
            nic: toProviderValues(etablissement.nic),
            headcount: toProviderValues(etablissement.headcount)
        };

        const actual = ApiEntrepriseAdapter.toEtablissement(etablissement);
        expect(actual).toEqual(expected);
    })

    it("should return Etablissement without", () => {
        const PROVIDER_NAME = ApiEntrepriseAdapter.PROVIDER_NAME
        const toProviderValues = ProviderValueFactory.buildProviderValuesAdapter(PROVIDER_NAME, new Date());
        const etablissement = {
            siret: SIRET,
            nic: siretToNIC(SIRET)
        }

        const expected = {
            siret: toProviderValues(etablissement.siret),
            nic: toProviderValues(etablissement.nic)
        };

        const actual = ApiEntrepriseAdapter.toEtablissement(etablissement);
        expect(actual).toEqual(expected);
    })
})