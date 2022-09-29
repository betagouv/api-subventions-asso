import FonjepEntityAdapter from './adapters/FonjepEntityAdapter';
import fonjepService, { FONJEP_SERVICE_ERRORS } from './fonjep.service';
import fonjepSubventionRepository from "./repositories/fonjep.subvention.repository";
import { SubventionEntity, VersementEntity } from "../../../../tests/modules/providers/fonjep/__fixtures__/entity"
import * as Validators from "../../../shared/Validators";
import fonjepVersementRepository from "./repositories/fonjep.versement.repository";


const MONGO_ID = "ID";
const SIREN = "002034000";
const SIRET = `${SIREN}32010`;
const CODE_POSTE = "J00034";
const WRONG_SIRET = SIRET.slice(0, 6);
const findByIdMock: jest.SpyInstance<Promise<unknown>> = jest.spyOn(fonjepSubventionRepository, "findById");
const toDemandeSubventionMock = jest.spyOn(FonjepEntityAdapter, "toDemandeSubvention");
const toVersementMock = jest.spyOn(FonjepEntityAdapter, "toVersement");
const isSiretMock = jest.spyOn(Validators, "isSiret");
const isAssociationNameMock = jest.spyOn(Validators, "isAssociationName");
const isDatesMock = jest.spyOn(Validators, "isDates");
const isStringsValidMock = jest.spyOn(Validators, "isStringsValid");
const isNumbersValidMock = jest.spyOn(Validators, "isNumbersValid");
const findBySiretMock = jest.spyOn(fonjepSubventionRepository, "findBySiret");

const replaceDateWithFakeTimer = value => {
    if (value instanceof Date) {
        return new Date();
    } else return value
}

