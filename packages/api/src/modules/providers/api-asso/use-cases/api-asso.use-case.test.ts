import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import ApiAssoPort from "../../../../adapters/outputs/api/api-asso/api-asso.port";
import { Rna, Siren } from "../../../../identifier-objects";
import { fixtureAsso as STRUCTURE_DTO } from "../__fixtures__/ApiAssoStructureFixture";
import FindRnaSirenUseCase from "./find-rna-siren.use-case";

describe("ApiAsso Use Cases", () => {
    describe("FindRnaSiren", () => {
        const SIREN = new Siren(DEFAULT_ASSOCIATION.siren);
        const RNA = new Rna(DEFAULT_ASSOCIATION.rna);

        // @ts-expect-error: mock port
        const mockApiAssoPort = { getStructure: jest.fn() } as ApiAssoPort;
        let useCase: FindRnaSirenUseCase;
        beforeEach(() => {
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
});
