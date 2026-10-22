import axios, { type RawAxiosRequestHeaders } from "axios";
import { PUBLIC_DATASUB_URL } from "$env/static/public";
import errorsService from "$lib/errors/errors.service";

class RequestsService {
    _errorHooks: { ErrorClass: Error; callback: () => unknown }[] = [];

    constructor() {
        axios.defaults.baseURL = PUBLIC_DATASUB_URL;

        axios.interceptors.response.use(
            response => response,
            error => errorsService.axiosErrorToError(error),
        );
    }

    get(path, params?: Record<string, unknown>, requestOption?: Record<string, unknown>) {
        return this._sendRequest("get", path, params, undefined, requestOption);
    }

    post(path, data, requestOption?: Record<string, unknown>) {
        return this._sendRequest("post", path, undefined, data, requestOption);
    }

    patch(path, data, requestOption?: Record<string, unknown>) {
        return this._sendRequest("patch", path, undefined, data, requestOption);
    }

    delete(path, params?: Record<string, unknown>, requestOption?: Record<string, unknown>) {
        return this._sendRequest("delete", path, params, undefined, requestOption);
    }

    _sendRequest(type, path, params, data, requestOption: Record<string, unknown> = {}) {
        const axiosOption: Record<string, unknown> = { ...requestOption };

        const isFormData = data instanceof FormData;

        let headers: RawAxiosRequestHeaders = {
            ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
            ...(requestOption.headers as RawAxiosRequestHeaders | undefined),
        };

        if (axiosOption.headers) {
            headers = { ...headers, ...axiosOption.headers };
        }

        return axios.request({
            withCredentials: true,
            url: path,
            method: type,
            data,
            params,
            headers,
            ...axiosOption,
        });
    }
}

const requestsService = new RequestsService();

export default requestsService;
