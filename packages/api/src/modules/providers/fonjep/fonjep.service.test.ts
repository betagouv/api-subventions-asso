import FonjepEntityAdapter from './adapters/FonjepEntityAdapter';
import FonjepRequestEntity from './entities/FonjepRequestEntity';
import fonjepService, { FONJEP_SERVICE_ERRORS } from './fonjep.service';
import fonjepRepository from "./repositories/fonjep.repository";
import FonjepEntity from "../../../../tests/modules/providers/fonjep/__fixtures__/entity"

import * as Validators from "../../../shared/Validators";

const MONGO_ID = "ID";
const SIRET = "00203400032010"
const findByIdMock: jest.SpyInstance<Promise<unknown>> = jest.spyOn(fonjepRepository, "findById");
const toDemandeSubventionMock = jest.spyOn(FonjepEntityAdapter, "toDemandeSubvention");
const isSiretMock = jest.spyOn(Validators, "isSiret");
const isAssociationNameMock = jest.spyOn(Validators, "isAssociationName");
const isDatesMock = jest.spyOn(Validators, "isDates");
const isStringsValidMock = jest.spyOn(Validators, "isStringsValid");
const isNumbersValidMock = jest.spyOn(Validators, "isNumbersValid");
const findBySiretMock = jest.spyOn(fonjepRepository, "findBySiret");

describe("FonjepService", () => {
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
            const entity = { siret: "000000001"};
            findByIdMock.mockImplementationOnce(() => Promise.resolve(entity));

            await fonjepService.getDemandeSubventionById(MONGO_ID);

            expect(FonjepEntityAdapter.toDemandeSubvention).toHaveBeenCalledWith(entity);
        })
    });

    describe("validateEntity", () => {
        it("should validate entity", () => {
            const entity = { ... FonjepEntity };
            const expected  = { success : true };
            const actual = fonjepService.validateEntity(entity); 
            expect(actual).toEqual(expected);
        });

        it("should not validate because siret is wrong", () => {
            const entity = { ...FonjepEntity };
            isSiretMock.mockImplementationOnce(() => false);
            const expected = { success: false, "message": `INVALID SIRET FOR ${entity.legalInformations.siret}`, data: entity, code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
            const actual = fonjepService.validateEntity(entity)
            expect(actual).toEqual(expected);
        });

        it("should not validate because name is wrong", () => {
            const entity = { ...FonjepEntity };
            isSiretMock.mockImplementationOnce(() => true);
            isAssociationNameMock.mockImplementationOnce(() => false);
            const expected = { success: false, message: `INVALID NAME FOR ${FonjepEntity.legalInformations.siret}`, data: entity , code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });
        
        it("should not validate because date is wrong", () => {
            const entity = { ...FonjepEntity };
            isSiretMock.mockImplementationOnce(() => true);
            isAssociationNameMock.mockImplementationOnce(() => true);
            isDatesMock.mockImplementationOnce(() => false);
            const expected = { success: false, message: `INVALID DATE FOR ${FonjepEntity.legalInformations.siret}`, data: entity , code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
            
        })
        
        it("should not validate because a string is wrong", () => {
            const entity = { ...FonjepEntity };
            isSiretMock.mockImplementationOnce(() => true);
            isAssociationNameMock.mockImplementationOnce(() => true);
            isDatesMock.mockImplementationOnce(() => true);
            isStringsValidMock.mockImplementationOnce(() => false);
            const expected = { success: false, message: `INVALID STRING FOR ${entity.legalInformations.siret}`, data: entity , code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });

        it("should not validate because a number is wrong", () => {
            const entity = { ...FonjepEntity };
            isSiretMock.mockImplementationOnce(() => true);
            isAssociationNameMock.mockImplementationOnce(() => true);
            isDatesMock.mockImplementationOnce(() => true);
            isStringsValidMock.mockImplementationOnce(() => true);
            isNumbersValidMock.mockImplementationOnce(() => false);
            const expected = { success: false, message: `INVALID NUMBER FOR ${entity.legalInformations.siret}`, data: entity , code: FONJEP_SERVICE_ERRORS.INVALID_ENTITY };
            const actual = fonjepService.validateEntity(entity);
            expect(actual).toEqual(expected);
        });
    });

    describe("createEntity", () => {
        const validateEntityMock = jest.spyOn(fonjepService, "validateEntity");
        it("should create entity", async () => {
            validateEntityMock.mockImplementationOnce(() => ({ success: true }));
            // @ts-expect-error: mock repository
            jest.spyOn(fonjepRepository, "create").mockImplementationOnce(async () => entity);
            const entity = { ...FonjepEntity };
            const expected = { success: true, entity, state: "created" };
            const actual = await fonjepService.createEntity(entity);
            expect(actual).toEqual(expected);
        })

        it("should not create entity", async () => {
            const entity = { ...FonjepEntity };
            const VALIDATE = { success: false }; 
            const expected = VALIDATE;
            // @ts-expect-error: mock
            validateEntityMock.mockImplementationOnce(() => VALIDATE);
            const actual = await fonjepService.createEntity(entity);
            expect(actual).toEqual(expected);
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

});