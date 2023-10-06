import {
    AsyncTask,
    CronJob,
    CronSchedule,
    LongIntervalJob,
    SimpleIntervalJob,
    SimpleIntervalSchedule,
    Task,
} from "toad-scheduler";
import axios from "axios";
import * as Sentry from "@sentry/node";
import { ENV } from "../configurations/env.conf";

export const errorHandlerFactory = cronName => {
    return error => {
        Sentry.captureException(error);
        console.error(`error during cron ${cronName}`);
        console.trace();
        return axios
            .post("https://mattermost.incubateur.net/hooks/qefuswbp9fybdjf97yqxo93cqr ", {
                text: `[${ENV}] Le cron \`${cronName}\` a échoué`,
                username: "Police du Cron",
                icon_emoji: "alarm_clock",
                props: { card: `\`\`\`\n${new Error(error).stack}\n\`\`\`` },
            })
            .catch(() => console.error("error sending mattermost log"));
    };
};

// think about creating the cron monitor in sentry https://sentry.incubateur.net/organizations/betagouv/crons/

export const newJob = (schedule, JobClass, TaskClass) => {
    const attributeName = JobClass === CronJob ? "__cronJobs__" : "__intervalJobs__";
    return function (target, propertyKey: string, descriptor) {
        if (!target[attributeName]) target[attributeName] = [];
        const cronName = `${target.constructor.name}.${propertyKey}`;
        let message: string;

        const loggedFunction =
            TaskClass === AsyncTask
                ? () => {
                      message = `cron task started: ${cronName}`;
                      console.log(message);
                      Sentry.captureEvent({ level: "info", message });
                      return descriptor.value().then(() => {
                          message = `cron task ended successfully: ${cronName}`;
                          Sentry.captureEvent({ level: "info", message });
                          console.log(message);
                      });
                  }
                : () => {
                      message = `cron task started: ${cronName}`;
                      console.log(message);
                      Sentry.captureEvent({ level: "info", message });
                      descriptor.value();
                      message = `cron task ended successfully: ${cronName}`;
                      console.log(message);
                      Sentry.captureEvent({ level: "info", message });
                  };
        const task = new TaskClass(cronName, loggedFunction, errorHandlerFactory(cronName));
        target[attributeName].push(new JobClass(schedule, task, { preventOverrun: true }));
    };
};

/**
 * @param schedule: SimpleIntervalSchedule (toad-scheduler)
 * @param isIntervalLong: boolean -- set to true if interval is higher than 24.85 days. Prevents overflow issues
 */
export const IntervalCron = (schedule: SimpleIntervalSchedule, isIntervalLong: boolean) => {
    const JobClass = isIntervalLong ? LongIntervalJob : SimpleIntervalJob;
    return newJob({ runImmediately: true, ...schedule }, JobClass, Task);
};

/**
 * @param schedule: SimpleIntervalSchedule (toad-scheduler)
 * @param isIntervalLong: boolean -- set to true if interval is higher than 24.85 days. Prevents overflow issues
 */
export const AsyncIntervalCron = (schedule: SimpleIntervalSchedule, isIntervalLong: boolean) => {
    const JobClass = isIntervalLong ? LongIntervalJob : SimpleIntervalJob;
    return newJob({ runImmediately: true, ...schedule }, JobClass, AsyncTask);
};

export const Cron = (schedule: CronSchedule) => {
    return newJob(schedule, CronJob, Task);
};

export const AsyncCron = (schedule: CronSchedule) => {
    return newJob(schedule, CronJob, AsyncTask);
};
