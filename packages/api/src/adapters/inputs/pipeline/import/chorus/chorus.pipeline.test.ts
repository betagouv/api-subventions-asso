import DEFAULT_ASSOCIATION from "../../../../../../tests/__fixtures__/association.fixture";
import { CheckIdentifierIsFromAssoUseCase } from "../../../../../modules/associations/use-cases/check-identifier-is-from-asso.use-case";
import { ChorusService } from "../../../../../modules/providers/chorus/chorus.service";
import { SaveChorusDbos } from "../../../../../modules/providers/chorus/use-cases/save-dbos";
import { SaveChorusFseDbos } from "../../../../../modules/providers/chorus/use-cases/save-fse-dbos";
import { UpdateFlatByExercise } from "../../../../../modules/providers/chorus/use-cases/update-flat-by-exercise";
import { CHORUS_DBOS } from "../../../../outputs/db/providers/chorus/chorus.fixtures";
import { ChorusPipeline } from "./chorus.pipeline";

describe("Chorus Pipeline", () => {
    const mockSaveEntities = { execute: jest.fn() } as unknown as jest.Mocked<SaveChorusDbos>;
    const mockSaveFseEntities = { execute: jest.fn() } as unknown as jest.Mocked<SaveChorusFseDbos>;
    const mockCheckIsAsso = {
        execute: jest.fn(),
    } as unknown as jest.Mocked<CheckIdentifierIsFromAssoUseCase>;
    const mockChorusService = { syncFlat: jest.fn() } as unknown as jest.Mocked<ChorusService>; // @TODO = jest.fn() as unknown as jest.Mocked<> this a use case
    const mockUpdateFlatByExercise = { execute: jest.fn() } as unknown as jest.Mocked<UpdateFlatByExercise>;

    const pipeline = new ChorusPipeline(
        mockSaveEntities,
        mockSaveFseEntities,
        mockCheckIsAsso,
        mockChorusService,
        mockUpdateFlatByExercise,
    );

    beforeEach(() => {
        mockCheckIsAsso.execute.mockResolvedValue(true);
    });

    describe("FilterAssos", () => {
        const DBOS = CHORUS_DBOS;

        it("filters entity when branch code is not accepted", async () => {
            const expected = [];
            // @ts-expect-error: test private method
            const actual = await pipeline.filterAssos([{ ...DBOS, codeBranche: "Z000" }]);
            expect(actual).toEqual(expected);
        });

        it("filters entity out when siret and ridetOrTahitiet equals #", async () => {
            const expected = [];
            // @ts-expect-error: test private method
            const actual = await pipeline.filterAssos([{ ...DBOS, siret: "#", ridetOrTahitiet: "#" }]);
            expect(actual).toEqual(expected);
        });

        it("filters entity out when siret does not belong to an association", async () => {
            jest.mocked(mockCheckIsAsso.execute).mockResolvedValue(false);
            const expected = [];
            // @ts-expect-error: test private method
            const actual = await pipeline.filterAssos([DBOS]);
            expect(actual).toEqual(expected);
        });

        it("filters entity out when ridetOrTahitiet does not belong to an association", async () => {
            jest.mocked(mockCheckIsAsso.execute).mockResolvedValue(false);
            const expected = [];
            // @ts-expect-error: test private method
            const actual = await pipeline.filterAssos([
                { ...DBOS[0], siret: "#", ridetOrTahitiet: DEFAULT_ASSOCIATION.ridet },
            ]);
            expect(actual).toEqual(expected);
        });

        // does not mock identifier-object EstablishmentIdentifier
        it("filters entity when idenfiers are not well formated", async () => {
            jest.mocked(mockCheckIsAsso.execute).mockResolvedValue(false);
            const expected = [];
            // @ts-expect-error: test private method
            const actual = await pipeline.filterAssos([{ ...DBOS, siret: "#", ridetOrTahitiet: "not-a-ridet" }]);
            expect(actual).toEqual(expected);
        });

        it("returns valide entities", async () => {
            const expected = DBOS;
            // @ts-expect-error: test private method
            const actual = await pipeline.filterAssos(DBOS);
            expect(actual).toEqual(expected);
        });
    });
});
