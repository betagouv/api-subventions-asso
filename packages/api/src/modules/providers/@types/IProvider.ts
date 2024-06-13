import { ProviderEnum } from "../../../@enums/ProviderEnum";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import PaymentProvider from "../../payments/@types/PaymentProvider";
import GrantProvider from "../../grant/@types/GrantProvider";
import DocumentProvider from "../../documents/@types/DocumentsProvider";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";

export default interface Provider {
    provider: {
        name: string;
        type: ProviderEnum;
        description: string;
        id: string;
    };
}

// TODO: find a way to make a type accept any type that inherit from Provider
export type AnyProvider =
    | DemandesSubventionsProvider<unknown>
    | PaymentProvider<unknown>
    | GrantProvider
    | DocumentProvider
    | EtablissementProvider
    | AssociationsProvider;
