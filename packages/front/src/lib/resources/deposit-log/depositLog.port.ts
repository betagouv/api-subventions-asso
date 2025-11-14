import requestsService from "$lib/services/requests.service";
import type { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";

class DepositLogPort {
    BASE_PATH = "/parcours-depot";

    getResource(resource?: string) {
        return requestsService.get(`${this.BASE_PATH}${resource ? "/" + resource : ""}`);
    }

    async getDepositLog() {
        return this.getResource();
    }

    async getGrantCsv() {
        return this.getResource("donnees-existantes");
    }

    createDepositLog(depositLogRequest: CreateDepositScdlLogDto) {
        return requestsService.post(this.BASE_PATH, depositLogRequest);
    }

    updateDepositLog(step: number, depositLogRequest: DepositScdlLogDto) {
        return requestsService.patch(this.BASE_PATH + `/step/${step}`, depositLogRequest);
    }

    deleteDepositLog() {
        return requestsService.delete(this.BASE_PATH);
    }

    validateScdlFile(file: File, depositLog: DepositScdlLogDto, sheetName?: string) {
        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("depositScdlLogDto", JSON.stringify(depositLog));
        if (sheetName) {
            formdata.append("sheetName", sheetName);
        }

        return requestsService.post(this.BASE_PATH + "/validation-fichier-scdl", formdata);
    }

    persistScdlFile(file: File) {
        const formdata = new FormData();
        formdata.append("file", file);
        return requestsService.post(this.BASE_PATH + "/depot-fichier-scdl", formdata);
    }
}

const depositLogPort = new DepositLogPort();

export default depositLogPort;
