import axios from "axios";

export default class SSEConnector {
    constructor(route) {
        this.route = route;
        this.callbackData = () => null;
        this.callbackClose = () => null;
        this.callbackError = () => null;

        const baseUrl = axios.defaults.baseURL;
        this.source = new EventSource(`${baseUrl}${this.route}`, { withCredentials: true });

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

    on(event, callback) {
        switch (event) {
            case "data":
                this.callbackData = callback;
                break;
            case "close":
                this.callbackClose = callback;
                break;
            case "error":
                this.callbackError = callback;
                break;
            default:
                throw new Error(`Event ${event} is not available`);
        }
    }
}
