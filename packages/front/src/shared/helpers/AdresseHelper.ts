import { ProviderValues } from "@api-subventions-asso/dto";
import ProviderValueHelper from "./ProviderValueHelper";

export default class AdresseHelper {
    public static providerValuesToString(data: ProviderValues) {
        const value = ProviderValueHelper.getValue(data) as {
            numero?: string;
            type_voie?: string;
            voie?: string;
            code_postal?: string;
            commune?: string;
        };
        if (!value) return;
        const { numero = "", type_voie = "", voie = "", code_postal = "", commune = "" } = value;

        return `${numero || ""} ${type_voie || ""} ${voie || ""} ${code_postal || ""} ${commune || ""}`.replace(
            "  ",
            " ",
        );
    }
}
