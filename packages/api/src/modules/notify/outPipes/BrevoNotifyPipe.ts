import Brevo from "@getbrevo/brevo";
import { API_SENDINBLUE_TOKEN } from "../../../configurations/apis.conf";

export default class BrevoNotifyPipe {
    client: Brevo.ApiClient;

    constructor() {
        this.client = Brevo.ApiClient.instance;
        this.initBrevo();
    }

    initBrevo() {
        if (this.isTokenSet()) return;

        // Configure API key authorization: api-key
        const apiKey = this.client.authentications["api-key"];
        console.log(API_SENDINBLUE_TOKEN);
        apiKey.apiKey = API_SENDINBLUE_TOKEN;
    }

    isTokenSet() {
        return !!this.client.authentications["api-key"].apiKey;
    }
}
