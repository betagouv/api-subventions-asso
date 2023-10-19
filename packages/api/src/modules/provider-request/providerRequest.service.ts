import axios, { AxiosError } from "axios";
import ProviderRequestLog from "./entities/ProviderRequestLog";
import providerRequestRepository from "./repositories/providerRequest.repository";
import RequestConfig from "./@types/RequestConfig";
import { RequestResponse } from "./@types/RequestResponse";
import RequestConfigAdapter from "./adapters/RequestConfigAdapter";
import RequestResponseAdapter from "./adapters/RequestResponseAdapter";

class ProviderRequestService {
    get<T = any>(url: string, option: RequestConfig) {
        return this._sendRequest<T>("GET", url, option);
    }

    post<T = any>(url: string, option: RequestConfig) {
        return this._sendRequest<T>("POST", url, option);
    }

    _sendRequest<T>(type: "GET" | "POST", url: string, option: RequestConfig): Promise<RequestResponse<T>> {
        const date = new Date();

        const axiosOption = RequestConfigAdapter.toAxiosRequestConfig(option);

        return axios
            .request<T>({
                method: type,
                url,
                ...axiosOption,
            })
            .then(async response => {
                await this.createLog(option.providerName, url, date, response.status, type);
                return RequestResponseAdapter.toRequestReponse(response);
            })
            .catch(async (error: AxiosError) => {
                if (error.status) await this.createLog(option.providerName, url, date, error.status, type);
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
