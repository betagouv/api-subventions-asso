import { getEstabStatusBadgeOptions } from "$lib/resources/associations/association.helper";

export class EstablishmentCardController {
    constructor(establishment) {
        this.establishment = establishment;
        this.estabStatusBadgeOptions = getEstabStatusBadgeOptions(this.establishment);
    }

    get badgesProps() {
        console.log(this.estabStatusBadgeOptions);
        return this.estabStatusBadgeOptions;
    }
}
