import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import {LoginDtoResponse} from "@api-subventions-asso/dto"
import { DATASUB_URL } from "./config";
import AssociationDtoResponse from "@api-subventions-asso/dto/search/AssociationDtoResponse";
import EtablissementDtoResponse from "@api-subventions-asso/dto/search/EtablissementDtoResponse";
import User from "../@types/User";

export class APIDatasubService {
    login(email: string, password: string) {
        return this.sendRequest<LoginDtoResponse>("POST", "/auth/login", undefined, {
            email,
            password
        })
    }

    resetPassword(token: string, password: string) {
        return this.sendRequest<{success: boolean}>("POST", "/auth/reset-password", undefined, {
            token,
            password
        })
    }

    searchAssoByRna(rna: string, user: User) {
        return this.sendRequest<AssociationDtoResponse>("GET", `/search/association/${rna}`, user);
    }

    searchAssoBySiren(siren: string, user: User) {
        return this.sendRequest<AssociationDtoResponse>("GET", `/search/association/${siren}`, user);
    }

    searchEtablissement(siret: string, user: User) {
        return this.sendRequest<EtablissementDtoResponse>("GET", `/search/etablissement/${siret}`, user);
    }

    private getHeaders(user?: User): AxiosRequestConfig {
        if (!user || !user.token) return {};
        return {
            headers: {
                "x-access-token": user.token as string
            }
        }
    }

    private async sendRequest<T>(method: "POST" | "GET" | "PUT" | "DELETE", uri: string, user?: User, body?: unknown) {
        let response: AxiosResponse<T, any>
        const url = `${DATASUB_URL}${uri}`;
        try {
            switch (method) {
                case "POST":
                    response = await axios.post<T>(url, body || {}, this.getHeaders(user));
                    break;
                case "PUT":
                    response = await axios.put<T>(url,  body || {}, this.getHeaders(user));
                    break;
                case "DELETE":
                    response = await axios.delete<T>(url, this.getHeaders(user));
                    break;
                case "GET":
                default:
                    response = await axios.get<T>(url, this.getHeaders(user));
                    break;
            }
        } catch(e) {
            return Promise.reject(e);
        }
        
        if (response.status !== 200) {
            return Promise.reject(response);
        }

        return Promise.resolve(response);
    }
}

const apiDatasubService = new APIDatasubService();

export default apiDatasubService;