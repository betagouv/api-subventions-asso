import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { LoginDtoResponse, ResetPasswordDtoResponse, SignupDtoResponse } from "@api-subventions-asso/dto";
import { DATASUB_URL } from "./config";
import AssociationDtoResponse from "@api-subventions-asso/dto/search/AssociationDtoResponse";
import EtablissementDtoResponse from "@api-subventions-asso/dto/search/EtablissementDtoResponse";
import UserDto, { UserWithJWTDto } from "@api-subventions-asso/dto/user/UserDto";

export class APIDatasubService {
    login(email: string, password: string) {
        return this.sendRequest<LoginDtoResponse>("POST", "/auth/login", undefined, {
            email,
            password
        });
    }

    signup(email: string) {
        return this.sendRequest<SignupDtoResponse>("POST", "/auth/signup", undefined, {
            email
        });
    }

    getRoles(user: UserWithJWTDto) {
        return this.sendRequest<{ success: boolean; roles: string[] }>("GET", "/user/roles", user);
    }

    listUser(user: UserWithJWTDto) {
        return this.sendRequest<{ success: boolean; users: UserDto[] }>("GET", "/user/admin/list-users", user);
    }

    createUser(userEmail: string, adminUser: UserWithJWTDto) {
        return this.sendRequest<{ success: boolean }>("POST", "/user/admin/create-user", adminUser, {
            email: userEmail
        });
    }

    resetPassword(token: string, password: string) {
        return this.sendRequest<ResetPasswordDtoResponse>("POST", "/auth/reset-password", undefined, {
            token,
            password
        });
    }

    forgetPassword(email: string) {
        return this.sendRequest<{ success: boolean }>("POST", "/auth/forget-password", undefined, {
            email
        });
    }

    searchAssoByRna(rna: string, user: UserWithJWTDto) {
        return this.sendRequest<AssociationDtoResponse>("GET", `/search/association/${rna}`, user);
    }

    searchAssoBySiren(siren: string, user: UserWithJWTDto) {
        return this.sendRequest<AssociationDtoResponse>("GET", `/search/association/${siren}`, user);
    }

    searchEtablissement(siret: string, user: UserWithJWTDto) {
        return this.sendRequest<EtablissementDtoResponse>("GET", `/search/etablissement/${siret}`, user);
    }

    private getHeaders(user?: UserWithJWTDto): AxiosRequestConfig {
        if (!user || !user.jwt || !user.jwt.token) return {};
        return {
            headers: {
                "x-access-token": user.jwt.token as string
            }
        };
    }

    private async sendRequest<T>(method: "POST" | "GET" | "PUT" | "DELETE", uri: string, user?: UserWithJWTDto, body?: unknown) {
        let response: AxiosResponse<T, any>;
        const url = `${DATASUB_URL}${uri}`;
        try {
            switch (method) {
                case "POST":
                    response = await axios.post<T>(url, body || {}, this.getHeaders(user));
                    break;
                case "PUT":
                    response = await axios.put<T>(url, body || {}, this.getHeaders(user));
                    break;
                case "DELETE":
                    response = await axios.delete<T>(url, this.getHeaders(user));
                    break;
                case "GET":
                default:
                    response = await axios.get<T>(url, this.getHeaders(user));
                    break;
            }
        } catch (e) {
            return Promise.reject(e);
        }

        return Promise.resolve(response);
    }
}

const apiDatasubService = new APIDatasubService();

export default apiDatasubService;
