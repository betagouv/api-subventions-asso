import indexService from "../../modules/index/index.service";
import { IndexHttp } from "./Index.http";

describe("IndexHttp", () => {
    describe("index", () => {
        const getDataMock: jest.SpyInstance = jest.spyOn(indexService, "getIndexData");
        let controller: IndexHttp;

        beforeEach(() => {
            controller = new IndexHttp();
        });
        it("should return index service data", () => {
            const expected = { test: true };
            getDataMock.mockImplementationOnce(() => expected);
            const actual = controller.index();

            expect(actual).toBe(expected);
        });
    });
});
