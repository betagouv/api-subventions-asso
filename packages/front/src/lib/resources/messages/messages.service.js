import Store from "../../core/Store";

export class MessagesService {
    constructor() {
        this.messages = new Store([]);

        this._addDefaultMessages();
    }

    _addDefaultMessages() {
        this.messages.update(messages =>
            messages.concat({
                title: "Certaines informations de votre profil sont manquantes. N’oubliez pas de compléter vos informations ici.",
            }),
        );
    }
}

const messagesService = new MessagesService();

export default messagesService;
