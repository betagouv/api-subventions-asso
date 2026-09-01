import { Address } from "../@types/Address";
import { Rna, Siret } from "../identifier-objects";

// Make it a class when validation will be required
export interface RnaEntity {
    id: Rna;
    lastUpdateDate: Date;
    creationDate: Date | null;
    publicationDate: Date | null;
    dissolutionDate: Date | null;
    siret: Siret | null;
    name: string | null;
    shortName: string | null;
    rup: string | null;
    object: string | null;
    socialObject: string | null;
    nature: string | null;
    address: Address | null;
}
