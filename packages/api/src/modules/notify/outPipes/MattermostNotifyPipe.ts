import axios from "axios";
import { FutureUserDto } from "dto";
import { NotificationDataTypes } from "../@types/NotificationDataTypes";
import { NotificationType } from "../@types/NotificationType";
import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import { ENV } from "../../../configurations/env.conf";

export class MattermostNotifyPipe implements NotifyOutPipe {
    accepts = [NotificationType.USER_DELETED, NotificationType.SIGNUP_BAD_DOMAIN];

    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = "https://mattermost.incubateur.net/hooks/qefuswbp9fybdjf97yqxo93cqr";
    }

    notify(type, data) {
        switch (type) {
            case NotificationType.USER_DELETED:
                return this.userDeleted(data);
            case NotificationType.SIGNUP_BAD_DOMAIN:
                return this.badEmailDomain(data);
            default:
                return Promise.resolve(false);
        }
    }

    private async sendMessage(payload) {
        try {
            await axios.post(this.apiUrl, {
                ...payload,
                text: `[${ENV}] ${payload.text}`,
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
            channel: "datasubvention---bizdev",
            username: "Suppression de compte",
            icon_emoji: "door",
        });
    }

    private badEmailDomain(data: FutureUserDto) {
        const message = `Un utilisateur ${
            data.email || ""
        }) a échoué à créer son compte car le nom de domaine de l'adresse n'est pas accepté.\xA0!`;

        return this.sendMessage({
            text: message,
            channel: "datasubvention---bizdev",
            username: "Nom de domaine pas reconnu",
            icon_emoji: "no_entry",
        });
    }
}

const mattermostNotifyPipe = new MattermostNotifyPipe();

export default mattermostNotifyPipe;
