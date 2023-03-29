import axios from "axios";
import { DATASUB_URL } from "../../src/shared/config";
import errorsService from "../errors/errors.service";

class RequestsService {
    _errorHooks = [];

    constructor() {
        axios.defaults.baseURL = DATASUB_URL;
    }

    get(path, params) {
        return this._sendRequest("get", path, params);
    }

    post(path, data) {
        return this._sendRequest("post", path, undefined, data);
    }

    delete(path, params) {
        return this._sendRequest("delete", path, params);
    }

    initAuthentification(apiToken) {
        axios.defaults.headers.common["x-access-token"] = apiToken;
    }

    addErrorHook(ErrorClass, callback) {
        this._errorHooks.push({
            ErrorClass,
            callback
        });
    }

    _sendRequest(type, path, params, data) {
        return axios
            .request({
                url: path,
                method: type,
                data,
                params
            })
            .catch(error => {
                const ErrorClass = errorsService.axiosErrorToError(error);

                const hooks = this._errorHooks.filter(hook => hook.ErrorClass === ErrorClass);
                const typedError = new ErrorClass({
                    message: error.response.data.message,
                    code: error.response.data.code,
                    __nativeError__: error
                });

                if (hooks.length) {
                    hooks.forEach(hook => {
                        hook.callback(typedError);
                    });
                }

                throw typedError;
            });
    }
}

const requestsService = new RequestsService();

export default requestsService;
