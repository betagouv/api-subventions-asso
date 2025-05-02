import { AxiosResponse } from "axios";
import { RequestResponse } from "../@types/RequestResponse";

export default class RequestResponseAdapter {
    // used to keep the code unbound to axios
    static toRequestReponse<T>(response: AxiosResponse<T>): RequestResponse<T> {
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }
}
