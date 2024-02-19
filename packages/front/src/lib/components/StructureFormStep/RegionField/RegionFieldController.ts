import Store from "$lib/core/Store";
import type { Option } from "$lib/types/FieldOption";
import geoService from "$lib/resources/externals/geo/geo.service";
import { waitElementIsVisible } from "$lib/helpers/visibilityHelper";

export default class RegionFieldController {
    public regionOptions: Store<Option<string>[]>;

    constructor() {
        this.regionOptions = new Store([]);
    }

    private async loadOptions() {
        if (this.regionOptions.value.length) return;
        const territories = await geoService.getRegions();
        const transform = (reg: { nom: string }) => reg.nom;
        const options = territories
            .map(territory => ({
                label: transform(territory),
                value: transform(territory),
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        this.regionOptions.set(options);
    }

    async onMount(element) {
        // Svelte component mounted so bind:this replaced this.element with current node element
        await waitElementIsVisible(element as HTMLElement);
        await this.loadOptions();
    }
}
