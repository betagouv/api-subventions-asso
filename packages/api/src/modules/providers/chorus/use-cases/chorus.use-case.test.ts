import chorusFseAdapter from "../../../../adapters/outputs/db/providers/chorus/chorus-fse.adapter";
import chorusAdapter from "../../../../adapters/outputs/db/providers/chorus/chorus.adapter";
import { GenericParser } from "../../../../shared/GenericParser";
import { sanitizeFloat } from "../../../../shared/helpers/NumberHelper";
import paymentFlatChorusService from "../../../payment-flat/payment-flat.chorus.service";
import { CHORUS_ENTITIES, CHORUS_FSE_ENTITIES, PARSED_DATA } from "../__fixtures__/ChorusFixtures";
import chorusService from "../chorus.service";
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
