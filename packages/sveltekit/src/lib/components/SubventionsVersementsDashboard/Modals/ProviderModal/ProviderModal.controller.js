import providersService from "../../../../resources/providers/providers.service";
import Store from "../../../../core/Store";

export default class ProviderModalController {
    constructor() {
        this.providers = new Store([]);
        this.loading = new Store(true);
        this.error = new Store(null);
        this._loadProviders();
    }

    async _loadProviders() {
        try {
            const providers = await providersService.getProviders();
            this.providers.set(providers);
            this.loading.set(false);
        } catch (e) {
            this.error.set(e);
        }
    }
}
