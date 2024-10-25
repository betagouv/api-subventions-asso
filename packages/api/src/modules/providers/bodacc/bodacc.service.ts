import { Association } from "dto";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";
import ProviderCore from "../ProviderCore";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";
import Siren from "../../../valueObjects/Siren";
import BodaccAdapter from "./adapters/bodacc.adapter";
import { BodaccDto } from "./dto/BodaccDto";

export class BodaccService extends ProviderCore implements AssociationsProvider {
    isAssociationsProvider = true;

    apiUrl = "https://bodacc-datadila.opendatasoft.com/api/v2";

    constructor() {
        super({
            type: ProviderEnum.api,
            name: "Bodacc",
            id: "bodacc",
            description: "Le bulletin officiel des annonces civiles et commerciales",
        });
    }

    async sendRequest(siren: Siren) {
        try {
            const result = await this.http.get<BodaccDto>(
                `${this.apiUrl}/catalog/datasets/annonces-commerciales/records?order_by=dateparution DESC&refine=registre:${siren.value}`,
            );
            return result.data;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    async getAssociations(identifier: AssociationIdentifier): Promise<Association[]> {
        if (!identifier.siren) return [];

        const bodaccDto = await this.sendRequest(identifier.siren);
        if (!bodaccDto || bodaccDto.total_count === 0) return [];

        return [BodaccAdapter.toAssociation(bodaccDto)];
    }
}

const bodaccService = new BodaccService();
export default bodaccService;
