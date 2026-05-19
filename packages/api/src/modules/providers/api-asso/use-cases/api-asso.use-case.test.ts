import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import { ASSOCIATION_DTO } from "../../../../adapters/inputs/http/__fixtures__/association.fixture";
import { Rna, Siren } from "../../../../identifier-objects";
import { fixtureAsso as STRUCTURE_DTO } from "../__fixtures__/ApiAssoStructureFixture";
import { RNA_STRUCTURE_DTO } from "../__fixtures__/RnaStructureFixture";
import FindRnaSirenUseCase from "./find-rna-siren.use-case";
import GetRnaAssoUseCase from "./get-rna-asso.use-case";
import TransformRnaStructureToAssoUseCase from "./transform-rna-structure-to-asso.use-case";

describe("ApiAsso Use Cases", () => {
    const mockApiAssoPort = {
        getStructure: jest.fn(),
        getRnaStructure: jest.fn(),
        getSirenStructure: jest.fn(),
    };

    const SIREN = new Siren(DEFAULT_ASSOCIATION.siren);
    const RNA = new Rna(DEFAULT_ASSOCIATION.rna);

    describe("FindRnaSiren", () => {
        let useCase: FindRnaSirenUseCase;
        beforeEach(() => {
            // @ts-expect-error: inject mock
            useCase = new FindRnaSirenUseCase(mockApiAssoPort);
        });

        it("should return null if identite is undefined", async () => {
            jest.mocked(mockApiAssoPort.getStructure).mockResolvedValueOnce({ ...STRUCTURE_DTO, identite: undefined });
            const expected = null;
            const actual = await useCase.execute(RNA);
            expect(actual).toEqual(expected);
        });

        it.each([
            { identifier: RNA, expected: { rna: RNA, siren: new Siren(STRUCTURE_DTO.identite!.id_siren as string) } },
            { identifier: SIREN, expected: { rna: new Rna(STRUCTURE_DTO.identite!.id_rna), siren: SIREN } },
        ])("should return identifiers", async ({ identifier, expected }) => {
            jest.mocked(mockApiAssoPort.getStructure).mockResolvedValueOnce(STRUCTURE_DTO);
            const actual = await useCase.execute(identifier);
            expect(actual).toEqual(expected);
        });
    });

    describe("GetRnaAsso", () => {
        const mockToAsso = { execute: jest.fn().mockReturnValue(ASSOCIATION_DTO) };
        // @ts-expect-error: inject mock
        const useCase = new GetRnaAssoUseCase(mockApiAssoPort, mockToAsso);

        beforeAll(() => {
            mockApiAssoPort.getRnaStructure.mockResolvedValue(RNA_STRUCTURE_DTO);
        });

        it("get rna structure from api asso", async () => {
            await useCase.execute(RNA);
            expect(mockApiAssoPort.getRnaStructure).toHaveBeenCalledWith(RNA);
        });

        it("transform structure to association", async () => {
            await useCase.execute(RNA);
            expect(mockToAsso.execute).toHaveBeenCalledWith(RNA_STRUCTURE_DTO);
        });

        it("returns association", async () => {
            const expected = ASSOCIATION_DTO;
            const actual = await useCase.execute(RNA);
            expect(actual).toEqual(expected);
        });

        it("returns null if structure was not found", async () => {
            mockApiAssoPort.getRnaStructure.mockResolvedValueOnce(null);
            const expected = null;
            const actual = await useCase.execute(RNA);
            expect(actual).toEqual(expected);
        });

        it("returns null if association identite is an empty object", async () => {
            mockApiAssoPort.getRnaStructure.mockResolvedValueOnce({ ...ASSOCIATION_DTO, identite: {} });
            const expected = null;
            const actual = await useCase.execute(RNA);
            expect(actual).toEqual(expected);
        });
    });

    describe("TransformRnaStructureToAsso", () => {
        const useCase = new TransformRnaStructureToAssoUseCase();

        it("transforms rna structure to association ", () => {
            expect(useCase.execute(RNA_STRUCTURE_DTO)).toMatchSnapshot();
        });

        it("sets structure as public utility", () => {
            const STRUCTURE_COPY = { ...RNA_STRUCTURE_DTO };
            // @ts-expect-error: edge case
            delete STRUCTURE_COPY.identite.util_publique;
            expect(
                useCase.execute({
                    ...RNA_STRUCTURE_DTO,
                    identite: {
                        ...RNA_STRUCTURE_DTO.identite,
                        nature: "Reconnue d'utilité publique",
                    },
                }),
            ).toMatchSnapshot();
        });
    });
});
