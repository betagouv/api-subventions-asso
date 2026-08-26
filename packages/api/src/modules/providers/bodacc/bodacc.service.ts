import { ProviderEnum } from "../../../@enums/ProviderEnum";
import ProviderCore from "../provider.core";

// Empty shell the time to find a solutions to the /providers route
export class BodaccService extends ProviderCore {
    constructor() {
        super({
            type: ProviderEnum.api,
            name: "Bodacc",
            id: "bodacc",
            description: "Le bulletin officiel des annonces civiles et commerciales",
        });
    }
}

const bodaccService = new BodaccService();
export default bodaccService;
