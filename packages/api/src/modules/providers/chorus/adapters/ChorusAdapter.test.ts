import { ObjectId, WithId } from "mongodb";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import ChorusLineEntity from "../entities/ChorusLineEntity";
import ChorusAdapter from "./ChorusAdapter";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";
import { ENTITIES, PAYMENTS } from "../__fixtures__/ChorusFixtures";
import { RawPayment } from "../../../grant/@types/rawGrant";
import PROGRAMS from "../../../../../tests/dataProviders/db/__fixtures__/stateBudgetProgram";

describe("ChorusAdapter", () => {
    const PROGRAM = PROGRAMS[0];
    describe("toCommon", () => {
        it("returns proper result", () => {
            const INPUT = {
                indexedInformations: {
                    amount: 42789,
                    dateOperation: new Date("2022-02-02"),
                    codeDomaineFonctionnel: "0BOP-other",
                },
            };
            // @ts-expect-error mock
            const actual = ChorusAdapter.toCommon(INPUT);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("rawToPayment", () => {
        //@ts-expect-error: parameter type
        const RAW_PAYMENT: RawPayment<ChorusLineEntity> = { data: ENTITIES[0] };

        let mockToPayment: jest.SpyInstance;
        beforeAll(() => {
            mockToPayment = jest.spyOn(ChorusAdapter, "toPayment");
            mockToPayment.mockReturnValue(PAYMENTS[0]);
        });

        afterEach(() => {
            mockToPayment.mockClear();
        });

        afterAll(() => {
            mockToPayment.mockRestore();
        });

        it("should call toPayment()", () => {
            ChorusAdapter.rawToPayment(RAW_PAYMENT, PROGRAM);
            expect(ChorusAdapter.toPayment).toHaveBeenCalledWith(RAW_PAYMENT.data, PROGRAM);
        });

        it("should return Payment", () => {
            const expected = PAYMENTS[0];
            const actual = ChorusAdapter.rawToPayment(RAW_PAYMENT, PROGRAM);
            expect(actual).toEqual(expected);
        });
    });

    const now = new Date();
    const toPV = (value: unknown, provider = "Chorus") => ProviderValueAdapter.toProviderValue(value, provider, now);

    describe("toPayment", () => {
        it("should return complet entity", () => {
            const entity = ENTITIES[0];

            const actual = ChorusAdapter.toPayment(entity as WithId<ChorusLineEntity>, PROGRAM);

            expect(actual).toMatchSnapshot();
        });

        it("should return partial entity", () => {
            const entity = new ChorusLineEntity(
                "UNIQUE_ID",
                {
                    codeBranche: "FAKE",
                    branche: "FAKE",
                    centreFinancier: "FAKE",
                    codeCentreFinancier: "FAKE",
                    domaineFonctionnel: "FAKE",
                    numeroDemandePayment: "FAKE",
                    codeDomaineFonctionnel: "FAKE",
                    siret: "FAKE",
                    ej: "FAKE",
                    amount: 0,
                    dateOperation: now,
                },
                {},
                "" as unknown as ObjectId,
            );

            const actual = ChorusAdapter.toPayment(entity as WithId<ChorusLineEntity>, PROGRAM);
            const expected = {
                codeBranche: toPV("FAKE"),
                branche: toPV("FAKE"),
                centreFinancier: toPV("FAKE"),
                domaineFonctionnel: toPV("FAKE"),
                siret: toPV("FAKE"),
                ej: toPV("FAKE"),
                amount: toPV(0),
                dateOperation: toPV(now),
                programme: toPV(PROGRAM.code_programme, dataBretagneService.provider.name),
                libelleProgramme: toPV(PROGRAM.label_programme, dataBretagneService.provider.name),
            };

            expect(actual).toMatchObject(expected);
        });
    });
});
