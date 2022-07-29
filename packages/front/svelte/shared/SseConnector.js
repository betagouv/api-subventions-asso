import axios from "axios";

export default class SSEConnector {
    constructor(route) {
        this.route = route;
        this.callbackData = () => null;
        this.callbackClose = () => null;
        this.callbackError = () => null;

        const token = axios.defaults.headers.common["x-access-token"];
        this.source = new EventSource(`${axios.defaults.baseURL}${this.route}?token=${token}`);

        this.source.addEventListener("message", ev => {
            const data = JSON.parse(ev.data);

            if (data?.event === "close") {
                this.source.close();
                this.callbackClose(data);
                return;
            }

            this.callbackData(data);
        });

        this.source.addEventListener("error", ev => this.callbackError(ev));
    }

    onData(callback) {
        this.callbackData = callback;
    }

    onClose(callback) {
        this.callbackClose = callback;
    }

    onError(callback) {
        this.callbackError = callback;
    }
}
