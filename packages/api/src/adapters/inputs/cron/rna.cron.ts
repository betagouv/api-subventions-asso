import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import rnaPipeline, { RnaPipeline } from "../pipeline/import/rna/rna.pipeline";

export class RnaCron implements CronController {
    name = "rna";

    constructor(public pipeline: RnaPipeline) {}

    // each 3 of the month at 5 am
    @AsyncCron({ cronExpression: "0 5 3 * *" })
    async updateAll() {
        // this.pipeline.run();
    }
}

const rnaCron = new RnaCron(rnaPipeline);
export default rnaCron;
