import { ContactsApi, ContactsApiApiKeys, UpdateContact } from "@sendinblue/client";
import { NotificationDataTypes } from "../@types/NotificationDataTypes";
import { NotificationType } from "../@types/NotificationType";
import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import { API_SENDINBLUE_CONTACT_LIST, API_SENDINBLUE_TOKEN } from "../../../configurations/apis.conf";

const SENDIND_BLUE_CONTACT_LISTS = [Number(API_SENDINBLUE_CONTACT_LIST)];

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
            case NotificationType.USER_ACTIVATED:
                return this.userActivated(data);
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

    private userActivated(data: NotificationDataTypes[NotificationType.USER_ACTIVATED]) {
        const updateContact = new UpdateContact();
        updateContact.attributes = { COMPTE_ACTIVE: true };
        updateContact.listIds = SENDIND_BLUE_CONTACT_LISTS;
        return this.apiInstance.updateContact(data.email, updateContact).then(({ body }) => {
            if (body.id) return true;
            return false;
        });
    }
}

const brevoContactNotifyPipe = new BrevoContactNotifyPipe();

export default brevoContactNotifyPipe;
