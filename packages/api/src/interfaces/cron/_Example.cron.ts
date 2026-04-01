import { AsyncCron, AsyncIntervalCron, Cron, IntervalCron } from "../../decorators/cron.decorator";
import { CronController } from "../../@types/CronController";

export class ExampleCron implements CronController {
    name = "cronExample";
    static testParity = 0;

    @IntervalCron({ minutes: 1 }, false)
    intervalTest() {
        console.log("hello world");
    }

    @AsyncIntervalCron({ minutes: 1 }, false)
    asyncIntervalTest() {
        ExampleCron.testParity += 1;
        if (ExampleCron.testParity % 2) return Promise.reject("odd number: task fails");
        console.log("even number: test successes");
        return Promise.resolve();
    }

    @Cron({ cronExpression: "* * * * *" })
    test() {
        console.log("good morning world");
    }

    @AsyncCron({ cronExpression: "* * * * *" })
    asyncTest() {
        ExampleCron.testParity += 1;
        if (ExampleCron.testParity % 2) return Promise.reject("odd number: cron task fails");
        console.log("even number: test successes");
        return Promise.resolve();
    }
}
