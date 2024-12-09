import { AsyncCron } from "../../decorators/cronController.decorator";
import { CronController } from "../../@types/cron";
import searchService from "../../modules/search/search.service";

export class SearchCacheCron implements CronController {
    name = "searchCacheCron";

    // every day at 11 PM UTC
    @AsyncCron({ cronExpression: "0 23 * * *" })
    clear() {
        return searchService.cleanCache();
    }
}
