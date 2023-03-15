import { DemarchesSimplifieesEntityAdapter } from "./adapters/DemarchesSimplifieesEntityAdapter";
import demarchesSimplifieesService from "./demarchesSimplifiees.service";
import demarchesSimplifieesMapperRepository from "./repositories/demarchesSimplifieesMapper.repository";

describe("DemarchesSimplifieesService", () => {
    let mapperRepoFindAllMock: jest.SpyInstance;

    beforeAll(() => {
        mapperRepoFindAllMock = jest.spyOn(demarchesSimplifieesMapperRepository, "findAll");
    });

    describe("getSchemasByIds", () => {
        beforeAll(() => {
            mapperRepoFindAllMock.mockResolvedValue([
                {
                    demarcheId: 1,
                    schema: []
                }
            ]);
        });

        it("should call mapperRepo", async () => {
            // @ts-ignore getSchemasByIds is private method
            await demarchesSimplifieesService.getSchemasByIds();

            expect(mapperRepoFindAllMock).toHaveBeenCalledTimes(1);
        });

        it("should return good data", async () => {
            // @ts-ignore getSchemasByIds is private method
            const actual = await demarchesSimplifieesService.getSchemasByIds();

            expect(actual).toEqual(
                expect.objectContaining({
                    1: {
                        demarcheId: 1,
                        schema: expect.any(Array)
                    }
                })
            );
        });
    });

    describe("enititesToSubventions", () => {
        let getSchemasByIdsMock: jest.SpyInstance;
        let entityAdatperToSubMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-ignore getSchemasByIds is private method
            getSchemasByIdsMock = jest.spyOn(demarchesSimplifieesService, "getSchemasByIds");
            entityAdatperToSubMock = jest.spyOn(DemarchesSimplifieesEntityAdapter, "toSubvention");
        });
    });
});
