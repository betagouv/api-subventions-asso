import indexService from "../../modules/index/index.service";
import { IndexInterfaceHttp } from "./IndexInterfaceHttp";

describe("IndexInterfaceHttp", () => {
    describe("index", () => {
        const getDataMock: jest.SpyInstance = jest.spyOn(indexService, "getIndexData");
        let controller: IndexInterfaceHttp;

        beforeEach(() => {
            controller = new IndexInterfaceHttp();
        });
        it("should return index service data", () => {
            const expected = { test: true };
            getDataMock.mockImplementationOnce(() => expected);
            const actual = controller.index();

            expect(actual).toBe(expected);
        });
    });
});
