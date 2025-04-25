import { Provider } from "../@types/Provider";

export default class ProvidersInfos {
    constructor(
        public api: Provider[],
        public raw: Provider[],
    ) {}
}
