import RnaSirenEntity from "../../entities/RnaSirenEntity";
import { ASSOCIATION_IDENTIFIER } from "../../identifierObjects/__fixtures__/IdentifierFixture";
import rnaSirenService from "./rna-siren.service";

import Rna from "../../identifierObjects/Rna";
import Siren from "../../identifierObjects/Siren";
import apiAssoService from "../providers/apiAsso/apiAsso.service";
import rnaSirenPort from "../../dataProviders/db/rnaSiren/rnaSiren.port";
import associationIdentifierService from "../association-identifier/association-identifier.service";

jest.mock("../association-identifier/association-identifier.service");
jest.mock("../providers/apiAsso/apiAsso.service");
jest.mock("../../dataProviders/db/rnaSiren/rnaSiren.port");

describe("RnaSirenService", () => {
    const RNA = new Rna("W123456789");
    const SIREN = new Siren("123456789");
    const RNA_SIREN_ENTITY = new RnaSirenEntity(RNA, SIREN);

    describe("insertManyAssociationIdentifer", () => {
        let mockInsertMany: jest.SpyInstance;

        beforeEach(() => {
            mockInsertMany = jest.spyOn(rnaSirenService, "insertMany").mockImplementation(jest.fn());
        });

        afterAll(() => {
            mockInsertMany.mockRestore();
        });

        it("tranform AssociationIdentifiers into RnaSirenEntities", () => {
            rnaSirenService.insertManyAssociationIdentifer([ASSOCIATION_IDENTIFIER]);
            expect(mockInsertMany).toHaveBeenCalledWith([
                new RnaSirenEntity(ASSOCIATION_IDENTIFIER.rna, ASSOCIATION_IDENTIFIER.siren),
            ]);
        });
    });

    describe("find", () => {
        let mockFindFromApiAsso: jest.SpyInstance;

        beforeAll(() => {
            mockFindFromApiAsso = jest.spyOn(rnaSirenService, "findFromApiAsso").mockResolvedValue(RNA_SIREN_ENTITY);
        });

        beforeEach(() => {
            mockFindFromApiAsso.mockClear();
            jest.mocked(rnaSirenPort.find).mockResolvedValue([RNA_SIREN_ENTITY]);
        });

        afterAll(() => {
            mockFindFromApiAsso.mockRestore();
        });

        it("search for entities already persisted in database", async () => {
            await rnaSirenService.find(RNA);
            expect(rnaSirenPort.find).toHaveBeenCalledWith(RNA);
        });

        it("returns entities from database", async () => {
            const expected = [RNA_SIREN_ENTITY];
            const actual = await rnaSirenService.find(RNA);
            expect(actual).toEqual(expected);
        });

        it("search for a match from API ASSO when no entities found in database", async () => {
            jest.mocked(rnaSirenPort.find).mockResolvedValueOnce(null);
            await rnaSirenService.find(RNA);
            expect(mockFindFromApiAsso).toHaveBeenCalledWith(RNA);
        });

        it("return wrapped entity from API ASSO", async () => {
            jest.mocked(rnaSirenPort.find).mockResolvedValueOnce(null);
            const actual = await rnaSirenService.find(RNA);
            const expected = [RNA_SIREN_ENTITY];
            expect(actual).toEqual(expected);
        });
    });

    describe("findFromUnknownIdentifier", () => {
        let mockFind: jest.SpyInstance;

        beforeAll(() => {
            mockFind = jest.spyOn(rnaSirenService, "find").mockResolvedValue([RNA_SIREN_ENTITY]);
            jest.mocked(associationIdentifierService.identifierStringToEntity).mockReturnValue(RNA);
        });

        beforeEach(() => {
            mockFind.mockClear();
            jest.mocked(associationIdentifierService.identifierStringToEntity).mockClear();
        });

        afterAll(() => {
            mockFind.mockRestore();
        });

        it("map string to an identifier object", async () => {
            await rnaSirenService.findFromUnknownIdentifier(RNA.value);
            expect(associationIdentifierService.identifierStringToEntity).toHaveBeenCalledWith(RNA.value);
        });

        it("calls find with identifier object", async () => {
            jest.mocked(associationIdentifierService.identifierStringToEntity).mockReturnValueOnce(RNA);
            await rnaSirenService.findFromUnknownIdentifier(RNA.value);
            expect(mockFind).toHaveBeenCalledWith(RNA);
        });

        it("returns rnaSiren entity", async () => {
            jest.mocked(associationIdentifierService.identifierStringToEntity).mockReturnValueOnce(RNA);
            await rnaSirenService.findFromUnknownIdentifier(RNA.value);
            expect(mockFind).toHaveBeenCalledWith(RNA);
        });
    });

    describe("findFromApiAsso", () => {
        it("returns null when API ASSO does not find any match", async () => {
            jest.mocked(apiAssoService.findRnaSiren).mockResolvedValue(null);
            const expected = null;
            const actual = await rnaSirenService.findFromApiAsso(RNA);
            expect(actual).toBe(expected);
        });

        it("persists new match from API ASSO", async () => {
            jest.mocked(apiAssoService.findRnaSiren).mockResolvedValue({ rna: RNA, siren: SIREN });
            await rnaSirenService.findFromApiAsso(RNA);
            expect(rnaSirenPort.insert).toHaveBeenCalledWith(RNA_SIREN_ENTITY);
        });

        it("returns new entity", async () => {
            jest.mocked(apiAssoService.findRnaSiren).mockResolvedValue({ rna: RNA, siren: SIREN });
            const expected = RNA_SIREN_ENTITY;
            const actual = await rnaSirenService.findFromApiAsso(RNA);
            expect(actual).toEqual(expected);
        });
    });
});
