import { NotifyOutPipe, NotificationValidationType } from "./@types/NotifyOutPipe";
import outPipes from "./outPipes";

export class NotifyService {
    private outPipes: NotifyOutPipe[] = outPipes;

    get notify(): NotificationValidationType {
        return (type, data) => {
            const pipesPromise = this.outPipes.map(pipe => {
                if (!pipe.accepts.includes(type)) return;
                return pipe.notify(type, data);
            });
            return Promise.all(pipesPromise).then(values => values.every(value => value === true));
        };
    }
}

const notifyService = new NotifyService();

export default notifyService;
