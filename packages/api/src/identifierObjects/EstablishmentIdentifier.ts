import AssociationIdentifier from "./AssociationIdentifier";
import Siret from "./Siret";
import Ridet from "./Ridet";
import Tahitiet from "./Tahitiet";
import { EstablishmentIdName } from "./@types/IdentifierName";

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

    static getIdentifierType(identifier: string): EstablishmentIdName | null {
        if (Siret.isSiret(identifier)) return Siret.getName();
        if (Ridet.isRidet(identifier)) return Ridet.getName();
        if (Tahitiet.isTahitiet(identifier)) return Tahitiet.getName();
        return null;
    }

    static buildIdentifierFromString(identifier: string) {
        if (Siret.isSiret(identifier)) return new Siret(identifier);
        if (Ridet.isRidet(identifier)) return new Ridet(identifier);
        if (Tahitiet.isTahitiet(identifier)) return new Tahitiet(identifier);
        return null;
    }

    toString(): string {
        if (!this.siret) throw new Error("No siret found in EstablishmentIdentifier");
        return this.siret?.value;
    }
}
