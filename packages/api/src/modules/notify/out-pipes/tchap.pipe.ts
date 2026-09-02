import type { MatrixClient } from "matrix-bot-sdk";
import { NotificationDataTypes } from "../@types/NotificationDataTypes";
import { NotificationType } from "../@types/NotificationType";
import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import { ENV } from "../../../configurations/env.conf";
import { FutureUser } from "../../../domain/users/@types/FutureUser";

enum TchapRooms {
    ACCOUNTS = "accounts",
    PRODUCT = "product",
    DEV = "dev",
}

export class TchapPipe implements NotifyOutPipe {
    private client?: MatrixClient;
    private clientConfiguration?: { homeserverUrl: string; accessToken: string };

    notify(type, data) {
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
            case NotificationType.DATA_IMPORT_FAILURE:
                return this.dataImportFailure(data);
            case NotificationType.DEPOSIT_SCDL_SUCCESS:
                return this.depositScdlSuccess(data);
            case NotificationType.EXTERNAL_API_ERROR:
                return this.externalApiError(data);
            case NotificationType.MONGO_CONNECTION_LOST:
                return this.connectionLost(data);
            default:
                return Promise.resolve(false);
        }
    }

    private async sendMessage(room: TchapRooms, title: string, emoji: string, message: string) {
        const homeserverUrl = process.env.TCHAP_HOMESERVER_URL ?? "";
        const accessToken = process.env.TCHAP_ACCESS_TOKEN ?? "";
        const roomId = this.getRoomId(room);

        if (!homeserverUrl || !accessToken || !roomId) {
            console.warn("Missing Tchap environment configuration");
            return false;
        }

        try {
            const htmlText = `[${ENV}] ${emoji} <strong>${title}</strong><br><br>${message}`;
            const client = await this.getClient(homeserverUrl, accessToken);
            await client.sendHtmlText(roomId, htmlText);
            return true;
        } catch {
            console.error("error sending tchap notification");
            return false;
        }
    }

    private getRoomId(room: TchapRooms) {
        switch (room) {
            case TchapRooms.ACCOUNTS:
                return process.env.TCHAP_ROOM_ID_ACCOUNTS ?? "";
            case TchapRooms.PRODUCT:
                return process.env.TCHAP_ROOM_ID_PRODUCT ?? "";
            case TchapRooms.DEV:
                return process.env.TCHAP_ROOM_ID_DEV ?? "";
        }
    }

    private async getClient(homeserverUrl: string, accessToken: string): Promise<MatrixClient> {
        const shouldCreateClient =
            !this.client ||
            this.clientConfiguration?.homeserverUrl !== homeserverUrl ||
            this.clientConfiguration?.accessToken !== accessToken;

        if (shouldCreateClient) {
            const { MatrixClient } = await import("matrix-bot-sdk");
            const client = new MatrixClient(homeserverUrl, accessToken);
            this.client = client;
            this.clientConfiguration = { homeserverUrl, accessToken };
            return client;
        }

        return this.client as MatrixClient;
    }

    private formatValueWithPercent(value: number, total: number): string {
        if (total === 0) return `${value}`;
        const percent = ((value / total) * 100).toFixed(2);
        return `${value} (${percent}%)`;
    }

    private dataImportSuccess(data: NotificationDataTypes[NotificationType.DATA_IMPORT_SUCCESS]) {
        const { fileName, fileCount, durationMs, parsedCount, importedCount, errorCount, exerciseYear } = data.details;
        const fileLabel =
            fileCount !== undefined && fileCount > 1
                ? `<strong>Batch</strong> : <code>${fileName}</code> (${fileCount} fichiers)`
                : `<strong>Fichier</strong> : <code>${fileName}</code>`;

        const details = [
            fileLabel,
            `<strong>Durée</strong> : ${Math.round(durationMs / 1000)}s`,
            ...(exerciseYear !== undefined ? [`<strong>Année</strong> : ${exerciseYear}`] : []),
            "<strong>Counts</strong>",
            `<ul><li>Lignes parsées : ${parsedCount}</li><li>Données importées : ${this.formatValueWithPercent(
                importedCount,
                parsedCount,
            )}</li><li>Erreurs : ${this.formatValueWithPercent(errorCount, parsedCount)}</li></ul>`,
        ];

        const message = `Import de données réussi pour le fournisseur <strong>${data.providerName}</strong>${
            data.providerSiret ? ` (SIRET : <code>${data.providerSiret}</code>)` : ""
        }${
            data.exportDate
                ? ` avec une date d'export au <strong>${data.exportDate.toISOString().split("T")[0]}</strong>`
                : ""
        }.<br><br>${details.join("<br>")}`;

        return this.sendMessage(TchapRooms.PRODUCT, "Import de données réussi", "✅", message);
    }

    private dataImportFailure(data: NotificationDataTypes[NotificationType.DATA_IMPORT_FAILURE]) {
        const details = data.details;
        const lines: string[] = [
            `<strong>Fichier</strong> : <code>${details.fileName}</code>`,
            ...(details.exerciseYear !== undefined ? [`<strong>Année</strong> : ${details.exerciseYear}`] : []),
            `<strong>Durée</strong> : ${Math.round(details.durationMs / 1000)}s`,
            ...(details.fileCount !== undefined ? [`<strong>Fichiers traités</strong> : ${details.fileCount}`] : []),
        ];

        if (details.parsedCount !== undefined) {
            lines.push("<strong>Counts partiels</strong>");
            lines.push(
                `<ul><li>Lignes parsées : ${details.parsedCount}</li><li>Données importées : ${details.importedCount}</li><li>Erreurs : ${details.errorCount}</li></ul>`,
            );
        }

        const suffix = lines.length ? `<br>${lines.join("<br>")}` : "";
        const message = `Échec d'import pour le fournisseur <strong>${data.providerName}</strong>${
            data.exportDate ? ` (export du <strong>${data.exportDate.toISOString().split("T")[0]}</strong>)` : ""
        }.<br><strong>Erreur</strong> : ${data.error}${suffix}`;

        return this.sendMessage(TchapRooms.PRODUCT, "Import de données échoué", "❌", message);
    }

    private depositScdlSuccess(data: NotificationDataTypes[NotificationType.DEPOSIT_SCDL_SUCCESS]) {
        const message = `Nouveau dépôt SCDL réalisé pour le fournisseur <strong>${data.providerName}</strong>${
            data.providerSiret ? ` (SIRET : <code>${data.providerSiret}</code>)` : ""
        } pour ${data.grantCoverageYears.length === 1 ? "l'exercice" : "les exercices"} ${data.grantCoverageYears.join(
            ", ",
        )}.<br>${data.parsedLines} ${
            data.parsedLines === 1 ? "donnée de subvention a été déposée" : "données de subventions ont été déposées"
        }.`;
        return this.sendMessage(TchapRooms.PRODUCT, "Dépôt de données SCDL", "✅", message);
    }

    private userDeleted(data: NotificationDataTypes[NotificationType.USER_DELETED]) {
        const message = data.selfDeleted
            ? `${data.firstname || ""} ${data.lastname || ""} (${
                  data.email
              }) a supprimé son compte, veuillez supprimer toutes ses données !`
            : `Le compte de ${data.firstname || ""} ${data.lastname || ""} (${
                  data.email
              }) a été supprimé par un administrateur. N'oubliez pas de supprimer toutes ses données !`;

        return this.sendMessage(TchapRooms.ACCOUNTS, "Suppression de compte", "🚪", message);
    }

    private batchUsersDeleted(data: NotificationDataTypes[NotificationType.BATCH_USERS_DELETED]) {
        const emailsMdList = data.users.reduce(
            (mdList: string, miniUser) =>
                `${mdList}<li>${miniUser.firstname || ""} ${miniUser.lastname || ""} (${miniUser.email})</li>`,
            "",
        );
        const message = `Les comptes suivants ont été supprimés pour inactivité trop longue.<br><ul>${emailsMdList}</ul><br>N'oubliez pas de supprimer toutes leurs données !`;

        return this.sendMessage(TchapRooms.ACCOUNTS, "Suppression de comptes", "🚪", message);
    }

    private badEmailDomain(data: FutureUser) {
        const message = `L'inscription de l'utilisateur ${
            data.email || ""
        } a échouée car le nom de domaine de l'adresse mail n'est pas accepté.`;

        return this.sendMessage(TchapRooms.ACCOUNTS, "Nom de domaine rejeté", "⛔", message);
    }

    private failedCron({ cronName, error }) {
        const stack = new Error(error).stack ?? String(error);
        const message = `Le cron <code>${cronName}</code> a échoué<br><br>${this.formatCodeBlock(stack)}`;

        return this.sendMessage(TchapRooms.DEV, "Police du Cron", "⏰", message);
    }

    private connectionLost({ eventName }) {
        const message = `La connexion au serveur mongoDB a été perdue<br><br>${this.formatCodeBlock(eventName)}`;

        return this.sendMessage(TchapRooms.DEV, "Docteur Connector", "🧨", message);
    }

    private depositUnfinished(data: NotificationDataTypes[NotificationType.DEPOSIT_UNFINISHED]) {
        const usersMdList = data.users.reduce((msg, user) => {
            if (user.lastname && user.firstname)
                return `${msg}<li>${user.email} (${user.firstname} ${user.lastname})</li>`;
            return `${msg}<li>${user.email}</li>`;
        }, "");
        const message = `Bonjour Data.Subvention !<br><br>Voici la liste du jour des utilisateurs à relancer pour finaliser leur dépôt de données :<br><ul>${usersMdList}</ul>`;

        return this.sendMessage(TchapRooms.ACCOUNTS, "Relance de dépôt de données", "📑", message);
    }

    private formatCodeBlock(value: string) {
        return `<pre><code>${value}</code></pre>`;
    }

    private externalApiError(data: NotificationDataTypes[NotificationType.EXTERNAL_API_ERROR]) {
        const details: string[] = [];
        if (data.details.pathParams) {
            details.push(`<strong>Paramètre(s) d'URL utilisé</strong> : ${data.details.pathParams.join("-")}`);
        }
        if (data.details.queryParams) {
            details.push(
                `<strong>Query HTTP utilisée(s)</strong> :<br>${data.details.queryParams
                    .map(queryObj => `${queryObj.name}: ${queryObj.value}`)
                    .join("<br>")}`,
            );
        }
        if (data.details.examples) {
            details.push(
                this.formatCodeBlock(data.details.examples.map(example => JSON.stringify(example)).join("\n")),
            );
        }

        const message = `L'API <strong>${data.details.apiName}</strong> rencontre un problème : ${
            data.message
        }${details.length ? `<br><br><strong>Informations complémentaires</strong> :<br>${details.join("<br>")}` : ""}`;

        return this.sendMessage(TchapRooms.DEV, "Erreur API externe", "🧨", message);
    }
}

const tchapNotifyPipe = new TchapPipe();

export default tchapNotifyPipe;
