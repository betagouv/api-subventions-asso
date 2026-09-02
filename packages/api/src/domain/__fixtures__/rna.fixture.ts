import DEFAULT_ASSOCIATION from "../../../tests/__fixtures__/association.fixture";
import { Rna, Siret } from "../../identifier-objects";

export const RNA_ENTITY = {
    id: new Rna(DEFAULT_ASSOCIATION.rna),
    lastUpdateDate: new Date("2023-03-04"),
    creationDate: new Date("2006-03-04"),
    publicationDate: new Date("2006-03-04"),
    dissolutionDate: new Date("0001-01-01"), // means no dissolution date
    siret: new Siret(DEFAULT_ASSOCIATION.siret),
    name: DEFAULT_ASSOCIATION.name,
    shortName: DEFAULT_ASSOCIATION.name,
    rup: "42.000.0418",
    object: "Lorem ipsum",
    socialObject: "015045",
    nature: "R",
    address: {
        number: "18",
        type: null,
        name: "Alexandre Lefas",
        complement: null,
        postalCode: "35000",
        city: "Rennes",
    },
};
