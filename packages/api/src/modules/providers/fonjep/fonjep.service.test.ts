import FonjepEntityAdapter from "./adapters/FonjepEntityAdapter";
import fonjepService, { FonjepRejectedRequest, FONJEP_SERVICE_ERRORS } from "./fonjep.service";
import fonjepSubventionRepository from "./repositories/fonjep.subvention.repository";
import { SubventionEntity, PaymentEntity } from "../../../../tests/modules/providers/fonjep/__fixtures__/entity";
import * as Validators from "../../../shared/Validators";
import fonjepPaymentRepository from "./repositories/fonjep.payment.repository";
import fonjepJoiner from "./joiners/fonjepJoiner";

jest.mock("./adapters/FonjepEntityAdapter");

const SIREN = "002034000";
const SIRET = `${SIREN}32010`;
const CODE_POSTE = "J00034";
const WRONG_SIRET = SIRET.slice(0, 6);
const isSiretMock = jest.spyOn(Validators, "isSiret");
const isAssociationNameMock = jest.spyOn(Validators, "isAssociationName");
const isDatesMock = jest.spyOn(Validators, "areDates");
const isStringsValidMock = jest.spyOn(Validators, "areStringsValid");
const isNumbersValidMock = jest.spyOn(Validators, "areNumbersValid");
const findBySiretMock = jest.spyOn(fonjepSubventionRepository, "findBySiret");

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
            // @ts-expect-error: mock repository
            jest.spyOn(fonjepSubventionRepository, "create").mockImplementationOnce(async () => entity);
            const entity = { ...SubventionEntity };
            const expected = true;
            const actual = await fonjepService.createSubventionEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("should call repository", async () => {
            validateEntityMock.mockImplementationOnce(() => true);
            const repoCreateMock = jest
                .spyOn(fonjepSubventionRepository, "create")
                // @ts-expect-error: mock repository
                .mockImplementationOnce(async () => expected);
            const expected = { ...SubventionEntity };
            await fonjepService.createSubventionEntity(expected);
            expect(repoCreateMock).toHaveBeenCalledWith(expected);
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
            const createPaymentMock = jest.spyOn(fonjepPaymentRepository, "create");
            createPaymentMock.mockImplementationOnce(jest.fn());
            const entity = { ...PaymentEntity };
            await fonjepService.createPaymentEntity(entity);
            expect(createPaymentMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("getDemandeSubventionByRna", () => {
        it("should return null", async () => {
            const expected = null;
            const actual = await fonjepService.getDemandeSubventionByRna("FAKE_RNA");
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionBySiret", () => {
        it("should map FonjepEntity to DemandeSubvention", async () => {
            // @ts-expect-error: mock;
            findBySiretMock.mockImplementationOnce(async () => [{}]);
            // @ts-expect-error: mock;
            FonjepEntityAdapter.toDemandeSubvention.mockImplementationOnce(entity => entity);
            await fonjepService.getDemandeSubventionBySiret(SIRET);
            expect(FonjepEntityAdapter.toDemandeSubvention).toHaveBeenCalledTimes(1);
        });

        it("should return null", async () => {
            findBySiretMock.mockImplementationOnce(async () => []);
            const expected = null;
            const actual = await fonjepService.getDemandeSubventionBySiret(SIRET);
            expect(actual).toEqual(expected);
        });
    });

    describe("getPaymentsByKey", () => {
        const findByCodeMock = jest.spyOn(fonjepPaymentRepository, "findByCodePoste");
        let toPaymentArrayMock: jest.SpyInstance;

        beforeAll(() => {
            toPaymentArrayMock = jest.spyOn(fonjepService, "toPaymentArray")
            toPaymentArrayMock.mockImplementation(data => data);
        })

        it("calls adapter", async () => {
            // @ts-expect-error: mock
            findByCodeMock.mockImplementationOnce(async () => [PaymentEntity]);
            await fonjepService.getPaymentsByKey(CODE_POSTE);
            expect(toPaymentArrayMock).toHaveBeenCalledWith([PaymentEntity]);
        });
    });

    describe("getPaymentsBySiret", () => {
        const findBySiretMock = jest.spyOn(fonjepPaymentRepository, "findBySiret");
        let toPaymentArrayMock: jest.SpyInstance;

        beforeAll(() => {
            toPaymentArrayMock = jest.spyOn(fonjepService, "toPaymentArray")
            toPaymentArrayMock.mockImplementation(data => data);
        })

        it("calls adapter", async () => {
            // @ts-expect-error: mock
            findBySiretMock.mockImplementationOnce(async () => [PaymentEntity]);
            await fonjepService.getPaymentsBySiret(SIRET);
            expect(toPaymentArrayMock).toHaveBeenCalledWith([PaymentEntity]);
        });
    });

    describe("getPaymentsBySiren", () => {
        const findBySirenMock = jest.spyOn(fonjepPaymentRepository, "findBySiren");
        let toPaymentArrayMock: jest.SpyInstance;

        beforeAll(() => {
            toPaymentArrayMock = jest.spyOn(fonjepService, "toPaymentArray")
            toPaymentArrayMock.mockImplementation(data => data);
        })

        it("calls toPayementArray", async () => {
            // @ts-expect-error: mock
            findBySirenMock.mockImplementationOnce(async () => [PaymentEntity]);
            await fonjepService.getPaymentsBySiren(SIREN);
            expect(toPaymentArrayMock).toHaveBeenCalledWith([PaymentEntity]);
        });
    });

    describe("Database Management", () => {
        describe("applyTemporyCollection()", () => {
            it("should call applyTemporyCollection() on payment and subvention collection", async () => {
                const spySubventionApplyTemporyCollection = jest
                    .spyOn(fonjepSubventionRepository, "applyTemporyCollection")
                    .mockImplementation(jest.fn());
                const spyPaymentApplyTemporyCollection = jest
                    .spyOn(fonjepPaymentRepository, "applyTemporyCollection")
                    .mockImplementation(jest.fn());
                await fonjepService.applyTemporyCollection();
                expect(spySubventionApplyTemporyCollection).toHaveBeenCalledTimes(1);
                expect(spyPaymentApplyTemporyCollection).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("raw grant", () => {
        const DATA = [{ indexedInformations: { code_poste: "EJ", annee_demande: 2042 } }];

        describe("getRawGrantsBySiret", () => {
            const SIRET = "12345678900000";
            let findBySiretMock;
            beforeAll(
                () =>
                    (findBySiretMock = jest
                        .spyOn(fonjepJoiner, "getFullFonjepGrantsBySiret")
                        // @ts-expect-error: mock
                        .mockImplementation(jest.fn(() => DATA))),
            );
            afterAll(() => findBySiretMock.mockRestore());

            it("should call findBySiret()", async () => {
                await fonjepService.getRawGrantsBySiret(SIRET);
                expect(findBySiretMock).toHaveBeenCalledWith(SIRET);
            });

            it("returns raw grant data", async () => {
                const actual = await fonjepService.getRawGrantsBySiret(SIRET);
                expect(actual).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "data": Object {
                          "indexedInformations": Object {
                            "annee_demande": 2042,
                            "code_poste": "EJ",
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

        describe("getRawGrantsBySiren", () => {
            const SIREN = "123456789";
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
                await fonjepService.getRawGrantsBySiren(SIREN);
                expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("returns raw grant data", async () => {
                const actual = await fonjepService.getRawGrantsBySiren(SIREN);
                expect(actual).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "data": Object {
                          "indexedInformations": Object {
                            "annee_demande": 2042,
                            "code_poste": "EJ",
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
});
