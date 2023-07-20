import associationService from "./association.service";

import associationPort from "./association.port";
jest.mock("./association.port", () => ({
    incExtractData: jest.fn(),
    getByIdentifier: jest.fn(() => ({})),
    getEstablishments: jest.fn(() => []),
    search: jest.fn(() => []),
}));

import * as validatorHelper from "$lib/helpers/validatorHelper";
jest.mock("$lib/helpers/validatorHelper");
import * as sirenHelper from "$lib/helpers/sirenHelper";
jest.mock("$lib/helpers/sirenHelper");

const ASSOCIATIONS = [{ rna: "W123455353", siren: "123456789" }];

import * as providerValueHelper from "$lib/helpers/providerValueHelper";
jest.mock("$lib/helpers/providerValueHelper", () => {
    return {
        flattenProviderValue: jest.fn(() => ASSOCIATIONS),
    };
});

describe("AssociationService", () => {
    const SIREN = "000000009";

    describe("incExtractData", () => {
        it("should call associationPort.extractData()", () => {
            associationService.incExtractData(SIREN);
            expect(associationPort.incExtractData).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("getAssociation", () => {
        it("should return undefined if no association found", async () => {
            const expected = undefined;
            associationPort.getByIdentifier.mockImplementationOnce(jest.fn());
            const actual = await associationService.getAssociation(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should flaten data", async () => {
            associationPort.getByIdentifier.mockImplementationOnce(async () => ASSOCIATIONS);
            await associationService.getAssociation(SIREN);
            expect(providerValueHelper.flattenProviderValue).toHaveBeenCalledTimes(1);
        });
    });

    describe("getEstablishments", () => {
        it("should call port", async () => {
            await associationService.getEstablishments(SIREN);
            expect(associationPort.getEstablishments).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("_searchByIdentifier", () => {
        const mockGetAssociation = jest.spyOn(associationService, "getAssociation");
        beforeAll(() =>
            mockGetAssociation.mockImplementation(() => ({
                rna: ASSOCIATIONS[0].rna,
                siren: ASSOCIATIONS[0].siren,
                denomination_rna: "DENOMINATION",
            })),
        );

        afterAll(() => {
            associationPort.getByIdentifier.mockReset();
        });

        it("calls helper to identify start of siret", async () => {
            await associationService._searchByIdentifier(SIREN);
            expect(validatorHelper.isStartOfSiret).toHaveBeenCalledWith(SIREN);
        });

        it("transform to siren if start of siret", async () => {
            validatorHelper.isStartOfSiret.mockReturnValueOnce(true);
            await associationService._searchByIdentifier(SIREN);
            expect(sirenHelper.siretToSiren).toHaveBeenCalledWith(SIREN);
        });

        it("call getAssociation()", async () => {
            const transformedSiren = "test";
            validatorHelper.isStartOfSiret.mockReturnValueOnce(true);
            sirenHelper.siretToSiren.mockReturnValueOnce(transformedSiren);
            await associationService._searchByIdentifier(SIREN);
            expect(mockGetAssociation).toHaveBeenCalledWith(transformedSiren);
        });

        it("catch 404 and returns empty list", async () => {
            mockGetAssociation.mockRejectedValue({ httpCode: 404 });
            const expected = [];
            const actual = await associationService._searchByIdentifier(SIREN);
            expect(actual).toEqual(expected);
        });

        it("returns summarized result from port", async () => {
            mockGetAssociation.mockImplementationOnce(() => ({
                rna: "RNA",
                siren: "SIREN",
                denomination_rna: "NOM_RNA",
                denomination_siren: "NOM_SIREN",
                autre_valeur: "ratata",
            }));
            const expected = [
                {
                    rna: "RNA",
                    siren: "SIREN",
                    name: "NOM_RNA",
                },
            ];
            const actual = await associationService._searchByIdentifier(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("_searchByText", () => {
        it("calls port", async () => {
            await associationService._searchByText(SIREN);
            expect(associationPort.search).toHaveBeenCalledWith(SIREN);
        });

        it("returns result from port", async () => {
            const expected = "test";
            associationPort.search.mockReturnValueOnce(expected);
            const actual = await associationService._searchByText(SIREN);
            expect(actual).toBe(expected);
        });
    });

    describe("search", () => {
        let mockByText, mockByIdentifier;
        beforeAll(() => {
            mockByText = jest.spyOn(associationService, "_searchByText").mockResolvedValue([]);
            mockByIdentifier = jest.spyOn(associationService, "_searchByIdentifier").mockResolvedValue([]);
        });
        afterAll(() => {
            mockByText.mockRestore();
            mockByIdentifier.mockRestore();
        });

        it("calls _searchByText", async () => {
            await associationService.search(SIREN);
            expect(mockByText).toHaveBeenCalledWith(SIREN);
        });

        it("returns result from search text if not empty", async () => {
            const expected = ["a", "b"];
            mockByText.mockResolvedValueOnce(expected);
            const actual = await associationService.search(SIREN);
            expect(actual).toEqual(expected);
        });

        it("does not call _searchByIdentifier if search text is not empty", async () => {
            mockByText.mockResolvedValueOnce(["a", "b"]);
            await associationService.search(SIREN);
            expect(mockByIdentifier).not.toHaveBeenCalled();
        });

        it("calls identifier helpers if _searchByIdentifier is empty", async () => {
            await associationService.search(SIREN);
            expect(validatorHelper.isRna).toHaveBeenCalledWith(SIREN) &&
                expect(validatorHelper.isStartOfSiret).toHaveBeenCalledWith(SIREN);
        });

        it("does not call _searchByIdentifier if arg is not an identifier", async () => {
            validatorHelper.isRna.mockReturnValueOnce(false);
            validatorHelper.isStartOfSiret.mockReturnValueOnce(false);
            await associationService.search(SIREN);
            expect(mockByIdentifier).not.toHaveBeenCalled();
        });

        it("calls _searchByIdentifier if arg is an identifier", async () => {
            validatorHelper.isStartOfSiret.mockReturnValueOnce(true);
            await associationService.search(SIREN);
            expect(mockByIdentifier).toHaveBeenCalledWith(SIREN);
        });

        it("returns result from _searchByIdentifier if arg is an identifier", async () => {
            validatorHelper.isStartOfSiret.mockReturnValueOnce(true);
            await associationService.search(SIREN);
            expect(mockByIdentifier).toHaveBeenCalledWith(SIREN);
        });

        it("returns an empty list if arg is not an identifier and searchByText is empty-handed", async () => {
            validatorHelper.isRna.mockReturnValueOnce(false);
            validatorHelper.isStartOfSiret.mockReturnValueOnce(false);
            const expected = [];
            const actual = await associationService.search(SIREN);
            expect(actual).toEqual(expected);
        });
    });
});
