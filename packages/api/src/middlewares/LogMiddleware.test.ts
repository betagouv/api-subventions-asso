import { expressLogger } from "./LogMiddleware";
import expressWinston from "express-winston";
import { ObjectId } from "mongodb";

jest.mock("express-winston");

describe("LogMiddleware", () => {
    let cfg: expressWinston.LoggerOptions;
    const REQUEST: expressWinston.FilterRequest = {
        user: {
            _id: new ObjectId("66e2f3f057c19ddb79d81d02"),
            email: "someone@email.fr",
        },
    } as unknown as expressWinston.FilterRequest;
    beforeAll(() => {
        expressLogger();
        cfg = jest.mocked(expressWinston.logger).mock.calls[0][0];
    });

    describe("requestFilter", () => {
        let requestFilter: expressWinston.RequestFilter;

        beforeAll(() => {
            requestFilter = cfg.requestFilter || jest.fn();
        });

        it("keeps user id", () => {
            const actual = requestFilter(REQUEST, "user")._id;
            expect(actual).toMatchInlineSnapshot(`"66e2f3f057c19ddb79d81d02"`);
        });

        it("censors email", () => {
            const actual = requestFilter(REQUEST, "user").email;
            expect(actual).toMatchInlineSnapshot(`"**********"`);
        });
    });
});
