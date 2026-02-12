import statsService from "../../modules/stats/stats.service";
import { AdminHttp } from "./Admin.http";

jest.mock("../../modules/stats/stats.service");

describe("Admin Controller", () => {
    let cli: AdminHttp;

    beforeEach(() => {
        cli = new AdminHttp();
    });

    describe("getConsumption", () => {
        it("calls statsService", async () => {
            await cli.getConsumption();
            expect(statsService.getConsumption).toHaveBeenCalled();
        });
    });
});
