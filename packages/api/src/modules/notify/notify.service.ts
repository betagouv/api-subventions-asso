import * as Sentry from "@sentry/node";
import { NotifyOutPipe, NotifierMethodType } from "./@types/NotifyOutPipe";
import outPipes from "./outPipes";
import { ENV, EnvironmentEnum } from "../../configurations/env.conf";
import { NOTIFICATION_ENV_CONFIG } from "./NotificationEnvConfig";
import { NotificationType } from "./@types/NotificationType";

export class NotifyService {
    private outPipes: NotifyOutPipe[] = outPipes;

    // we use getter to force NotifierMethodType for function returned by this
    // this is used to avoid using notify()() syntax
    get notify(): NotifierMethodType {
        return (type, data) => {
            if (this.shouldSkipNotification(type)) {
                return Promise.resolve(true);
            }

            const pipesPromise = this.outPipes.map(pipe => {
                return pipe.notify(type, data).catch(e => {
                    Sentry.captureException(e); // TODO refactor with errorService? #1591
                    console.error(e);
                    return false;
                });
            });
            // careful: the result means nothing since pipes not concerned return false anyway
            return Promise.all(pipesPromise).then(values => values.every(value => value === true));
        };
    }

    private shouldSkipNotification(type: NotificationType): boolean {
        // todo : unit test
        const allowedEnvs = NOTIFICATION_ENV_CONFIG[type];

        if (allowedEnvs) {
            return !allowedEnvs.some(env => env === ENV);
        } else {
            return ENV === EnvironmentEnum.DEV || ENV === EnvironmentEnum.TEST;
        }
    }
}

const notifyService = new NotifyService();

export default notifyService;
