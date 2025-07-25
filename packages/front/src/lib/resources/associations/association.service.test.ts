import associationService from "./association.service";

import associationPort from "./association.port";
import type { PaginatedAssociationNameDto } from "dto";
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
import { siretToSiren } from "$lib/helpers/identifierHelper";
vi.mock("$lib/helpers/identifierHelper");
const mockedIdentifierHelper = vi.mocked(IdentifierHelper);
vi.mock("$lib/helpers/sirenHelper");
vi.mock("$lib/services/searchHistory.service");
vi.mock("$lib/resources/associations/association.helper");
vi.mock("$lib/resources/associations/association.adapter");
const ASSOCIATIONS = [{ rna: "W123455353", siren: "123456789" }];

import * as providerValueHelper from "$lib/helpers/providerValueHelper";
import { isAssociation } from "$lib/resources/associations/association.helper";
import { updateSearchHistory } from "$lib/services/searchHistory.service";

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

        it("checks if is really asso", async () => {
            // @ts-expect-error: mock
            mockedAssociationPort.getByIdentifier.mockResolvedValue(ASSOCIATIONS[0]);
            vi.mocked(providerValueHelper.flattenProviderValue).mockReturnValueOnce(ASSOCIATIONS[0]);
            await associationService.getAssociation(SIREN);
            expect(isAssociation).toHaveBeenCalledWith(ASSOCIATIONS[0]);
        });

        it("saves asso in search history if really asso", async () => {
            // @ts-expect-error: mock
            mockedAssociationPort.getByIdentifier.mockResolvedValue(ASSOCIATIONS[0]);
            vi.mocked(isAssociation).mockReturnValueOnce(true);
            await associationService.getAssociation(SIREN);
            expect(updateSearchHistory).toHaveBeenCalled();
        });

        it("does not save in search history if not asso", async () => {
            // @ts-expect-error: mock
            mockedAssociationPort.getByIdentifier.mockResolvedValue(ASSOCIATIONS[0]);
            await associationService.getAssociation(SIREN);
            vi.mocked(isAssociation).mockReturnValueOnce(false);
            expect(updateSearchHistory).not.toHaveBeenCalled();
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
            expect(siretToSiren).toHaveBeenCalledWith(SIREN);
        });

        it("call getAssociation()", async () => {
            const transformedSiren = "test";
            mockedIdentifierHelper.isStartOfSiret.mockReturnValueOnce(true);
            vi.mocked(siretToSiren).mockReturnValueOnce(transformedSiren);
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
            const PAGE = 2;
            await associationService._searchByText(SIREN, PAGE);
            expect(mockedAssociationPort.search).toHaveBeenCalledWith(SIREN, PAGE);
        });

        it("calls port with default PAGE", async () => {
            await associationService._searchByText(SIREN);
            expect(mockedAssociationPort.search).toHaveBeenCalledWith(SIREN, 1);
        });

        it("returns result from port", async () => {
            const expected = "test" as unknown as PaginatedAssociationNameDto;
            mockedAssociationPort.search.mockResolvedValue(expected);
            const actual = await associationService._searchByText(SIREN);
            expect(actual).toBe(expected);
        });
    });

    describe("search", () => {
        let mockByText, mockByIdentifier;
        beforeAll(() => {
            mockByText = vi
                .spyOn(associationService, "_searchByText")
                .mockResolvedValue({} as unknown as PaginatedAssociationNameDto);
            mockByIdentifier = vi.spyOn(associationService, "_searchByIdentifier").mockResolvedValue([]);
        });
        afterAll(() => {
            mockByText.mockRestore();
            mockByIdentifier.mockRestore();
        });

        it("calls _searchByText", async () => {
            const PAGE = 2;
            await associationService.search(SIREN, PAGE);
            expect(mockByText).toHaveBeenCalledWith(SIREN, PAGE);
        });

        it("calls _searchByText with default PAGE", async () => {
            await associationService.search(SIREN);
            expect(mockByText).toHaveBeenCalledWith(SIREN, 1);
        });

        it("returns result from search text if not empty", async () => {
            const expected = { nbPages: 1, page: 1, results: ["a", "b"], total: 2 };
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
            const expected = { nbPages: 1, page: 1, results: [], total: 0 };
            const actual = await associationService.search(SIREN);
            expect(actual).toEqual(expected);
        });
    });
});
