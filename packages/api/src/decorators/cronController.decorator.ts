import {
    AsyncTask,
    CronJob,
    CronSchedule,
    LongIntervalJob,
    SimpleIntervalJob,
    SimpleIntervalSchedule,
    Task,
} from "toad-scheduler";
import * as Sentry from "@sentry/node";
import notifyService from "../modules/notify/notify.service";
import { NotificationType } from "../modules/notify/@types/NotificationType";

export const errorHandlerFactory = (cronName: string) => {
    return (error: Error) => {
        Sentry.captureException(error);
        console.error(`error during cron ${cronName}`);
        console.trace();
        notifyService.notify(NotificationType.FAILED_CRON, { cronName, error });
        return;
    };
};

// think about creating the cron monitor in sentry https://sentry.incubateur.net/organizations/betagouv/crons/

export const newJob = (schedule, JobClass, TaskClass) => {
    const attributeName = JobClass === CronJob ? "__cronJobs__" : "__intervalJobs__";
    return function (target, propertyKey: string, descriptor) {
        if (!target[attributeName]) target[attributeName] = [];
        const cronName = `${target.constructor.name}.${propertyKey}`;
        const sentryCronSlug = `${target.constructor.name}-${propertyKey}`.toLowerCase();
        let message: string;

        const loggedFunction =
            TaskClass === AsyncTask
                ? () => {
                      message = `cron task started: ${cronName}`;
                      console.log(message);
                      Sentry.captureEvent({ level: "info", message });
                      const checkInId = Sentry.captureCheckIn({
                          monitorSlug: sentryCronSlug,
                          status: "in_progress",
                      });
                      return descriptor
                          .value()
                          .then(() => {
                              message = `cron task ended successfully: ${cronName}`;
                              Sentry.captureEvent({ level: "info", message });
                              Sentry.captureCheckIn({
                                  checkInId,
                                  monitorSlug: sentryCronSlug,
                                  status: "ok",
                              });
                              console.log(message);
                          })
                          .catch(e => {
                              Sentry.captureCheckIn({
                                  checkInId,
                                  monitorSlug: sentryCronSlug,
                                  status: "error",
                              });
                              throw e;
                          });
                  }
                : () => {
                      message = `cron task started: ${cronName}`;
                      console.log(message);
                      Sentry.captureEvent({ level: "info", message });
                      const checkInId = Sentry.captureCheckIn({
                          monitorSlug: sentryCronSlug,
                          status: "in_progress",
                      });
                      try {
                          descriptor.value();
                      } catch (e) {
                          Sentry.captureCheckIn({
                              checkInId,
                              monitorSlug: sentryCronSlug,
                              status: "error",
                          });
                          throw e;
                      }
                      message = `cron task ended successfully: ${cronName}`;
                      console.log(message);
                      Sentry.captureCheckIn({
                          checkInId,
                          monitorSlug: sentryCronSlug,
                          status: "ok",
                      });
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
