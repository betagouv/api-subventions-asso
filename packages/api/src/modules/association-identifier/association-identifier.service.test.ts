import DEFAULT_ASSOCIATION from "../../../tests/__fixtures__/association.fixture";
import Rna from "../../identifier-objects/Rna";
import associationIdentifierService from "./association-identifier.service";
import rnaSirenService from "../rna-siren/rna-siren.service";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import Siren from "../../identifier-objects/Siren";
import rnaAdapter from "../../adapters/outputs/db/rna/rna.adapter";
import sireneUniteLegaleAdapter from "../../adapters/outputs/db/sirene/sirene-unite-legale.adapter";
import { RNA_ENTITY } from "../../domain/__fixtures__/rna.fixture";
import { SIRENE_UNITE_LEGAL_ENTITIES } from "../../domain/__fixtures__/unite-legale.fixture";

jest.mock("../../adapters/outputs/db/rna/rna.adapter");
jest.mock("../../adapters/outputs/db/sirene/sirene-unite-legale.adapter");
jest.mock("../rna-siren/rna-siren.service");

describe("AssociationIdentifierService", () => {
    const SIREN = new Siren(DEFAULT_ASSOCIATION.siren);
    const RNA = new Rna(DEFAULT_ASSOCIATION.rna);
    const ASSOCIATIONS_IDENTIFIERS = [AssociationIdentifier.fromSirenAndRna(SIREN, RNA)];
    const UNITE_LEGALE_ENTITY = { ...SIRENE_UNITE_LEGAL_ENTITIES[0] };

    describe("getAssociationIdentifiers", () => {
        let mockIdentifierStringToEntity: jest.SpyInstance;
        const mockGetByRna = jest.spyOn(rnaAdapter, "getByRna").mockResolvedValue(RNA_ENTITY);
        const mockFindOneByRna = jest.spyOn(sireneUniteLegaleAdapter, "findOneByRna");
        const mockFindOneBySiren = jest.spyOn(sireneUniteLegaleAdapter, "findOneBySiren");
        // @ts-expect-error: mock private method
        const mockFilterDuplicates = jest.spyOn(associationIdentifierService, "filterDuplicates");
        beforeEach(() => {
            mockIdentifierStringToEntity = jest
                .spyOn(associationIdentifierService, "identifierStringToEntity")
                .mockReturnValue(RNA);

            jest.mocked(rnaSirenService.find).mockResolvedValue(null);
            mockGetByRna.mockResolvedValue(RNA_ENTITY);
            mockFindOneByRna.mockResolvedValue(UNITE_LEGALE_ENTITY);
            mockFindOneBySiren.mockResolvedValue(UNITE_LEGALE_ENTITY);
            // @ts-expect-error: mock private method return value
            mockFilterDuplicates.mockReturnValue(ASSOCIATIONS_IDENTIFIERS);
        });

        afterAll(() => {
            [mockIdentifierStringToEntity, mockFilterDuplicates].forEach(mock => mock.mockRestore());
        });

        it("returns results from rnaSiren", async () => {
            jest.mocked(rnaSirenService.find).mockResolvedValueOnce([
                { rna: new Rna(DEFAULT_ASSOCIATION.rna), siren: new Siren(DEFAULT_ASSOCIATION.siren) },
            ]);
            const expected = [
                AssociationIdentifier.fromSirenAndRna(
                    new Siren(DEFAULT_ASSOCIATION.siren),
                    new Rna(DEFAULT_ASSOCIATION.rna),
                ),
            ];
            const actual = await associationIdentifierService.getAssociationIdentifiers(RNA.value);
            expect(actual).toEqual(expected);
        });

        describe("when identifier is Rna", () => {
            beforeEach(() => {
                mockIdentifierStringToEntity = jest
                    .spyOn(associationIdentifierService, "identifierStringToEntity")
                    .mockReturnValue(RNA);
            });
            it("get result from rna adapter", async () => {
                await associationIdentifierService.getAssociationIdentifiers(RNA.value);
                expect(mockGetByRna).toHaveBeenCalledWith(RNA);
            });

            it("get result from unite legale adapter by rna", async () => {
                await associationIdentifierService.getAssociationIdentifiers(RNA.value);
                expect(mockFindOneByRna).toHaveBeenCalledWith(RNA);
            });

            it("returns results", async () => {
                const expected = ASSOCIATIONS_IDENTIFIERS; // filterDuplicates mock
                const actual = await associationIdentifierService.getAssociationIdentifiers(RNA.value);
                expect(actual).toEqual(expected);
            });
        });

        describe("when identifier is Siren", () => {
            beforeEach(() => {
                mockIdentifierStringToEntity = jest
                    .spyOn(associationIdentifierService, "identifierStringToEntity")
                    .mockReturnValue(SIREN);
            });

            it("get result from unite legale adapter by rna", async () => {
                await associationIdentifierService.getAssociationIdentifiers(SIREN.value);
                expect(mockFindOneBySiren).toHaveBeenCalledWith(SIREN);
            });

            it("returns results ", async () => {
                const expected = [
                    AssociationIdentifier.fromSirenAndRna(
                        UNITE_LEGALE_ENTITY.siren,
                        UNITE_LEGALE_ENTITY.identifiantAssociationUniteLegale,
                    ),
                ]; // filterDuplicates mock
                const actual = await associationIdentifierService.getAssociationIdentifiers(SIREN.value);
                expect(actual).toEqual(expected);
            });
        });

        it("persists match in rna-siren collection", async () => {
            await associationIdentifierService.getAssociationIdentifiers(RNA.value);
            expect(rnaSirenService.insertManyAssociationIdentifer).toHaveBeenLastCalledWith(ASSOCIATIONS_IDENTIFIERS);
        });
    });

    describe("filterDuplicates", () => {
        it("removes duplicate AssociationIdentifier", () => {
            const expected = ASSOCIATIONS_IDENTIFIERS;
            // @ts-expect-error: test private method
            const actual = associationIdentifierService.filterDuplicates([
                ...ASSOCIATIONS_IDENTIFIERS,
                ASSOCIATIONS_IDENTIFIERS[0],
            ]);
            expect(actual).toEqual(expected);
        });
    });
});
