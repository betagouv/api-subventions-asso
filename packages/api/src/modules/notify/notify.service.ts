import * as Sentry from "@sentry/node";
import { NotifyOutPipe, NotifierMethodType } from "./@types/NotifyOutPipe";
import outPipes from "./outPipes";

export class NotifyService {
    private outPipes: NotifyOutPipe[] = outPipes;

    get notify(): NotifierMethodType {
        return (type, data) => {
            const pipesPromise = this.outPipes.map(pipe => {
                if (!pipe.accepts.includes(type)) return;
                return pipe.notify(type, data).catch(e => {
                    Sentry.captureException(e); // TODO refactor with errorService? #1591
                    console.error(e);
                    return false;
                });
            });
            return Promise.all(pipesPromise).then(values => values.every(value => value === true));
        };
    }
}

const notifyService = new NotifyService();

export default notifyService;
