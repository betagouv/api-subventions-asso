import indexService from "../../index.service";
import { IndexController } from "./IndexController";

describe("IndexController", () => {
    describe("index", () => {
        const getDataMock: jest.SpyInstance = jest.spyOn(indexService, "getIndexData");
        let controller: IndexController;

        beforeEach(() => {
            controller = new IndexController();
        });
        it("should return index service data", () => {
            const expected = { test: true };
            getDataMock.mockImplementationOnce(() => expected);
            const actual = controller.index();

            expect(actual).toBe(expected);
        });
    });
});
