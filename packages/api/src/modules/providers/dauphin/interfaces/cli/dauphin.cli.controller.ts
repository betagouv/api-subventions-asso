import { CliStaticInterface } from "../../../../../@types";
import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import dauphinService from "../../dauphin.service";

@StaticImplements<CliStaticInterface>()
export default class DauphinCliController {
    static cmdName = "dauphin";

    async getApplications(date = new Date()) {
        const midnight = new Date(date);

        midnight.setHours(0, 0, 0, 0);

        console.log(midnight);

        await dauphinService.fetchAndSaveApplicationsFromDate(midnight);
    }
}
