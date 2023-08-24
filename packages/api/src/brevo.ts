import Brevo from "@getbrevo/brevo";
import { API_SENDINBLUE_TOKEN } from "./configurations/apis.conf";

export default function initBrevo() {
    const defaultClient = Brevo.ApiClient.instance;

    // Configure API key authorization: api-key
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = API_SENDINBLUE_TOKEN;
}
