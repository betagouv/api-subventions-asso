import { Siren } from "@api-subventions-asso/dto";
import axios from "axios";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";
import BodaccAdapter from "./adapters/bodacc.adapter";
import { BodaccDto } from "./dto/BodaccDto";

export class BodaccService implements AssociationsProvider {
    provider = {
        type: ProviderEnum.api,
        name: "Bodacc",
        description: "Le bulletin officiel des annonces civiles et commerciales"
    };

    isAssociationsProvider = true;

    apiUrl = "https://bodacc-datadila.opendatasoft.com/api/v2";

    async sendRequest(siren: Siren) {
        try {
            const result = await axios.get<BodaccDto>(
                `${this.apiUrl}/catalog/datasets/annonces-commerciales/records?order_by=dateparution DESC&refine=registre:${siren}`
            );
            return result.data;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getAssociationsBySiren(siren: Siren) {
        const bodaccDto = await this.sendRequest(siren);
        if (!bodaccDto || bodaccDto.total_count === 0) return null;
        return [BodaccAdapter.toAssociation(bodaccDto)];
    }

    async getAssociationsBySiret(siret) {
        return this.getAssociationsBySiren(siretToSiren(siret));
    }

    async getAssociationsByRna() {
        return null;
    }
}

const bodaccService = new BodaccService();
export default bodaccService;
