import * as https from "https";
import * as http from "http";
import { AxiosRequestConfig } from "axios";
import RequestConfig from "../@types/RequestConfig";

export default class RequestConfigMapper {
    static toAxiosRequestConfig(config: RequestConfig): AxiosRequestConfig {
        return {
            headers: config.headers,
            responseType: config.responseType,
            data: config.data,
            ...(config.keepAlive
                ? {
                      httpAgent: new http.Agent({ keepAlive: true }),
                      httpsAgent: new https.Agent({ keepAlive: true }),
                  }
                : {}),
        };
    }
}
