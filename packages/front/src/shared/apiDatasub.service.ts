import axios from "axios"
import {LoginDtoResponse} from "@api-subventions-asso/dto"
import { DATASUB_URL } from "./config";
import { Request } from "express";
import { DefaultObject } from "../@types/utils";
import AssociationDtoResponse from "@api-subventions-asso/dto/search/AssociationDtoResponse";

export class APIDatasubService {
    login(email: string, password: string) {
        return axios.post<LoginDtoResponse>(`${DATASUB_URL}/auth/login`, {
            email,
            password
        })
    }

    searchAssoByRna(rna: string, req: Request) {
        return axios.get<AssociationDtoResponse>(`${DATASUB_URL}/search/association/${rna}`, {
            headers: this.getHeaders(req)
        });
    }

    private getHeaders(req: Request): DefaultObject<string> {
        const sessionData = req.session as unknown as DefaultObject<DefaultObject>;
        return {
            "x-access-token": sessionData.user.token as string
        }
    }
}

const apiDatasubService = new APIDatasubService();

export default apiDatasubService;