import { Siren } from "../../@types/Siren";
import Association from "./interfaces/Association";
import AssociationsProvider from "./interfaces/AssociationsProvider";
import providers from "../providers";
import { DefaultObject } from "../../@types/utils";
import EntrepriseDtoAdapter from "../providers/dataEntreprise/adapters/EntrepriseDtoAdapter";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdatper";
import LeCompteAssoRequestAdapter from "../providers/leCompteAsso/adapters/LeCompteAssoRequestAdapter";
import { ProviderValues } from "../../@types/ProviderValue";
import AssociationDtoAdapter from "../providers/dataEntreprise/adapters/AssociationDtoAdapter";
import { Rna } from "../../@types/Rna";
import FormaterHelper from "../../shared/helpers/FormaterHelper";

export class AssociationsService {

    private provider_score: DefaultObject<number> = {
        [EntrepriseDtoAdapter.PROVIDER_NAME]: 1,
        [AssociationDtoAdapter.PROVIDER_NAME]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5,
        [LeCompteAssoRequestAdapter.PROVIDER_NAME]: 0.5,
    }

    async getAssociationBySiren(siren: Siren, rna?: Rna) {
        const data = await (await this.aggregate(siren, rna)).filter(asso => asso) as Association[];

        if (!data.length) return null;

        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    private async aggregate(siren: Siren, rna?: Rna): Promise<(Association | null)[]> {
        const associationProviders = Object.values(providers).filter((p) => this.isAssociationsProvider(p)) as AssociationsProvider[];
        return[...(await Promise.all(
            associationProviders.map( p => p.getAssociationsBySiren(siren, rna))
        )).flat()];
    }

    private isAssociationsProvider(data: unknown): data is AssociationsProvider {
        return (data as AssociationsProvider).isAssociationsProvider
    }

}

const associationsService = new AssociationsService();

export default associationsService;