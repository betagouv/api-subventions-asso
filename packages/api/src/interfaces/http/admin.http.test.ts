import statsService from "../../modules/stats/stats.service";
import { AdminHttp } from "./Admin.http";

describe("Admin Controller", () => {
    let cli: AdminHttp;

    beforeEach(() => {
        cli = new AdminHttp();
    });

    describe("getDetailedStats", () => {
        const TODAY = new Date();
        it("calls statsService with current year with no path paramter provided", async () => {
            await cli.getDetailedStats();
            expect(statsService.doStuff).toHaveBeenCalledWith(TODAY.getFullYear().toString());
        });
    });
});
