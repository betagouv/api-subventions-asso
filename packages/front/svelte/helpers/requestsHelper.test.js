import * as requestHelper from "./requestsHelper";
describe("requestHelper", () => {
    describe("toQueryString", () => {
        it("should return an empty string", () => {
            const expected = "";
            const query = {
                test: undefined
            };

            const actual = requestHelper.toQueryString(query);

            expect(actual).toBe(expected);
        });

        it("should return a query string with 2 elements", () => {
            const expected = "test=1&testA=5";
            const query = {
                test: 1,
                testA: 5
            };

            const actual = requestHelper.toQueryString(query);

            expect(actual).toBe(expected);
        });

        it("should return a query string with one element", () => {
            const expected = "testA=5";
            const query = {
                test: undefined,
                testA: 5
            };

            const actual = requestHelper.toQueryString(query);

            expect(actual).toBe(expected);
        });
    });
});
