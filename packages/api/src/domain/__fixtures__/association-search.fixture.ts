import DEFAULT_ASSOCIATION from "../../../tests/__fixtures__/association.fixture";
import AssociationSearchEntity from "../../entities/AssociationSearchEntity";
import { Rna, Siren, Siret } from "../../identifier-objects";

export const ASSOCIATION_SEARCH_ENTITIES: AssociationSearchEntity[] = [
    new AssociationSearchEntity({
        siren: new Siren(DEFAULT_ASSOCIATION.siren),
        mainEstablishmentSiret: new Siret(DEFAULT_ASSOCIATION.siret),
        rna: new Rna(DEFAULT_ASSOCIATION.rna),
        name: DEFAULT_ASSOCIATION.name,
        object: "ROLE AND DEFINITION OF THE ASSOCIATION",
        address: {
            number: "1",
            type: "RUE",
            name: "Général de Gaulle",
            city: "Paris",
            postalCode: "75000",
            complement: null,
        },
        nbEstabs: 2,
    }),
];
