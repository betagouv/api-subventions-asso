import { AsyncCron, Cron } from "../../../../decorators/cronController.decorator";
import { CronController } from "../../../../@types/cron";

export class ExampleCronController implements CronController {
    name = "cronExample";
    static testParity = 0;

    @Cron({ seconds: 10 }, false)
    test() {
        console.log("hello world");
    }

    @AsyncCron({ seconds: 10 }, false)
    asyncTest() {
        ExampleCronController.testParity += 1;
        if (ExampleCronController.testParity % 2) return Promise.reject("odd number: task fails");
        console.log("even number: test successes");
        return Promise.resolve();
    }
}
