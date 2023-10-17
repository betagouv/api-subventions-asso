import axios, { AxiosError } from "axios";
import ProviderRequestLog from "./entities/ProviderRequestLog";
import providerRequestRepository from "./repositories/providerRequest.repository";

class ProviderRequestService {
    get(url: string, params: Record<string, string>, headers: Record<string, string>, providerName: string) {
        return this._sendRequest("GET", url, headers, params, undefined, providerName);
    }

    post(
        url: string,
        params: Record<string, string>,
        headers: Record<string, string>,
        body: unknown,
        providerName: string,
    ) {
        return this._sendRequest("POST", url, headers, params, body, providerName);
    }

    _sendRequest(
        type: "GET" | "POST",
        url: string,
        headers: Record<string, string>,
        params: Record<string, string>,
        body: unknown,
        providerName: string,
    ) {
        const date = new Date();
        return axios
            .request({
                method: type,
                url,
                data: body,
                headers,
                params,
            })
            .then(async response => {
                await this.createLog(providerName, url, date, response.status, type);
                return response;
            })
            .catch(async (error: AxiosError) => {
                if (error.status) await this.createLog(providerName, url, date, error.status, type);
                throw error;
            });
    }

    async createLog(providerName: string, route: string, date: Date, responseCode: number, type: "GET" | "POST") {
        const log = new ProviderRequestLog(providerName, route, date, responseCode, type);

        await providerRequestRepository.create(log);
    }
}

const providerRequestService = new ProviderRequestService();

export default providerRequestService;
