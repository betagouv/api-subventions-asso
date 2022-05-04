import { ProviderValue } from "../../../@types";

export default interface Document {
    type: ProviderValue<string>
    url: ProviderValue<string>
    nom: ProviderValue<string>
}