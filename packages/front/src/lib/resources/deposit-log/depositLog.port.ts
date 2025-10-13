import requestsService from "$lib/services/requests.service";
import type { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";

class DepositLogPort {
    BASE_PATH = "/parcours-depot";

    getResource(resource?: string) {
        return requestsService.get(`${this.BASE_PATH}/${resource ? "/" + resource : ""}`);
    }

    async getDepositLog() {
        return this.getResource();
    }

    createDepositLog(depositLogRequest: CreateDepositScdlLogDto) {
        return requestsService.post(this.BASE_PATH, depositLogRequest);
    }

    updateDepositLog(step: number, depositLogRequest: DepositScdlLogDto) {
        return requestsService.patch(this.BASE_PATH + `/step/${step}`, depositLogRequest);
    }
}

const depositLogPort = new DepositLogPort();

export default depositLogPort;
