import ParseHistoryUniteLegalUseCase from "./ParseHistoryUniteLegalUseCase";
import PartialUniteLegalRow from "../__fixtures__/PartialUniteLegalRow";
import { AssociationRow } from "../__fixtures__/AssociationRowFixture";
import { EntrepriseRow } from "../__fixtures__/EntrepriseRowFixture";
import associationNameService from "../../../association-name/associationName.service";
import dataGouvService from "../datagouv.service";
import { UniteLegaleHistoriqueAdapter } from "../adapter/UniteLegaleHistoriqueAdapter";
import { UniteLegalHistoryRow } from "../@types/UniteLegalHistoryRow";
import { SaveCallback } from "../@types";
import * as DateHelper from "../../../../shared/helpers/DateHelper";
import DataGouvHistoryLegalUnitParser from "../dataGouvHistoryLegalUnitParser";
import CliLogger from "../../../../shared/CliLogger";

describe("ParseHistoryUniteLegalUseCase", () => {
    const addAssociationNameMock = jest.spyOn(associationNameService, "upsert").mockImplementation(jest.fn());
    const addManyEntrepriseSirenMock = jest
        .spyOn(dataGouvService, "insertManyEntrepriseSiren")
        .mockImplementation(jest.fn());

    const rowToAssociationNameMock = jest.spyOn(UniteLegaleHistoriqueAdapter, "rowToAssociationName");
    const rowToEntrepriseSirenMock = jest.spyOn(UniteLegaleHistoriqueAdapter as any, "rowToEntrepriseSiren");

    describe("isAssociation()", () => {
        it("should return true", () => {
            const expected = true;
            const actual = ParseHistoryUniteLegalUseCase._isAssociation(AssociationRow);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const expected = false;
            const actual = ParseHistoryUniteLegalUseCase._isAssociation(EntrepriseRow);
            expect(actual).toEqual(expected);
        });
    });

    describe("shouldBeSaved()", () => {
        it("should return true if association denomination has changed", () => {
            const expected = true;
            const actual = ParseHistoryUniteLegalUseCase._shouldBeSaved({
                ...AssociationRow,
                changementDenominationUniteLegale: "true",
            });
            expect(actual).toEqual(expected);
        });

        it("should return true if association is new", () => {
            const expected = true;
            // @ts-expect-error: test type string method accpete only "true" | "false"
            const actual = ParseHistoryUniteLegalUseCase._shouldBeSaved({
                ...AssociationRow,
                ...PartialUniteLegalRow,
            });
            expect(actual).toEqual(expected);
        });

        it("should return false if association has changed but not the denomination", () => {
            const expected = false;
            // @ts-expect-error: test type string method accpete only "true" | "false"
            const actual = ParseHistoryUniteLegalUseCase._shouldBeSaved({
                ...AssociationRow,
                ...PartialUniteLegalRow,
                changementEtatAdministratifUniteLegale: "true",
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("isUniteLegaleNew()", () => {
        it("should return true", () => {
            const expected = true;
            const actual = ParseHistoryUniteLegalUseCase._isUniteLegaleNew(PartialUniteLegalRow);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const expected = false;
            const actual = ParseHistoryUniteLegalUseCase._isUniteLegaleNew({
                ...PartialUniteLegalRow,
                changementEtatAdministratifUniteLegale: "true",
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("saveAssociations()", () => {
        it("should transform rows to associationNames", async () => {
            const expected = 1;
            await ParseHistoryUniteLegalUseCase._saveAssociations([AssociationRow]);
            const actual = rowToAssociationNameMock.mock.calls.length;
            expect(actual).toEqual(expected);
        });

        it("should save associationNames", async () => {
            await ParseHistoryUniteLegalUseCase._saveAssociations([AssociationRow, AssociationRow]);
            expect(addAssociationNameMock).toHaveBeenCalledTimes(2);
        });
    });

    describe("saveEntreprises()", () => {
        it("should transform rows to entrepriseSiren", async () => {
            await ParseHistoryUniteLegalUseCase._saveEntreprises([EntrepriseRow]);
            expect(rowToEntrepriseSirenMock).toHaveBeenCalledTimes(1);
        });

        it("should save entrepriseSirens", async () => {
            await ParseHistoryUniteLegalUseCase._saveEntreprises([EntrepriseRow, EntrepriseRow]);
            expect(addManyEntrepriseSirenMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("._saveEntity", () => {
        let stackAssociation: UniteLegalHistoryRow[];
        let stackEntreprise: UniteLegalHistoryRow[];
        let chunksMetadata: { chunksSize: number; chunksInSave: number };
        let saveEntity: SaveCallback<UniteLegalHistoryRow>;
        const streamAction = jest.fn();

        let isAssoSpy: jest.SpyInstance;
        let shouldBeSavedSpy: jest.SpyInstance;
        let isUniteLegaleNewSpy: jest.SpyInstance;
        let saveEntreprisesSpy: jest.SpyInstance;
        let saveAssociationsSpy: jest.SpyInstance;

        beforeAll(() => {
            isAssoSpy = jest.spyOn(ParseHistoryUniteLegalUseCase, "_isAssociation");
            shouldBeSavedSpy = jest.spyOn(ParseHistoryUniteLegalUseCase, "_shouldBeSaved");
            isUniteLegaleNewSpy = jest.spyOn(ParseHistoryUniteLegalUseCase, "_isUniteLegaleNew");
            saveEntreprisesSpy = jest
                .spyOn(ParseHistoryUniteLegalUseCase, "_saveEntreprises")
                .mockResolvedValue(undefined);
            saveAssociationsSpy = jest
                .spyOn(ParseHistoryUniteLegalUseCase, "_saveAssociations")
                .mockResolvedValue(undefined);
        });

        beforeEach(() => {
            stackAssociation = [];
            stackEntreprise = [];
            chunksMetadata = { chunksInSave: 0, chunksSize: 2 };
            streamAction.mockReset();
            isUniteLegaleNewSpy.mockReset();
            shouldBeSavedSpy.mockReset();
            isAssoSpy.mockReset();

            saveEntity = ParseHistoryUniteLegalUseCase._saveEntityFactory(
                stackAssociation,
                stackEntreprise,
                chunksMetadata,
            );
        });

        it("should check if entity is an association", async () => {
            isAssoSpy.mockReturnValueOnce(true);
            shouldBeSavedSpy.mockReturnValueOnce(true);
            await saveEntity({} as UniteLegalHistoryRow, streamAction, streamAction);

            expect(isAssoSpy).toBeCalledTimes(1);
        });

        it("should check if entity shouldBeSaved", async () => {
            isAssoSpy.mockReturnValueOnce(true);
            shouldBeSavedSpy.mockReturnValueOnce(true);
            await saveEntity({} as UniteLegalHistoryRow, streamAction, streamAction);

            expect(shouldBeSavedSpy).toBeCalledTimes(1);
        });

        it("should be call _isUniteLegaleNew", async () => {
            isAssoSpy.mockReturnValueOnce(false);
            shouldBeSavedSpy.mockReturnValueOnce(false);
            isUniteLegaleNewSpy.mockReturnValueOnce(true);
            await saveEntity({} as UniteLegalHistoryRow, streamAction, streamAction);

            expect(isUniteLegaleNewSpy).toBeCalledTimes(1);
        });

        it("should be call streamPause", async () => {
            isAssoSpy.mockReturnValueOnce(false);
            shouldBeSavedSpy.mockReturnValueOnce(false);
            isUniteLegaleNewSpy.mockReturnValue(true);
            await saveEntity({} as UniteLegalHistoryRow, streamAction, () => {});
            await saveEntity({} as UniteLegalHistoryRow, streamAction, () => {});
            expect(streamAction).toBeCalledTimes(1);
        });

        it("should be call saveEntreprisesSpy", async () => {
            isAssoSpy.mockReturnValueOnce(false);
            shouldBeSavedSpy.mockReturnValueOnce(false);
            isUniteLegaleNewSpy.mockReturnValue(true);
            await saveEntity({} as UniteLegalHistoryRow, streamAction, streamAction);
            await saveEntity({} as UniteLegalHistoryRow, streamAction, streamAction);

            expect(saveEntreprisesSpy).toBeCalledTimes(1);
            expect(saveEntreprisesSpy.mock.calls[0][0]).toHaveLength(2);
        });

        it("should be call _saveAssociations", async () => {
            isUniteLegaleNewSpy.mockReturnValue(false);
            shouldBeSavedSpy.mockReturnValue(true);
            isAssoSpy.mockReturnValue(true);
            await saveEntity({} as UniteLegalHistoryRow, streamAction, streamAction);
            await saveEntity({} as UniteLegalHistoryRow, streamAction, streamAction);

            expect(saveAssociationsSpy).toBeCalledTimes(1);
            expect(saveAssociationsSpy.mock.calls[0][0]).toHaveLength(2);
        });

        it("should be call streamPause", async () => {
            isAssoSpy.mockReturnValue(false);
            shouldBeSavedSpy.mockReturnValue(false);
            isUniteLegaleNewSpy.mockReturnValue(true);
            await saveEntity({} as UniteLegalHistoryRow, () => {}, streamAction);
            await saveEntity({} as UniteLegalHistoryRow, () => {}, streamAction);
            expect(streamAction).toBeCalledTimes(1);
        });
    });

    describe("run", () => {
        let getLastDateImportSpy: jest.SpyInstance;
        let isValidDateSpy: jest.SpyInstance;
        let saveEntityFactorySpy: jest.SpyInstance;
        let parseUniteLegalHistorySpy: jest.SpyInstance;
        let saveEntreprisesSpy: jest.SpyInstance;
        let saveAssociationsSpy: jest.SpyInstance;
        let addNewImportSpy: jest.SpyInstance;

        beforeAll(() => {
            getLastDateImportSpy = jest.spyOn(dataGouvService, "getLastDateImport").mockResolvedValue(new Date());
            isValidDateSpy = jest.spyOn(DateHelper, "isValidDate").mockReturnValue(true);
            saveEntityFactorySpy = jest
                .spyOn(ParseHistoryUniteLegalUseCase, "_saveEntityFactory")
                .mockReturnValue(jest.fn());
            parseUniteLegalHistorySpy = jest
                .spyOn(DataGouvHistoryLegalUnitParser, "parseUniteLegalHistory")
                .mockResolvedValue();
            saveAssociationsSpy = jest.spyOn(ParseHistoryUniteLegalUseCase, "_saveAssociations").mockResolvedValue();
            // @ts-expect-error mock
            saveEntreprisesSpy = jest.spyOn(ParseHistoryUniteLegalUseCase, "_saveEntreprises").mockResolvedValue();
            // @ts-expect-error mock
            addNewImportSpy = jest.spyOn(dataGouvService, "addNewImport").mockReturnValue();
        });

        it("should call logger", async () => {
            const logger = {
                logIC: jest.fn(),
            } as unknown as CliLogger;

            await ParseHistoryUniteLegalUseCase.run("", new Date(), logger);

            expect(logger.logIC).toHaveBeenCalled();
        });

        it("should check if date is valid", async () => {
            await ParseHistoryUniteLegalUseCase.run("", new Date());

            expect(isValidDateSpy).toBeCalledTimes(1);
        });

        it("should throw errer if date is invalid", async () => {
            isValidDateSpy.mockReturnValueOnce(false);
            expect(() => ParseHistoryUniteLegalUseCase.run("", new Date())).rejects.toThrowError();
        });

        it("should call getLastDateImport", async () => {
            await ParseHistoryUniteLegalUseCase.run("", new Date());

            expect(getLastDateImportSpy).toHaveBeenCalled();
        });

        it("should call saveEntityFactory", async () => {
            await ParseHistoryUniteLegalUseCase.run("", new Date());

            expect(saveEntityFactorySpy).toHaveBeenCalled();
        });

        it("should call parseUniteLegalHistory", async () => {
            await ParseHistoryUniteLegalUseCase.run("", new Date());

            expect(parseUniteLegalHistorySpy).toHaveBeenCalled();
        });

        it("should call addNewImport", async () => {
            await ParseHistoryUniteLegalUseCase.run("", new Date());

            expect(addNewImportSpy).toHaveBeenCalled();
        });

        it("should call _saveEntreprises", async () => {
            saveEntityFactorySpy.mockImplementationOnce((stackAsso, stackEntreprise) => {
                stackEntreprise.push(...[1, 2, 3]);
                return jest.fn();
            });

            await ParseHistoryUniteLegalUseCase.run("", new Date());

            expect(saveEntreprisesSpy).toHaveBeenCalled();
        });

        it("should call saveAssociations", async () => {
            saveEntityFactorySpy.mockImplementationOnce(stackAsso => {
                stackAsso.push(...[1, 2, 3]);
                return jest.fn();
            });

            await ParseHistoryUniteLegalUseCase.run("", new Date());

            expect(saveAssociationsSpy).toHaveBeenCalled();
        });
    });
});
