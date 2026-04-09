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

    async getExistingScdlDatas() {
        return this.getResource("donnees-existantes");
    }

    getFileDownloadUrl() {
        return this.getResource("fichier-depose/url-de-telechargement");
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

    validateScdlFile(file?: File, depositLog?: DepositScdlLogDto, sheetName?: string, processedExercices?: number[]) {
        const formdata = new FormData();
        if (file) formdata.append("file", file);
        if (depositLog) formdata.append("depositScdlLogDto", JSON.stringify(depositLog));
        if (sheetName) formdata.append("sheetName", sheetName);
        if (processedExercices) formdata.append("processedExercices", JSON.stringify(processedExercices));

        return requestsService.post(this.BASE_PATH + "/validation-fichier-scdl", formdata);
    }

    persistScdlFile() {
        return requestsService.post(this.BASE_PATH + "/depot-fichier-scdl");
    }
}

const depositLogPort = new DepositLogPort();

export default depositLogPort;
