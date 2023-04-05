import { AsyncCron, AsyncIntervalCron, Cron, IntervalCron } from "../../../../decorators/cronController.decorator";
import { CronController } from "../../../../@types/cron";

export class ExampleCronController implements CronController {
    name = "cronExample";
    static testParity = 0;

    @IntervalCron({ minutes: 1 }, false)
    intervalTest() {
        console.log("hello world");
    }

    @AsyncIntervalCron({ minutes: 1 }, false)
    asyncIntervalTest() {
        ExampleCronController.testParity += 1;
        if (ExampleCronController.testParity % 2) return Promise.reject("odd number: task fails");
        console.log("even number: test successes");
        return Promise.resolve();
    }

    @Cron({ cronExpression: "* * * * *" })
    test() {
        console.log("good morning world");
    }

    @AsyncCron({ cronExpression: "* * * * *" })
    asyncTest() {
        ExampleCronController.testParity += 1;
        if (ExampleCronController.testParity % 2) return Promise.reject("odd number: cron task fails");
        console.log("even number: test successes");
        return Promise.resolve();
    }
}
