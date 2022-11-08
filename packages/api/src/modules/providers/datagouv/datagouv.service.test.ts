import dataGouvService from "./datagouv.service";
import EntrepriseSirenEntity from "./entities/EntrepriseSirenEntity";
import entrepriseSirenRepository from "./repositories/entreprise_siren.repository";
import historyImportRepository from "./repositories/historyImport.repository"

describe("DataGouvService", () => {
    describe("addEntrepriseSiren", () => {
        it("should call repository", async () => {
            const createEntrepriseSirenMock = jest.spyOn(entrepriseSirenRepository, "upsert").mockImplementationOnce(jest.fn());
            await dataGouvService.addEntrepriseSiren({} as EntrepriseSirenEntity);
            expect(createEntrepriseSirenMock).toHaveBeenCalledTimes(1);
        })
    })
    describe("addNewImport", () => {
        const addEntityMock: jest.SpyInstance<unknown> = jest.spyOn(historyImportRepository, "add");

        it("should call repository to save entity", async () => {
            addEntityMock.mockImplementationOnce(async () => null);

            const expected = {
                filename: "fake_filename.csv",
                dateOfFile: new Date(),
                dateOfImport: new Date(),
            }

            await dataGouvService.addNewImport(expected);

            expect(addEntityMock).toHaveBeenCalledWith(expected);
        });
    })

    describe("getLastDateImport", () => {
        const findLastImportMock: jest.SpyInstance<unknown> = jest.spyOn(historyImportRepository, "findLastImport");


        it("should return null", async () => {
            findLastImportMock.mockImplementationOnce(() => null);

            const expected = null;

            const actual = await dataGouvService.getLastDateImport();

            expect(actual).toBe(expected);
        });

        it("should return date", async () => {
            const expected = new Date(2022, 8, 9);
            findLastImportMock.mockImplementationOnce(() => ({
                filename: "TEST",
                dateOfFile: expected,
                dateOfImport: new Date(),
            }));

            const actual = await dataGouvService.getLastDateImport();

            expect(actual).toBe(expected)
        });
    });
})