export class EstablishmentCardController {
    constructor(establishment) {
        this.badgesProps = establishment.ouvert
            ? { label: "Ouvert", type: "success" }
            : { label: "Fermé", type: "error" };
    }
}