describe("FonjepService", () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));

    // Mock all date in fixture with fake timer
    // Maybe this should / could be done for all test files (in jest.config ?)
    for (const prop in VersementEntity.indexedInformations) {
        VersementEntity.indexedInformations[prop] = replaceDateWithFakeTimer(VersementEntity.indexedInformations[prop]);
    }

    beforeAll(() => {
        // @ts-expect-error: mock
        toDemandeSubventionMock.mockImplementation(entity => entity);
    });

    afterAll(() => {
        toDemandeSubventionMock.mockRestore();
    });

    describe("getDemandeSubventionById", () => {
        it("should return null if given ID does not match any document", async () => {
            findByIdMock.mockImplementationOnce(async () => null);
            const expected = new Error("DemandeSubvention not found");
            let actual;
            try {
                actual = await fonjepService.getDemandeSubventionById(MONGO_ID);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });

        it("should call FonjepEntityAdapter.toDemandeSubvention", async () => {
            const entity = { siret: "000000001" };
            findByIdMock.mockImplementationOnce(() => Promise.resolve(entity));

            await fonjepService.getDemandeSubventionById(MONGO_ID);

            expect(FonjepEntityAdapter.toDemandeSubvention).toHaveBeenCalledWith(entity);
        })
    });

    describe("validateEntity", () => {
        it("should validate entity", () => {
            const entity = { ...SubventionEntity };
            const expected = { success: true };
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("should not validate because siret is wrong", () => {
            const entity = { ...SubventionEntity };
            isSiretMock.mockImplementationOnce(() => false);
            const expected = { success: false, "message": `INVALID SIRET FOR ${entity.legalInformations.siret}`, data: entity, code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
            const actual = fonjepService.validateEntity(entity)
            expect(actual).toEqual(expected);
        });

        it("should not validate because name is wrong", () => {
            const entity = { ...SubventionEntity };
            isSiretMock.mockImplementationOnce(() => true);
            isAssociationNameMock.mockImplementationOnce(() => false);
            const expected = { success: false, message: `INVALID NAME FOR ${SubventionEntity.legalInformations.siret}`, data: entity, code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("should not validate because date is wrong", () => {
            const entity = { ...SubventionEntity };
            isSiretMock.mockImplementationOnce(() => true);
            isAssociationNameMock.mockImplementationOnce(() => true);
            isDatesMock.mockImplementationOnce(() => false);
            const expected = { success: false, message: `INVALID DATE FOR ${SubventionEntity.legalInformations.siret}`, data: entity, code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);

        })

        it("should not validate because a string is wrong", () => {
            const entity = { ...SubventionEntity };
            isSiretMock.mockImplementationOnce(() => true);
            isAssociationNameMock.mockImplementationOnce(() => true);
            isDatesMock.mockImplementationOnce(() => true);
            isStringsValidMock.mockImplementationOnce(() => false);
            const expected = { success: false, message: `INVALID STRING FOR ${entity.legalInformations.siret}`, data: entity, code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
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
            const expected = { success: false, message: `INVALID NUMBER FOR ${entity.legalInformations.siret}`, data: entity, code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });
    });

    describe("createSubventionEntity", () => {
        const validateEntityMock = jest.spyOn(fonjepService, "validateEntity");
        it("should create entity", async () => {
            validateEntityMock.mockImplementationOnce(() => ({ success: true }));
            // @ts-expect-error: mock repository
            jest.spyOn(fonjepSubventionRepository, "create").mockImplementationOnce(async () => entity);
            const entity = { ...SubventionEntity };
            const expected = { success: true };
            const actual = await fonjepService.createSubventionEntity(entity);
            expect(actual).toEqual(expected);
        })

        it("should call repository", async () => {
            validateEntityMock.mockImplementationOnce(() => ({ success: true }));
            // @ts-expect-error: mock repository
            const repoCreateMock = jest.spyOn(fonjepSubventionRepository, "create").mockImplementationOnce(async () => expected);
            const expected = { ...SubventionEntity };
            await fonjepService.createSubventionEntity(expected);
            expect(repoCreateMock).toHaveBeenCalledWith(expected);
        })

        it("should not create entity", async () => {
            const entity = { ...SubventionEntity };
            const VALIDATE = { success: false };
            const expected = VALIDATE;
            // @ts-expect-error: mock
            validateEntityMock.mockImplementationOnce(() => VALIDATE);
            const actual = await fonjepService.createSubventionEntity(entity);
            expect(actual).toEqual(expected);
        })
    });

    describe("createVersementEntity", () => {
        it("should throw error if siret invalid", async () => {
            // copy with spread operator doesn't work for nested object (indexedInformations)
            const entity = JSON.parse(JSON.stringify(VersementEntity));
            entity.legalInformations.siret = WRONG_SIRET;
            const expected = { success: false, message: `INVALID SIRET FOR ${WRONG_SIRET}`, data: entity, code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
            const actual = await fonjepService.createVersementEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("creates entity", async () => {
            const createVersementMock = jest.spyOn(fonjepVersementRepository, "create");
            createVersementMock.mockImplementationOnce(jest.fn());
            const entity = { ...VersementEntity };
            await fonjepService.createVersementEntity(entity);
            expect(createVersementMock).toHaveBeenCalledTimes(1);
        })
    })

    describe("getDemandeSubventionByRna", () => {
        it("should return null", async () => {
            const expected = null;
            const actual = await fonjepService.getDemandeSubventionByRna("FAKE_RNA");
            expect(actual).toEqual(expected);
        })
    });

    describe("getDemandeSubventionBySiret", () => {
        it("should map FonjepEntity to DemandeSubvention", async () => {
            // @ts-expect-error: mock;
            findBySiretMock.mockImplementationOnce(async () => [{}]);
            // @ts-expect-error: mock;
            toDemandeSubventionMock.mockImplementationOnce(entity => entity)
            await fonjepService.getDemandeSubventionBySiret(SIRET);
            expect(toDemandeSubventionMock).toHaveBeenCalledTimes(1);
        });

        it("should return null", async () => {
            findBySiretMock.mockImplementationOnce(async () => []);
            const expected = null;
            const actual = await fonjepService.getDemandeSubventionBySiret(SIRET);
            expect(actual).toEqual(expected);
        })
    });

    describe("toVersementArray()", () => {
        fonjepService.toVersementArray([VersementEntity, VersementEntity]);
        expect(toVersementMock).toHaveBeenCalledTimes(2)
    })

    describe("getVersementsByKey", () => {

        const findByCodeMock = jest.spyOn(fonjepVersementRepository, "findByCodePoste");

        it("returns VersementFonjep[]", async () => {
            // @ts-expect-error: mock
            findByCodeMock.mockImplementationOnce(async () => [VersementEntity])
            const actual = await fonjepService.getVersementsByKey(CODE_POSTE)
            expect(actual).toMatchSnapshot();
        })
    })

    describe("getVersementsBySiret", () => {
        const findBySiretMock = jest.spyOn(fonjepVersementRepository, "findBySiret");

        it("returns VersementFonjep[]", async () => {
            // @ts-expect-error: mock
            findBySiretMock.mockImplementationOnce(async () => [VersementEntity])
            const actual = await fonjepService.getVersementsBySiret(SIRET)
            expect(actual).toMatchSnapshot();
        })
    })

    describe("getVersementsBySiren", () => {
        const findBySirenMock = jest.spyOn(fonjepVersementRepository, "findBySiren");
        it("should return VersementFonjep[]", async () => {
            // @ts-expect-error: mock
            findBySirenMock.mockImplementationOnce(async () => [VersementEntity])
            const actual = await fonjepService.getVersementsBySiren(SIREN);
            expect(actual).toMatchSnapshot();
        })
    })

    describe("dropCollection()", () => {
        const mockDrop = jest.spyOn(fonjepSubventionRepository, "drop");
        it("return true if drop() succeed", async () => {
            mockDrop.mockImplementationOnce(async () => true);
            const exepected = true;
            const actual = await fonjepService.dropCollection();
            expect(actual).toEqual(exepected);
        })

        it("return false if drop() throws", async () => {
            mockDrop.mockImplementationOnce(() => { throw new Error() });
            const expected = false;
            const actual = await fonjepService.dropCollection();
            expect(actual).toEqual(expected);
        })
    });

});