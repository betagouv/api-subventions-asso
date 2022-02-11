import ProviderValue from "../../../@types/ProviderValue";
import { Rna } from "../../../@types/Rna";
import { Siren } from "../../../@types/Siren";
import { DefaultObject } from "../../../@types/utils";

export default interface Association extends DefaultObject<(ProviderValue<unknown> | undefined)> {
    siren: ProviderValue<Siren>,
    rna: ProviderValue<Rna>,
    nic_siege?: ProviderValue<string>,
    categorie_juridique?: ProviderValue<string>,
    denomination?: ProviderValue<string>;
    denominations_usuelle?: ProviderValue<string[]>,
    date_creation?: ProviderValue<Date>,
    data_modification?: ProviderValue<Date>
}