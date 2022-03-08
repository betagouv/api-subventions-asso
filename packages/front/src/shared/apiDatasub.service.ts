import axios from "axios"
import {LoginDtoResponse} from "@api-subventions-asso/dto"
import { DATASUB_URL } from "./config";

export class APIDatasubService {
    login(email: string, password: string) {
        return axios.post<LoginDtoResponse>(`${DATASUB_URL}/auth/login`, {
            email,
            password
        })
    }
}

const apiDatasubService = new APIDatasubService();

export default apiDatasubService;