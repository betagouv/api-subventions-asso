import AssociationIdentifier from "./AssociationIdentifier";
import Siret from "./Siret";

export default class EstablishmentIdentifier {
    public siret?: Siret;

    public associationIdentifier: AssociationIdentifier;

    private constructor(associationIdentifier: AssociationIdentifier, siret?: Siret) {
        this.associationIdentifier = associationIdentifier;
        this.siret = siret;
    }

    static fromSiret(siret: Siret, associationIdentifier: AssociationIdentifier) {
        return new EstablishmentIdentifier(associationIdentifier, siret);
    }

    toString(): string {
        if (!this.siret) throw new Error("No siret found in EstablishmentIdentifier");
        return this.siret?.value;
    }
}
