import FonjepEntityAdapter from "./adapters/FonjepEntityAdapter";
import fonjepService, { FonjepRejectedRequest, FONJEP_SERVICE_ERRORS } from "./fonjep.service";
import fonjepSubventionPort from "../../../dataProviders/db/providers/fonjep/fonjep.subvention.port";
import { SubventionEntity, PaymentEntity } from "../../../../tests/modules/providers/fonjep/__fixtures__/entity";
import * as Validators from "../../../shared/Validators";
import fonjepPaymentPort from "../../../dataProviders/db/providers/fonjep/fonjep.payment.port";
import fonjepJoiner from "../../../dataProviders/db/providers/fonjep/fonjep.joiner";
import { FONJEP_PAYMENTS, FONJEP_PAYMENT_ENTITIES } from "./__fixtures__/FonjepEntities";
import { RawApplication, RawFullGrant, RawPayment } from "../../grant/@types/rawGrant";
import { DemandeSubvention } from "dto";
import FonjepSubventionEntity from "./entities/FonjepSubventionEntity";
import FonjepPaymentEntity from "./entities/FonjepPaymentEntity";
import PROGRAMS from "../../../../tests/dataProviders/db/__fixtures__/stateBudgetProgram";
import dataBretagneService from "../dataBretagne/dataBretagne.service";
import Siren from "../../../valueObjects/Siren";
import Siret from "../../../valueObjects/Siret";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../../valueObjects/EstablishmentIdentifier";

jest.mock("./adapters/FonjepEntityAdapter");

const SIREN = new Siren("002034000");
const SIRET = SIREN.toSiret(`32010`);
const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);
const ESTABLISHMENT_ID = EstablishmentIdentifier.fromSiret(SIRET, ASSOCIATION_ID);

const CODE_POSTE = "J00034";
const WRONG_SIRET = SIRET.value.slice(0, 6);
const isSiretMock = jest.spyOn(Siret, "isSiret");
const isAssociationNameMock = jest.spyOn(Validators, "isAssociationName");
const isDatesMock = jest.spyOn(Validators, "areDates");
const isStringsValidMock = jest.spyOn(Validators, "areStringsValid");
const isNumbersValidMock = jest.spyOn(Validators, "areNumbersValid");
const findBySiretSubventionMock = jest.spyOn(fonjepSubventionPort, "findBySiret");
const findBySirenSubventionMock = jest.spyOn(fonjepSubventionPort, "findBySiren");
const findBySiretPaymentMock = jest.spyOn(fonjepPaymentPort, "findBySiret");
const findBySirenPaymentMock = jest.spyOn(fonjepPaymentPort, "findBySiren");

const replaceDateWithFakeTimer = value => {
    if (value instanceof Date) {
        return new Date();
    } else return value;
};

