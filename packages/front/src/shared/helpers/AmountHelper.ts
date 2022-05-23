import { ProviderValue } from "@api-subventions-asso/dto"
import ProviderValueHelper from "./ProviderValueHelper"

export default class AmountHelper {
    public static providerValueToEuro(value: ProviderValue<number>) {
        return AmountHelper.numberToEuro(ProviderValueHelper.getValue(value) || 0)
    }

    public static numberToEuro(value: number | string) {
        value = typeof value === "string" ? parseFloat(value) : value;
        return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    }
}