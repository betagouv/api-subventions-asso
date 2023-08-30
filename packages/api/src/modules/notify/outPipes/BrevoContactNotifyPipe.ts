import * as Sentry from "@sentry/node";
import Brevo from "@getbrevo/brevo";
import { NotificationDataTypes } from "../@types/NotificationDataTypes";
import { NotificationType } from "../@types/NotificationType";
import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import { API_SENDINBLUE_CONTACT_LIST } from "../../../configurations/apis.conf";
import BrevoNotifyPipe from "./BrevoNotifyPipe";

const SENDIND_BLUE_CONTACT_LISTS = [Number(API_SENDINBLUE_CONTACT_LIST)];

export class BrevoContactNotifyPipe extends BrevoNotifyPipe implements NotifyOutPipe {
    accepts = [
        NotificationType.USER_CREATED,
        NotificationType.USER_ACTIVATED,
        NotificationType.USER_LOGGED,
        NotificationType.USER_ALREADY_EXIST,
    ];

    private apiInstance: Brevo.ContactsApi;

    constructor() {
        super();
        this.apiInstance = new Brevo.ContactsApi();
    }

    notify(type, data) {
        switch (type) {
            case NotificationType.USER_CREATED:
                return this.userCreated(data);
            case NotificationType.USER_ALREADY_EXIST:
                return this.userCreated(data); // If user exist in datasub database so we create in brevo
            case NotificationType.USER_ACTIVATED:
                return this.userActivated(data);
            case NotificationType.USER_LOGGED:
                return this.userLogged(data);
            default:
                return Promise.resolve(false);
        }
    }

    private userCreated(data: NotificationDataTypes[NotificationType.USER_CREATED]) {
        const payload = {
            attributes: {
                DATE_INSCRIPTION: data.signupAt,
                COMPTE_ACTIVE: data.active,
                SOURCE_IMPORT: "Data.Subvention",
                LIEN_ACTIVATION: data.url,
                PRENOM: data.firstname,
                NOM: data.lastname,
            },
            listIds: SENDIND_BLUE_CONTACT_LISTS,
        };

        const sendCreation = () => {
            return this.apiInstance.createContact({
                email: data.email,
                ...payload,
            });
        };

        const sendUpdate = () => this.apiInstance.updateContact(data.email, payload);

        return sendCreation()
            .then(({ body }) => {
                if (body?.id) return true;
                return false;
            })
            .catch(({ response, body: wrongBody }) => {
                // The true body is contained in response.body, body of error is wrong
                if (response.body.code === "duplicate_parameter") {
                    // It's error code for { code: 'duplicate_parameter', message: 'Contact already exist' }
                    // If user exists in other list brevo throws an error so we update contact to add in good list
                    return sendUpdate()
                        .then(({ response }) => {
                            const status = response.statusCode || 0;
                            if (status > 200 && status < 300) return true;
                            // Theoretically, this should never happen because mistakes should happen in "catch", but the lib seems to be behaving completely madly!
                            Sentry.captureException({ response });
                            return false;
                        })
                        .catch(e => {
                            Sentry.captureException(e);
                            return false;
                        });
                }

                Sentry.captureException({ response, body: wrongBody }); // Don't send to sentry if error is already caught
                return false;
            });
    }

    private userActivated(data: NotificationDataTypes[NotificationType.USER_ACTIVATED]) {
        const updateContact = new Brevo.UpdateContact();
        updateContact.attributes = { COMPTE_ACTIVE: true };
        updateContact.listIds = SENDIND_BLUE_CONTACT_LISTS;
        return this.apiInstance
            .updateContact(data.email, updateContact)
            .then(() => true)
            .catch(error => {
                Sentry.captureException(error);
                return false;
            });
    }

    private userLogged(data: NotificationDataTypes[NotificationType.USER_LOGGED]) {
        const updateContact = new Brevo.UpdateContact();
        updateContact.attributes = { DERNIERE_CONNEXION: data.date };
        updateContact.listIds = SENDIND_BLUE_CONTACT_LISTS;
        return this.apiInstance
            .updateContact(data.email, updateContact)
            .then(() => true)
            .catch(error => {
                Sentry.captureException(error);
                return false;
            });
    }
}

const brevoContactNotifyPipe = new BrevoContactNotifyPipe();

export default brevoContactNotifyPipe;
