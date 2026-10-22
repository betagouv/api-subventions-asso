import type { BadgeOption } from "$lib/dsfr/Badge.types";
import { getStatusBadgeOptions } from "$lib/resources/establishments/establishment.helper";

export class EstablishmentCardController {
    establishment: Record<string, unknown>;
    estabStatusBadgeOptions: Partial<BadgeOption> | null;
    constructor(establishment) {
        this.establishment = establishment;
        this.estabStatusBadgeOptions = getStatusBadgeOptions(this.establishment);
    }

    get badgesProps() {
        return this.estabStatusBadgeOptions;
    }
}
