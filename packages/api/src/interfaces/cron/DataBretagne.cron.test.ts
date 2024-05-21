import dataBretagneService from "../../modules/providers/dataBretagne/dataBretagne.service";
import { DataBretagneCron } from "./DataBretagne.cron";
jest.mock("../../modules/providers/dataBretagne/dataBretagne.service");

describe("DataBretagne Cron", () => {
    describe("resync", () => {
        it("shoudl call dataBretagneService.resyncPrograms()", () => {
            const cron = new DataBretagneCron();
            cron.resync();
            expect(dataBretagneService.resyncPrograms).toHaveBeenCalledTimes(1);
        });
    });
});
