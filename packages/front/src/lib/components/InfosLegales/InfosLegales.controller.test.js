import InfosLegalesController from "./InfosLegales.controller";
import DEFAULT_ASSOCIATION from "$lib/resources/associations/__fixtures__/Association";
import DEFAULT_ETABLISSEMENT from "$lib/resources/establishments/__fixtures__/Etablissement";
import { dateToDDMMYYYY } from "$lib/helpers/dateHelper";

vi.mock("$lib/resources/associations/association.helper", async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ASSOCIATION = await import("$lib/resources/associations/__fixtures__/Association");
    return {
        addressToString: address => address,
        getSiegeSiret: () => ASSOCIATION.default.siren + ASSOCIATION.default.nic_siege,
        getAddress: () => ASSOCIATION.default.adresse_siege_rna,
        getImmatriculation: vi.fn(),
        getModification: vi.fn(),
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
                            DEFAULT_ASSOCIATION.adresse_siege_siren,
                        ],
                        [
                            "Date d'immatriculation",
                            dateToDDMMYYYY(DEFAULT_ASSOCIATION.date_creation_rna),
                            dateToDDMMYYYY(DEFAULT_ASSOCIATION.date_creation_siren),
                        ],
                        [
                            "Date de modification",
                            dateToDDMMYYYY(DEFAULT_ASSOCIATION.date_modification_rna),
                            dateToDDMMYYYY(DEFAULT_ASSOCIATION.date_modification_siren),
                        ],
                    ],
                };
                const actual = controller._buildModalData();
                expect(actual).toEqual(expected);
            });
        });

        describe("getter siret()", () => {
            it("should return headquarters siret object", () => {
                const expected = {
                    title: "SIRET du siège",
                    value: DEFAULT_ASSOCIATION.siren + DEFAULT_ASSOCIATION.nic_siege,
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