describe("FonjepService", () => {
    jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

    // Mock all date in fixture with fake timer
    // Maybe this should / could be done for all test files (in jest.config ?)
    for (const prop in PaymentEntity.indexedInformations) {
        PaymentEntity.indexedInformations[prop] = replaceDateWithFakeTimer(PaymentEntity.indexedInformations[prop]);
    }

    beforeAll(() => {
        // @ts-expect-error: mock
        FonjepEntityAdapter.toDemandeSubvention.mockImplementation(entity => entity);
        dataBretagneService.programsByCode = {
            [PROGRAMS[1].code_programme]: PROGRAMS[1],
        };
    });

    afterAll(() => {
        // @ts-expect-error: mock
        FonjepEntityAdapter.toDemandeSubvention.mockRestore();
    });

    describe("validateEntity", () => {
        it("should validate entity", () => {
            const entity = { ...SubventionEntity };
            const expected = true;
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("should not validate because siret is wrong", () => {
            const entity = { ...SubventionEntity };
            isSiretMock.mockImplementationOnce(() => false);
            const expected = new FonjepRejectedRequest(
                `INVALID SIRET FOR ${entity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("should not validate because name is wrong", () => {
            const entity = { ...SubventionEntity };
            isSiretMock.mockImplementationOnce(() => true);
            isAssociationNameMock.mockImplementationOnce(() => false);
            const expected = new FonjepRejectedRequest(
                `INVALID NAME FOR ${SubventionEntity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("should not validate because date is wrong", () => {
            const entity = { ...SubventionEntity };
            isSiretMock.mockImplementationOnce(() => true);
            isAssociationNameMock.mockImplementationOnce(() => true);
            isDatesMock.mockImplementationOnce(() => false);
            const expected = new FonjepRejectedRequest(
                `INVALID DATE FOR ${SubventionEntity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("should not validate because a string is wrong", () => {
            const entity = { ...SubventionEntity };
            isSiretMock.mockImplementationOnce(() => true);
            isAssociationNameMock.mockImplementationOnce(() => true);
            isDatesMock.mockImplementationOnce(() => true);
            isStringsValidMock.mockImplementationOnce(() => false);
            const expected = new FonjepRejectedRequest(
                `INVALID STRING FOR ${entity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("should not validate because a number is wrong", () => {
            const entity = { ...SubventionEntity };
            isSiretMock.mockImplementationOnce(() => true);
            isAssociationNameMock.mockImplementationOnce(() => true);
            isDatesMock.mockImplementationOnce(() => true);
            isStringsValidMock.mockImplementationOnce(() => true);
            isNumbersValidMock.mockImplementationOnce(() => false);
            const expected = new FonjepRejectedRequest(
                `INVALID NUMBER FOR ${entity.legalInformations.siret}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });
    });

    describe("createSubventionEntity", () => {
        const validateEntityMock = jest.spyOn(fonjepService, "validateEntity");
        it("should create entity", async () => {
            validateEntityMock.mockImplementationOnce(() => true);
            // @ts-expect-error: mock port
            jest.spyOn(fonjepSubventionPort, "create").mockImplementationOnce(async () => entity);
            const entity = { ...SubventionEntity };
            const expected = true;
            const actual = await fonjepService.createSubventionEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("should call port", async () => {
            validateEntityMock.mockImplementationOnce(() => true);
            const portCreateMock = jest
                .spyOn(fonjepSubventionPort, "create")
                // @ts-expect-error: mock port
                .mockImplementationOnce(async () => expected);
            const expected = { ...SubventionEntity };
            await fonjepService.createSubventionEntity(expected);
            expect(portCreateMock).toHaveBeenCalledWith(expected);
        });

        it("should not create entity", async () => {
            const entity = { ...SubventionEntity };
            const VALIDATE = new FonjepRejectedRequest("", 1, {});
            const expected = VALIDATE;
            validateEntityMock.mockImplementationOnce(() => VALIDATE);
            const actual = await fonjepService.createSubventionEntity(entity);
            expect(actual).toEqual(expected);
        });
    });

    describe("getBopFromFounderCode", () => {
        it.each`
            code         | expected
            ${"10012"}   | ${361}
            ${undefined} | ${undefined}
        `("should return value", ({ code, expected }) => {
            const actual = fonjepService.getBopFromFounderCode(code);
            expect(actual).toEqual(expected);
        });
    });

    describe("createPaymentEntity", () => {
        it("should throw error if siret invalid", async () => {
            // copy with spread operator doesn't work for nested object (indexedInformations)
            const entity = JSON.parse(JSON.stringify(PaymentEntity));
            entity.legalInformations.siret = WRONG_SIRET;
            const expected = new FonjepRejectedRequest(
                `INVALID SIRET FOR ${WRONG_SIRET}`,
                FONJEP_SERVICE_ERRORS.INVALID_ENTITY,
                entity,
            );
            const actual = await fonjepService.createPaymentEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("creates entity", async () => {
            const createPaymentMock = jest.spyOn(fonjepPaymentPort, "create");
            createPaymentMock.mockImplementationOnce(jest.fn());
            const entity = { ...PaymentEntity };
            await fonjepService.createPaymentEntity(entity);
            expect(createPaymentMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("getDemandeSubvention", () => {
        it("should call fonjepSubventionPort.findBySiret", async () => {
            // @ts-expect-error: SubventionEntity dont have _id
            findBySiretSubventionMock.mockResolvedValueOnce([SubventionEntity]);
            await fonjepService.getDemandeSubvention(ESTABLISHMENT_ID);
            expect(findBySiretSubventionMock).toHaveBeenCalledWith(SIRET);
        });

        it("should call fonjepSubventionPort.findBySiren", async () => {
            // @ts-expect-error: SubventionEntity dont have _id
            findBySirenSubventionMock.mockResolvedValueOnce([SubventionEntity]);
            await fonjepService.getDemandeSubvention(ASSOCIATION_ID);
            expect(findBySirenSubventionMock).toHaveBeenCalledWith(SIREN);
        });

        it("should call FonjepEntityAdapter.toDemandeSubvention", async () => {
            // @ts-expect-error: SubventionEntity dont have _id
            findBySiretSubventionMock.mockResolvedValueOnce([SubventionEntity]);
            await fonjepService.getDemandeSubvention(ESTABLISHMENT_ID);
            expect(FonjepEntityAdapter.toDemandeSubvention).toHaveBeenCalledWith(SubventionEntity);
        });
    });

    describe("getProgramCode", () => {
        it("should return code", () => {
            const expected = 163;
            const actual = fonjepService.getProgramCode(FONJEP_PAYMENT_ENTITIES[0]);
            expect(actual).toEqual(expected);
        });
    });

    // used to share getProgramCode mock
    describe("Adapte to Payment", () => {
        let mockGetProgamCode: jest.SpyInstance;
        beforeAll(() => {
            mockGetProgamCode = jest.spyOn(fonjepService, "getProgramCode").mockReturnValue(163);
        });

        afterAll(() => {
            mockGetProgamCode.mockRestore();
        });

        describe("toPaymentArray", () => {
            it("call toPayment for each document", () => {
                fonjepService.toPaymentArray(FONJEP_PAYMENT_ENTITIES);
                FONJEP_PAYMENT_ENTITIES.forEach((entity, index) => {
                    expect(jest.mocked(FonjepEntityAdapter.toPayment)).toHaveBeenNthCalledWith(
                        index + 1,
                        entity,
                        PROGRAMS[1],
                    );
                });
            });
        });

        describe("rawToPayment", () => {
            // @ts-expect-error: parameter type
            const RAW_PAYMENT: RawPayment<FonjepPaymentEntity> = { data: FONJEP_PAYMENT_ENTITIES[0] };
            it("should call FonjepEntityAdapter.rawToPayment", () => {
                fonjepService.rawToPayment(RAW_PAYMENT);
                expect(FonjepEntityAdapter.rawToPayment).toHaveBeenCalledWith(RAW_PAYMENT, PROGRAMS[1]);
            });

            it("should return Payment", () => {
                jest.mocked(FonjepEntityAdapter.rawToPayment).mockReturnValueOnce(FONJEP_PAYMENTS[0]);
                const expected = FONJEP_PAYMENTS[0];
                const actual = fonjepService.rawToPayment(RAW_PAYMENT);
                expect(actual).toEqual(expected);
            });
        });

        describe("rawToGrant", () => {
            const RAW_FULLGRANT: RawFullGrant<{
                application: FonjepSubventionEntity;
                payments: FonjepPaymentEntity[];
            }> = {
                // @ts-expect-error: parameter type
                data: { application: { foo: "bar" }, payments: [{ poo: "paz" }] },
            };
            // @ts-expect-error: parameter type
            const GRANT: Grant = { application: { foo: "bar" }, payments: [{ poo: "paz" }] };

            it("should call FonjepEntityAdapter.rawToGrant", () => {
                fonjepService.rawToGrant(RAW_FULLGRANT);
                // array of program see TODO in method
                expect(FonjepEntityAdapter.rawToGrant).toHaveBeenCalledWith(RAW_FULLGRANT, [PROGRAMS[1]]);
            });

            it("should return DemandeSubvention", () => {
                jest.mocked(FonjepEntityAdapter.rawToGrant).mockReturnValueOnce(GRANT);
                const expected = GRANT;
                const actual = fonjepService.rawToGrant(RAW_FULLGRANT);
                expect(actual).toEqual(expected);
            });
        });
    });

    describe("getPaymentsByKey", () => {
        const findByCodeMock = jest.spyOn(fonjepPaymentPort, "findByCodePoste");
        let toPaymentArrayMock: jest.SpyInstance;

        beforeAll(() => {
            toPaymentArrayMock = jest.spyOn(fonjepService, "toPaymentArray");
            toPaymentArrayMock.mockImplementation(data => data);
        });

        it("calls adapter", async () => {
            // @ts-expect-error: mock
            findByCodeMock.mockImplementationOnce(async () => [PaymentEntity]);
            await fonjepService.getPaymentsByKey(CODE_POSTE);
            expect(toPaymentArrayMock).toHaveBeenCalledWith([PaymentEntity]);
        });
    });

    describe("getPayments", () => {
        it("should call fonjepPaymentPort.findBySiret", async () => {
            // @ts-expect-error: PaymentEntity dont have _id
            findBySiretPaymentMock.mockResolvedValueOnce([PaymentEntity]);
            await fonjepService.getPayments(ESTABLISHMENT_ID);
            expect(findBySiretPaymentMock).toHaveBeenCalledWith(SIRET);
        });

        it("should call fonjepPaymentPort.findBySiren", async () => {
            // @ts-expect-error: PaymentEntity dont have _id
            findBySirenPaymentMock.mockResolvedValueOnce([PaymentEntity]);
            await fonjepService.getPayments(ASSOCIATION_ID);
            expect(findBySirenPaymentMock).toHaveBeenCalledWith(SIREN);
        });

        it("should call toPaymentArray", async () => {
            // @ts-expect-error: PaymentEntity dont have _id
            findBySiretPaymentMock.mockResolvedValueOnce([PaymentEntity]);
            const toPaymentArrayMock = jest.spyOn(fonjepService, "toPaymentArray");
            await fonjepService.getPayments(ESTABLISHMENT_ID);
            expect(toPaymentArrayMock).toHaveBeenCalledWith([PaymentEntity]);
        });
    });

    describe("Database Management", () => {
        describe("applyTemporyCollection()", () => {
            it("should call applyTemporyCollection() on payment and subvention collection", async () => {
                const spySubventionApplyTemporyCollection = jest
                    .spyOn(fonjepSubventionPort, "applyTemporyCollection")
                    .mockImplementation(jest.fn());
                const spyPaymentApplyTemporyCollection = jest
                    .spyOn(fonjepPaymentPort, "applyTemporyCollection")
                    .mockImplementation(jest.fn());
                await fonjepService.applyTemporyCollection();
                expect(spySubventionApplyTemporyCollection).toHaveBeenCalledTimes(1);
                expect(spyPaymentApplyTemporyCollection).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("raw grant", () => {
        const DATA = [{ application: { indexedInformations: { code_poste: "EJ", annee_demande: 2042 } } }];

        describe("getRawGrants", () => {
            let findBySirenMock;
            beforeAll(
                () =>
                    (findBySirenMock = jest
                        .spyOn(fonjepJoiner, "getFullFonjepGrantsBySiren")
                        // @ts-expect-error: mock
                        .mockImplementation(jest.fn(() => DATA))),
            );
            afterAll(() => findBySirenMock.mockRestore());

            it("should call findBySiren()", async () => {
                await fonjepService.getRawGrants(ASSOCIATION_ID);
                expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("returns raw grant data", async () => {
                const actual = await fonjepService.getRawGrants(ASSOCIATION_ID);
                expect(actual).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "data": Object {
                          "application": Object {
                            "indexedInformations": Object {
                              "annee_demande": 2042,
                              "code_poste": "EJ",
                            },
                          },
                        },
                        "joinKey": "EJ - 2042",
                        "provider": "fonjep",
                        "type": "fullGrant",
                      },
                    ]
                `);
            });
        });
    });

    describe("rawToCommon", () => {
        const RAW = "RAW";
        const ADAPTED = {};

        beforeAll(() => {
            FonjepEntityAdapter.toCommon
                // @ts-expect-error: mock
                .mockImplementation(input => input.toString());
        });

        afterAll(() => {
            // @ts-expect-error: mock
            FonjepEntityAdapter.toCommon.mockReset();
        });

        it("calls adapter with data from raw grant", () => {
            // @ts-expect-error: mock
            fonjepService.rawToCommon({ data: RAW });
            expect(FonjepEntityAdapter.toCommon).toHaveBeenCalledWith(RAW);
        });
        it("returns result from adapter", () => {
            // @ts-expect-error: mock
            FonjepEntityAdapter.toCommon.mockReturnValueOnce(ADAPTED);
            const expected = ADAPTED;
            // @ts-expect-error: mock
            const actual = fonjepService.rawToCommon({ data: RAW });
            expect(actual).toEqual(expected);
        });
    });

    describe("rawToApplication", () => {
        // @ts-expect-error: parameter type
        const RAW_APPLICATION: RawApplication<FonjepSubventionEntity> = { data: { foo: "bar" } };
        // @ts-expect-error: parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };

        it("should call FonjepEntityAdapter.rawToApplication", () => {
            fonjepService.rawToApplication(RAW_APPLICATION);
            expect(FonjepEntityAdapter.rawToApplication).toHaveBeenCalledWith(RAW_APPLICATION);
        });

        it("should return DemandeSubvention", () => {
            jest.mocked(FonjepEntityAdapter.rawToApplication).mockReturnValueOnce(APPLICATION);
            const expected = APPLICATION;
            const actual = fonjepService.rawToApplication(RAW_APPLICATION);
            expect(actual).toEqual(expected);
        });
    });
});
