import axios from "axios";
import { FutureUserDto } from "dto";
import { NotificationDataTypes } from "../@types/NotificationDataTypes";
import { NotificationType } from "../@types/NotificationType";
import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import { ENV } from "../../../configurations/env.conf";

enum MattermostChannels {
    BIZDEV = "datasubvention---bizdev",
}

export class MattermostNotifyPipe implements NotifyOutPipe {
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
            case NotificationType.FAILED_CRON:
                return this.failedCron(data);
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
            channel: MattermostChannels.BIZDEV,
            username: "Suppression de compte",
            icon_emoji: "door",
        });
    }

    private badEmailDomain(data: FutureUserDto) {
        const message = `L'inscription de l'utilisateur ${
            data.email || ""
        } a échouée car le nom de domaine de l'adresse mail n'est pas accepté.`;

        return this.sendMessage({
            text: message,
            channel: MattermostChannels.BIZDEV,
            username: "Nom de domaine rejeté",
            icon_emoji: "no_entry",
        });
    }

    private async failedCron({ cronName, error }) {
        try {
            return await this.sendMessage({
                text: `[${ENV}] Le cron \`${cronName}\` a échoué`,
                username: "Police du Cron",
                icon_emoji: "alarm_clock",
                props: { card: `\`\`\`\n${new Error(error).stack}\n\`\`\`` },
            });
        } catch {
            console.error("error sending mattermost log");
            return false;
        }
    }
}

const mattermostNotifyPipe = new MattermostNotifyPipe();

export default mattermostNotifyPipe;
