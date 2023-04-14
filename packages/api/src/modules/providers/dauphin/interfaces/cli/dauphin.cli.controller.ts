import { CliStaticInterface } from "../../../../../@types";
import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import dauphinService from "../../dauphin.service";

@StaticImplements<CliStaticInterface>()
export default class DauphinCliController {
    static cmdName = "dauphin";

    // only for test purpose
    async test(date = new Date()) {
        const midnight = new Date(date);
        midnight.setHours(0, 0, 0, 0);
        console.log(`fetching all dauphin applications since ${midnight}`);
        await dauphinService.fetchAndSaveApplicationsFromDate(midnight);
    }
}
