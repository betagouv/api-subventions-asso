import { getStatusBadgeOptions } from "$lib/resources/establishments/establishment.helper";

export class EstablishmentCardController {
    constructor(establishment) {
        this.establishment = establishment;
        this.estabStatusBadgeOptions = getStatusBadgeOptions(this.establishment);
    }

    get badgesProps() {
        return this.estabStatusBadgeOptions;
    }
}
