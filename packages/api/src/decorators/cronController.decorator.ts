import {
    AsyncTask,
    CronJob,
    CronSchedule,
    LongIntervalJob,
    SimpleIntervalJob,
    SimpleIntervalSchedule,
    Task
} from "toad-scheduler";
import axios from "axios";

export const errorHandler = cronName => {
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
};

export const newJob = (schedule, jobConstructor, taskConstructor) => {
    const attributeName = jobConstructor === CronJob ? "__cronJobs__" : "__intervalJobs__";
    return function (target, propertyKey: string, descriptor) {
        if (!target[attributeName]) target[attributeName] = [];
        const cronName = `${target.constructor.name}.${propertyKey}`;
        const task = new taskConstructor(cronName, () => descriptor.value(), errorHandler(cronName));
        target[attributeName].push(new jobConstructor(schedule, task, { preventOverrun: true }));
    };
};

/**
 * @param schedule: SimpleIntervalSchedule (toad-scheduler)
 * @param isIntervalLong: boolean -- set to true if interval is higher than 24.85 days. Prevents overflow issues
 */
export const IntervalCron = (schedule: SimpleIntervalSchedule, isIntervalLong: boolean) => {
    const jobConstructor = isIntervalLong ? LongIntervalJob : SimpleIntervalJob;
    return newJob({ runImmediately: true, ...schedule }, jobConstructor, Task);
};

/**
 * @param schedule: SimpleIntervalSchedule (toad-scheduler)
 * @param isIntervalLong: boolean -- set to true if interval is higher than 24.85 days. Prevents overflow issues
 */
export const AsyncIntervalCron = (schedule: SimpleIntervalSchedule, isIntervalLong: boolean) => {
    const jobConstructor = isIntervalLong ? LongIntervalJob : SimpleIntervalJob;
    return newJob({ runImmediately: true, ...schedule }, jobConstructor, AsyncTask);
};

export const Cron = (schedule: CronSchedule) => {
    return newJob(schedule, CronJob, Task);
};

export const AsyncCron = (schedule: CronSchedule) => {
    return newJob(schedule, CronJob, AsyncTask);
};
