import Rna from "./Rna";
import Siren from "./Siren";

export default class AssociationIdentifier {
    public rna?: Rna;
    public siren?: Siren;

    private constructor(rna?: Rna, siren?: Siren) {
        this.rna = rna;
        this.siren = siren;
    }

    static fromRna(rna: Rna) {
        return new AssociationIdentifier(rna, undefined);
    }

    static fromSiren(siren: Siren) {
        return new AssociationIdentifier(undefined, siren);
    }

    static fromSirenAndRna(siren: Siren, rna: Rna) {
        // if siren ou rna pas ok erreur
        return new AssociationIdentifier(rna, siren);
    }

    static fromId(id: Rna | Siren) {
        if (id instanceof Rna) {
            return AssociationIdentifier.fromRna(id);
        } else if (id instanceof Siren) {
            return AssociationIdentifier.fromSiren(id);
        } else {
            throw new Error("Invalid type");
        }
    }

    toString(): string {
        if (this.rna) return this.rna.value;
        if (this.siren) return this.siren.value;
        throw new Error("No rna or siren found in AssociationIdentifier");
    }
}
