import DEFAULT_ASSOCIATION from "../../views/association/__fixtures__/Association";
import DEFAULT_ETABLISSEMENT from "../../views/etablissement/__fixtures__/Etablissement";
import InfosLegalesController from "./InfosLegales.controller";
import { dateToDDMMYYYY } from "@helpers/dateHelper";

jest.mock("../../views/association/association.helper", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ASSOCIATION = require("../../views/association/__fixtures__/Association");
    return {
        __esModule: true, // this property makes it work
        addressToString: address => address,
        getSiegeSiret: () => ASSOCIATION.default.siren + ASSOCIATION.default.nic_siege,
        getAddress: () => ASSOCIATION.default.adresse_siege_rna,
        getImmatriculation: jest.fn(),
        getModification: jest.fn()
    };
});

function buildPartialAssociation() {
    return { ...DEFAULT_ASSOCIATION };
}

function buildPartialEtablissement() {
    return { ...DEFAULT_ETABLISSEMENT };
}

describe("InfosLegales Controller", () => {
    describe("Association view", () => {
        const controller = new InfosLegalesController(buildPartialAssociation(), undefined);

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
                            dateToDDMMYYYY(DEFAULT_ASSOCIATION.date_creation_rna),
                            dateToDDMMYYYY(DEFAULT_ASSOCIATION.date_creation_siren)
                        ],
                        [
                            "Date de modification",
                            dateToDDMMYYYY(DEFAULT_ASSOCIATION.date_modification_rna),
                            dateToDDMMYYYY(DEFAULT_ASSOCIATION.date_modification_siren)
                        ]
                    ]
                };
                const actual = controller._buildModalData();
                expect(actual).toEqual(expected);
            });
        });

        describe("getter siret()", () => {
            it("should return headquarters siret object", () => {
                const expected = {
                    title: "SIRET du siège",
                    value: DEFAULT_ASSOCIATION.siren + DEFAULT_ASSOCIATION.nic_siege
                };
                const actual = controller.siret;
                expect(actual).toEqual(expected);
            });
        });
        describe("getter address()", () => {
            it("should return headquarters address object", () => {
                const expected = { title: "Adresse du siège", value: DEFAULT_ASSOCIATION.adresse_siege_rna };
                const actual = controller.address;
                expect(actual).toEqual(expected);
            });
        });
    });

    describe("Etablissement view", () => {
        const controller = new InfosLegalesController(buildPartialAssociation(), buildPartialEtablissement());

        describe("getter siret()", () => {
            it("should return etablissement siret object", () => {
                const expected = { title: "SIRET établissement", value: DEFAULT_ETABLISSEMENT.siret };
                const actual = controller.siret;
                expect(actual).toEqual(expected);
            });
        });
        describe("getter address()", () => {
            it("should return etablissement address object", () => {
                const expected = { title: "Adresse établissement", value: DEFAULT_ETABLISSEMENT.adresse };
                const actual = controller.address;
                expect(actual).toEqual(expected);
            });
        });
    });
});
