import path from "path";
import * as fs from "fs";
import axios, { AxiosError } from "axios";
import * as unzipper from "unzipper";
import { logger } from "express-winston";
import ProviderRequestLog from "./entities/ProviderRequestLog";
import providerRequestRepository from "./repositories/providerRequest.repository";
import RequestConfig from "./@types/RequestConfig";
import { RequestResponse } from "./@types/RequestResponse";
import RequestConfigAdapter from "./adapters/RequestConfigAdapter";
import RequestResponseAdapter from "./adapters/RequestResponseAdapter";

export class ProviderRequestService {
    constructor(private providerId: string) {}

    get<T = any>(url: string, option?: RequestConfig) {
        return this.sendRequest<T>("GET", url, option);
    }

    post<T = any, D = unknown>(url: string, data?: D, option?: RequestConfig) {
        if (data) {
            option = {
                ...option,
                data,
            };
        }
        return this.sendRequest<T>("POST", url, option);
    }

    private sendRequest<T>(type: "GET" | "POST", url: string, option?: RequestConfig): Promise<RequestResponse<T>> {
        const date = new Date();

        const axiosOption = option ? RequestConfigAdapter.toAxiosRequestConfig(option) : {};

        return axios
            .request<T>({
                method: type,
                url,
                ...axiosOption,
            })
            .then(async response => {
                console.log(response);
                await this.createLog(url, date, response.status, type);
                return RequestResponseAdapter.toRequestReponse(response);
            })
            .catch(async (error: AxiosError) => {
                console.log(error);
                if (error.status) await this.createLog(url, date, error.status, type);
                throw error;
            });
    }

    private async createLog(route: string, date: Date, responseCode: number, type: "GET" | "POST") {
        const log = new ProviderRequestLog(this.providerId, route, date, responseCode, type);

        await providerRequestRepository.create(log);
    }

    async downloadAndExtractZip(url: string, extractTo: string) {
        const destination = fs.mkdtempSync(path.join(__dirname, "/csvTemp"));

        const zipPath = path.join(destination, "sirene.zip");

        console.log("Downloading sirene zip file");
        console.log(url);
        await this.get(url, {
            responseType: "stream",
        }).then(result => {
            console.log(url);
            //   console.log(result.data);
            console.log("Downloaded sirene zip file");

            const file = fs.createWriteStream(zipPath);

            result.data.pipe(file);

            console.log("après interval");

            file.on("finish", () => {
                console.log("finish");
                file.close();
            });
            file.on("error", err => {
                console.error(err);
            });
        });

        /*
        result.data.pipe(unzipper.Parse())
        .on('entry', (entry) => {
            const filePath = path.join(extractTo, entry.path);
            console.log('on entry')
            fs.mkdirSync(path.dirname(filePath), {recursive: true});
            if (entry.type === 'File') {
                entry.pipe(fs.createWriteStream(filePath));
                console.log('File extracted:', filePath);
            }
            else {
                console.log('not file')
                console.log(filePath)
            }
        })
        .on('close', () => {
            console.log('Extraction complete');
        })
        .on('error', (err) => {
            console.error(err);
        }); 
        */
    }
}

export default function ProviderRequestFactory(providerId: string) {
    return new ProviderRequestService(providerId);
}
