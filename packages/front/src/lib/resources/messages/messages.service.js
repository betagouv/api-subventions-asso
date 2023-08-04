import Store from "../../core/Store";

export class MessagesService {
    constructor() {
        this.messages = new Store([]);

        this._addDefaultMessages();
    }

    _addDefaultMessages() {
        this.messages.update(messages =>
            messages.concat({
                title: "Les assises de la simplification associative",
                description:
                    "Decouvrez toutes les étapes des Assises de la simplification associative : consultation en ligne des associations, ateliers assos-administrations, assises nationales et nouvelle feuille de route interministérielle !",
                href: "https://www.associations.gouv.fr/les-assises-de-la-simplification-associative-la-consultation-est-lancee.html",
                endDate: new Date(2023, 0, 16),
                startDate: new Date(2022, 11, 29),
            }),
        );
    }
}

const messagesService = new MessagesService();

export default messagesService;
