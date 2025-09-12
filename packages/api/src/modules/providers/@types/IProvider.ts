import { ProviderEnum } from "../../../@enums/ProviderEnum";

export default interface Provider {
    meta: {
        name: string;
        type: ProviderEnum;
        description: string;
        id: string;
    };
}
