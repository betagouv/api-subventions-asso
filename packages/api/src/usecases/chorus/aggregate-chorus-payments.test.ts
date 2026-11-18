import { ChorusAdapter } from "../../adapters/outputs/db/providers/chorus/chorus.adapter";
import { CHORUS_ENTITIES } from "../../domain/providers/chorus/chorus.fixture";
import { CHORUS_PAYMENT_FLAT_ENTITY } from "../../modules/payment-flat/__fixtures__/payment-flat.fixture";
import { DATA_BRETAGNE_RECORDS } from "../../modules/providers/data-bretagne/__fixtures__/dataBretagne.fixture";
import { DataBretagneService } from "../../modules/providers/data-bretagne/data-bretagne.service";
import { AggregateChorusPayments } from "./aggregate-chorus-payments";
import { ChorusToPaymentFlat } from "./chorus-to-payment-flat";

describe("AggregateChorusPayments UseCase", () => {
    describe("toAggregatedPaymentFlatEntities", () => {
        const ENTITIES = [{ ...CHORUS_ENTITIES[1] }, { ...CHORUS_ENTITIES[0] }];

        const mockPort = {
            cursorFindOnExercise: jest.fn().mockImplementation(async function* () {
                for (const entity of ENTITIES) yield entity;
            }),
        } as unknown as jest.Mocked<ChorusAdapter>;

        const mockMapper = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<ChorusToPaymentFlat>;

        const mockDataBretagneService = {
            getAllDataRecords: jest.fn().mockResolvedValue({
                programs: DATA_BRETAGNE_RECORDS.programs,
                ministries: DATA_BRETAGNE_RECORDS.ministries,
                fonctionalDomains: DATA_BRETAGNE_RECORDS.fonctionalDomains,
                programsRef: DATA_BRETAGNE_RECORDS.programsRef,
            }),
        } as unknown as jest.Mocked<DataBretagneService>;

        const usecase = new AggregateChorusPayments(mockPort, mockDataBretagneService, mockMapper);

        const EXERCISE = 2022;

        beforeEach(() => {
            mockMapper.execute.mockReturnValue({ ...CHORUS_PAYMENT_FLAT_ENTITY });
        });

        it("should call chorusCursorFind with exercice", async () => {
            await usecase.execute(EXERCISE);
            expect(mockPort.cursorFindOnExercise).toHaveBeenCalledWith(EXERCISE);
        });

        it("maps chorus into payment-flat", async () => {
            await usecase.execute(EXERCISE);
            expect(mockMapper.execute).toHaveBeenCalledTimes(ENTITIES.length);
        });

        it("should return an array of PaymentFlatEntity", async () => {
            const result = await usecase.execute(EXERCISE);
            const expected = [{ ...CHORUS_PAYMENT_FLAT_ENTITY, amount: CHORUS_PAYMENT_FLAT_ENTITY.amount * 2 }];
            expect(result).toEqual(expected);
        });
    });
});
