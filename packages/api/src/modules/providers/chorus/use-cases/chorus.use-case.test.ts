import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import chorusFseAdapter from "../../../../adapters/outputs/db/providers/chorus/chorus-fse.adapter";
import chorusAdapter from "../../../../adapters/outputs/db/providers/chorus/chorus.adapter";
import { GenericParser } from "../../../../shared/GenericParser";
import { sanitizeFloat } from "../../../../shared/helpers/NumberHelper";
import { CheckIdentifierIsFromAssoUseCase } from "../../../associations/use-cases/check-identifier-is-from-asso.use-case";
import paymentFlatChorusService from "../../../payment-flat/payment-flat.chorus.service";
import { CHORUS_ENTITIES, CHORUS_FSE_ENTITIES, PARSED_DATA } from "../__fixtures__/ChorusFixtures";
import chorusService from "../chorus.service";
import { FilterChorusEntities } from "./filter-entities";
import { FilterChorusFseEntities } from "./filter-fse-entities";
import { SaveChorusEntities } from "./save-entities";
import { SaveChorusFseEntities } from "./save-fse-entities";
import { TransformFseToFlat } from "./transform-fse-to-flat";
import { UpdateFlatByExercise } from "./update-flat-by-exercise";

jest.mock("../../../../shared/GenericParser");
jest.mock("../../../../shared/helpers/NumberHelper");
jest.mock("../../../../adapters/outputs/db/providers/chorus/chorus.adapter");
jest.mock("../../../../adapters/outputs/db/providers/chorus/chorus-fse.adapter");
jest.mock("../chorus.service");
jest.mock("../../../payment-flat/payment-flat.chorus.service");

describe("Chorus Use Cases", () => {
    const CHORUS_DTO = PARSED_DATA[0];

    beforeEach(() => {
        jest.mocked(sanitizeFloat).mockReturnValue(CHORUS_DTO["Montant payé"]);
        jest.mocked(GenericParser.getDateFromXLSX).mockReturnValue(new Date("2026-03-03"));
    });

    describe("FilterChorusEntities", () => {
        const mockCheckIsAsso = { execute: jest.fn() } as unknown as CheckIdentifierIsFromAssoUseCase;
        const useCase = new FilterChorusEntities(mockCheckIsAsso);
        const ENTITY = CHORUS_ENTITIES[0];
        beforeEach(() => {});

        it("filters entity when branch code is not accepted", async () => {
            const expected = [];
            const actual = await useCase.execute([{ ...ENTITY, codeBranche: "Z000" }]);
            expect(actual).toEqual(expected);
        });

        it("filters entity when siret is undefined and ridetOrTahitiet equals #", async () => {
            const expected = [];
            const actual = await useCase.execute([{ ...ENTITY, siret: undefined, ridetOrTahitiet: "#" }]);
            expect(actual).toEqual(expected);
        });

        it("filters entity when siret does not belong to an association", async () => {
            jest.mocked(mockCheckIsAsso.execute).mockResolvedValue(false);
            const expected = [];
            const actual = await useCase.execute([ENTITY]);
            expect(actual).toEqual(expected);
        });

        it("filters entity when ridetOrTahitiet does not belong to an association", async () => {
            jest.mocked(mockCheckIsAsso.execute).mockResolvedValue(false);
            const expected = [];
            const actual = await useCase.execute([
                { ...ENTITY, siret: undefined, ridetOrTahitiet: DEFAULT_ASSOCIATION.ridet },
            ]);
            expect(actual).toEqual(expected);
        });

        it("filters entity when idenfiers are not well formated", async () => {
            jest.mocked(mockCheckIsAsso.execute).mockResolvedValue(false);
            const expected = [];
            const actual = await useCase.execute([{ ...ENTITY, siret: undefined, ridetOrTahitiet: "not-a-ridet" }]);
            expect(actual).toEqual(expected);
        });

        it("returns valide entities", async () => {
            jest.mocked(mockCheckIsAsso.execute).mockResolvedValue(true);
            const expected = [ENTITY];
            const actual = await useCase.execute([ENTITY]);
            expect(actual).toEqual(expected);
        });
    });

    describe("FilterChorusFseEntities", () => {
        const mockCheckIsAsso = { execute: jest.fn() } as unknown as CheckIdentifierIsFromAssoUseCase;
        const useCase = new FilterChorusFseEntities(mockCheckIsAsso);
        const ENTITY = CHORUS_FSE_ENTITIES[0];

        beforeEach(() => {});

        it("returns valide entities", async () => {
            jest.mocked(mockCheckIsAsso.execute).mockResolvedValue(true);
            const expected = [ENTITY];
            const actual = await useCase.execute([ENTITY]);
            expect(actual).toEqual(expected);
        });

        it("filters entity when branch code is not accepted", async () => {
            const expected = [];
            const actual = await useCase.execute([{ ...ENTITY, branchCode: "Z000" }]);
            expect(actual).toEqual(expected);
        });

        it("filters entity when not an association", async () => {
            jest.mocked(mockCheckIsAsso.execute).mockResolvedValue(false);
            const expected = [];
            const actual = await useCase.execute([ENTITY]);
            expect(actual).toEqual(expected);
        });
    });

    describe("SaveChorusEntities", () => {
        const useCase = new SaveChorusEntities(chorusAdapter);
        // @ts-expect-error: set private property
        useCase.BATCH_SIZE = 1;

        it("upserts each batch", async () => {
            await useCase.execute(CHORUS_ENTITIES);
            // batch size is set to 1
            CHORUS_ENTITIES.forEach((entity, index) => {
                expect(chorusAdapter.upsertMany).toHaveBeenNthCalledWith(index + 1, [entity]);
            });
        });
    });

    describe("SaveChorusFseEntities", () => {
        const useCase = new SaveChorusFseEntities(chorusFseAdapter);

        it("upserts entities", async () => {
            await useCase.execute(CHORUS_FSE_ENTITIES);
            expect(chorusFseAdapter.upsertMany).toHaveBeenCalledWith(CHORUS_FSE_ENTITIES);
        });
    });

    describe("TransformFseToFlat", () => {
        const useCase = new TransformFseToFlat();
        it("returns ChorusFseEntity", () => {
            const actual = useCase.execute(CHORUS_FSE_ENTITIES[0]);
            expect(actual).toMatchSnapshot({ updateDate: expect.any(Date) });
        });
    });

    describe("UpdateFlatByExercise", () => {
        const useCase = new UpdateFlatByExercise(paymentFlatChorusService, chorusService);
        const EXERCISE = 2025;

        it("update chorus payments flats", async () => {
            await useCase.execute(EXERCISE);
            expect(paymentFlatChorusService.updatePaymentsFlatCollection).toHaveBeenCalledWith(EXERCISE);
        });

        it("update chorus fse payments flats", async () => {
            await useCase.execute(EXERCISE);
            expect(chorusService.syncFlatByExercise).toHaveBeenCalledWith(EXERCISE);
        });
    });
});
