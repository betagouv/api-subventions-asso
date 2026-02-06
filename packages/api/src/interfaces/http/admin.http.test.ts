import statsService from "../../modules/stats/stats.service";
import { AdminHttp } from "./Admin.http";

jest.mock("../../modules/stats/stats.service");

describe("Admin Controller", () => {
    let cli: AdminHttp;

    beforeEach(() => {
        cli = new AdminHttp();
    });

    describe("getDetailedStats", () => {
        it("calls statsService", async () => {
            await cli.getDetailedStats();
            expect(statsService.doStuff).toHaveBeenCalled();
        });
    });
});
