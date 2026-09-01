import DEFAULT_ASSOCIATION from "../../../tests/__fixtures__/association.fixture";
import { EstablishmentEntity } from "../structures/establishments/EstablishmentEntity";

export const ESTABLISHMENT_ENTITY: EstablishmentEntity = new EstablishmentEntity({
    siret: DEFAULT_ASSOCIATION.siret,
    siege: true,
    address: {
        number: "18",
        type: "rue",
        name: "Alexandre Lefas",
        complement: null,
        postalCode: "35000",
        city: "Rennes",
    },
    lastUpdate: new Date("2026-05-20"),
});
