import axios from "axios";
import dedent from "dedent";
import { FutureUserDto } from "dto";
import { NotificationDataTypes } from "../@types/NotificationDataTypes";
import { NotificationType } from "../@types/NotificationType";
import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import { ENV } from "../../../configurations/env.conf";

enum MattermostChannels {
    ACCOUNTS = "datasubvention---comptes-app",
    PRODUCT = "datasubvention---produit",
    DEV = "datasubvention---dev",
}

export class MattermostNotifyPipe implements NotifyOutPipe {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = "https://mattermost.incubateur.net/hooks/qefuswbp9fybdjf97yqxo93cqr";
    }

    notify(type, data) {
        if (!["prod", "preprod"].includes(ENV)) Promise.resolve(true); // do nothing in dev mode
        switch (type) {
            case NotificationType.USER_DELETED:
                return this.userDeleted(data);
            case NotificationType.BATCH_USERS_DELETED:
                return this.batchUsersDeleted(data);
            case NotificationType.SIGNUP_BAD_DOMAIN:
                return this.badEmailDomain(data);
            case NotificationType.FAILED_CRON:
                return this.failedCron(data);
            case NotificationType.DEPOSIT_UNFINISHED:
                return this.depositUnfinished(data);
            case NotificationType.DATA_IMPORT_SUCCESS:
                return this.dataImportSuccess(data);
            case NotificationType.DEPOSIT_SCDL_SUCCESS:
                return this.depositScdlSuccess(data);
            case NotificationType.EXTERNAL_API_ERROR:
                return this.externalApiError(data);
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

    private dataImportSuccess(data: NotificationDataTypes[NotificationType.DATA_IMPORT_SUCCESS]) {
        const message = dedent`Import de données réussi pour le fournisseur **${data.providerName}**${
            data.providerSiret ? ` (SIRET : \`${data.providerSiret}\`)` : ""
        }${data.exportDate ? ` avec une date d'export au **${data.exportDate.toISOString().split("T")[0]}**` : ""}.`;
        return this.sendMessage({
            text: message,
            channel: MattermostChannels.PRODUCT,
            username: "Import de données",
            icon_emoji: "white_check_mark",
        });
    }

    private depositScdlSuccess(data: NotificationDataTypes[NotificationType.DEPOSIT_SCDL_SUCCESS]) {
        const message = dedent`
        Nouveau dépôt SCDL réalisé pour le fournisseur **${data.providerName}**${
            data.providerSiret ? ` (SIRET : \`${data.providerSiret}\`)` : ""
        } pour ${data.grantCoverageYears.length === 1 ? "l'exercice" : "les exercices"} ${data.grantCoverageYears.join(", ")}.
        ${data.parsedLines} ${data.parsedLines === 1 ? "donnée de subvention a été déposée" : "données de subventions ont été déposées"}.
        `;
        return this.sendMessage({
            text: message,
            channel: MattermostChannels.PRODUCT,
            username: "Dépôt de données SCDL",
            icon_emoji: "white_check_mark",
        });
    }

    private userDeleted(data: NotificationDataTypes[NotificationType.USER_DELETED]) {
        const message = data.selfDeleted
            ? `${data.firstname || ""} ${data.lastname || ""} (${
                  data.email
              }) a supprimé son compte, veuillez supprimer toutes ses données !`
            : `Le compte de ${data.firstname || ""} ${data.lastname || ""} (${
                  data.email
              }) a été supprimé par un administrateur. N'oubliez pas de supprimer toutes ses données !`;

        return this.sendMessage({
            text: message,
            channel: MattermostChannels.ACCOUNTS,
            username: "Suppression de compte",
            icon_emoji: "door",
        });
    }

    private batchUsersDeleted(data: NotificationDataTypes[NotificationType.BATCH_USERS_DELETED]) {
        const emailsMdList = data.users.reduce(
            (mdList: string, miniUser) =>
                `${mdList}\n- ${miniUser.firstname || ""} ${miniUser.lastname || ""} (${miniUser.email})`,
            "",
        );
        const message = dedent`Les comptes suivants ont été supprimés pour inactivité trop longue.
        ${emailsMdList} 
        N'oubliez pas de supprimer toutes leurs données !`;

        return this.sendMessage({
            text: message,
            channel: MattermostChannels.ACCOUNTS,
            username: "Suppression de comptes",
            icon_emoji: "door",
        });
    }

    private badEmailDomain(data: FutureUserDto) {
        const message = `L'inscription de l'utilisateur ${
            data.email || ""
        } a échouée car le nom de domaine de l'adresse mail n'est pas accepté.`;

        return this.sendMessage({
            text: message,
            channel: MattermostChannels.ACCOUNTS,
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

    // bypass pipe architecture for production debugging
    // notify DB connection lost
    async connectionLost(listener) {
        try {
            return await this.sendMessage({
                text: `La connexion au serveur mongoDB a été perdue`,
                username: "Docteur Connector",
                icon_emoji: "firecracker",
                props: { card: `\`\`\`\n${listener}\n\`\`\`` },
            });
        } catch {
            console.error("error sending mattermost log for DB connection lost");
            return false;
        }
    }

    private depositUnfinished(data: NotificationDataTypes[NotificationType.DEPOSIT_UNFINISHED]) {
        const message = `Bonjour Data.Subvention !\n
        Voici la liste du jour des utilisateurs à relancer pour finaliser leur dépôt de données :\n
        ${data.users.reduce((msg, user) => {
            if (user.lastname && user.firstname) return `${msg}- ${user.email} (${user.firstname} ${user.lastname})\n`;
            return `${msg}- ${user.email}\n`;
        }, "")}`;

        return this.sendMessage({
            text: message,
            channel: MattermostChannels.ACCOUNTS,
            username: "Relance de dépôt de données",
            icon_emoji: "bookmark_tabs",
        });
    }

    private externalApiError(data: NotificationDataTypes[NotificationType.EXTERNAL_API_ERROR]) {
        let message = `L'API ${data.details.apiName} rencontre un problème : ${data.message}`;
        if (data.details.pathParams || data.details.queryParams) {
            message = message + "Informations complémentaires :";
            if (data.details.pathParams)
                message = message + `\n Paramètre(s) d'URL utilisé : ${data.details.pathParams.join("-")}`;
            if (data.details.queryParams)
                message =
                    message +
                    `\n Query HTTP utilisée(s) : ${data.details.queryParams.reduce((message, queryObj) => {
                        return message + `\n ${queryObj.name}: ${queryObj.value}`;
                    }, "")}`;
        }
        if (data.details.examples)
            message =
                message +
                `${data.details.examples.reduce((message, example) => message + `${JSON.stringify(example)}`, "")}`;

        return this.sendMessage({
            text: message,
            channel: MattermostChannels.DEV,
            icon_emoji: "firecracker",
        });
    }
}

const mattermostNotifyPipe = new MattermostNotifyPipe();

export default mattermostNotifyPipe;
