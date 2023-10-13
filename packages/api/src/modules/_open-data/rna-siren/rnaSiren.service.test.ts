import { WithId } from "mongodb";
import RnaSiren from "../../../../src/modules/_open-data/rna-siren/entities/RnaSirenEntity";
import rnaSirenService from "../../../../src/modules/_open-data/rna-siren/rnaSiren.service";
import rnaSirenRepository from "./repositories/rnaSiren.repository";
jest.mock("./repositories/rnaSiren.repository");
const mockedRnaSirenRepository = jest.mocked(rnaSirenRepository);
import * as SirenHelper from "../../../shared/helpers/SirenHelper";
jest.mock("../../../shared/helpers/SirenHelper");
const mockedSirenHelper = jest.mocked(SirenHelper);

const RNA = "W000000000";
const SIREN = "000000001";

describe("RnaSirenService", () => {
    let mockAdd: jest.SpyInstance;

    beforeAll(async () => {
        mockedSirenHelper.siretToSiren.mockImplementation(siren => siren);
    });

    describe("add", () => {
        it("shoudl call SiretHelper.siretToSiren()", async () => {
            await rnaSirenService.add(RNA, SIREN);
            expect(mockedSirenHelper.siretToSiren).toHaveBeenCalledWith(SIREN);
        });

        it("should call rnaSirenRepository.findBySiren()", async () => {
            await rnaSirenService.add(RNA, SIREN);
            expect(rnaSirenRepository.findBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("should call rnaSirenRepository.create()", async () => {
            mockedRnaSirenRepository.findBySiren.mockResolvedValueOnce(null);
            await rnaSirenService.add(RNA, SIREN);
            expect(rnaSirenRepository.create).toHaveBeenCalledWith(new RnaSiren(RNA, SIREN));
        });
    });

    describe("getSiren", () => {
        let mockFindSirenByRna: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: private method
            mockFindSirenByRna = jest.spyOn(rnaSirenService, "findSirenByRna");
            mockFindSirenByRna.mockResolvedValue(SIREN);
            mockedRnaSirenRepository.findByRna.mockResolvedValue(null);
        });

        afterAll(() => {
            mockFindSirenByRna.mockRestore();
            mockedRnaSirenRepository.findByRna.mockReset();
        });

        it("should call rnaSirenRepository.findByRna()", async () => {
            await rnaSirenService.getSiren(RNA);
            expect(mockedRnaSirenRepository.findByRna).toHaveBeenCalledWith(RNA);
        });

        it("should return siren if RnaSiren found", async () => {
            mockedRnaSirenRepository.findByRna.mockResolvedValueOnce({ siren: SIREN } as WithId<RnaSiren>);
            const expected = SIREN;
            const actual = await rnaSirenService.getSiren(RNA);
            expect(actual).toEqual(expected);
        });

        it("should call findSirenByRna()", async () => {
            await rnaSirenService.getSiren(RNA);
            expect(mockFindSirenByRna).toHaveBeenCalledWith(RNA);
        });

        it("should call add()", async () => {
            await rnaSirenService.getSiren(RNA);
            expect(mockFindSirenByRna).toHaveBeenCalledWith(RNA);
        });

        it("should return siren", async () => {
            const expected = SIREN;
            const actual = await rnaSirenService.getSiren(RNA);
            expect(actual).toEqual(expected);
        });
    });

    describe("getRna", () => {
        let mockFindRnaBySiren: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: private method
            mockFindRnaBySiren = jest.spyOn(rnaSirenService, "findRnaBySiren");
            mockFindRnaBySiren.mockResolvedValue(null);
            mockAdd = jest.spyOn(rnaSirenService, "add");
            mockAdd.mockResolvedValue(RNA);
            mockedRnaSirenRepository.findBySiren.mockResolvedValue(null);
        });

        afterAll(() => {
            mockFindRnaBySiren.mockRestore();
            mockAdd.mockRestore();
            mockedRnaSirenRepository.findBySiren.mockReset();
        });

        it("should call siretToSiren()", async () => {
            await rnaSirenService.getRna(SIREN);
            expect(mockedSirenHelper.siretToSiren).toHaveBeenCalledWith(SIREN);
        });

        it("should call rnaSirenRepository.findBySiren()", async () => {
            await rnaSirenService.getRna(SIREN);
            expect(mockedSirenHelper.siretToSiren).toHaveBeenCalledWith(SIREN);
        });

        it("should return rna if entity found", async () => {
            // @ts-expect-error: mock RnaSiren
            mockedRnaSirenRepository.findBySiren.mockResolvedValueOnce({ rna: RNA });
            const expected = RNA;
            const actual = await rnaSirenService.getRna(SIREN);
            expect(actual).toEqual(expected);
        });

        it("should call findRnaBySiren()", async () => {
            await rnaSirenService.getRna(SIREN);
            expect(mockFindRnaBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("should call add() if rna found", async () => {
            mockFindRnaBySiren.mockResolvedValueOnce(RNA);
            await rnaSirenService.getRna(SIREN);
            expect(mockAdd).toHaveBeenCalledWith(RNA, SIREN);
        });

        it("should return rna", async () => {
            mockFindRnaBySiren.mockResolvedValueOnce(RNA);
            const expected = RNA;
            const actual = await rnaSirenService.getRna(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("insertMany", () => {
        it("should call rnaSirenRepository.insertMany()", async () => {
            await rnaSirenService.insertMany([]);
            expect(mockedRnaSirenRepository.insertMany).toHaveBeenCalledWith([]);
        });
    });

    describe("cleanDuplicate", () => {
        it("should call rnaSirenRepository.cleanDuplicate()", async () => {
            await rnaSirenService.cleanDuplicate();
            expect(mockedRnaSirenRepository.cleanDuplicate).toHaveBeenCalledTimes(1);
        });
    });
});
