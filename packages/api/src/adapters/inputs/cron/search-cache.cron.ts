import { AsyncCron } from "../../../decorators/cron.decorator";
import { CronController } from "../../../@types/CronController";
import searchService from "../../../modules/search/search.service";

export class SearchCacheCron implements CronController {
    name = "searchCacheCron";

    // every day at 11 PM UTC
    @AsyncCron({ cronExpression: "0 23 * * *" })
    clear() {
        return searchService.cleanCache();
    }
}
