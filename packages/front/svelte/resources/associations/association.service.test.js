import associationService from "./association.service";
import associationPort from "./association.port";
import { isRna, isStartOfSiret } from "@helpers/validatorHelper";
import { siretToSiren } from "@helpers/sirenHelper";
import * as providerValueHelper from "@helpers/providerValueHelper";

jest.mock("@helpers/validatorHelper");
jest.mock("@helpers/sirenHelper");
jest.mock("@helpers/providerValueHelper", () => ({
    flatenProviderValue: jest.fn(),
}));

describe("AssociationService", () => {
    const SIREN = "000000009";

    describe("getAssociation", () => {
        it("should return undefined if no association found", async () => {
            jest.spyOn(associationPort, "getByRnaOrSiren").mockImplementationOnce(jest.fn());
            const expected = undefined;
            const actual = await associationService.getAssociation(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should flaten data", async () => {
            jest.spyOn(associationPort, "getByRnaOrSiren").mockImplementationOnce(async () => ({}));
            await associationService.getAssociation(SIREN);
            expect(providerValueHelper.flatenProviderValue).toHaveBeenCalledTimes(1);
        });
    });

    describe("incExtractData", () => {
        let mockPort;
        beforeAll(() => {
            mockPort = jest.spyOn(associationPort, "incExtractData").mockResolvedValue();
        });
        afterAll(() => {
            mockPort.mockRestore();
        });

        it("should call associationPort.extractData()", () => {
            associationService.incExtractData(SIREN);
            expect(mockPort).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("_searchByIdentifier", () => {
        let mockGetAsso;

        beforeAll(() => {
            mockGetAsso = jest.spyOn(associationService, "getAssociation").mockResolvedValue({});
        });
        afterAll(() => mockGetAsso.mockRestore());

        it("calls helper to identify start of siret", async () => {
            await associationService._searchByIdentifier(SIREN);
            expect(isStartOfSiret).toHaveBeenCalledWith(SIREN);
        });

        it("transform to siren if start of siret", async () => {
            isStartOfSiret.mockReturnValueOnce(true);
            await associationService._searchByIdentifier(SIREN);
            expect(siretToSiren).toHaveBeenCalledWith(SIREN);
        });

        it("gets association from computed siren", async () => {
            const transformedSiren = "test";
            isStartOfSiret.mockReturnValueOnce(true);
            siretToSiren.mockReturnValueOnce(transformedSiren);
            await associationService._searchByIdentifier(SIREN);
            expect(mockGetAsso).toHaveBeenCalledWith(transformedSiren);
        });

        it("gets association from given identifier", async () => {
            isStartOfSiret.mockReturnValueOnce(false);
            await associationService._searchByIdentifier(SIREN);
            expect(mockGetAsso).toHaveBeenCalledWith(SIREN);
        });

        it("catch 404 and returns empty list", async () => {
            mockGetAsso.mockRejectedValueOnce({ httpCode: 404 });
            const expected = [];
            const actual = await associationService._searchByIdentifier(SIREN);
            expect(actual).toEqual(expected);
        });

        it("returns summarized result from port", async () => {
            mockGetAsso.mockResolvedValue({
                rna: "RNA",
                siren: "SIREN",
                denomination_rna: "NOM_RNA",
                denomination_siren: "NOM_SIREN",
                autre_valeur: "ratata",
            });
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
        let mockPort;
        beforeAll(() => {
            mockPort = jest.spyOn(associationPort, "search").mockResolvedValue([]);
        });
        afterAll(() => {
            mockPort.mockRestore();
        });

        it("calls port", async () => {
            await associationService._searchByText(SIREN);
            expect(mockPort).toHaveBeenCalledWith(SIREN);
        });

        it("returns result from port", async () => {
            const expected = "test";
            mockPort.mockReturnValueOnce(expected);
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
            expect(isRna).toHaveBeenCalledWith(SIREN) && expect(isStartOfSiret).toHaveBeenCalledWith(SIREN);
        });

        it("does not call _searchByIdentifier if arg is not an identifier", async () => {
            isRna.mockReturnValueOnce(false);
            isStartOfSiret.mockReturnValueOnce(false);
            await associationService.search(SIREN);
            expect(mockByIdentifier).not.toHaveBeenCalled();
        });

        it("calls _searchByIdentifier if arg is an identifier", async () => {
            isStartOfSiret.mockReturnValueOnce(true);
            await associationService.search(SIREN);
            expect(mockByIdentifier).toHaveBeenCalledWith(SIREN);
        });

        it("returns result from _searchByIdentifier if arg is an identifier", async () => {
            isStartOfSiret.mockReturnValueOnce(true);
            await associationService.search(SIREN);
            expect(mockByIdentifier).toHaveBeenCalledWith(SIREN);
        });

        it("returns an empty list if arg is not an identifier and searchByText is empty-handed", async () => {
            isRna.mockReturnValueOnce(false);
            isStartOfSiret.mockReturnValueOnce(false);
            const expected = [];
            const actual = await associationService.search(SIREN);
            expect(actual).toEqual(expected);
        });
    });
});
