import { ContactsApi, ContactsApiApiKeys } from "@sendinblue/client";
import { NotificationDataTypes } from "../@types/NotificationDataTypes";
import { NotificationType } from "../@types/NotificationType";
import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import { API_SENDINBLUE_CONTACT_LIST, API_SENDINBLUE_TOKEN } from "../../../configurations/apis.conf";

export class BrevoContactNotifyPipe implements NotifyOutPipe {
    accepts = [NotificationType.USER_CREATED];

    private apiInstance: ContactsApi;

    constructor() {
        this.apiInstance = new ContactsApi();
        this.apiInstance.setApiKey(ContactsApiApiKeys.apiKey, API_SENDINBLUE_TOKEN as string);
    }

    notify(type, data) {
        switch (type) {
            case NotificationType.USER_CREATED:
                return this.userCreated(data);
            default:
                return Promise.resolve(false);
        }
    }

    private userCreated(data: NotificationDataTypes[NotificationType.USER_CREATED]) {
        return this.apiInstance
            .createContact({
                email: data.email,
                attributes: {
                    DATE_INSCRIPTION: data.signupAt,
                    COMPTE_ACTIVE: data.active,
                    SOURCE_IMPORT: "Data.Subvention",
                    LIEN_ACTIVATION: data.token,
                },
                listIds: [Number(API_SENDINBLUE_CONTACT_LIST)],
            })
            .then(({ body }) => {
                if (body.id) return true;
                return false;
            });
    }
}

const brevoContactNotifyPipe = new BrevoContactNotifyPipe();

export default brevoContactNotifyPipe;
