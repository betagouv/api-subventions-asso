import { ProviderEnum } from "../../../@enums/ProviderEnum";

export default interface Provider {
    provider: {
        name: string;
        type: ProviderEnum;
        description: string;
        id: string;
    };
}
