import { Siren } from "../../@types/Siren";
import Association from "./interfaces/Association";
import AssociationsProvider from "./interfaces/AssociationsProvider";
import providers from "../providers";
import { DefaultObject } from "../../@types/utils";
import EntrepriseDtoAdapter from "../providers/DataEntreprise/adapters/EntrepriseDtoAdapter";
import OsirisRequestAdapter from "../osiris/adapters/OsirisRequestAdatper";

export class AssociationsService {

    private provider_score: DefaultObject<number> = {
        [EntrepriseDtoAdapter.PROVIDER_NAME]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5
    }

    private providers: AssociationsProvider[] = Object.values(providers).filter((p) => (p as AssociationsProvider).isAssociationsProvider) as AssociationsProvider[]

    async getAssociationBySiren(siren: Siren) {
        const data = await (await this.aggregate(siren)).filter(asso => asso) as Association[];


        return Object.assign({}, ...data.sort((a, b) => 
            (this.provider_score[a.siren.provider] || 0)
            - (this.provider_score[b.siren.provider] || 0)
        ));
    }

    private async aggregate(siren: Siren): Promise<(Association | null)[]> {
        return Promise.all(
            this.providers.map( p => p.getAssociationsBySiren(siren))
        );
    }

}

const associationsService = new AssociationsService();

export default associationsService;