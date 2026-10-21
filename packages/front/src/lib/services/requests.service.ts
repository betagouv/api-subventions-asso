import axios, { type AxiosRequestConfig, type RawAxiosRequestHeaders } from "axios";
import errorsService from "../errors/errors.service";
import { PUBLIC_DATASUB_URL } from "$env/static/public";

class RequestsService {
    _errorHooks: { ErrorClass: Error; callback: () => unknown }[] = [];

    constructor() {
        axios.defaults.baseURL = PUBLIC_DATASUB_URL;

        axios.interceptors.response.use(
            response => response,
            error => this._errorCatcher(error),
        );
    }

    get(path, params, requestOption) {
        return this._sendRequest("get", path, params, undefined, requestOption);
    }

    post(path, data, requestOption) {
        return this._sendRequest("post", path, undefined, data, requestOption);
    }

    patch(path, data, requestOption) {
        return this._sendRequest("patch", path, undefined, data, requestOption);
    }

    delete(path, params, requestOption) {
        return this._sendRequest("delete", path, params, undefined, requestOption);
    }

    addErrorHook(ErrorClass, callback) {
        this._errorHooks.push({
            ErrorClass,
            callback,
        });
    }

    _sendRequest(type, path, params, data, requestOption: AxiosRequestConfig = {}) {
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

    _errorCatcher(error) {
        // @ts-expect-error: better type this
        const ErrorClass = errorsService.axiosErrorToError(error) as Error;

        const hooks = this._errorHooks.filter(hook => (hook.ErrorClass as Error) === ErrorClass);

        // @ts-expect-error: better type this
        const typedError: Error = new ErrorClass(
            {
                message: error?.response?.data.message || error.message,
            },
            error,
        );

        if (hooks.length) {
            hooks.forEach(hook => {
                // @ts-expect-error: better type this
                hook.callback(typedError as Error);
            });
        }
        throw typedError;
    }
}

const requestsService = new RequestsService();

export default requestsService;
