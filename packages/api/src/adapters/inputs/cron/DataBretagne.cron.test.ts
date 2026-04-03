import dataBretagneService from "../../../modules/providers/data-bretagne/dataBretagne.service";
import { DataBretagneCron } from "./DataBretagne.cron";

jest.mock("../../../modules/providers/data-bretagne/dataBretagne.service");

describe("DataBretagne Cron", () => {
    // TODO test that it saves import log
    describe("resync", () => {
        it("should call dataBretagneService.resyncPrograms()", async () => {
            const cron = new DataBretagneCron();
            await cron.resync();
            expect(dataBretagneService.resyncPrograms).toHaveBeenCalledTimes(1);
        });
    });
});
