import { AsyncTask, LongIntervalJob, SimpleIntervalJob, Task } from "toad-scheduler";
import axios from "axios";

function errorHandler(cronName) {
    return error => {
        console.error(`error during cron ${cronName}`);
        console.trace();
        return axios
            .post("https://mattermost.incubateur.net/hooks/qefuswbp9fybdjf97yqxo93cqr ", {
                text: `[${process.env.ENV}] Le cron \`${cronName}\` a échoué`,
                username: "Police du Cron",
                icon_emoji: "alarm_clock",
                props: { card: `\`\`\`\n${new Error(error).stack}\n\`\`\`` }
            })
            .catch(() => console.error("error sending mattermost log"));
    };
}

/**
 * @param schedule: SimpleIntervalSchedule (toad-scheduler)
 * @param isIntervalLong: boolean -- set to true if interval is higher than 24.85 days. Prevents overflow issues
 */
export function Cron(schedule, isIntervalLong) {
    return function (target, propertyKey: string, descriptor) {
        if (!target["__jobs__"]) target["__jobs__"] = [];
        const cronName = `${target.constructor.name}.${propertyKey}`;
        const task = new Task(cronName, () => descriptor.value(), errorHandler(cronName));
        const jobConstructor = isIntervalLong ? LongIntervalJob : SimpleIntervalJob;
        target["__jobs__"].push(new jobConstructor({ ...schedule, runImmediately: true }, task));
    };
}

/**
 * @param schedule: SimpleIntervalSchedule (toad-scheduler)
 * @param isIntervalLong: boolean -- set to true if interval is higher than 24.85 days. Prevents overflow issues
 */
export function AsyncCron(schedule, isIntervalLong) {
    return function (target, propertyKey: string, descriptor) {
        if (!target["__jobs__"]) target["__jobs__"] = [];
        const cronName = `${target.constructor.name}.${propertyKey}`;
        const task = new AsyncTask(propertyKey, () => descriptor.value(), errorHandler(cronName));
        const jobConstructor = isIntervalLong ? LongIntervalJob : SimpleIntervalJob;
        target["__jobs__"].push(new jobConstructor({ runImmediately: true, ...schedule }, task));
    };
}
