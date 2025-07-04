import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import userStatsService from "../../modules/user/services/stats/user.stats.service";

@StaticImplements<CliStaticInterface>()
export default class UserCli {
    static cmdName = "user";

    updateNbRequests() {
        return userStatsService.updateNbRequests();
    }
}
