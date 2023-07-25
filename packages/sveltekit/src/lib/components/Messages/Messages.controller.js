import Store from "$lib/core/Store";
import messagesService from "$lib/resources/messages/messages.service";

export default class MessagesController {
    constructor() {
        this.messages = new Store([]);

        messagesService.messages.subscribe(messages => this._updateMessages(messages));
    }

    _updateMessages(messages) {
        this.messages.set(messages.filter(message => this._isVisibleMessage(message)));
    }

    _isVisibleMessage(message) {
        return message.endDate.getTime() > Date.now() && Date.now() >= message.startDate.getTime();
    }
}
