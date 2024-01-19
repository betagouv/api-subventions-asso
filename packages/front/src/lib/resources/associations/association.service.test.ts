import associationService from "./association.service";

import associationPort from "./association.port";
vi.mock("./association.port", () => ({
    default: {
        incExtractData: vi.fn(),
        getByIdentifier: vi.fn(() => ({})),
        getEstablishments: vi.fn(() => []),
        search: vi.fn(() => []),
    },
}));
const mockedAssociationPort = vi.mocked(associationPort);
vi.mock("$lib/services/localStorage.service", () => ({
    updateSearchHistory: vi.fn(),
}));

import * as IdentifierHelper from "$lib/helpers/identifierHelper";
vi.mock("$lib/helpers/identifierHelper");
const mockedIdentifierHelper = vi.mocked(IdentifierHelper);
import * as sirenHelper from "$lib/helpers/sirenHelper";
vi.mock("$lib/helpers/sirenHelper");
const mockedSirenHelper = vi.mocked(sirenHelper);
vi.mock("$lib/services/searchHistory.service");
import * as AssociationHelper from "$lib/resources/associations/association.helper";
vi.mock("$lib/resources/associations/association.helper");
import * as AssociationAdapter from "$lib/resources/associations/association.adapter";
vi.mock("$lib/resources/associations/association.adapter");

const ASSOCIATIONS = [{ rna: "W123455353", siren: "123456789" }];

import * as providerValueHelper from "$lib/helpers/providerValueHelper";
vi.mock("$lib/helpers/providerValueHelper", () => {
    return {
        flattenProviderValue: vi.fn(() => ASSOCIATIONS),
    };
});

describe("AssociationService", () => {
    const SIREN = "000000009";

    describe("incExtractData", () => {
        it("should call associationPort.extractData()", () => {
            associationService.incExtractData(SIREN);
            expect(mockedAssociationPort.incExtractData).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("getAssociation", () => {
        it("should return undefined if no association found", async () => {
            const expected = undefined;
            mockedAssociationPort.getByIdentifier.mockResolvedValue(undefined);
            const actual = await associationService.getAssociation(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should flatten data", async () => {
            // @ts-expect-error: mock
            mockedAssociationPort.getByIdentifier.mockResolvedValue(ASSOCIATIONS[0]);
            await associationService.getAssociation(SIREN);
            expect(providerValueHelper.flattenProviderValue).toHaveBeenCalledTimes(1);
        });
    });

    describe("getEstablishments", () => {
        it("should call port", async () => {
            await associationService.getEstablishments(SIREN);
            expect(mockedAssociationPort.getEstablishments).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("_searchByIdentifier", () => {
        const mockGetAssociation = vi.spyOn(associationService, "getAssociation");

        beforeAll(() =>
            // @ts-expect-error: mock
            mockGetAssociation.mockResolvedValue({
                rna: ASSOCIATIONS[0].rna,
                siren: ASSOCIATIONS[0].siren,
                denomination_rna: "DENOMINATION",
            }),
        );

        afterAll(() => {
            mockGetAssociation.mockReset();
        });

        it("calls helper to identify start of siret", async () => {
            await associationService._searchByIdentifier(SIREN);
            expect(mockedIdentifierHelper.isStartOfSiret).toHaveBeenCalledWith(SIREN);
        });

        it("transform to siren if start of siret", async () => {
            mockedIdentifierHelper.isStartOfSiret.mockReturnValueOnce(true);
            await associationService._searchByIdentifier(SIREN);
            expect(sirenHelper.siretToSiren).toHaveBeenCalledWith(SIREN);
        });

        it("call getAssociation()", async () => {
            const transformedSiren = "test";
            mockedIdentifierHelper.isStartOfSiret.mockReturnValueOnce(true);
            mockedSirenHelper.siretToSiren.mockReturnValueOnce(transformedSiren);
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
            mockGetAssociation.mockResolvedValueOnce({
                rna: "RNA",
                siren: "SIREN",
                denomination_rna: "NOM_RNA",
                denomination_siren: "NOM_SIREN",
                // @ts-expect-error: test
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
        it("calls port", async () => {
            await associationService._searchByText(SIREN);
            expect(mockedAssociationPort.search).toHaveBeenCalledWith(SIREN);
        });

        it("returns result from port", async () => {
            const expected = "test";
            mockedAssociationPort.search.mockResolvedValue(expected);
            const actual = await associationService._searchByText(SIREN);
            expect(actual).toBe(expected);
        });
    });

    describe("search", () => {
        let mockByText, mockByIdentifier;
        beforeAll(() => {
            mockByText = vi.spyOn(associationService, "_searchByText").mockResolvedValue([]);
            mockByIdentifier = vi.spyOn(associationService, "_searchByIdentifier").mockResolvedValue([]);
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
            expect(mockedIdentifierHelper.isRna).toHaveBeenCalledWith(SIREN);
            expect(mockedIdentifierHelper.isStartOfSiret).toHaveBeenCalledWith(SIREN);
        });

        it("does not call _searchByIdentifier if arg is not an identifier", async () => {
            mockedIdentifierHelper.isRna.mockReturnValueOnce(false);
            mockedIdentifierHelper.isStartOfSiret.mockReturnValueOnce(false);
            await associationService.search(SIREN);
            expect(mockByIdentifier).not.toHaveBeenCalled();
        });

        it("calls _searchByIdentifier if arg is an identifier", async () => {
            mockedIdentifierHelper.isStartOfSiret.mockReturnValueOnce(true);
            await associationService.search(SIREN);
            expect(mockByIdentifier).toHaveBeenCalledWith(SIREN);
        });

        it("returns result from _searchByIdentifier if arg is an identifier", async () => {
            mockedIdentifierHelper.isStartOfSiret.mockReturnValueOnce(true);
            await associationService.search(SIREN);
            expect(mockByIdentifier).toHaveBeenCalledWith(SIREN);
        });

        it("returns an empty list if arg is not an identifier and searchByText is empty-handed", async () => {
            mockedIdentifierHelper.isRna.mockReturnValueOnce(false);
            mockedIdentifierHelper.isStartOfSiret.mockReturnValueOnce(false);
            const expected = [];
            const actual = await associationService.search(SIREN);
            expect(actual).toEqual(expected);
        });
    });
});
