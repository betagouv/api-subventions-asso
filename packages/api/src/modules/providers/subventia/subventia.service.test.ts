import subventiaRepository from "./repositories/subventia.repository";
import subventiaService, { RejectedRequest, SUBVENTIA_SERVICE_ERROR } from "./subventia.service";
import entity from "./__fixtures__/entity";
import * as Validators from "../../../shared/Validators";

describe("SubventiaService", () => {
    describe("createEntity", () => {
        const validationMock = jest.spyOn(subventiaService, "validateEntity");
        const repoCreateMock = jest.spyOn(subventiaRepository, "create");

        afterAll(() => {
            validationMock.mockClear();
            repoCreateMock.mockClear();
        });

        it("should reject entity (validation fail)", async () => {
            const expected = {
                message: "I'm a test",
            } as unknown as RejectedRequest;
            validationMock.mockImplementationOnce(() => expected);

            const actual = await subventiaService.createEntity(entity);

            expect(actual).toBe(expected);
        });

        it("should create entity", async () => {
            validationMock.mockImplementationOnce(() => true);
            repoCreateMock.mockImplementation(jest.fn());
            const expected = {
                state: "created",
            };
            const actual = await subventiaService.createEntity(entity);

            expect(actual).toEqual(expected);
        });
    });

    describe("validateEntity", () => {
        it("should be reject because siret is not valid", () => {
            jest.spyOn(Validators, "isSiret").mockImplementationOnce(() => false);

            const expected = {
                message: `INVALID SIRET FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY,
            };

            const actual = subventiaService.validateEntity(entity);

            expect(actual).toEqual(expected);
        });

        it("should be reject because name is not valid", () => {
            jest.spyOn(Validators, "isSiret").mockImplementationOnce(() => true);
            jest.spyOn(Validators, "isAssociationName").mockImplementationOnce(() => false);

            const expected = {
                message: `INVALID NAME FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY,
            };

            const actual = subventiaService.validateEntity(entity);

            expect(actual).toEqual(expected);
        });

        it("should be reject because string is not valid", () => {
            jest.spyOn(Validators, "isSiret").mockImplementationOnce(() => true);
            jest.spyOn(Validators, "isAssociationName").mockImplementationOnce(() => true);
            jest.spyOn(Validators, "areStringsValid").mockImplementationOnce(() => false);

            const expected = {
                message: `INVALID STRING FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY,
            };

            const actual = subventiaService.validateEntity(entity);

            expect(actual).toEqual(expected);
        });

        it("should be reject because number is not valid", () => {
            jest.spyOn(Validators, "isSiret").mockImplementationOnce(() => true);
            jest.spyOn(Validators, "isAssociationName").mockImplementationOnce(() => true);
            jest.spyOn(Validators, "areStringsValid").mockImplementationOnce(() => true);
            jest.spyOn(Validators, "areNumbersValid").mockImplementationOnce(() => false);

            const expected = {
                message: `INVALID NUMBER FOR ${entity.legalInformations.siret}`,
                data: entity,
                code: SUBVENTIA_SERVICE_ERROR.INVALID_ENTITY,
            };

            const actual = subventiaService.validateEntity(entity);

            expect(actual).toEqual(expected);
        });

        it("should be valid", () => {
            jest.spyOn(Validators, "isSiret").mockImplementationOnce(() => true);
            jest.spyOn(Validators, "isAssociationName").mockImplementationOnce(() => true);
            jest.spyOn(Validators, "areStringsValid").mockImplementationOnce(() => true);
            jest.spyOn(Validators, "areNumbersValid").mockImplementationOnce(() => true);

            const actual = subventiaService.validateEntity(entity);

            expect(actual).toBeTruthy();
        });
    });
});
