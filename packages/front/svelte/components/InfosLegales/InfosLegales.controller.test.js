import InfosLegalesController from "./InfosLegales.controller";
import * as AssociationHelper from "../../views/association/association.helper";
jest.mock("../../views/association/association.helper", () => ({
    getAddress: address => address
}));

const DEFAULT_ASSOCIATION = {
    denomination_rna: "DENOMINATION_RNA",
    denomination_siren: "DENOMINATION_SIREN",
    adresse_siege_rna: "Adresse RNA",
    adresse_siege_siren: "Adresse SIREN",
    date_creation_rna: new Date("2000-01-01"),
    date_creation_siren: new Date("2012-01-01"),
    date_modification_rna: new Date("2021-01-01"),
    date_modification_siren: new Date("2016-01-01")
};

function buildPartialAssociation() {
    return { ...DEFAULT_ASSOCIATION };
}

describe("InfosLegales Controller", () => {
    const controller = new InfosLegalesController(buildPartialAssociation());
    describe("_buildModalData", () => {
        it("should return data", () => {
            const expected = {
                headers: ["Titre", "Informations provenant du RNA", "Informations provenant du SIREN"],
                rows: [
                    ["Dénomination", DEFAULT_ASSOCIATION.denomination_rna, DEFAULT_ASSOCIATION.denomination_siren],
                    [
                        "Adresse du siège",
                        DEFAULT_ASSOCIATION.adresse_siege_rna,
                        DEFAULT_ASSOCIATION.adresse_siege_siren
                    ],
                    [
                        "Date d'immatriculation",
                        DEFAULT_ASSOCIATION.date_creation_rna,
                        DEFAULT_ASSOCIATION.date_creation_siren
                    ],
                    [
                        "Date de modification",
                        DEFAULT_ASSOCIATION.date_modification_rna,
                        DEFAULT_ASSOCIATION.date_modification_siren
                    ]
                ]
            };
            const actual = controller._buildModalData();
            expect(actual).toEqual(expected);
        });
    });
});
