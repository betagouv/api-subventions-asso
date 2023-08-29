import axios from "axios";
import { NotificationDataTypes } from "../@types/NotificationDataTypes";
import { NotificationType } from "../@types/NotificationType";
import { NotifyOutPipe } from "../@types/NotifyOutPipe";

export class MattermostNotifyPipe implements NotifyOutPipe {
    accepts = [NotificationType.USER_DELETED];

    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = "https://mattermost.incubateur.net/hooks/qefuswbp9fybdjf97yqxo93cqr";
    }

    notify(type, data) {
        switch (type) {
            case NotificationType.USER_DELETED:
                return this.userDeleted(data);
            default:
                return Promise.resolve(false);
        }
    }

    private async sendMessage(payload) {
        try {
            await axios.post(this.apiUrl, {
                ...payload,
                text: `[${process.env.ENV}] ${payload.text}`,
            });
            return true;
        } catch {
            console.error("error sending mattermost log");
            return false;
        }
    }

    private userDeleted(data: NotificationDataTypes[NotificationType.USER_DELETED]) {
        const message = `${data.firstname || ""} ${data.lastname || ""} (${
            data.email
        }) a supprimé son compte, veuillez supprimer toutes ses données\xA0!`;

        return this.sendMessage({
            text: message,
            channel: "datasubvention---bizdev", // TODO choose proper channel
            username: "Suppression de compte",
            icon_emoji: "door",
        });
    }
}

const mattermostNotifyPipe = new MattermostNotifyPipe();

export default mattermostNotifyPipe;
